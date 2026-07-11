# 🌍 Virtual World's — Atlas of the Multiverse

> *Discover, wander, and claim your place in the multiverse of virtual worlds.*

[![Edit with Shakespeare](https://shakespeare.diy/badge.svg)](https://shakespeare.diy/clone?url=https%3A%2F%2Fgithub.com%2FNostrDanish%2FVirtual-Worlds.git)

An interactive fantasy-map atlas of digital realms, powered by the **Nostr** decentralised protocol. Explore hundreds of virtual worlds — from VR metaverses and creative sandboxes to browser games and AI simulations — all plotted on a living, community-driven map.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Fantasy Atlas Map** | SVG-based interactive map with 8 distinct biomes, zoomable and pannable |
| 🌐 **Nostr-Powered** | World listings are Nostr events — fully decentralised, censorship-resistant |
| 📬 **Submit a Realm** | Any user can submit a new virtual world via a Nostr-signed event |
| 🗳️ **Community Voting** | Upvote pending realms; 5 unique votes promote a realm to the live map |
| 🎲 **Random Portal** | One click (or press `R`) teleports you to a random world |
| 🔑 **Nostr Login** | Log in with any NIP-07 browser extension, nsec, or NIP-46 remote signer |
| 📱 **Mobile-First** | Fully responsive; slide-over drawer on mobile, inline sidebar on desktop |
| ⚡ **Lightning Zaps** | Support worlds (and their submitters) with Bitcoin Lightning via NIP-57 |
| 🌑 **Dark Theme** | Immersive deep-space dark theme with gold accents |

---

## 🗺️ Biomes

The atlas is divided into eight biomes, each representing a category of virtual world:

| Biome | Emoji | Worlds |
|---|---|---|
| Enchanted Forests | 🌲 | Social & roleplay (Second Life, IMVU…) |
| Mountain Forges | ⛏️ | Creative sandboxes (Minecraft, Roblox…) |
| Crystal Spires | 💎 | VR & metaverse (VRChat, Decentraland…) |
| Shadow Realms | 🌑 | Indie & experimental (Resonite, Vircadia…) |
| Floating Isles | ☁️ | Browser-based (Mozilla Hubs, Gather.town…) |
| Sunken Depths | 🌊 | Sci-fi & space (No Man's Sky, Star Citizen…) |
| Void Nexus | 🔮 | Abstract & AI (AI Town, World App…) |
| Dragon Peaks | 🐉 | Competitive & gaming (Fortnite, GTA Online…) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/NostrDanish/Virtual-Worlds.git
cd Virtual-Worlds

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The compiled output is placed in the `dist/` directory and is ready to be deployed to any static host.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite 8](https://vitejs.dev) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| UI components | [shadcn/ui](https://ui.shadcn.com) (Radix UI) |
| Nostr protocol | [Nostrify](https://nostrify.dev) + [nostr-tools](https://github.com/nbd-wtf/nostr-tools) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) |
| Routing | [React Router v6](https://reactrouter.com) |
| Map | [Leaflet](https://leafletjs.com) (CRS.Simple) |
| Lightning | [Alby SDK](https://getalby.com) + WebLN + NWC |
| Language | TypeScript 5 |

---

## 📡 Nostr Protocol (Custom NIP)

Virtual World's defines two custom Nostr event kinds documented in [`NIP.md`](./NIP.md):

### Kind 37801 — Virtual Realm Listing *(Addressable)*

An addressable event representing a virtual world submission.

```json
{
  "kind": 37801,
  "content": "<plain description>",
  "tags": [
    ["d", "vw-my-world-abc123"],
    ["name", "My World"],
    ["u", "https://myworld.example"],
    ["t", "crystal-spires"],
    ["image", "https://..."],
    ["lore", "A mystical realm where..."],
    ["status", "pending"],
    ["alt", "Virtual realm listing: My World"]
  ]
}
```

### Kind 1459 — Realm Upvote *(Regular)*

A simple endorsement. One upvote per pubkey per realm is counted.

```json
{
  "kind": 1459,
  "content": "",
  "tags": [
    ["e", "<event-id of kind 37801 realm>"],
    ["alt", "Upvote for virtual realm: My World"]
  ]
}
```

> Standard **NIP-25 reactions** (kind 7 with `"+"`) are also counted as upvotes, ensuring interoperability with any Nostr client that supports reactions.

**Voting threshold:** 5 unique upvotes (by pubkey, across kinds 1459 and 7) promote a pending realm to the live atlas map.

For the full spec see **[NIP.md](./NIP.md)**.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `R` | Open a Random Portal |
| `B` | Toggle the sidebar |
| `Esc` | Deselect world / close dialogs |

---

## 🤝 Contributing

Contributions are welcome! Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** for guidelines on submitting issues, pull requests, and new world data.

---

## 📜 License

This project is released under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgements

- All virtual world icons and names are trademarks of their respective owners.
- Map tile background and biome artwork are original SVG assets.
- Built with ❤️ on the [Nostr](https://nostr.com) protocol.
- Vibed with [Shakespeare](https://shakespeare.diy) — the AI-powered web builder.
