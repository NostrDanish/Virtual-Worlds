// Virtual Worlds – core type definitions
// NIP Custom Kinds:
//   kind 37801 – Addressable "Virtual Realm" listing (submitted by users via Nostr)
//   kind 1459  – Realm upvote/endorsement event

export type Biome =
  | 'enchanted-forest'   // Social / roleplay worlds
  | 'mountain-forge'     // Creative sandboxes (Roblox, Minecraft…)
  | 'crystal-spires'     // VR / metaverse experiences
  | 'shadow-realms'      // Indie / experimental
  | 'floating-isles'     // Browser-based worlds
  | 'sunken-depths'      // Underwater / alien sci-fi worlds
  | 'void-nexus'         // Abstract / tech / AI worlds
  | 'dragon-peaks';      // Competitive / gaming worlds

export const BIOME_META: Record<Biome, { label: string; emoji: string; color: string; description: string }> = {
  'enchanted-forest':  { label: 'Enchanted Forests',  emoji: '🌲', color: '#2d6a4f', description: 'Social & roleplay realms' },
  'mountain-forge':    { label: 'Mountain Forges',    emoji: '⛏️', color: '#6b4226', description: 'Creative sandboxes' },
  'crystal-spires':    { label: 'Crystal Spires',     emoji: '💎', color: '#5e60ce', description: 'VR & metaverse worlds' },
  'shadow-realms':     { label: 'Shadow Realms',      emoji: '🌑', color: '#3a3a5c', description: 'Indie & experimental' },
  'floating-isles':    { label: 'Floating Isles',     emoji: '☁️', color: '#0077b6', description: 'Browser-based worlds' },
  'sunken-depths':     { label: 'Sunken Depths',      emoji: '🌊', color: '#023e8a', description: 'Sci-fi & alien worlds' },
  'void-nexus':        { label: 'Void Nexus',         emoji: '🔮', color: '#7b2d8b', description: 'Abstract & AI worlds' },
  'dragon-peaks':      { label: 'Dragon Peaks',       emoji: '🐉', color: '#9b1c1c', description: 'Competitive & gaming' },
};

export interface WorldMarker {
  id: string;
  name: string;
  lore: string;              // Fantasy-flavored description
  description: string;       // Plain description
  url: string;               // "Enter Portal" link
  thumbnail: string;         // Image URL
  biome: Biome;
  tags: string[];            // e.g. ["VR", "Free", "Multiplayer"]
  coordinates: [number, number]; // [lat, lng] in Leaflet CRS.Simple space
  visitors: number;          // Fake visitor count
  rating: number;            // 1–5
  // Nostr fields (set when submitted via Nostr)
  nostrEventId?: string;
  nostrPubkey?: string;
  nostrEventCoord?: string;  // "37801:<pubkey>:<d-tag>"
}

export interface PendingRealm {
  id: string;
  name: string;
  url: string;
  description: string;
  biome: Biome;
  thumbnail: string;
  tags: string[];
  upvotes: number;
  votedBy: string[];         // pubkeys / local session IDs that already voted
  submittedAt: number;
  // Nostr fields
  nostrEventId?: string;
  nostrPubkey?: string;
  nostrDisplayName?: string;
  nostrAvatar?: string;
}

// Nostr event kind for a Virtual Realm listing (addressable)
export const KIND_VIRTUAL_REALM = 37801;
// Nostr event kind for upvote/endorsement
export const KIND_REALM_UPVOTE = 1459;

// Upvote threshold before a pending realm gets added to the map
export const UPVOTE_THRESHOLD = 5;

// Map image dimensions (for the SVG-based fantasy map)
export const MAP_WIDTH = 3200;
export const MAP_HEIGHT = 2000;
