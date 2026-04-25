// WorldHeader – top navigation bar for Virtual Worlds
import { PlusCircle, Clock, Users } from 'lucide-react';
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
}

export function WorldHeader({ worldCount, pendingCount, onSubmitClick, onPendingClick }: WorldHeaderProps) {
  const { user } = useCurrentUser();
  const author = useAuthor(user?.pubkey);
  const displayName = author.data?.metadata?.name ?? (user ? genUserName(user.pubkey) : null);
  const avatar = author.data?.metadata?.picture;

  return (
    <header
      className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1e3a5f]/60 flex-shrink-0"
      style={{
        background: 'linear-gradient(90deg, #0d1729 0%, #0f1a2e 50%, #0d1729 100%)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, #c9a84c88, #6b4c0c)', border: '1.5px solid #c9a84c88' }}>
          <span className="text-sm">🌍</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-[#c9a84c] font-bold text-base leading-none tracking-wide"
            style={{ fontFamily: 'Palatino Linotype, serif' }}>
            Virtual Worlds
          </h1>
          <p className="text-[#4a5568] text-[10px] leading-none mt-0.5 italic">
            Atlas of the Multiverse
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-3 ml-4">
        <StatPill icon="🌐" label={`${worldCount} Realms`} />
        <StatPill icon="⚔️" label="Discover" />
        <StatPill icon="🔮" label="Nostr-powered" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Pending button */}
        <button
          onClick={onPendingClick}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            'border border-[#4c1d95]/60 text-[#a78bfa]',
            'hover:border-[#7c3aed] hover:bg-[#4c1d95]/20 hover:text-white',
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
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            'bg-gradient-to-r from-[#c9a84c]/80 to-[#a87c20]/80',
            'border border-[#c9a84c]/50 text-[#0d1729]',
            'hover:from-[#c9a84c] hover:to-[#a87c20] hover:shadow-[0_0_12px_rgba(201,168,76,0.4)]',
          )}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open Portal</span>
          <span className="sm:hidden">+</span>
        </button>

        {/* Login / account */}
        <div className="flex items-center">
          {user && avatar ? (
            <img
              src={avatar}
              alt={displayName ?? ''}
              className="w-8 h-8 rounded-full border-2 border-[#c9a84c]/40 object-cover"
              title={displayName ?? ''}
            />
          ) : (
            <LoginArea className="max-w-[200px]" />
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
