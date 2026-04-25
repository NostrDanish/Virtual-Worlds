// Hook for querying and managing Virtual Realm events from Nostr (kind 37801)
// Uses NIP-25 reactions (kind 7) in addition to kind 1459 for upvotes.
import { useNostr } from '@nostrify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';
import { KIND_VIRTUAL_REALM, KIND_REALM_UPVOTE, UPVOTE_THRESHOLD, type WorldMarker, type PendingRealm, type Biome, MAP_WIDTH, MAP_HEIGHT } from '@/lib/worldTypes';

function parseWorldEvent(event: NostrEvent): WorldMarker | null {
  const tags = event.tags;
  const getTag = (name: string) => tags.find(([n]) => n === name)?.[1] ?? '';

  const name = getTag('name');
  const url = getTag('u');
  const biome = getTag('t') as Biome;
  const thumbnail = getTag('image');
  const lat = parseFloat(getTag('lat') || '0');
  const lng = parseFloat(getTag('lng') || '0');

  if (!name || !url || !biome) return null;
  if (isNaN(lat) || isNaN(lng)) return null;

  const tagList = tags.filter(([n]) => n === 'tag').map(([, v]) => v);
  const visitors = parseInt(getTag('visitors') || '0', 10);
  const rating = parseFloat(getTag('rating') || '4.0');
  const status = getTag('status');

  return {
    id: `nostr-${event.id.slice(0, 12)}`,
    name,
    lore: getTag('lore') || event.content,
    description: event.content,
    url,
    thumbnail,
    biome,
    tags: tagList,
    coordinates: [lat, lng],
    visitors: isNaN(visitors) ? 0 : visitors,
    rating: isNaN(rating) ? 4.0 : Math.min(5, Math.max(1, rating)),
    nostrEventId: event.id,
    nostrPubkey: event.pubkey,
    nostrEventCoord: `${KIND_VIRTUAL_REALM}:${event.pubkey}:${getTag('d')}`,
    // store status for filtering
    _status: status,
  } as WorldMarker & { _status?: string };
}

function parsePendingEvent(event: NostrEvent): PendingRealm | null {
  const tags = event.tags;
  const getTag = (name: string) => tags.find(([n]) => n === name)?.[1] ?? '';

  const name = getTag('name');
  const url = getTag('u');
  const biome = getTag('t') as Biome;

  if (!name || !url || !biome) return null;

  const tagList = tags.filter(([n]) => n === 'tag').map(([, v]) => v);

  return {
    id: event.id,
    name,
    url,
    description: event.content,
    biome,
    thumbnail: getTag('image'),
    tags: tagList,
    upvotes: 0,
    votedBy: [],
    submittedAt: event.created_at,
    nostrEventId: event.id,
    nostrPubkey: event.pubkey,
  };
}

/** Fetch approved Virtual Realm listings from Nostr.
 *  Queries ALL kind 37801 events, then separates approved from pending.
 *  Also counts NIP-25 reactions (kind 7) and kind 1459 upvotes.
 */
export function useNostrWorlds() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-worlds'],
    queryFn: async () => {
      try {
        const events = await nostr.query(
          [{ kinds: [KIND_VIRTUAL_REALM], limit: 100 }],
          { signal: AbortSignal.timeout(8000) }
        );
        // Return worlds that are NOT pending (approved or no status tag)
        return events
          .map(parseWorldEvent)
          .filter((w): w is WorldMarker => w !== null)
          .filter(w => {
            const s = (w as WorldMarker & { _status?: string })._status;
            return s !== 'pending';
          });
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });
}

/** Fetch pending realm submissions from Nostr + upvote counts (kind 1459 + kind 7) */
export function useNostrPendingRealms() {
  const { nostr } = useNostr();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['nostr-pending-realms'],
    queryFn: async () => {
      try {
        // Fetch all realm events + upvotes + NIP-25 reactions in a single batch
        const [realmEvents, upvoteEvents, reactionEvents] = await Promise.all([
          nostr.query(
            [{ kinds: [KIND_VIRTUAL_REALM], limit: 100 }],
            { signal: AbortSignal.timeout(8000) }
          ).catch(() => [] as NostrEvent[]),
          nostr.query(
            [{ kinds: [KIND_REALM_UPVOTE], limit: 500 }],
            { signal: AbortSignal.timeout(8000) }
          ).catch(() => [] as NostrEvent[]),
          nostr.query(
            [{ kinds: [7], '#k': [String(KIND_VIRTUAL_REALM)], limit: 500 }],
            { signal: AbortSignal.timeout(8000) }
          ).catch(() => [] as NostrEvent[]),
        ]);

        // Filter only pending events
        const pendingEvents = realmEvents.filter(ev => {
          const status = ev.tags.find(([n]) => n === 'status')?.[1];
          return status === 'pending';
        });

        // Count upvotes per event id (from both kind 1459 AND kind 7 reactions)
        const upvoteCounts: Record<string, Set<string>> = {};
        for (const ev of [...upvoteEvents, ...reactionEvents]) {
          const targetId = ev.tags.find(([n]) => n === 'e')?.[1];
          if (targetId) {
            if (!upvoteCounts[targetId]) upvoteCounts[targetId] = new Set();
            upvoteCounts[targetId].add(ev.pubkey);
          }
        }

        const pending = pendingEvents
          .map(parsePendingEvent)
          .filter((p): p is PendingRealm => p !== null)
          .map((p) => ({
            ...p,
            upvotes: upvoteCounts[p.id]?.size ?? 0,
            votedBy: Array.from(upvoteCounts[p.id] ?? []),
          }));

        return pending;
      } catch {
        return [];
      }
    },
    staleTime: 30_000,
  });

  // Auto-invalidate worlds list when a pending realm gets enough upvotes
  if (query.data) {
    const promoted = query.data.filter((r) => r.upvotes >= UPVOTE_THRESHOLD);
    if (promoted.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['nostr-worlds'] });
    }
  }

  return query;
}

/** Generate a random coordinate within map bounds, biased away from edges */
export function randomCoordinate(): [number, number] {
  const margin = 400;
  const lat = margin + Math.random() * (MAP_HEIGHT - margin * 2);
  const lng = margin + Math.random() * (MAP_WIDTH - margin * 2);
  return [lat, lng];
}
