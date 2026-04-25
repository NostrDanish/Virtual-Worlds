// SubmitRealmDialog – lets users submit new virtual worlds via Nostr (kind 37801)
// Requires Nostr login; submissions are published as addressable events.

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Sparkles, Globe, Tag, Image, FileText, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useQueryClient } from '@tanstack/react-query';
import { LoginArea } from '@/components/auth/LoginArea';
import type { Biome } from '@/lib/worldTypes';
import { BIOME_META, KIND_VIRTUAL_REALM, MAP_WIDTH, MAP_HEIGHT } from '@/lib/worldTypes';

interface FormData {
  name: string;
  url: string;
  description: string;
  lore: string;
  biome: Biome;
  thumbnail: string;
  tags: string;
}

interface SubmitRealmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate a stable d-tag slug from a name
function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function randomCoord(max: number, margin = 200): number {
  return margin + Math.random() * (max - margin * 2);
}

export function SubmitRealmDialog({ isOpen, onClose }: SubmitRealmDialogProps) {
  const { user } = useCurrentUser();
  const { mutateAsync: publish, isPending } = useNostrPublish();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      biome: 'enchanted-forest',
    },
  });

  const selectedBiome = watch('biome') as Biome;

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    const dTag = `vw-${slugify(data.name)}-${Date.now().toString(36)}`;
    const tagList = data.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // Place at a pseudo-random position on the map
    const lat = randomCoord(MAP_HEIGHT);
    const lng = randomCoord(MAP_WIDTH);

    try {
      // Publish as kind 37801 (Virtual Realm) — addressable event
      // With 'status': 'pending' so it goes into the pending queue
      await publish({
        kind: KIND_VIRTUAL_REALM,
        content: data.description,
        tags: [
          ['d', dTag],
          ['name', data.name],
          ['u', data.url],
          ['t', data.biome],
          ['image', data.thumbnail],
          ['lore', data.lore || data.description],
          ['lat', lat.toFixed(2)],
          ['lng', lng.toFixed(2)],
          ['status', 'pending'],
          ['alt', `Virtual realm submission: ${data.name} — ${data.description}`],
          ...tagList.map(t => ['tag', t] as [string, string]),
        ],
      });

      setSubmitted(true);
      reset();
      // Refresh the pending list
      await queryClient.invalidateQueries({ queryKey: ['nostr-pending-realms'] });
    } catch (err) {
      console.error('Failed to submit realm:', err);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh]"
        style={{
          background: 'linear-gradient(135deg, #0d1729 0%, #150a2e 50%, #0a1a2e 100%)',
          border: '1px solid #3d2f6e',
          boxShadow: '0 0 60px rgba(109,40,217,0.3), 0 24px 48px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#1e3a5f]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, #7c3aed, #4c1d95)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-[#e0d0ff] font-bold text-lg tracking-wide" style={{ fontFamily: 'Palatino Linotype, serif' }}>
              Open a New Portal
            </h2>
            <p className="text-[#6b5a8d] text-xs">Submit your realm to the multiverse atlas</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-auto text-[#4a5568] hover:text-[#a78bfa] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {!user ? (
            /* Login required */
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🔮</div>
              <h3 className="text-[#c4b5fd] font-semibold text-lg mb-2" style={{ fontFamily: 'Palatino Linotype, serif' }}>
                A Nostr Identity is Required
              </h3>
              <p className="text-[#6b7a8d] text-sm mb-6 leading-relaxed">
                To submit a realm to the atlas, you must present your Nostr sigil.
                Your submission will be bound to your cryptographic identity forever.
              </p>
              <div className="flex justify-center">
                <LoginArea className="max-w-xs" />
              </div>
            </div>
          ) : submitted ? (
            /* Success state */
            <div className="text-center py-8">
              <div className="text-5xl mb-4 animate-bounce">✨</div>
              <h3 className="text-[#4ade80] font-semibold text-lg mb-2" style={{ fontFamily: 'Palatino Linotype, serif' }}>
                Portal Submitted to the Ether!
              </h3>
              <p className="text-[#6b7a8d] text-sm mb-2 leading-relaxed">
                Your realm has been inscribed in the Nostr chronicles.
                Once the community bestows <span className="text-[#fbbf24] font-semibold">5 upvotes</span> upon it,
                it shall appear on the Atlas.
              </p>
              <p className="text-[#4a5568] text-xs mb-6">
                Check the "Pending Realms" tab to see your submission and vote on others.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-[#1e3a5f]/60 border border-[#4a5568] text-[#c8d8e8] text-sm hover:border-[#7c3aed] transition-all"
                >
                  Submit Another
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', color: 'white' }}
                >
                  View Pending Realms
                </button>
              </div>
            </div>
          ) : (
            /* Submission form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* World Name */}
              <FormField label="Realm Name" icon={<Globe className="w-3.5 h-3.5" />} error={errors.name?.message}>
                <input
                  type="text"
                  placeholder="e.g. The Rift of Echoes"
                  {...register('name', { required: 'A name is required', minLength: { value: 2, message: 'Name too short' } })}
                  className={fieldCls(!!errors.name)}
                />
              </FormField>

              {/* URL */}
              <FormField label="Portal URL" icon={<Globe className="w-3.5 h-3.5" />} error={errors.url?.message}>
                <input
                  type="url"
                  placeholder="https://your-world.example.com"
                  {...register('url', { required: 'A URL is required' })}
                  className={fieldCls(!!errors.url)}
                />
              </FormField>

              {/* Description */}
              <FormField label="Description" icon={<FileText className="w-3.5 h-3.5" />} error={errors.description?.message}>
                <textarea
                  rows={2}
                  placeholder="What is this world about?"
                  {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Please write more' } })}
                  className={cn(fieldCls(!!errors.description), 'resize-none')}
                />
              </FormField>

              {/* Lore */}
              <FormField label="Lore (fantasy flavored)" icon={<Sparkles className="w-3.5 h-3.5" />}>
                <textarea
                  rows={2}
                  placeholder='"A realm where shadows whisper secrets to those brave enough to listen..."'
                  {...register('lore')}
                  className={cn(fieldCls(), 'resize-none italic')}
                />
              </FormField>

              {/* Biome selector */}
              <FormField label="Biome / Category" icon={<Map className="w-3.5 h-3.5" />}>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.entries(BIOME_META) as [Biome, typeof BIOME_META[Biome]][]).map(([key, meta]) => (
                    <label
                      key={key}
                      className={cn(
                        'flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all border text-sm',
                        selectedBiome === key
                          ? 'border-[#7c3aed] bg-[#4c1d95]/30 text-white'
                          : 'border-[#1e3a5f]/60 bg-[#0f1f30]/60 text-[#6b7a8d] hover:border-[#4a5568]'
                      )}
                    >
                      <input type="radio" value={key} {...register('biome')} className="sr-only" />
                      <span>{meta.emoji}</span>
                      <span className="text-xs font-medium leading-tight">{meta.label}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              {/* Tags */}
              <FormField label="Tags (comma separated)" icon={<Tag className="w-3.5 h-3.5" />}>
                <input
                  type="text"
                  placeholder="VR, Free, Multiplayer, Mobile..."
                  {...register('tags')}
                  className={fieldCls()}
                />
              </FormField>

              {/* Thumbnail URL */}
              <FormField label="Thumbnail URL (optional)" icon={<Image className="w-3.5 h-3.5" />}>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...register('thumbnail')}
                  className={fieldCls()}
                />
              </FormField>

              {/* Nostr identity note */}
              <div className="bg-[#0f1f30]/80 border border-[#1e3a5f]/60 rounded-lg px-3 py-2">
                <p className="text-[#4a5568] text-[10px]">
                  🔑 Submitting as{' '}
                  <span className="text-[#c9a84c]">
                    {user.pubkey.slice(0, 8)}…{user.pubkey.slice(-4)}
                  </span>
                  . Your submission is cryptographically signed and published to Nostr relays.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  'w-full py-3 rounded-xl text-sm font-bold tracking-wider text-white transition-all',
                  isPending
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:opacity-90 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]'
                )}
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95, #6d28d9)' }}
              >
                {isPending ? '⏳ Opening Portal…' : '✨ Submit Realm to the Atlas'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function fieldCls(hasError = false): string {
  return cn(
    'w-full px-3 py-2 rounded-lg text-sm',
    'bg-[#0f1f30] border text-[#c8d8e8] placeholder-[#3a4d60]',
    'focus:outline-none focus:ring-1 transition-all',
    hasError
      ? 'border-[#ef4444] focus:ring-[#ef4444]/30'
      : 'border-[#1e3a5f]/80 focus:border-[#7c3aed]/60 focus:ring-[#7c3aed]/20'
  );
}

function FormField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8b9db0] uppercase tracking-wider mb-1.5">
        {icon}
        {label}
      </label>
      {children}
      {error && <p className="text-[#ef4444] text-[10px] mt-1">{error}</p>}
    </div>
  );
}
