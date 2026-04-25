# Virtual Worlds NIP

This document defines the custom Nostr event kinds used by **Virtual World's** — the Atlas of the Multiverse.

---

## Kind 37801 – Virtual Realm Listing (Addressable)

An addressable event representing a virtual world / realm submission in the Virtual Worlds atlas.

**Kind:** `37801`  
**Range:** Addressable (30000–39999) — latest event per `pubkey + kind + d` combination is kept.

### Event Structure

```json
{
  "kind": 37801,
  "content": "<plain description of the world>",
  "tags": [
    ["d", "<unique-slug-identifier>"],
    ["name", "<World Name>"],
    ["u", "<URL to enter the world>"],
    ["t", "<biome>"],
    ["image", "<thumbnail image URL>"],
    ["lore", "<fantasy-flavored lore description>"],
    ["lat", "<y-coordinate on the atlas map>"],
    ["lng", "<x-coordinate on the atlas map>"],
    ["status", "pending|approved"],
    ["tag", "<tag1>"],
    ["tag", "<tag2>"],
    ["alt", "Virtual realm listing: <name>"]
  ]
}
```

### Tags

| Tag      | Required | Description |
|----------|----------|-------------|
| `d`      | Yes      | Unique identifier slug (e.g. `vw-my-world-abc123`) |
| `name`   | Yes      | Display name of the virtual world |
| `u`      | Yes      | URL to access / enter the world |
| `t`      | Yes      | Biome/category (see Biomes section) |
| `image`  | No       | Thumbnail image URL |
| `lore`   | No       | Fantasy-flavored lore description |
| `lat`    | No       | Y-coordinate on the atlas map (0–5000) |
| `lng`    | No       | X-coordinate on the atlas map (0–8000) |
| `status` | No       | `"pending"` (awaiting community votes) or omit/`"approved"` (on map) |
| `tag`    | No       | Repeatable. Additional tags like "VR", "Free", "Multiplayer" |
| `alt`    | Yes      | NIP-31 human-readable summary |

### Biomes

| Value              | Label             | Description |
|--------------------|-------------------|-------------|
| `enchanted-forest` | Enchanted Forests | Social / roleplay worlds |
| `mountain-forge`   | Mountain Forges   | Creative sandboxes (Roblox, Minecraft) |
| `crystal-spires`   | Crystal Spires    | VR / metaverse experiences |
| `shadow-realms`    | Shadow Realms     | Indie / experimental worlds |
| `floating-isles`   | Floating Isles    | Browser-based worlds |
| `sunken-depths`    | Sunken Depths     | Sci-fi / alien worlds |
| `void-nexus`       | Void Nexus        | Abstract / AI worlds |
| `dragon-peaks`     | Dragon Peaks      | Competitive / gaming worlds |

---

## Kind 1459 – Realm Upvote / Endorsement (Regular)

A simple endorsement event. One upvote per pubkey per realm is counted.

**Kind:** `1459`  
**Range:** Regular (1000–9999) — stored permanently by relays.

### Event Structure

```json
{
  "kind": 1459,
  "content": "",
  "tags": [
    ["e", "<event-id of the kind 37801 pending realm>"],
    ["alt", "Upvote for virtual realm: <name>"]
  ]
}
```

### Tags

| Tag   | Required | Description |
|-------|----------|-------------|
| `e`   | Yes      | Event ID of the pending kind 37801 realm |
| `alt` | Yes      | NIP-31 human-readable summary |

---

## NIP-25 Reactions (Kind 7) – Alternative Voting

In addition to kind 1459, the app also publishes and counts **NIP-25 reactions** (kind 7) as upvotes for maximum Nostr interoperability. This means users voting from any standard Nostr client that supports NIP-25 reactions will have their votes counted.

### Reaction Event Structure

```json
{
  "kind": 7,
  "content": "+",
  "tags": [
    ["e", "<event-id of the kind 37801 pending realm>"],
    ["k", "37801"],
    ["alt", "Reaction to virtual realm: <name>"]
  ]
}
```

Both kind 1459 and kind 7 events referencing the same `e` tag are counted. Unique pubkeys are deduplicated across both kinds.

---

## Voting Threshold

When a pending realm accumulates **5 unique upvotes** (unique by pubkey, from either kind 1459 or kind 7), it is automatically promoted to approved status and displayed on the atlas map.
