# 🤝 Contributing to Virtual World's

Thank you for your interest in helping grow the Atlas of the Multiverse! This guide covers everything you need to contribute — whether you're fixing a bug, adding a new virtual world to the seed data, improving the map, or proposing new Nostr protocol features.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Ways to Contribute](#ways-to-contribute)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Submitting a New Virtual World (Seed Data)](#submitting-a-new-virtual-world-seed-data)
6. [Biome Reference](#biome-reference)
7. [Coding Guidelines](#coding-guidelines)
8. [Pull Request Process](#pull-request-process)
9. [Nostr Protocol Extensions](#nostr-protocol-extensions)
10. [Reporting Bugs](#reporting-bugs)
11. [Feature Requests](#feature-requests)

---

## Code of Conduct

Be kind, inclusive, and constructive. Harassment of any kind will not be tolerated. By participating you agree to treat all contributors with respect, regardless of their background, skill level, or opinions.

---

## Ways to Contribute

| Type | Description |
|---|---|
| 🐛 **Bug fixes** | Fix broken functionality, visual glitches, or incorrect data |
| 🌐 **New world entries** | Add a virtual world to the curated seed data |
| 🗺️ **Map improvements** | Enhance biome artwork, coordinates, or SVG assets |
| ✨ **New features** | Propose and build new features for the atlas |
| 📡 **Nostr extensions** | Improve the custom NIP or add interoperability |
| 📖 **Documentation** | Improve README, NIP.md, or inline code comments |
| 🌍 **Translations** | Help localise the UI for non-English speakers |

---

## Development Setup

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- A **Nostr browser extension** (e.g. [Alby](https://getalby.com), [nos2x](https://github.com/fiatjaf/nos2x)) for testing login and event publishing

### Steps

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/Virtual-Worlds.git
cd Virtual-Worlds

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Running Tests

```bash
# Type-checks, linting, unit tests, and a production build — all in one command
npm test
```

All tests must pass before a PR can be merged. **Never submit a PR with failing tests.**

---

## Project Structure

```
Virtual-Worlds/
├── public/               # Static assets served as-is
├── src/
│   ├── components/       # React UI components
│   │   ├── auth/         # Login / account management
│   │   ├── ui/           # shadcn/ui primitives
│   │   ├── FantasyMap.tsx      # Leaflet CRS.Simple map
│   │   ├── WorldSidebar.tsx    # World list & search
│   │   ├── WorldHeader.tsx     # Top navigation bar
│   │   ├── SubmitRealmDialog.tsx # Nostr submission form
│   │   └── PendingRealmsPanel.tsx # Community voting panel
│   ├── hooks/            # Custom React hooks (Nostr queries, etc.)
│   ├── lib/
│   │   ├── worldData.ts  # ← Curated seed world list lives here
│   │   ├── worldTypes.ts # TypeScript interfaces & constants
│   │   └── ...
│   ├── pages/            # Route-level page components
│   └── contexts/         # React context providers
├── NIP.md                # Custom Nostr protocol specification
├── CONTRIBUTING.md       # This file
├── LICENSE               # MIT License
└── README.md             # Project overview
```

---

## Submitting a New Virtual World (Seed Data)

The curated list of pre-loaded worlds lives in **`src/lib/worldData.ts`**. To add a new world:

### 1. Open `src/lib/worldData.ts`

Find the section for the correct biome (see [Biome Reference](#biome-reference)) and add a new entry following this shape:

```ts
{
  id: 'unique-kebab-case-id',           // Lowercase, hyphens only, globally unique
  name: 'World Name',
  lore: 'Fantasy-flavored description ~1-2 sentences.',
  description: 'Plain factual description of what this world is.',
  url: 'https://official-website.example',
  thumbnail: 'https://...image-url...', // Publicly accessible image, ~400px wide
  biome: 'crystal-spires',              // One of the 8 biomes — see below
  tags: ['VR', 'Free', 'Multiplayer'],  // 2–5 short tags
  coordinates: [2400, 1500],            // [lat (y), lng (x)] within [0–5000, 0–8000]
  visitors: 500_000,                    // Approximate monthly active users
  rating: 4.2,                          // Your honest assessment (1.0–5.0)
},
```

### 2. Guidelines for Good Entries

- **`id`** must be globally unique and use only lowercase letters, numbers, and hyphens.
- **`lore`** should feel like flavour text from a fantasy novel — make it evocative!
- **`description`** should be factual and neutral, no marketing language.
- **`url`** must link to the official website or main entry point.
- **`thumbnail`** should ideally be a real screenshot or official artwork. Unsplash fallbacks are acceptable for launch but real assets are preferred.
- **`coordinates`** should be placed in the correct biome region on the map. Check existing entries in the same biome for guidance.
- **`tags`** are short, capitalised labels (e.g. `"VR"`, `"Free"`, `"Mobile"`, `"Open-Source"`).
- **`visitors`** and **`rating`** are approximations; cite your sources in the PR description.

### 3. Coordinate Zones (Approximate)

| Biome | Y (lat) range | X (lng) range |
|---|---|---|
| Enchanted Forests | 1100–1800 | 2200–3200 |
| Mountain Forges | 1000–2000 | 5000–6100 |
| Crystal Spires | 2000–3200 | 1100–1800 |
| Shadow Realms | 2700–3500 | 6100–7000 |
| Floating Isles | 3800–4500 | 3500–4700 |
| Sunken Depths | 2500–3100 | 3600–4500 |
| Void Nexus | 3000–3700 | 500–1100 |
| Dragon Peaks | 800–1500 | 6500–7500 |

---

## Biome Reference

| Value | Label | Types of worlds |
|---|---|---|
| `enchanted-forest` | Enchanted Forests | Social, roleplay, avatar-based |
| `mountain-forge` | Mountain Forges | Creative sandboxes, game creation |
| `crystal-spires` | Crystal Spires | VR headset worlds, metaverse |
| `shadow-realms` | Shadow Realms | Indie, experimental, open-source |
| `floating-isles` | Floating Isles | Browser-based, no-download worlds |
| `sunken-depths` | Sunken Depths | Sci-fi, space, alien worlds |
| `void-nexus` | Void Nexus | AI simulations, abstract, Web3 identity |
| `dragon-peaks` | Dragon Peaks | Competitive, battle royale, gaming |

---

## Coding Guidelines

### TypeScript

- **Never use `any`**. Use proper types at all times.
- Define interfaces in `src/lib/worldTypes.ts` for shared data shapes.
- Prefer `type` for unions/intersections, `interface` for object shapes.

### React

- Use functional components with hooks only.
- Keep components focused — one responsibility per component.
- Prefer `useCallback` for event handlers passed to child components.
- Use `useMemo` for expensive derived values.

### Styling

- Use **Tailwind CSS utility classes** exclusively — no inline styles unless strictly necessary (e.g. dynamic map colours).
- Follow the existing dark-space aesthetic: deep navy backgrounds (`#030e1f`), gold accents (`#c9a84c`), frost-purple text.
- Use the `cn()` utility from `src/lib/utils.ts` to conditionally merge class names.

### Nostr

- Always use `useNostrPublish` for publishing events — never call the signer directly.
- Filter queries by `authors` wherever trust is required (see security notes in `AGENTS.md`).
- Include `alt` tags on all custom kind events (NIP-31 compliance).

### Linting & Formatting

The project uses **ESLint** with the TypeScript and React-Hooks plugins. Run the linter before committing:

```bash
npx eslint .
```

---

## Pull Request Process

1. **Fork** the repo and create a feature branch:
   ```bash
   git checkout -b feat/add-my-world
   ```

2. **Make your changes** — keep commits small and focused.

3. **Run the full test suite**:
   ```bash
   npm test
   ```
   Fix any type errors, lint warnings, or failing tests before continuing.

4. **Open a Pull Request** against the `main` branch with:
   - A clear title (e.g. `feat: add Neos VR to shadow-realms biome`)
   - A description of *what* changed and *why*
   - Screenshots / screen recordings for UI changes
   - Sources for visitor counts or ratings if adding world data

5. A maintainer will review your PR. Please respond to feedback promptly.

6. Once approved, your PR will be squash-merged.

### Commit Message Convention

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Neos VR to shadow-realms
fix: correct Decentraland coordinates
docs: update biome reference table
chore: bump nostr-tools to 2.14
```

---

## Nostr Protocol Extensions

Significant changes to the event schema (kinds 37801 and 1459) require a **NIP amendment**:

1. Open an issue describing the proposed change and its rationale.
2. Discuss with maintainers — breaking changes require a migration path.
3. Update `NIP.md` alongside any code changes in the same PR.
4. Custom kinds must include an `alt` NIP-31 tag.

See the existing [NIP.md](./NIP.md) for the current spec.

---

## Reporting Bugs

Open a GitHub Issue and include:

- **Steps to reproduce** the bug
- **Expected behaviour**
- **Actual behaviour**
- **Browser & OS** (e.g. Firefox 126, macOS 14)
- **Console errors** (open DevTools → Console)
- **Nostr extension** you're using (if relevant)

---

## Feature Requests

Open a GitHub Issue with the `enhancement` label and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered
- Mockups or references if applicable

---

Thank you for helping make the Atlas of the Multiverse better for everyone! 🌍✨
