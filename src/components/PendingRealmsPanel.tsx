// PendingRealmsPanel – shows community-submitted worlds awaiting approval votes
// Uses Nostr kind 1459 for upvote events

import { useState } from 'react';
import { ThumbsUp, ExternalLink, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PendingRealm } from '@/lib/worldTypes';
import { BIOME_META, KIND_REALM_UPVOTE, UPVOTE_THRESHOLD } from '@/lib/worldTypes';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useQueryClient } from '@tanstack/react-query';
import { LoginArea } from '@/components/auth/LoginArea';
import { genUserName } from '@/lib/genUserName';
import { useAuthor } from '@/hooks/useAuthor';
import { formatDistanceToNow } from 'date-fns';

interface PendingRealmsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pendingRealms: PendingRealm[];
  localPending: PendingRealm[];
  onLocalUpvote: (id: string) => void;
  onLocalPromote: (id: string) => void;
}

export function PendingRealmsPanel({
  isOpen,
  onClose,
  pendingRealms,
  localPending,
  onLocalUpvote,
  onLocalPromote,
}: PendingRealmsPanelProps) {
  if (!isOpen) return null;

  const allPending = [...pendingRealms, ...localPending];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d1729 0%, #100a20 100%)',
          border: '1px solid #3d2f6e',
          boxShadow: '0 0 60px rgba(139,92,246,0.2), 0 24px 48px rgba(0,0,0,0.8)',
          maxHeight: '85vh',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#1e3a5f]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#4c1d95]">
            <Clock className="w-4 h-4 text-[#c4b5fd]" />
          </div>
          <div>
            <h2 className="text-[#e0d0ff] font-bold text-lg" style={{ fontFamily: 'Palatino Linotype, serif' }}>
              Pending Realms
            </h2>
            <p className="text-[#6b5a8d] text-xs">
              {allPending.length} realm{allPending.length !== 1 ? 's' : ''} await the community's blessing
            </p>
          </div>
          <button onClick={onClose} className="ml-auto text-[#4a5568] hover:text-[#a78bfa] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upvote threshold notice */}
        <div className="mx-6 mt-4 mb-3 px-3 py-2 rounded-lg bg-[#1e1040]/60 border border-[#4c1d95]/40 text-xs text-[#a78bfa]">
          ✨ Realms that receive <span className="text-[#fbbf24] font-bold">{UPVOTE_THRESHOLD} upvotes</span> will be automatically added to the Atlas map.
        </div>

        {/* List */}
        <div className="overflow-y-auto px-4 pb-5 space-y-3" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          {allPending.length === 0 ? (
            <div className="text-center py-12 text-[#3a4d60]">
              <div className="text-4xl mb-3">🌌</div>
              <p className="text-sm italic">No realms await the council's verdict.</p>
              <p className="text-xs mt-1">Submit one using the "Open a Portal" button!</p>
            </div>
          ) : (
            allPending.map(realm => (
              <PendingRealmCard
                key={realm.id}
                realm={realm}
                isLocal={localPending.some(r => r.id === realm.id)}
                onUpvote={() => {
                  if (localPending.some(r => r.id === realm.id)) {
                    onLocalUpvote(realm.id);
                    if (realm.upvotes + 1 >= UPVOTE_THRESHOLD) {
                      onLocalPromote(realm.id);
                    }
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PendingRealmCard({
  realm,
  isLocal,
  onUpvote,
}: {
  realm: PendingRealm;
  isLocal: boolean;
  onUpvote: () => void;
}) {
  const { user } = useCurrentUser();
  const { mutateAsync: publish, isPending: isVoting } = useNostrPublish();
  const queryClient = useQueryClient();
  const [localVoted, setLocalVoted] = useState(false);

  const biome = BIOME_META[realm.biome as keyof typeof BIOME_META];
  const alreadyVoted = localVoted || (user && realm.votedBy.includes(user.pubkey));
  const progress = Math.min(100, (realm.upvotes / UPVOTE_THRESHOLD) * 100);

  // For Nostr-submitted realms, show author info
  const authorPubkey = realm.nostrPubkey;
  const author = useAuthor(authorPubkey);
  const authorName = author.data?.metadata?.name ?? (authorPubkey ? genUserName(authorPubkey) : 'Unknown Adventurer');
  const authorAvatar = author.data?.metadata?.picture;

  const handleVote = async () => {
    if (alreadyVoted) return;

    if (isLocal) {
      // Local-only voting (no Nostr required)
      setLocalVoted(true);
      onUpvote();
      return;
    }

    if (!user) return;

    try {
      // Publish both kind 1459 upvote AND NIP-25 reaction (kind 7)
      // for maximum Nostr interoperability
      await publish({
        kind: KIND_REALM_UPVOTE,
        content: '',
        tags: [
          ['e', realm.id],
          ['alt', `Upvote for virtual realm: ${realm.name}`],
        ],
      });
      // Also publish a NIP-25 reaction for interoperability
      await publish({
        kind: 7,
        content: '+',
        tags: [
          ['e', realm.id],
          ['k', String(KIND_REALM_UPVOTE)],
          ['alt', `Reaction to virtual realm: ${realm.name}`],
        ],
      }).catch(() => { /* best-effort NIP-25 reaction */ });
      setLocalVoted(true);
      await queryClient.invalidateQueries({ queryKey: ['nostr-pending-realms'] });
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const timeAgo = realm.submittedAt
    ? formatDistanceToNow(new Date(realm.submittedAt * 1000), { addSuffix: true })
    : '';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: 'rgba(15, 31, 48, 0.7)',
        border: '1px solid rgba(30, 58, 95, 0.5)',
      }}
    >
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        {realm.thumbnail ? (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
            <img src={realm.thumbnail} alt={realm.name} className="w-full h-full object-cover opacity-80" />
          </div>
        ) : (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center bg-[#1e3a5f]/50 text-3xl">
            {biome?.emoji ?? '🌐'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Name + biome badge */}
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-[#e2d8f3] font-semibold text-sm flex-1 truncate" style={{ fontFamily: 'Palatino Linotype, serif' }}>
              {realm.name}
            </h3>
            <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full hidden sm:inline-block"
              style={{ background: `${biome?.color ?? '#333'}22`, color: biome?.color ?? '#888', border: `1px solid ${biome?.color ?? '#333'}44` }}>
              {biome?.emoji} {biome?.label}
            </span>
          </div>

          {/* Description */}
          <p className="text-[#6b7a8d] text-xs line-clamp-2 mb-2">{realm.description}</p>

          {/* Tags */}
          {realm.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {realm.tags.slice(0, 4).map(t => (
                <span key={t} className="text-[9px] bg-[#1e293b] text-[#64748b] border border-[#334155] px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Author + time */}
          <div className="flex items-center gap-2">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-4 h-4 rounded-full" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-[#4c1d95]/60 flex items-center justify-center text-[8px]">🧙</div>
            )}
            <span className="text-[#4a5568] text-[10px]">{authorName}</span>
            {timeAgo && <span className="text-[#3a4050] text-[10px]">· {timeAgo}</span>}
            <a
              href={realm.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-[#4a5568] hover:text-[#60a5fa] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Upvote section */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 pl-2 border-l border-[#1e3a5f]/40">
          {!user && !isLocal ? (
            <div className="text-center">
              <div className="text-[10px] text-[#4a5568] mb-1 w-16 text-center">Login to vote</div>
              <LoginArea className="scale-75 origin-center" />
            </div>
          ) : (
            <button
              onClick={handleVote}
              disabled={!!alreadyVoted || isVoting}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all text-sm font-bold',
                alreadyVoted
                  ? 'bg-[#14532d]/40 text-[#22c55e] border border-[#22c55e]/30 cursor-default'
                  : 'bg-[#1e3a5f]/60 text-[#60a5fa] border border-[#1e3a5f] hover:border-[#60a5fa]/60 hover:text-white hover:bg-[#1e3a5f]'
              )}
            >
              <ThumbsUp className={cn('w-4 h-4', alreadyVoted && 'fill-current')} />
              <span className="text-xs">{realm.upvotes}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#4a5568]">
            {realm.upvotes} / {UPVOTE_THRESHOLD} votes needed
          </span>
          <span className="text-[10px] text-[#4a5568]">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-[#0f1f30] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: progress >= 100
                ? 'linear-gradient(90deg, #22c55e, #86efac)'
                : 'linear-gradient(90deg, #7c3aed, #c4b5fd)',
              boxShadow: progress >= 100 ? '0 0 8px #22c55e' : '0 0 8px #7c3aed88',
            }}
          />
        </div>
        {progress >= 100 && (
          <p className="text-[#22c55e] text-[10px] mt-1 text-center animate-pulse">
            ✨ Threshold reached — adding to Atlas!
          </p>
        )}
      </div>
    </div>
  );
}
