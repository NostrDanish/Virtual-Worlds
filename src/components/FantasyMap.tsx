// FantasyMap – Leaflet map with L.CRS.Simple + massive 8000x5000 SVG overlay
// Custom glowing portal DivIcon markers with pulsing CSS animations per biome.

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WorldMarker, Biome } from '@/lib/worldTypes';
import { BIOME_META, MAP_WIDTH, MAP_HEIGHT } from '@/lib/worldTypes';
import { generateFantasyMapSvg } from '@/lib/fantasyMapSvg';

interface FantasyMapProps {
  worlds: WorldMarker[];
  selectedWorldId: string | null;
  onWorldSelect: (world: WorldMarker) => void;
  onMapClick?: () => void;
}

// Biome glow/core color palette
const BIOME_COLORS: Record<Biome, { glow: string; core: string }> = {
  'enchanted-forest': { glow: '#40c97f', core: '#2d6a4f' },
  'mountain-forge':   { glow: '#f59e0b', core: '#6b4226' },
  'crystal-spires':   { glow: '#818cf8', core: '#5e60ce' },
  'shadow-realms':    { glow: '#a78bfa', core: '#3a3a5c' },
  'floating-isles':   { glow: '#38bdf8', core: '#0077b6' },
  'sunken-depths':    { glow: '#22d3ee', core: '#023e8a' },
  'void-nexus':       { glow: '#e879f9', core: '#7b2d8b' },
  'dragon-peaks':     { glow: '#f87171', core: '#9b1c1c' },
};

function createPortalIcon(biome: Biome, isSelected: boolean): L.DivIcon {
  const { glow, core } = BIOME_COLORS[biome];
  const size = isSelected ? 34 : 26;
  const pulseSize = size + 20;
  const outerSize = pulseSize + 16;

  const html = `
    <div class="portal-marker" style="position:relative;width:${outerSize}px;height:${outerSize}px;">
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:${pulseSize + 10}px;height:${pulseSize + 10}px;border-radius:50%;
        background:${glow};opacity:0.2;
        animation:portalPulse 2.2s ease-in-out infinite;pointer-events:none;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:${size + 8}px;height:${size + 8}px;border-radius:50%;
        background:transparent;border:2px solid ${glow};
        box-shadow:0 0 14px ${glow},0 0 28px ${glow}55;
        animation:portalGlow 2s ease-in-out infinite alternate;pointer-events:none;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:${size}px;height:${size}px;border-radius:50%;
        background:radial-gradient(circle,${glow}cc 0%,${core} 55%,#000000cc 100%);
        border:2px solid ${glow};
        box-shadow:0 0 10px ${glow},inset 0 0 10px rgba(0,0,0,0.5);
        cursor:pointer;
      "></div>
      ${isSelected ? `<div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:${size + 14}px;height:${size + 14}px;border-radius:50%;
        border:2px solid #fbbf24;box-shadow:0 0 20px #fbbf24;pointer-events:none;
      "></div>` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -(outerSize / 2)],
  });
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

function createPopupContent(world: WorldMarker): string {
  const biome = BIOME_META[world.biome];
  const { glow, core } = BIOME_COLORS[world.biome];
  const stars = '\u2605'.repeat(Math.round(world.rating)) + '\u2606'.repeat(5 - Math.round(world.rating));
  const tags = world.tags.map(t =>
    `<span style="background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:4px;padding:2px 8px;font-size:11px;margin:2px 3px 0 0;display:inline-block;">${t}</span>`
  ).join('');

  return `
    <div style="
      font-family:'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif;
      background:linear-gradient(135deg,#0f1729 0%,#1a0a2e 100%);
      border:1px solid #4a3f6b;border-radius:14px;width:300px;overflow:hidden;
      color:#e2d8f3;box-shadow:0 12px 40px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.05);
    ">
      ${world.thumbnail ? `
      <div style="height:140px;overflow:hidden;position:relative;">
        <img src="${world.thumbnail}" alt="${world.name}" style="width:100%;height:100%;object-fit:cover;opacity:0.85;"/>
        <div style="position:absolute;bottom:0;left:0;right:0;height:70px;background:linear-gradient(to top,#0f1729,transparent);"></div>
        <div style="position:absolute;top:8px;right:8px;background:${glow}22;border:1px solid ${glow}88;color:${glow};border-radius:20px;padding:4px 12px;font-size:11px;">
          ${biome.emoji} ${biome.label}
        </div>
      </div>` : ''}
      <div style="padding:16px;">
        <h3 style="margin:0 0 6px;font-size:20px;font-weight:bold;color:#f0e6ff;letter-spacing:0.5px;text-shadow:0 0 24px ${glow}55;">${world.name}</h3>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="color:#fbbf24;font-size:13px;letter-spacing:1px;">${stars}</span>
          <span style="color:#6b7280;font-size:12px;">${world.rating.toFixed(1)}</span>
          <span style="color:#4b5563;font-size:12px;">&bull;</span>
          <span style="color:#60a5fa;font-size:12px;">\uD83D\uDC41 ${fmtNum(world.visitors)} adventurers</span>
        </div>
        <p style="margin:0 0 12px;font-size:13px;color:#a89cc8;font-style:italic;line-height:1.6;border-left:3px solid ${glow}55;padding-left:10px;">
          &ldquo;${world.lore}&rdquo;
        </p>
        <div style="margin-bottom:14px;">${tags}</div>
        <a href="${world.url}" target="_blank" rel="noopener noreferrer" style="
          display:block;text-align:center;
          background:linear-gradient(135deg,${core},${glow}cc);color:#fff;
          text-decoration:none;padding:10px 18px;border-radius:10px;
          font-size:14px;font-weight:bold;letter-spacing:1px;
          border:1px solid ${glow}88;box-shadow:0 0 16px ${glow}44;
          transition:all 0.2s ease;
        " onmouseover="this.style.boxShadow='0 0 30px ${glow}88'" onmouseout="this.style.boxShadow='0 0 16px ${glow}44'">
          \u26A1 Enter Portal
        </a>
      </div>
    </div>
  `;
}

export function FantasyMap({ worlds, selectedWorldId, onWorldSelect, onMapClick }: FantasyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialise the Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const bounds: L.LatLngBoundsLiteral = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];

    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 4,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [[-200, -200], [MAP_HEIGHT + 200, MAP_WIDTH + 200]],
      maxBoundsViscosity: 0.85,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 100,
    });

    // Generate and overlay the massive SVG map
    const imageUrl = generateFantasyMapSvg();
    L.imageOverlay(imageUrl, bounds).addTo(map);

    // Start slightly zoomed in for an immersive feel
    map.setView([MAP_HEIGHT * 0.45, MAP_WIDTH * 0.45], -0.5);

    // Custom zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Click on map background to deselect
    map.on('click', () => onMapClick?.());

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep markers in sync
  const updateMarkers = useCallback(() => {
    const map = leafletMap.current;
    if (!map) return;

    const existingIds = new Set(markersRef.current.keys());
    const newIds = new Set(worlds.map(w => w.id));

    for (const id of existingIds) {
      if (!newIds.has(id)) {
        markersRef.current.get(id)?.remove();
        markersRef.current.delete(id);
      }
    }

    for (const world of worlds) {
      const isSelected = world.id === selectedWorldId;
      const icon = createPortalIcon(world.biome, isSelected);
      const latlng: L.LatLngExpression = [world.coordinates[0], world.coordinates[1]];

      if (markersRef.current.has(world.id)) {
        const marker = markersRef.current.get(world.id)!;
        marker.setLatLng(latlng);
        marker.setIcon(icon);
      } else {
        const marker = L.marker(latlng, { icon })
          .addTo(map)
          .bindPopup(createPopupContent(world), {
            maxWidth: 320,
            className: 'fantasy-popup',
          });

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onWorldSelect(world);
          marker.openPopup();
        });

        markersRef.current.set(world.id, marker);
      }
    }
  }, [worlds, selectedWorldId, onWorldSelect]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Pan to selected world
  useEffect(() => {
    if (!selectedWorldId || !leafletMap.current) return;
    const world = worlds.find(w => w.id === selectedWorldId);
    if (world) {
      const marker = markersRef.current.get(world.id);
      if (marker) {
        leafletMap.current.flyTo(
          [world.coordinates[0], world.coordinates[1]],
          1,
          { animate: true, duration: 1.2 }
        );
        setTimeout(() => marker.openPopup(), 600);
      }
    }
  }, [selectedWorldId, worlds]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        background: '#030e1f',
        cursor: 'crosshair',
      }}
    />
  );
}
