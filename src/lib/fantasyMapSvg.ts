// Procedural SVG fantasy continent map – MASSIVE 8000x5000 scale
// Returns a data URL for use with L.imageOverlay

export const MAP_SVG_WIDTH = 8000;
export const MAP_SVG_HEIGHT = 5000;

export function generateFantasyMapSvg(): string {
  const W = MAP_SVG_WIDTH;
  const H = MAP_SVG_HEIGHT;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="oceanGrad" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#0c2d4f"/>
      <stop offset="50%" stop-color="#081e3d"/>
      <stop offset="100%" stop-color="#030e1f"/>
    </radialGradient>
    <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2d4a22"/>
      <stop offset="40%" stop-color="#3d5a30"/>
      <stop offset="100%" stop-color="#1a3015"/>
    </linearGradient>
    <radialGradient id="forestGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d6a4f" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#1b4332" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7f5539"/>
      <stop offset="100%" stop-color="#4a2c0e"/>
    </linearGradient>
    <radialGradient id="crystalGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8ecae6" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#219ebc" stop-opacity="0.35"/>
    </radialGradient>
    <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3a3a5c" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#1a1a3a" stop-opacity="0.6"/>
    </radialGradient>
    <radialGradient id="islesGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#caf0f8" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#90e0ef" stop-opacity="0.25"/>
    </radialGradient>
    <radialGradient id="voidGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6a0dad" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#3c006e" stop-opacity="0.45"/>
    </radialGradient>
    <radialGradient id="dragonGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#9b1c1c" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#5c0000" stop-opacity="0.55"/>
    </radialGradient>
    <radialGradient id="sunkenGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#023e8a" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#012a5e" stop-opacity="0.45"/>
    </radialGradient>
    <filter id="landNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="4" seed="2" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0.12  0 0 0 0 0  0 0 0 0.1 0" in="noise" result="colorNoise"/>
      <feBlend in="SourceGraphic" in2="colorNoise" mode="multiply"/>
    </filter>
    <filter id="coastGlow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- OCEAN -->
  <rect width="${W}" height="${H}" fill="url(#oceanGrad)"/>

  <!-- Ocean waves -->
  <g opacity="0.1" stroke="#4fc3f7" stroke-width="1.5" fill="none">
    ${genWaves(W, H)}
  </g>

  <!-- ═══ MAIN CONTINENT ═══ -->
  <path d="
    M 1400,700 C 1600,500 2000,380 2600,420 C 3200,460 3800,380 4400,450
    C 5000,520 5500,420 6000,500 C 6500,580 6900,500 7100,650
    C 7350,800 7400,1100 7350,1400 C 7300,1700 7100,1950 6900,2200
    C 6700,2450 6800,2700 6700,2950 C 6600,3200 6400,3400 6100,3550
    C 5800,3700 5400,3750 5000,3800 C 4600,3850 4200,3900 3800,3850
    C 3400,3800 3000,3750 2600,3700 C 2200,3650 1800,3600 1500,3500
    C 1200,3400 950,3250 800,3050 C 650,2850 600,2600 650,2350
    C 700,2100 800,1850 850,1650 C 900,1450 950,1250 1050,1050
    C 1150,850 1200,900 1400,700 Z
  " fill="url(#landGrad)" filter="url(#landNoise)" stroke="#1a5c30" stroke-width="3" stroke-opacity="0.3"/>

  <!-- Coastline glow -->
  <path d="
    M 1400,700 C 1600,500 2000,380 2600,420 C 3200,460 3800,380 4400,450
    C 5000,520 5500,420 6000,500 C 6500,580 6900,500 7100,650
    C 7350,800 7400,1100 7350,1400 C 7300,1700 7100,1950 6900,2200
    C 6700,2450 6800,2700 6700,2950 C 6600,3200 6400,3400 6100,3550
    C 5800,3700 5400,3750 5000,3800 C 4600,3850 4200,3900 3800,3850
    C 3400,3800 3000,3750 2600,3700 C 2200,3650 1800,3600 1500,3500
    C 1200,3400 950,3250 800,3050 C 650,2850 600,2600 650,2350
    C 700,2100 800,1850 850,1650 C 900,1450 950,1250 1050,1050
    C 1150,850 1200,900 1400,700 Z
  " fill="none" stroke="#3ddc84" stroke-width="4" stroke-opacity="0.08" filter="url(#coastGlow)"/>

  <!-- Northern peninsula -->
  <path d="M 3400,420 C 3450,280 3550,200 3700,220 C 3850,240 3900,350 3850,450 C 3800,550 3650,560 3550,520 C 3450,480 3360,520 3400,420 Z" fill="#2d4a22"/>
  <!-- Northwest headland -->
  <path d="M 1600,600 C 1550,450 1650,350 1800,380 C 1950,410 1980,530 1900,600 C 1820,670 1650,680 1600,600 Z" fill="#2d4a22"/>
  <!-- Eastern cape -->
  <path d="M 7200,1800 C 7350,1700 7500,1750 7530,1870 C 7560,1990 7450,2100 7300,2050 C 7150,2000 7100,1900 7200,1800 Z" fill="#2d4a22"/>

  <!-- Western islands -->
  <path d="M 450,1600 C 500,1500 620,1510 650,1600 C 680,1690 620,1760 540,1740 C 460,1720 400,1700 450,1600 Z" fill="#2d4a22"/>
  <path d="M 350,2100 C 390,2020 480,2025 500,2100 C 520,2175 470,2230 400,2220 C 330,2210 310,2180 350,2100 Z" fill="#2d4a22"/>
  <path d="M 550,2500 C 600,2420 700,2425 720,2510 C 740,2595 690,2650 620,2640 C 550,2630 500,2580 550,2500 Z" fill="#2d4a22"/>
  <path d="M 300,2800 C 340,2730 420,2735 440,2810 C 460,2885 420,2930 360,2920 C 300,2910 260,2870 300,2800 Z" fill="#2d4a22"/>

  <!-- Southeastern archipelago -->
  <path d="M 5800,4100 C 5860,4020 5960,4030 5980,4110 C 6000,4190 5950,4240 5880,4230 C 5810,4220 5740,4180 5800,4100 Z" fill="#2d4a22"/>
  <path d="M 6200,4200 C 6260,4130 6360,4135 6380,4210 C 6400,4285 6350,4330 6280,4320 C 6210,4310 6140,4270 6200,4200 Z" fill="#2d4a22"/>
  <path d="M 6500,4050 C 6550,3970 6650,3985 6670,4060 C 6690,4135 6640,4180 6580,4170 C 6520,4160 6460,4120 6500,4050 Z" fill="#2d4a22"/>

  <!-- Northern island -->
  <path d="M 5000,250 C 5080,170 5220,175 5250,270 C 5280,365 5200,420 5110,410 C 5020,400 4930,340 5000,250 Z" fill="#2d4a22"/>

  <!-- ═══ BIOME OVERLAYS ═══ -->

  <!-- Enchanted Forest (NW) -->
  <ellipse cx="2800" cy="1400" rx="900" ry="700" fill="url(#forestGrad)" opacity="0.7"/>
  ${genTrees(2300, 1100, 30, '#1b4332', 0.7, 500)}
  ${genTrees(3100, 1500, 25, '#2d6a4f', 0.6, 400)}
  ${genTrees(2600, 1700, 20, '#234e35', 0.55, 350)}

  <!-- Mountain Forges (NE) -->
  <ellipse cx="5500" cy="1500" rx="850" ry="650" fill="url(#mountainGrad)" opacity="0.75"/>
  ${genMountains(5000, 1200, 14)}
  ${genMountains(5600, 1600, 10)}

  <!-- Crystal Spires (W) -->
  <ellipse cx="1600" cy="2500" rx="700" ry="800" fill="url(#crystalGrad)" opacity="0.6"/>
  ${genCrystals(1400, 2200, 16)}
  ${genCrystals(1700, 2700, 12)}

  <!-- Shadow Realms (E) -->
  <ellipse cx="6600" cy="3100" rx="700" ry="600" fill="url(#shadowGrad)" opacity="0.8"/>
  ${genSmoke(6300, 2900, 12)}

  <!-- Floating Isles (S) -->
  <ellipse cx="4000" cy="4100" rx="900" ry="500" fill="url(#islesGrad)" opacity="0.5"/>
  ${genIsles(3500, 4000, 8)}

  <!-- Void Nexus (far W) -->
  <ellipse cx="800" cy="3200" rx="550" ry="500" fill="url(#voidGrad)" opacity="0.75"/>
  ${genRunes(650, 3050, 9)}

  <!-- Dragon Peaks (far NE) -->
  <ellipse cx="6900" cy="1200" rx="600" ry="550" fill="url(#dragonGrad)" opacity="0.7"/>
  ${genDragon(6700, 1000)}
  ${genMountains(6500, 1050, 6)}

  <!-- Sunken Depths (center-south) -->
  <ellipse cx="3800" cy="2800" rx="600" ry="500" fill="url(#sunkenGrad)" opacity="0.5"/>

  <!-- ═══ RIVERS ═══ -->
  <g stroke="#4fc3f7" fill="none" opacity="0.4" stroke-linecap="round">
    <path d="M 2700,800 Q 2400,1300 2200,1800 Q 2000,2300 2300,2800" stroke-width="6"/>
    <path d="M 4500,600 Q 4700,1200 4600,1800 Q 4500,2400 4800,3000" stroke-width="5"/>
    <path d="M 6000,900 Q 5800,1500 5500,2000 Q 5200,2500 5400,3000" stroke-width="4.5"/>
    <path d="M 3200,1000 Q 3400,1500 3600,2000 Q 3800,2500 3600,3000" stroke-width="4"/>
    <!-- River deltas -->
    <path d="M 2300,2800 Q 2200,3000 2100,3200" stroke-width="3"/>
    <path d="M 2300,2800 Q 2400,3050 2350,3300" stroke-width="3"/>
    <path d="M 4800,3000 Q 4700,3200 4600,3400" stroke-width="3"/>
    <path d="M 4800,3000 Q 4900,3250 4850,3500" stroke-width="3"/>
  </g>

  <!-- ═══ LAKES ═══ -->
  <ellipse cx="3800" cy="2000" rx="250" ry="170" fill="#1a6b8a" opacity="0.65"/>
  <ellipse cx="3800" cy="2000" rx="200" ry="130" fill="#219ebc" opacity="0.35"/>
  <ellipse cx="2100" cy="2600" rx="130" ry="90" fill="#1a6b8a" opacity="0.6"/>
  <ellipse cx="5200" cy="2200" rx="150" ry="100" fill="#1a6b8a" opacity="0.55"/>
  <ellipse cx="4200" cy="1200" rx="100" ry="70" fill="#1a6b8a" opacity="0.5"/>
  <ellipse cx="6000" cy="2600" rx="120" ry="80" fill="#1a6b8a" opacity="0.5"/>

  <!-- ═══ BIOME LABELS ═══ -->
  <g font-family="serif" fill="#d4c5a9" opacity="0.5" font-style="italic">
    <text x="2800" y="1200" text-anchor="middle" font-size="50">Enchanted Forests</text>
    <text x="5500" y="1350" text-anchor="middle" font-size="50">Mountain Forges</text>
    <text x="1600" y="2350" text-anchor="middle" font-size="45">Crystal Spires</text>
    <text x="6600" y="3000" text-anchor="middle" font-size="45">Shadow Realms</text>
    <text x="4000" y="3950" text-anchor="middle" font-size="45">Floating Isles</text>
    <text x="800" y="3100" text-anchor="middle" font-size="40">Void Nexus</text>
    <text x="6900" y="1100" text-anchor="middle" font-size="45">Dragon Peaks</text>
    <text x="3800" y="2650" text-anchor="middle" font-size="45">Sunken Depths</text>
  </g>

  <!-- ═══ MAP GRID ═══ -->
  <g opacity="0.05" stroke="#c9a84c" stroke-width="1" fill="none">
    ${genGrid(W, H, 400)}
  </g>

  <!-- ═══ COMPASS ROSE ═══ -->
  ${genCompass(7500, 4600, 80)}

  <!-- ═══ TITLE CARTOUCHE ═══ -->
  <rect x="100" y="80" width="600" height="180" rx="12" fill="#0d1b2a" stroke="#c9a84c" stroke-width="3" opacity="0.85"/>
  <text x="400" y="150" text-anchor="middle" font-family="serif" font-size="42" fill="#c9a84c" letter-spacing="4">VIRTUAL WORLDS</text>
  <text x="400" y="195" text-anchor="middle" font-family="serif" font-size="20" fill="#a88a50" letter-spacing="2">THE ATLAS OF THE MULTIVERSE</text>
  <line x1="150" y1="215" x2="650" y2="215" stroke="#c9a84c" stroke-width="1.5" opacity="0.5"/>
  <text x="400" y="240" text-anchor="middle" font-family="serif" font-size="16" fill="#7a6a40" font-style="italic">Here be digital wonders</text>

  <!-- Corner decorations -->
  ${genCorners(W, H)}

  <!-- Scale bar -->
  <g transform="translate(200, 4750)" opacity="0.4">
    <line x1="0" y1="0" x2="400" y2="0" stroke="#c9a84c" stroke-width="2"/>
    <line x1="0" y1="-8" x2="0" y2="8" stroke="#c9a84c" stroke-width="2"/>
    <line x1="400" y1="-8" x2="400" y2="8" stroke="#c9a84c" stroke-width="2"/>
    <line x1="200" y1="-5" x2="200" y2="5" stroke="#c9a84c" stroke-width="1.5"/>
    <text x="200" y="25" text-anchor="middle" font-family="serif" font-size="14" fill="#c9a84c">100 leagues</text>
  </g>
</svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ─── Helpers ─────────────────────────────────────────────────────

function genWaves(w: number, h: number): string {
  const lines: string[] = [];
  for (let y = 120; y < h; y += 80) {
    const pts: string[] = [];
    for (let x = 0; x < w; x += 100) {
      const off = Math.sin((x + y) * 0.015) * 12;
      pts.push(`${x},${y + off}`);
    }
    lines.push(`<polyline points="${pts.join(' ')}"/>`);
  }
  return lines.join('\n    ');
}

function genTrees(cx: number, cy: number, count: number, color: string, op: number, spread: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + i * 0.7;
    const r = (Math.sin(i * 1.7) * 0.5 + 0.5) * spread;
    const tx = cx + Math.cos(a) * r;
    const ty = cy + Math.sin(a) * r;
    const s = 20 + Math.sin(i * 3.1) * 10;
    out.push(`<polygon points="${tx},${ty - s} ${tx - s * 0.6},${ty + s * 0.4} ${tx + s * 0.6},${ty + s * 0.4}" fill="${color}" opacity="${op}"/>`);
    out.push(`<rect x="${tx - 3}" y="${ty + s * 0.4}" width="6" height="${s * 0.4}" fill="#4a2c0e" opacity="${op}"/>`);
  }
  return out.join('\n    ');
}

function genMountains(cx: number, cy: number, count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const mx = cx + i * 75 + Math.sin(i * 0.8) * 40;
    const my = cy + Math.cos(i * 1.2) * 50;
    const w = 70 + Math.sin(i * 2) * 25;
    const h = 110 + Math.cos(i * 1.5) * 40;
    out.push(`<polygon points="${mx},${my - h} ${mx - w},${my + h * 0.3} ${mx + w},${my + h * 0.3}" fill="#8b6914" opacity="0.8"/>`);
    out.push(`<polygon points="${mx},${my - h} ${mx - w * 0.3},${my - h * 0.35} ${mx + w * 0.3},${my - h * 0.35}" fill="#e8e8e8" opacity="0.65"/>`);
  }
  return out.join('\n    ');
}

function genCrystals(cx: number, cy: number, count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = 100 + Math.sin(i * 1.4) * 250;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    const h = 40 + Math.sin(i * 0.9) * 25;
    const w = 14 + Math.cos(i * 1.7) * 6;
    out.push(`<polygon points="${x},${y - h} ${x - w},${y} ${x},${y + w * 0.5} ${x + w},${y}" fill="#a8d8ea" opacity="0.7"/>`);
  }
  return out.join('\n    ');
}

function genSmoke(cx: number, cy: number, count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const sx = cx + Math.sin(i * 2.1) * 350;
    const sy = cy + Math.cos(i * 1.3) * 250;
    const r = 40 + Math.sin(i * 0.7) * 30;
    out.push(`<circle cx="${sx}" cy="${sy}" r="${r}" fill="#2e2e4e" opacity="0.55"/>`);
  }
  return out.join('\n    ');
}

function genIsles(cx: number, cy: number, count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const ix = cx + i * 200 + Math.sin(i * 1.2) * 60;
    const iy = cy + Math.cos(i * 2.4) * 80;
    const w = 80 + Math.sin(i * 0.8) * 35;
    const h = 30 + Math.cos(i * 1.1) * 12;
    out.push(`<ellipse cx="${ix}" cy="${iy}" rx="${w}" ry="${h}" fill="#7ec8e3" opacity="0.5"/>`);
    out.push(`<ellipse cx="${ix}" cy="${iy - h * 0.4}" rx="${w * 0.6}" ry="${h * 0.5}" fill="#2d4a22" opacity="0.6"/>`);
  }
  return out.join('\n    ');
}

function genRunes(cx: number, cy: number, count: number): string {
  const out: string[] = [];
  const syms = ['\u2B21', '\u25B3', '\u25C8', '\u229B', '\u2B1F'];
  for (let i = 0; i < count; i++) {
    const rx = cx + Math.sin(i * 1.8) * 280;
    const ry = cy + Math.cos(i * 2.4) * 250;
    out.push(`<circle cx="${rx}" cy="${ry}" r="25" fill="none" stroke="#b44fc7" stroke-width="2" opacity="0.55"/>`);
    out.push(`<text x="${rx}" y="${ry + 8}" text-anchor="middle" font-size="22" fill="#d44fef" opacity="0.65">${syms[i % syms.length]}</text>`);
  }
  return out.join('\n    ');
}

function genDragon(x: number, y: number): string {
  return `
    <path d="M ${x + 100},${y + 100} C ${x + 60},${y + 30} ${x + 120},${y} ${x + 160},${y + 50}
      C ${x + 200},${y + 20} ${x + 250},${y + 40} ${x + 230},${y + 100}
      C ${x + 270},${y + 80} ${x + 300},${y + 120} ${x + 270},${y + 160}
      C ${x + 240},${y + 200} ${x + 160},${y + 180} ${x + 120},${y + 160}
      C ${x + 80},${y + 140} ${x + 140},${y + 180} ${x + 100},${y + 100} Z"
      fill="#c53030" opacity="0.6"/>
    <path d="M ${x + 140},${y + 80} L ${x + 40},${y + 30} L ${x + 100},${y + 120} Z" fill="#9b1c1c" opacity="0.45"/>
    <path d="M ${x + 210},${y + 80} L ${x + 340},${y + 35} L ${x + 250},${y + 120} Z" fill="#9b1c1c" opacity="0.45"/>
  `;
}

function genGrid(w: number, h: number, step: number): string {
  const out: string[] = [];
  for (let x = step; x < w; x += step) out.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`);
  for (let y = step; y < h; y += step) out.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`);
  return out.join('\n    ');
}

function genCompass(cx: number, cy: number, r: number): string {
  return `
  <g transform="translate(${cx},${cy})">
    <circle cx="0" cy="0" r="${r + 15}" fill="none" stroke="#c9a84c" stroke-width="2" opacity="0.6"/>
    <circle cx="0" cy="0" r="${r - 15}" fill="#0d1b2a" opacity="0.8"/>
    <polygon points="0,${-r} -14,${-r * 0.35} 14,${-r * 0.35}" fill="#c9a84c" opacity="0.85"/>
    <polygon points="0,${r} -14,${r * 0.35} 14,${r * 0.35}" fill="#6a5a30" opacity="0.85"/>
    <polygon points="${-r},0 ${-r * 0.35},-14 ${-r * 0.35},14" fill="#c9a84c" opacity="0.85"/>
    <polygon points="${r},0 ${r * 0.35},-14 ${r * 0.35},14" fill="#6a5a30" opacity="0.85"/>
    <circle cx="0" cy="0" r="7" fill="#c9a84c"/>
    <text x="0" y="${-r - 20}" text-anchor="middle" font-family="serif" font-size="20" fill="#c9a84c" font-weight="bold">N</text>
  </g>`;
}

function genCorners(w: number, h: number): string {
  const s = 60;
  const corners: [number, number, string][] = [
    [15, 15, ''], [w - 15, 15, 'scale(-1,1)'],
    [15, h - 15, 'scale(1,-1)'], [w - 15, h - 15, 'scale(-1,-1)'],
  ];
  return corners.map(([x, y, t]) => `
    <g transform="translate(${x},${y}) ${t}" transform-origin="${x} ${y}">
      <path d="M 0,0 L ${s},0 L ${s},12 L 12,12 L 12,${s} L 0,${s} Z" fill="none" stroke="#c9a84c" stroke-width="2" opacity="0.45"/>
    </g>`).join('');
}
