// Procedural SVG fantasy continent map
// Returns a data URL for use with L.imageOverlay
// The map is 3200×2000 px

export const MAP_SVG_WIDTH = 3200;
export const MAP_SVG_HEIGHT = 2000;

export function generateFantasyMapSvg(): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3200 2000" width="3200" height="2000">
  <defs>
    <!-- Ocean gradient -->
    <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0a2a4a"/>
      <stop offset="60%" stop-color="#071e3d"/>
      <stop offset="100%" stop-color="#030e1f"/>
    </radialGradient>
    <!-- Land base gradient -->
    <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2d4a22"/>
      <stop offset="40%" stop-color="#3d5a30"/>
      <stop offset="100%" stop-color="#1a3015"/>
    </linearGradient>
    <!-- Forest biome -->
    <radialGradient id="forestGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d6a4f" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#1b4332" stop-opacity="0.6"/>
    </radialGradient>
    <!-- Mountain biome -->
    <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7f5539"/>
      <stop offset="100%" stop-color="#4a2c0e"/>
    </linearGradient>
    <!-- Crystal biome -->
    <radialGradient id="crystalGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8ecae6" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#219ebc" stop-opacity="0.4"/>
    </radialGradient>
    <!-- Shadow biome -->
    <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3a3a5c" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#1a1a3a" stop-opacity="0.7"/>
    </radialGradient>
    <!-- Floating isles biome -->
    <radialGradient id="islesGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#caf0f8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#90e0ef" stop-opacity="0.3"/>
    </radialGradient>
    <!-- Void biome -->
    <radialGradient id="voidGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6a0dad" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#3c006e" stop-opacity="0.5"/>
    </radialGradient>
    <!-- Dragon biome -->
    <radialGradient id="dragonGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#9b1c1c" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#5c0000" stop-opacity="0.6"/>
    </radialGradient>
    <!-- Parchment texture overlay -->
    <filter id="parchment">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.4  0 0 0 0 0.1  0 0 0 0.08 0" result="coloredNoise"/>
      <feBlend in="SourceGraphic" in2="coloredNoise" mode="overlay"/>
    </filter>
    <!-- Glow filter for coastlines -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- Subtle noise for land texture -->
    <filter id="landNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0.15  0 0 0 0 0  0 0 0 0.12 0" in="noise" result="colorNoise"/>
      <feBlend in="SourceGraphic" in2="colorNoise" mode="multiply"/>
    </filter>
  </defs>

  <!-- ── OCEAN BACKGROUND ─────────────────────────────────────── -->
  <rect width="3200" height="2000" fill="url(#oceanGrad)"/>

  <!-- Ocean wave texture -->
  <g opacity="0.15" stroke="#4fc3f7" stroke-width="1" fill="none">
    ${generateWaves()}
  </g>

  <!-- ── MAIN CONTINENT ───────────────────────────────────────── -->
  <!-- Large central landmass -->
  <path d="
    M 600,300 C 700,200 900,150 1100,180 C 1350,210 1550,160 1750,200
    C 1950,240 2100,190 2300,220 C 2500,250 2700,210 2850,280
    C 3000,350 3050,480 3020,620 C 2990,760 2900,850 2850,950
    C 2800,1050 2820,1150 2780,1250 C 2740,1350 2650,1420 2550,1480
    C 2450,1540 2300,1560 2150,1580 C 2000,1600 1850,1620 1700,1600
    C 1550,1580 1400,1540 1250,1520 C 1100,1500 950,1480 800,1440
    C 650,1400 520,1340 440,1240 C 360,1140 350,1020 370,900
    C 390,780 440,670 480,570 C 520,470 500,400 600,300 Z
  " fill="url(#landGrad)" filter="url(#landNoise)"/>

  <!-- Northern peninsula -->
  <path d="
    M 1400,180 C 1420,100 1480,50 1560,60 C 1640,70 1680,130 1660,200
    C 1640,270 1580,280 1520,260 C 1460,240 1380,260 1400,180 Z
  " fill="#2d4a22"/>

  <!-- Eastern cape -->
  <path d="
    M 2900,800 C 2970,750 3050,780 3080,850 C 3110,920 3060,980 2980,970
    C 2900,960 2860,900 2900,800 Z
  " fill="#2d4a22"/>

  <!-- Western island cluster -->
  <path d="
    M 250,700 C 290,650 360,660 380,720 C 400,780 360,830 300,820
    C 240,810 210,760 250,700 Z
  " fill="#2d4a22"/>
  <path d="
    M 180,900 C 210,860 270,865 285,910 C 300,955 265,990 220,985
    C 175,980 150,940 180,900 Z
  " fill="#2d4a22"/>
  <path d="
    M 320,1050 C 360,1010 420,1015 435,1060 C 450,1105 415,1145 365,1140
    C 315,1135 280,1090 320,1050 Z
  " fill="#2d4a22"/>

  <!-- South-eastern archipelago -->
  <path d="
    M 2400,1650 C 2440,1610 2500,1615 2515,1655 C 2530,1695 2495,1730 2445,1720
    C 2395,1710 2360,1690 2400,1650 Z
  " fill="#2d4a22"/>
  <path d="
    M 2600,1700 C 2635,1665 2690,1670 2705,1710 C 2720,1750 2688,1785 2643,1778
    C 2598,1771 2565,1735 2600,1700 Z
  " fill="#2d4a22"/>

  <!-- ── BIOME OVERLAYS ────────────────────────────────────────── -->

  <!-- Enchanted Forest – northwest area (social/roleplay) -->
  <ellipse cx="1200" cy="600" rx="420" ry="300" fill="url(#forestGrad)" opacity="0.75"/>
  <!-- Forest trees decoration -->
  ${generateTrees(1050, 480, 12, '#1b4332', 0.7)}
  ${generateTrees(1300, 650, 10, '#2d6a4f', 0.6)}

  <!-- Mountain Forges – northeast (creative sandboxes) -->
  <ellipse cx="2200" cy="750" rx="350" ry="280" fill="url(#mountainGrad)" opacity="0.8"/>
  <!-- Mountain peaks -->
  ${generateMountains(2050, 680, 7)}

  <!-- Crystal Spires – west coast (VR/metaverse) -->
  <ellipse cx="760" cy="1050" rx="320" ry="350" fill="url(#crystalGrad)" opacity="0.65"/>
  ${generateCrystals(680, 950, 8)}

  <!-- Shadow Realms – far east (indie/experimental) -->
  <ellipse cx="2700" cy="1350" rx="300" ry="250" fill="url(#shadowGrad)" opacity="0.85"/>
  ${generateShadowSmoke(2600, 1280, 6)}

  <!-- Floating Isles – south (browser-based) -->
  <ellipse cx="1650" cy="1700" rx="380" ry="200" fill="url(#islesGrad)" opacity="0.55"/>
  ${generateFloatingIsles(1500, 1660, 5)}

  <!-- Void Nexus – far west (abstract/AI) -->
  <ellipse cx="420" cy="1400" rx="260" ry="220" fill="url(#voidGrad)" opacity="0.8"/>
  ${generateVoidRunes(360, 1350, 5)}

  <!-- Dragon Peaks – far northeast (competitive/gaming) -->
  <ellipse cx="2820" cy="620" rx="250" ry="220" fill="url(#dragonGrad)" opacity="0.75"/>
  ${generateDragonSymbols(2750, 560)}

  <!-- ── RIVERS & WATER FEATURES ──────────────────────────────── -->
  <path d="M 1100,400 Q 1000,600 950,800 Q 900,1000 1050,1200" 
    stroke="#4fc3f7" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M 1800,300 Q 1900,500 1850,700 Q 1800,900 1950,1100"
    stroke="#4fc3f7" stroke-width="2.5" fill="none" opacity="0.45"/>
  <path d="M 2400,500 Q 2350,700 2200,850 Q 2050,1000 2100,1200"
    stroke="#4fc3f7" stroke-width="2" fill="none" opacity="0.4"/>

  <!-- Lake in center -->
  <ellipse cx="1550" cy="900" rx="120" ry="80" fill="#1a6b8a" opacity="0.7"/>
  <ellipse cx="1550" cy="900" rx="100" ry="65" fill="#219ebc" opacity="0.4"/>

  <!-- Small lakes -->
  <ellipse cx="900" cy="1100" rx="60" ry="40" fill="#1a6b8a" opacity="0.6"/>
  <ellipse cx="2300" cy="1100" rx="50" ry="35" fill="#1a6b8a" opacity="0.55"/>

  <!-- ── BIOME LABELS ──────────────────────────────────────────── -->
  <g font-family="serif" fill="#d4c5a9" opacity="0.6" font-style="italic">
    <text x="1200" y="550" text-anchor="middle" font-size="22">Enchanted Forests</text>
    <text x="2200" y="700" text-anchor="middle" font-size="22">Mountain Forges</text>
    <text x="760" y="1000" text-anchor="middle" font-size="20">Crystal Spires</text>
    <text x="2700" y="1320" text-anchor="middle" font-size="20">Shadow Realms</text>
    <text x="1650" y="1660" text-anchor="middle" font-size="20">Floating Isles</text>
    <text x="420" y="1350" text-anchor="middle" font-size="18">Void Nexus</text>
    <text x="2820" y="580" text-anchor="middle" font-size="20">Dragon Peaks</text>
    <text x="1550" y="1250" text-anchor="middle" font-size="20">Sunken Depths</text>
  </g>

  <!-- ── GRID / MAP LINES ─────────────────────────────────────── -->
  <g opacity="0.07" stroke="#c9a84c" stroke-width="1" fill="none">
    ${generateGridLines()}
  </g>

  <!-- ── PARCHMENT OVERLAY ─────────────────────────────────────── -->
  <rect width="3200" height="2000" fill="none" filter="url(#parchment)" opacity="0.3"/>

  <!-- ── COMPASS ROSE ──────────────────────────────────────────── -->
  ${generateCompassRose(2980, 1880)}

  <!-- ── TITLE CARTOUCHE ──────────────────────────────────────── -->
  <rect x="60" y="40" width="380" height="110" rx="8" fill="#0d1b2a" stroke="#c9a84c" stroke-width="2" opacity="0.85"/>
  <text x="250" y="85" text-anchor="middle" font-family="serif" font-size="26" fill="#c9a84c" letter-spacing="3">VIRTUAL WORLDS</text>
  <text x="250" y="115" text-anchor="middle" font-family="serif" font-size="13" fill="#a88a50" letter-spacing="1">THE ATLAS OF THE MULTIVERSE</text>
  <line x1="90" y1="125" x2="410" y2="125" stroke="#c9a84c" stroke-width="1" opacity="0.5"/>
  <text x="250" y="140" text-anchor="middle" font-family="serif" font-size="11" fill="#7a6a40" font-style="italic">Here be digital wonders</text>

  <!-- Decorative corners -->
  ${generateCornerDecorations()}
</svg>
`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function generateWaves(): string {
  const lines: string[] = [];
  for (let y = 100; y < 2000; y += 60) {
    const points = [];
    for (let x = 0; x < 3200; x += 80) {
      const offset = Math.sin((x + y) * 0.02) * 8;
      points.push(`${x},${y + offset}`);
    }
    lines.push(`<polyline points="${points.join(' ')}"/>`);
  }
  return lines.join('\n  ');
}

function generateTrees(x: number, y: number, count: number, color: string, opacity: number): string {
  const trees: string[] = [];
  for (let i = 0; i < count; i++) {
    const tx = x + (Math.sin(i * 1.7) * 180);
    const ty = y + (Math.cos(i * 2.3) * 120);
    const size = 14 + Math.sin(i * 3.1) * 6;
    trees.push(`
      <polygon points="${tx},${ty - size} ${tx - size * 0.6},${ty + size * 0.4} ${tx + size * 0.6},${ty + size * 0.4}"
        fill="${color}" opacity="${opacity}"/>
      <rect x="${tx - 2}" y="${ty + size * 0.4}" width="4" height="${size * 0.4}"
        fill="#4a2c0e" opacity="${opacity}"/>
    `);
  }
  return trees.join('');
}

function generateMountains(x: number, y: number, count: number): string {
  const mts: string[] = [];
  for (let i = 0; i < count; i++) {
    const mx = x + i * 48 + Math.sin(i * 0.8) * 20;
    const my = y + Math.cos(i * 1.2) * 30;
    const w = 50 + Math.sin(i * 2) * 15;
    const h = 80 + Math.cos(i * 1.5) * 25;
    mts.push(`
      <polygon points="${mx},${my - h} ${mx - w},${my + h * 0.3} ${mx + w},${my + h * 0.3}"
        fill="#8b6914" opacity="0.8"/>
      <polygon points="${mx},${my - h} ${mx - w * 0.3},${my - h * 0.4} ${mx + w * 0.3},${my - h * 0.4}"
        fill="#e8e8e8" opacity="0.7"/>
    `);
  }
  return mts.join('');
}

function generateCrystals(x: number, y: number, count: number): string {
  const crystals: string[] = [];
  for (let i = 0; i < count; i++) {
    const cx = x + (Math.sin(i * 1.4) * 200);
    const cy = y + (Math.cos(i * 2.1) * 150);
    const h = 30 + Math.sin(i * 0.9) * 20;
    const w = 10 + Math.cos(i * 1.7) * 5;
    crystals.push(`
      <polygon points="${cx},${cy - h} ${cx - w},${cy} ${cx},${cy + w * 0.5} ${cx + w},${cy}"
        fill="#a8d8ea" opacity="0.7"/>
    `);
  }
  return crystals.join('');
}

function generateShadowSmoke(x: number, y: number, count: number): string {
  const smoke: string[] = [];
  for (let i = 0; i < count; i++) {
    const sx = x + (Math.sin(i * 2.1) * 150);
    const sy = y + (Math.cos(i * 1.3) * 100);
    const r = 30 + Math.sin(i * 0.7) * 20;
    smoke.push(`<circle cx="${sx}" cy="${sy}" r="${r}" fill="#2e2e4e" opacity="0.6"/>`);
  }
  return smoke.join('');
}

function generateFloatingIsles(x: number, y: number, count: number): string {
  const isles: string[] = [];
  for (let i = 0; i < count; i++) {
    const ix = x + i * 130 + Math.sin(i * 1.2) * 40;
    const iy = y + Math.cos(i * 2.4) * 50;
    const w = 60 + Math.sin(i * 0.8) * 25;
    const h = 22 + Math.cos(i * 1.1) * 8;
    isles.push(`
      <ellipse cx="${ix}" cy="${iy}" rx="${w}" ry="${h}"
        fill="#7ec8e3" opacity="0.55"/>
      <ellipse cx="${ix}" cy="${iy - h * 0.4}" rx="${w * 0.6}" ry="${h * 0.5}"
        fill="#2d4a22" opacity="0.65"/>
    `);
  }
  return isles.join('');
}

function generateVoidRunes(x: number, y: number, count: number): string {
  const runes: string[] = [];
  const symbols = ['⬡', '△', '◈', '⊛', '⬟'];
  for (let i = 0; i < count; i++) {
    const rx = x + (Math.sin(i * 1.8) * 120);
    const ry = y + (Math.cos(i * 2.4) * 100);
    runes.push(`
      <circle cx="${rx}" cy="${ry}" r="18" fill="none" stroke="#b44fc7" stroke-width="1.5" opacity="0.6"/>
      <text x="${rx}" y="${ry + 6}" text-anchor="middle" font-size="16" fill="#d44fef" opacity="0.7">${symbols[i % symbols.length]}</text>
    `);
  }
  return runes.join('');
}

function generateDragonSymbols(x: number, y: number): string {
  return `
    <!-- Dragon silhouette -->
    <path d="M ${x + 70},${y + 60} C ${x + 50},${y + 20} ${x + 80},${y} ${x + 100},${y + 30}
      C ${x + 120},${y + 10} ${x + 150},${y + 20} ${x + 140},${y + 60}
      C ${x + 160},${y + 50} ${x + 180},${y + 70} ${x + 160},${y + 90}
      C ${x + 140},${y + 110} ${x + 100},${y + 100} ${x + 80},${y + 90}
      C ${x + 60},${y + 80} ${x + 90},${y + 100} ${x + 70},${y + 60} Z"
      fill="#c53030" opacity="0.65"/>
    <!-- Wings -->
    <path d="M ${x + 90},${y + 50} L ${x + 30},${y + 20} L ${x + 70},${y + 70} Z"
      fill="#9b1c1c" opacity="0.5"/>
    <path d="M ${x + 130},${y + 50} L ${x + 200},${y + 25} L ${x + 155},${y + 70} Z"
      fill="#9b1c1c" opacity="0.5"/>
  `;
}

function generateGridLines(): string {
  const lines: string[] = [];
  for (let x = 200; x < 3200; x += 200) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="2000"/>`);
  }
  for (let y = 200; y < 2000; y += 200) {
    lines.push(`<line x1="0" y1="${y}" x2="3200" y2="${y}"/>`);
  }
  return lines.join('\n  ');
}

function generateCompassRose(cx: number, cy: number): string {
  const r = 55;
  return `
  <g transform="translate(${cx},${cy})">
    <!-- Outer ring -->
    <circle cx="0" cy="0" r="${r + 10}" fill="none" stroke="#c9a84c" stroke-width="1.5" opacity="0.7"/>
    <circle cx="0" cy="0" r="${r - 10}" fill="#0d1b2a" opacity="0.8"/>
    <!-- Cardinal points -->
    <polygon points="0,${-r} -10,${-r * 0.4} 10,${-r * 0.4}" fill="#c9a84c" opacity="0.9"/>
    <polygon points="0,${r} -10,${r * 0.4} 10,${r * 0.4}" fill="#6a5a30" opacity="0.9"/>
    <polygon points="${-r},0 ${-r * 0.4},-10 ${-r * 0.4},10" fill="#c9a84c" opacity="0.9"/>
    <polygon points="${r},0 ${r * 0.4},-10 ${r * 0.4},10" fill="#6a5a30" opacity="0.9"/>
    <!-- Intercardinal -->
    <polygon points="${r * 0.7},${-r * 0.7} ${r * 0.5},${-r * 0.2} ${r * 0.2},${-r * 0.5}" fill="#a88a50" opacity="0.7"/>
    <polygon points="${-r * 0.7},${-r * 0.7} ${-r * 0.5},${-r * 0.2} ${-r * 0.2},${-r * 0.5}" fill="#a88a50" opacity="0.7"/>
    <polygon points="${r * 0.7},${r * 0.7} ${r * 0.5},${r * 0.2} ${r * 0.2},${r * 0.5}" fill="#a88a50" opacity="0.7"/>
    <polygon points="${-r * 0.7},${r * 0.7} ${-r * 0.5},${r * 0.2} ${-r * 0.2},${r * 0.5}" fill="#a88a50" opacity="0.7"/>
    <!-- Center dot -->
    <circle cx="0" cy="0" r="5" fill="#c9a84c"/>
    <!-- N label -->
    <text x="0" y="${-r - 14}" text-anchor="middle" font-family="serif" font-size="14" fill="#c9a84c" font-weight="bold">N</text>
  </g>`;
}

function generateCornerDecorations(): string {
  const size = 40;
  const corners: [number, number, string][] = [
    [10, 10, ''],
    [3190, 10, 'scale(-1,1)'],
    [10, 1990, 'scale(1,-1)'],
    [3190, 1990, 'scale(-1,-1)'],
  ];
  return corners.map(([x, y, transform]) => `
    <g transform="translate(${x},${y}) ${transform}" transform-origin="${x} ${y}">
      <path d="M 0,0 L ${size},0 L ${size},8 L 8,8 L 8,${size} L 0,${size} Z"
        fill="none" stroke="#c9a84c" stroke-width="1.5" opacity="0.5"/>
    </g>
  `).join('');
}
