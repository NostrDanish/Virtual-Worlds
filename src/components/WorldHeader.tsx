// WorldHeader – responsive top navigation bar for Virtual Worlds
import { PlusCircle, Clock, Menu, X } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';

interface WorldHeaderProps {
  worldCount: number;
  pendingCount: number;
  onSubmitClick: () => void;
  onPendingClick: () => void;
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function WorldHeader({ worldCount, pendingCount, onSubmitClick, onPendingClick, onMenuClick, sidebarOpen }: WorldHeaderProps) {
  const { user } = useCurrentUser();
  const author = useAuthor(user?.pubkey);
  const displayName = author.data?.metadata?.name ?? (user ? genUserName(user.pubkey) : null);
  const avatar = author.data?.metadata?.picture;

  return (
    <header
      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#1e3a5f]/60 flex-shrink-0 z-50 relative"
      style={{
        background: 'linear-gradient(90deg, #0d1729 0%, #0f1a2e 50%, #0d1729 100%)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Menu toggle (visible always, more prominent on mobile) */}
      <button
        onClick={onMenuClick}
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all',
          'border border-[#1e3a5f]/80 text-[#c9a84c]',
          'hover:border-[#c9a84c]/60 hover:text-white active:scale-95',
          sidebarOpen && 'bg-[#1e3a5f]/40'
        )}
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'radial-gradient(circle, #c9a84c88, #6b4c0c)', border: '1.5px solid #c9a84c88' }}>
          <span className="text-xs sm:text-sm">🌍</span>
        </div>
        <div className="hidden sm:block min-w-0">
          <h1 className="text-[#c9a84c] font-bold text-base leading-none tracking-wide truncate"
            style={{ fontFamily: 'Cinzel, Palatino Linotype, serif' }}>
            Virtual World's
          </h1>
          <p className="text-[#4a5568] text-[10px] leading-none mt-0.5 italic">
            Atlas of the Multiverse
          </p>
        </div>
      </div>

      {/* Stats – hidden on mobile */}
      <div className="hidden lg:flex items-center gap-3 ml-2">
        <StatPill icon="🌐" label={`${worldCount} Realms`} />
        <StatPill icon="🔮" label="Nostr-powered" />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Pending button */}
        <button
          onClick={onPendingClick}
          className={cn(
            'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            'border border-[#4c1d95]/60 text-[#a78bfa]',
            'hover:border-[#7c3aed] hover:bg-[#4c1d95]/20 hover:text-white',
            'active:scale-95'
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pending</span>
          {pendingCount > 0 && (
            <span className="bg-[#7c3aed] text-white rounded-full px-1.5 py-0.5 text-[9px] min-w-[18px] text-center leading-none">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Submit button */}
        <button
          onClick={onSubmitClick}
          className={cn(
            'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            'bg-gradient-to-r from-[#c9a84c]/80 to-[#a87c20]/80',
            'border border-[#c9a84c]/50 text-[#0d1729]',
            'hover:from-[#c9a84c] hover:to-[#a87c20] hover:shadow-[0_0_12px_rgba(201,168,76,0.4)]',
            'active:scale-95'
          )}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open Portal</span>
          <span className="sm:hidden text-sm">+</span>
        </button>

        {/* Login / account */}
        <div className="flex items-center flex-shrink-0">
          {user && avatar ? (
            <img
              src={avatar}
              alt={displayName ?? ''}
              className="w-8 h-8 rounded-full border-2 border-[#c9a84c]/40 object-cover"
              title={displayName ?? ''}
            />
          ) : (
            <LoginArea className="max-w-[160px] sm:max-w-[200px]" />
          )}
        </div>
      </div>
    </header>
  );
}

function StatPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0f1f30]/80 border border-[#1e3a5f]/60">
      <span className="text-sm">{icon}</span>
      <span className="text-[#6b7a8d] text-xs">{label}</span>
    </div>
  );
}
