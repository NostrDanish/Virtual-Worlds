// Virtual Worlds – main page
// Mobile-first layout: sidebar becomes a slide-over drawer on phones.
// Full Nostr integration for world submissions and voting.

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSeoMeta } from '@unhead/react';
import { FantasyMap } from '@/components/FantasyMap';
import { WorldSidebar } from '@/components/WorldSidebar';
import { WorldHeader } from '@/components/WorldHeader';
import { SubmitRealmDialog } from '@/components/SubmitRealmDialog';
import { PendingRealmsPanel } from '@/components/PendingRealmsPanel';
import { SEED_WORLDS } from '@/lib/worldData';
import { useNostrWorlds, useNostrPendingRealms, randomCoordinate } from '@/hooks/useWorlds';
import type { WorldMarker, PendingRealm } from '@/lib/worldTypes';
import { BIOME_META } from '@/lib/worldTypes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

function mergeWorlds(seed: WorldMarker[], nostr: WorldMarker[]): WorldMarker[] {
  const seen = new Set(seed.map(w => w.url.toLowerCase()));
  const fresh = nostr.filter(w => !seen.has(w.url.toLowerCase()));
  return [...seed, ...fresh];
}

const Index = () => {
  useSeoMeta({
    title: "Virtual World's \u2013 Atlas of the Multiverse",
    description: 'Discover, wander, and claim your place in the multiverse of virtual worlds. An interactive fantasy map of digital realms powered by Nostr.',
    ogTitle: "Virtual World's \u2013 Atlas of the Multiverse",
    ogDescription: 'Discover virtual worlds on an interactive fantasy map powered by Nostr.',
  });

  const { toast } = useToast();
  const isMobile = useIsMobile();

  // ── Data ──────────────────────────────────────────────────────
  const { data: nostrWorlds = [] } = useNostrWorlds();
  const { data: nostrPending = [] } = useNostrPendingRealms();

  const [localPending, setLocalPending] = useLocalStorage<PendingRealm[]>('vw:pending', []);
  const [promotedIds, setPromotedIds] = useLocalStorage<string[]>('vw:promoted', []);
  const [visitedIds, setVisitedIds] = useLocalStorage<string[]>('vw:visited', []);

  const promotedLocal: WorldMarker[] = useMemo(() => {
    return localPending
      .filter(r => promotedIds.includes(r.id))
      .map(r => ({
        id: `local-${r.id}`,
        name: r.name,
        lore: r.description,
        description: r.description,
        url: r.url,
        thumbnail: r.thumbnail,
        biome: r.biome,
        tags: r.tags,
        coordinates: randomCoordinate(),
        visitors: 0,
        rating: 4.0,
        nostrPubkey: r.nostrPubkey,
      }));
  }, [localPending, promotedIds]);

  const allWorlds = useMemo(
    () => mergeWorlds([...SEED_WORLDS, ...promotedLocal], nostrWorlds),
    [nostrWorlds, promotedLocal]
  );

  // ── UI State ──────────────────────────────────────────────────
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  // Desktop starts open, mobile starts closed
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────
  const handleWorldSelect = useCallback((world: WorldMarker) => {
    setSelectedWorldId(world.id);
    setVisitedIds(prev => prev.includes(world.id) ? prev : [...prev, world.id]);
    // On mobile, close the sidebar when user taps a world
    if (isMobile) setSidebarOpen(false);
  }, [setVisitedIds, isMobile]);

  const handleRandomPortal = useCallback(() => {
    if (allWorlds.length === 0) return;
    const random = allWorlds[Math.floor(Math.random() * allWorlds.length)];
    handleWorldSelect(random);
    const biome = BIOME_META[random.biome];
    toast({
      title: '\uD83C\uDFB2 Random Portal Opened!',
      description: `You have been transported to ${biome.emoji} ${random.name}`,
    });
  }, [allWorlds, handleWorldSelect, toast]);

  const handleLocalUpvote = useCallback((id: string) => {
    setLocalPending(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const alreadyVoted = r.votedBy.includes('__local__');
        if (alreadyVoted) return r;
        return { ...r, upvotes: r.upvotes + 1, votedBy: [...r.votedBy, '__local__'] };
      })
    );
  }, [setLocalPending]);

  const handleLocalPromote = useCallback((id: string) => {
    setPromotedIds(prev => prev.includes(id) ? prev : [...prev, id]);
    toast({
      title: '\u2728 Realm Promoted!',
      description: 'The realm has received enough votes and been added to the Atlas!',
    });
  }, [setPromotedIds, toast]);

  // ── Keyboard shortcuts (desktop only) ─────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target as HTMLElement)?.isContentEditable;
      if (e.key === 'Escape') {
        setSelectedWorldId(null);
        setSubmitOpen(false);
        setPendingOpen(false);
        setSidebarOpen(false);
      }
      if (isTyping) return;
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) handleRandomPortal();
      if (e.key === 'b' && !e.ctrlKey && !e.metaKey) setSidebarOpen(v => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRandomPortal]);

  const visitedSet = useMemo(() => new Set(visitedIds), [visitedIds]);
  const pendingCount = nostrPending.length + localPending.filter(r => !promotedIds.includes(r.id)).length;

  return (
    <div className="flex flex-col h-full" style={{ background: '#030e1f' }}>
      {/* Header */}
      <WorldHeader
        worldCount={allWorlds.length}
        pendingCount={pendingCount}
        onSubmitClick={() => setSubmitOpen(true)}
        onPendingClick={() => setPendingOpen(true)}
        onMenuClick={() => setSidebarOpen(v => !v)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── MOBILE: slide-over drawer with backdrop ── */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar – slides over on mobile, inline on desktop */}
        <div
          className={cn(
            'flex-shrink-0 transition-all duration-300 overflow-hidden z-40',
            isMobile
              ? 'fixed inset-y-0 left-0 top-0'
              : '',
            isMobile
              ? (sidebarOpen ? 'w-[300px] translate-x-0' : 'w-0 -translate-x-full')
              : (sidebarOpen ? 'w-[288px]' : 'w-0')
          )}
          style={isMobile ? { paddingTop: 0 } : undefined}
        >
          {(sidebarOpen || !isMobile) && (
            <WorldSidebar
              worlds={allWorlds}
              selectedWorldId={selectedWorldId}
              onWorldSelect={handleWorldSelect}
              onRandomPortal={handleRandomPortal}
              visitedIds={visitedSet}
              onClose={isMobile ? () => setSidebarOpen(false) : undefined}
              className={cn('h-full', isMobile ? 'w-[300px]' : 'w-[288px]')}
            />
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          <FantasyMap
            worlds={allWorlds}
            selectedWorldId={selectedWorldId}
            onWorldSelect={handleWorldSelect}
            onMapClick={() => setSelectedWorldId(null)}
            isMobile={isMobile}
          />

          {/* Keyboard shortcuts hint – desktop only */}
          {!isMobile && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
              style={{ animation: 'fadeInUp 0.6s ease 1s both' }}
            >
              {[
                { key: 'R', label: 'Random Portal' },
                { key: 'B', label: 'Toggle Sidebar' },
                { key: 'Esc', label: 'Deselect' },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10px]"
                  style={{
                    background: 'rgba(13,23,41,0.8)',
                    border: '1px solid rgba(30,58,95,0.6)',
                    color: '#4a5568',
                  }}
                >
                  <kbd className="px-1 rounded" style={{ background: 'rgba(30,58,95,0.8)', color: '#c9a84c', fontSize: '9px' }}>
                    {key}
                  </kbd>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Selected world quick info – hidden on very small screens */}
          {selectedWorldId && !isMobile && (() => {
            const world = allWorlds.find(w => w.id === selectedWorldId);
            if (!world) return null;
            const biome = BIOME_META[world.biome];
            return (
              <div
                className="absolute top-4 right-4 max-w-[240px] rounded-xl overflow-hidden pointer-events-none animate-fade-in-up"
                style={{
                  background: 'rgba(13,23,41,0.92)',
                  border: '1px solid rgba(201,168,76,0.4)',
                  boxShadow: '0 0 24px rgba(201,168,76,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <span className="text-xl">{biome.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[#f0e6ff] font-semibold text-sm leading-tight truncate">{world.name}</p>
                    <p className="text-[#4a5568] text-xs">{biome.label}</p>
                  </div>
                  <span className="ml-auto text-[#fbbf24] text-xs flex-shrink-0">\u2605 {world.rating.toFixed(1)}</span>
                </div>
              </div>
            );
          })()}

          {/* Mobile: floating action buttons */}
          {isMobile && (
            <div className="absolute bottom-5 right-4 flex flex-col gap-2.5 z-10">
              <button
                onClick={handleRandomPortal}
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
                  border: '2px solid rgba(124,58,237,0.6)',
                  boxShadow: '0 4px 20px rgba(109,40,217,0.5)',
                }}
                title="Random Portal"
              >
                \uD83C\uDFB2
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <SubmitRealmDialog isOpen={submitOpen} onClose={() => setSubmitOpen(false)} />
      <PendingRealmsPanel
        isOpen={pendingOpen}
        onClose={() => setPendingOpen(false)}
        pendingRealms={nostrPending}
        localPending={localPending.filter(r => !promotedIds.includes(r.id))}
        onLocalUpvote={handleLocalUpvote}
        onLocalPromote={handleLocalPromote}
      />
    </div>
  );
};

export default Index;
