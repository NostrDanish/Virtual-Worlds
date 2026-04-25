// FantasyMap – Leaflet map with L.CRS.Simple + image overlay
// Markers are custom glowing portal DivIcons with pulsing CSS animations.

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

// Color config per biome
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
  const size = isSelected ? 28 : 22;
  const pulseSize = size + 14;

  const html = `
    <div class="portal-marker" data-biome="${biome}" style="position:relative;width:${size}px;height:${size}px;">
      <!-- Outer pulse ring -->
      <div style="
        position:absolute;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:${pulseSize}px;height:${pulseSize}px;
        border-radius:50%;
        background:${glow};
        opacity:0.25;
        animation: portalPulse 2s ease-in-out infinite;
        pointer-events:none;
      "></div>
      <!-- Inner glow ring -->
      <div style="
        position:absolute;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:${size + 6}px;height:${size + 6}px;
        border-radius:50%;
        background:transparent;
        border:2px solid ${glow};
        box-shadow: 0 0 10px ${glow}, 0 0 20px ${glow}60;
        animation: portalGlow 2s ease-in-out infinite alternate;
        pointer-events:none;
      "></div>
      <!-- Core portal -->
      <div style="
        position:absolute;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:radial-gradient(circle, ${glow}cc 0%, ${core}ff 60%, #000000cc 100%);
        border:2px solid ${glow};
        box-shadow: 0 0 8px ${glow}, inset 0 0 8px rgba(0,0,0,0.6);
        cursor:pointer;
        transition: transform 0.2s ease;
      "></div>
      ${isSelected ? `<div style="
        position:absolute;
        top:-4px;left:-4px;
        width:${size + 8}px;height:${size + 8}px;
        border-radius:50%;
        border:2px solid #fbbf24;
        box-shadow: 0 0 16px #fbbf24;
        pointer-events:none;
      "></div>` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [pulseSize + 10, pulseSize + 10],
    iconAnchor: [(pulseSize + 10) / 2, (pulseSize + 10) / 2],
    popupAnchor: [0, -(pulseSize / 2)],
  });
}

function formatVisitors(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

function createPopupContent(world: WorldMarker): string {
  const biome = BIOME_META[world.biome];
  const stars = '★'.repeat(Math.round(world.rating)) + '☆'.repeat(5 - Math.round(world.rating));
  const tags = world.tags.map(t =>
    `<span style="background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:4px;padding:2px 7px;font-size:10px;margin:2px 2px 0 0;display:inline-block;">${t}</span>`
  ).join('');

  return `
    <div style="
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
      background: linear-gradient(135deg, #0f1729 0%, #1a0a2e 100%);
      border: 1px solid #4a3f6b;
      border-radius: 12px;
      width: 280px;
      overflow: hidden;
      color: #e2d8f3;
      box-shadow: 0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05);
    ">
      <!-- Thumbnail -->
      ${world.thumbnail ? `
      <div style="height:130px;overflow:hidden;position:relative;">
        <img src="${world.thumbnail}" alt="${world.name}"
          style="width:100%;height:100%;object-fit:cover;opacity:0.85;"/>
        <div style="position:absolute;bottom:0;left:0;right:0;height:60px;
          background:linear-gradient(to top,#0f1729,transparent);"></div>
        <div style="position:absolute;top:8px;right:8px;
          background:${BIOME_COLORS[world.biome].glow}22;
          border:1px solid ${BIOME_COLORS[world.biome].glow}88;
          color:${BIOME_COLORS[world.biome].glow};
          border-radius:20px;padding:3px 10px;font-size:11px;">
          ${biome.emoji} ${biome.label}
        </div>
      </div>` : ''}

      <div style="padding:14px;">
        <!-- Title -->
        <h3 style="
          margin:0 0 4px;
          font-size:18px;
          font-weight:bold;
          color:#f0e6ff;
          letter-spacing:0.5px;
          text-shadow: 0 0 20px ${BIOME_COLORS[world.biome].glow}66;
        ">${world.name}</h3>

        <!-- Rating + visitors -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span style="color:#fbbf24;font-size:12px;letter-spacing:1px;">${stars}</span>
          <span style="color:#6b7280;font-size:11px;">${world.rating.toFixed(1)}</span>
          <span style="color:#4b5563;font-size:11px;">•</span>
          <span style="color:#60a5fa;font-size:11px;">👁 ${formatVisitors(world.visitors)} adventurers</span>
        </div>

        <!-- Lore text -->
        <p style="
          margin:0 0 10px;
          font-size:12px;
          color:#a89cc8;
          font-style:italic;
          line-height:1.5;
          border-left:2px solid ${BIOME_COLORS[world.biome].glow}66;
          padding-left:8px;
        ">"${world.lore}"</p>

        <!-- Tags -->
        <div style="margin-bottom:12px;">${tags}</div>

        <!-- CTA button -->
        <a href="${world.url}" target="_blank" rel="noopener noreferrer"
          style="
            display:block;
            text-align:center;
            background:linear-gradient(135deg, ${BIOME_COLORS[world.biome].core}, ${BIOME_COLORS[world.biome].glow}cc);
            color:#fff;
            text-decoration:none;
            padding:9px 16px;
            border-radius:8px;
            font-size:13px;
            font-weight:bold;
            letter-spacing:1px;
            border:1px solid ${BIOME_COLORS[world.biome].glow}88;
            box-shadow: 0 0 12px ${BIOME_COLORS[world.biome].glow}44;
            transition: all 0.2s ease;
          "
          onmouseover="this.style.boxShadow='0 0 24px ${BIOME_COLORS[world.biome].glow}88'"
          onmouseout="this.style.boxShadow='0 0 12px ${BIOME_COLORS[world.biome].glow}44'"
        >⚡ Enter Portal</a>
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
      maxZoom: 3,
      zoomControl: false,
      attributionControl: false,
      maxBounds: bounds,
      maxBoundsViscosity: 0.9,
    });

    // Generate and overlay the fantasy SVG map
    const imageUrl = generateFantasyMapSvg();
    L.imageOverlay(imageUrl, bounds).addTo(map);

    // Fit the view to the map bounds with some padding
    map.fitBounds(bounds, { padding: [10, 10] });

    // Custom zoom control in bottom-right
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

  // Keep markers in sync with world data
  const updateMarkers = useCallback(() => {
    const map = leafletMap.current;
    if (!map) return;

    const existingIds = new Set(markersRef.current.keys());
    const newIds = new Set(worlds.map(w => w.id));

    // Remove markers for worlds that no longer exist
    for (const id of existingIds) {
      if (!newIds.has(id)) {
        markersRef.current.get(id)?.remove();
        markersRef.current.delete(id);
      }
    }

    // Add or update markers
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
            maxWidth: 300,
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
        leafletMap.current.panTo([world.coordinates[0], world.coordinates[1]], {
          animate: true,
          duration: 0.8,
        });
        setTimeout(() => marker.openPopup(), 300);
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
