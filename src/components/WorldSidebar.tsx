// WorldSidebar – search, filters, world list, random portal, adventurer's log
import { useState, useMemo } from 'react';
import { Search, Shuffle, MapPin, Star, Eye, ChevronRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorldMarker, Biome } from '@/lib/worldTypes';
import { BIOME_META } from '@/lib/worldTypes';

interface WorldSidebarProps {
  worlds: WorldMarker[];
  selectedWorldId: string | null;
  onWorldSelect: (world: WorldMarker) => void;
  onRandomPortal: () => void;
  visitedIds: Set<string>;
  className?: string;
}

function formatVisitors(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

export function WorldSidebar({
  worlds,
  selectedWorldId,
  onWorldSelect,
  onRandomPortal,
  visitedIds,
  className,
}: WorldSidebarProps) {
  const [query, setQuery] = useState('');
  const [activeBiome, setActiveBiome] = useState<Biome | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'explore' | 'log'>('explore');

  const biomes = useMemo(() => {
    const used = new Set(worlds.map(w => w.biome));
    return Array.from(used) as Biome[];
  }, [worlds]);

  const filtered = useMemo(() => {
    return worlds.filter(w => {
      const matchBiome = activeBiome === 'all' || w.biome === activeBiome;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q)) ||
        w.description.toLowerCase().includes(q);
      return matchBiome && matchQuery;
    });
  }, [worlds, activeBiome, query]);

  const visitedWorlds = useMemo(
    () => worlds.filter(w => visitedIds.has(w.id)),
    [worlds, visitedIds]
  );

  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-hidden',
        'bg-gradient-to-b from-[#0d1b2a] to-[#0a1220]',
        'border-r border-[#1e3a5f]/60',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#1e3a5f]/60">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-[#c9a84c]" />
          <h1 className="text-[#c9a84c] font-bold text-lg tracking-wide" style={{ fontFamily: 'Palatino Linotype, serif' }}>
            Virtual Worlds
          </h1>
        </div>
        <p className="text-[#6b7a8d] text-[11px] italic leading-tight">
          Discover, wander, and claim your place in the multiverse
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e3a5f]/60">
        {(['explore', 'log'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all',
              activeTab === tab
                ? 'text-[#c9a84c] border-b-2 border-[#c9a84c] bg-[#c9a84c]/5'
                : 'text-[#6b7a8d] hover:text-[#a89a6a]'
            )}
          >
            {tab === 'explore' ? '🗺 Explore' : `📖 Log (${visitedWorlds.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'explore' ? (
        <>
          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4a5568]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search realms, tags..."
                className={cn(
                  'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
                  'bg-[#0f1f30] border border-[#1e3a5f]/80',
                  'text-[#c8d8e8] placeholder-[#3a4d60]',
                  'focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30',
                  'transition-all'
                )}
              />
            </div>
          </div>

          {/* Random Portal Button */}
          <div className="px-3 pb-2">
            <button
              onClick={onRandomPortal}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2 rounded-lg',
                'bg-gradient-to-r from-[#6d28d9]/40 to-[#4c1d95]/40',
                'border border-[#7c3aed]/40 hover:border-[#7c3aed]/80',
                'text-[#c4b5fd] hover:text-white text-sm font-semibold',
                'transition-all hover:from-[#6d28d9]/60 hover:to-[#4c1d95]/60',
                'group'
              )}
            >
              <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Random Portal
            </button>
          </div>

          {/* Biome filters */}
          <div className="px-3 pb-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveBiome('all')}
                className={cn(
                  'px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all',
                  activeBiome === 'all'
                    ? 'bg-[#c9a84c] text-[#0d1b2a]'
                    : 'bg-[#1a2a3a] text-[#6b7a8d] hover:text-[#c9a84c] border border-[#1e3a5f]/60'
                )}
              >
                All ({worlds.length})
              </button>
              {biomes.map(biome => {
                const meta = BIOME_META[biome];
                const count = worlds.filter(w => w.biome === biome).length;
                return (
                  <button
                    key={biome}
                    onClick={() => setActiveBiome(biome === activeBiome ? 'all' : biome)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all',
                      activeBiome === biome
                        ? 'text-white border'
                        : 'bg-[#1a2a3a] text-[#6b7a8d] hover:text-white border border-[#1e3a5f]/60'
                    )}
                    style={activeBiome === biome ? {
                      background: meta.color,
                      borderColor: meta.color,
                    } : {}}
                    title={meta.description}
                  >
                    {meta.emoji} {count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <div className="px-3 pb-1">
            <p className="text-[#3a4d60] text-[10px]">
              {filtered.length} realm{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* World list */}
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1.5 scrollbar-thin">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-[#3a4d60] text-sm italic">
                <p>No realms found in this realm…</p>
                <p className="text-xs mt-1">Perhaps try different incantations</p>
              </div>
            )}
            {filtered.map(world => (
              <WorldCard
                key={world.id}
                world={world}
                isSelected={world.id === selectedWorldId}
                isVisited={visitedIds.has(world.id)}
                onClick={() => onWorldSelect(world)}
              />
            ))}
          </div>
        </>
      ) : (
        /* Adventurer's Log */
        <div className="flex-1 overflow-y-auto px-3 pb-3 pt-3 space-y-2">
          {visitedWorlds.length === 0 ? (
            <div className="text-center py-12 text-[#3a4d60]">
              <div className="text-4xl mb-3">📜</div>
              <p className="text-sm italic">Your Adventurer's Log is empty.</p>
              <p className="text-xs mt-1">Venture into the map and explore worlds to record your journeys.</p>
            </div>
          ) : (
            <>
              <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-2">
                ⚔ Worlds you've explored
              </p>
              {visitedWorlds.map(world => (
                <WorldCard
                  key={world.id}
                  world={world}
                  isSelected={world.id === selectedWorldId}
                  isVisited
                  onClick={() => onWorldSelect(world)}
                  compact
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[#1e3a5f]/60 text-center">
        <p className="text-[#3a4d60] text-[10px]">
          Powered by{' '}
          <a href="https://shakespeare.diy" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">
            Shakespeare
          </a>
          {' '}·{' '}
          <span className="text-[#4a5568]">Vibed with Shakespeare ✨</span>
        </p>
      </div>
    </div>
  );
}

function WorldCard({
  world,
  isSelected,
  isVisited,
  onClick,
  compact = false,
}: {
  world: WorldMarker;
  isSelected: boolean;
  isVisited: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const biome = BIOME_META[world.biome];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-lg transition-all group',
        compact ? 'px-2.5 py-2' : 'px-2.5 py-2.5',
        isSelected
          ? 'bg-[#1e3a5f]/80 border border-[#c9a84c]/50 shadow-[0_0_12px_rgba(201,168,76,0.15)]'
          : 'bg-[#0f1f30]/60 border border-[#1e3a5f]/40 hover:border-[#1e3a5f] hover:bg-[#0f1f30]'
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Thumbnail */}
        {world.thumbnail && !compact && (
          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
            <img
              src={world.thumbnail}
              alt={world.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm">{biome.emoji}</span>
            <span className={cn('text-sm font-semibold truncate', isSelected ? 'text-[#f0e6ff]' : 'text-[#c8d8e8]')}>
              {world.name}
            </span>
            {isVisited && (
              <span className="ml-auto flex-shrink-0 text-[#22c55e] text-[9px] bg-[#14532d]/40 border border-[#22c55e]/30 px-1.5 py-0.5 rounded-full">
                ✓ Visited
              </span>
            )}
          </div>

          {!compact && (
            <p className="text-[11px] text-[#6b7a8d] line-clamp-2 leading-tight mb-1.5">
              {world.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-[10px] text-[#4a5568]">
            <span className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-[#fbbf24]" />
              {world.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-0.5">
              <Eye className="w-2.5 h-2.5 text-[#60a5fa]" />
              {formatVisitors(world.visitors)}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {biome.label}
            </span>
            <ChevronRight className={cn('w-3 h-3 ml-auto flex-shrink-0 transition-transform', isSelected && 'text-[#c9a84c] translate-x-0.5')} />
          </div>
        </div>
      </div>
    </button>
  );
}
