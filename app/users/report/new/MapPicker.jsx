"use client";

/**
 * MapPicker.jsx — Leaflet map untuk Next.js (no SSR via dynamic import)
 *
 * Props:
 *   lat, lng   : koordinat awal (null = belum ada pin)
 *   onSelect   : callback(lat, lng) — dipanggil setiap pin berubah
 *                Kirim () => {} untuk mode read-only
 *
 * Install:
 *   npm install leaflet react-leaflet
 */

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// ── Inject Leaflet CSS langsung (fix tile rendering di Next.js) ──────────────
function useLeafletCSS() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = "leaflet-css-inject";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);
  }, []);
}

// ── Fix icon default Leaflet hilang di webpack ───────────────────────────────
function fixLeafletIcon() {
  if (typeof window === "undefined") return;
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// ── Custom pin icon ──────────────────────────────────────────────────────────
function createPinIcon(color = "#004b8d") {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:32px;height:42px">
        <div style="
          width:32px;height:32px;
          background:${color};
          border:3px solid #fff;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 14px rgba(0,0,0,0.35);
          position:absolute;top:0;left:0;
        "></div>
        <div style="
          width:8px;height:8px;
          background:#fff;
          border-radius:50%;
          position:absolute;
          top:9px;left:9px;
          transform:rotate(-45deg) translate(2px,-2px);
        "></div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
}

// ── Sub: klik peta → pasang/pindah pin ──────────────────────────────────────
function LocationPicker({ position, setPosition, onSelect, readOnly }) {
  useMapEvents({
    click(e) {
      if (readOnly) return;
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={createPinIcon()}
      draggable={!readOnly}
      eventHandlers={
        readOnly
          ? {}
          : {
              dragend(e) {
                const { lat, lng } = e.target.getLatLng();
                setPosition([lat, lng]);
                onSelect(lat, lng);
              },
            }
      }
    />
  );
}

// ── Sub: animasi fly ke koordinat baru ──────────────────────────────────────
function MapFlyTo({ position }) {
  const map = useMap();
  const prev = useRef(null);

  useEffect(() => {
    if (!position) return;
    const key = position.join(",");
    if (key === prev.current) return;
    prev.current = key;
    map.flyTo(position, 16, { duration: 1.0 });
  }, [position, map]);

  return null;
}

// ── Sub: invalidate size setelah mount (fix tile terpotong) ──────────────────
function MapInvalidate() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function MapPicker({ lat, lng, onSelect }) {
  useLeafletCSS();

  const readOnly = typeof onSelect !== "function" || onSelect.toString() === "() => {}";

  const [iconsReady, setIconsReady] = useState(false);

  const parsedLat = lat ? parseFloat(lat) : null;
  const parsedLng = lng ? parseFloat(lng) : null;
  const hasCoords = parsedLat !== null && parsedLng !== null;

  const [position, setPosition] = useState(
    hasCoords ? [parsedLat, parsedLng] : null
  );

  // Sinkron kalau prop berubah dari luar (GPS / parent)
  useEffect(() => {
    if (parsedLat && parsedLng) {
      setPosition([parsedLat, parsedLng]);
    }
  }, [parsedLat, parsedLng]);

  // Fix icon + set ready
  useEffect(() => {
    fixLeafletIcon();
    setIconsReady(true);
  }, []);

  const defaultCenter = position || [-6.2088, 106.8456];
  const defaultZoom = position ? 15 : 12;

  if (!iconsReady) return null;

  return (
    <>
      {/* Inline style untuk memastikan tile container benar */}
      <style>{`
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          background: #e8f0f7;
          font-family: inherit;
        }
        .leaflet-tile-pane {
          opacity: 1 !important;
        }
        .leaflet-control-attribution {
          font-size: 10px;
          background: rgba(255,255,255,0.8);
        }
        .leaflet-control-zoom a {
          color: #004b8d !important;
          font-weight: 700;
        }
      `}</style>

      <MapContainer
        key={`map-${defaultCenter[0]}-${defaultCenter[1]}`}
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ width: "100%", height: "100%", minHeight: "340px" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          tileSize={256}
          zoomOffset={0}
        />

        <MapInvalidate />
        <MapFlyTo position={position} />

        <LocationPicker
          position={position}
          setPosition={setPosition}
          onSelect={onSelect || (() => {})}
          readOnly={readOnly}
        />
      </MapContainer>
    </>
  );
}