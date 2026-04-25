// Hook for querying and managing Virtual Realm events from Nostr (kind 37801)
import { useNostr } from '@nostrify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';
import { KIND_VIRTUAL_REALM, KIND_REALM_UPVOTE, type WorldMarker, type PendingRealm, type Biome, MAP_WIDTH, MAP_HEIGHT } from '@/lib/worldTypes';

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
  };
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

/** Fetch approved Virtual Realm listings from Nostr */
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
        return events.map(parseWorldEvent).filter((w): w is WorldMarker => w !== null);
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });
}

/** Fetch pending realm submissions from Nostr + their upvote counts */
export function useNostrPendingRealms() {
  const { nostr } = useNostr();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['nostr-pending-realms'],
    queryFn: async () => {
      try {
        // Fetch pending submissions using tag 't' = 'pending'
        const [pendingEvents, upvoteEvents] = await Promise.all([
          nostr.query(
            [{ kinds: [KIND_VIRTUAL_REALM], '#status': ['pending'], limit: 50 }],
            { signal: AbortSignal.timeout(8000) }
          ).catch(() => [] as NostrEvent[]),
          nostr.query(
            [{ kinds: [KIND_REALM_UPVOTE], limit: 500 }],
            { signal: AbortSignal.timeout(8000) }
          ).catch(() => [] as NostrEvent[]),
        ]);

        // Count upvotes per event id
        const upvoteCounts: Record<string, Set<string>> = {};
        for (const ev of upvoteEvents) {
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

  // Invalidate worlds list when a pending realm gets enough upvotes
  if (query.data) {
    const promoted = query.data.filter((r) => r.upvotes >= 5);
    if (promoted.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['nostr-worlds'] });
    }
  }

  return query;
}

/** Generate a random coordinate within map bounds, biased away from edges */
export function randomCoordinate(): [number, number] {
  const margin = 200;
  const lat = margin + Math.random() * (MAP_HEIGHT - margin * 2);
  const lng = margin + Math.random() * (MAP_WIDTH - margin * 2);
  return [lat, lng];
}
