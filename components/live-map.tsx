'use client'

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

// Fix default marker icon missing images issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl

// 🏠 Customer / Home icon using inline SVG
const homeIcon = L.divIcon({
  html: `
    <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center">
      <span style="
        position:absolute;
        width:44px;height:44px;
        background:rgba(128,0,0,0.2);
        border-radius:50%;
        animation:pulse 1.5s infinite;
      "></span>
      <div style="
        width:36px;height:36px;
        background:#800000;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
        position:relative;z-index:1;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
    </div>
  `,
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
})

// 🛵 Agent / Bike icon using inline SVG
const bikeIcon = L.divIcon({
  html: `
    <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center">
      <span style="
        position:absolute;
        width:48px;height:48px;
        background:rgba(59,130,246,0.2);
        border-radius:50%;
        animation:pulse 1.5s infinite;
      "></span>
      <div style="
        width:40px;height:40px;
        background:#1a1c2e;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
        position:relative;z-index:1;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    </div>
  `,
  className: '',
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

// ── Helper: Fix map resize in modals ───────────────────────────────────────
function ResizeMap() {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 300)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

// ── Helper: Auto-fit bounds to route ──────────────────────────────────────
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (!points.length) return
    map.fitBounds(points, { padding: [40, 40] })
  }, [points, map])
  return null
}

// ── Main LiveMap Export ────────────────────────────────────────────────────
export function LiveMap({
  agentLat,
  agentLng,
  customerLat,
  customerLng,
  technicianName,
}: {
  agentLat?: number
  agentLng?: number
  customerLat?: number
  customerLng?: number
  technicianName?: string
}) {
  const [agentPosition, setAgentPosition] = useState<[number, number] | null>(null)
  const [route, setRoute] = useState<[number, number][]>([])

  // Smooth interpolated agent movement
  useEffect(() => {
    if (!agentLat || !agentLng) return
    setAgentPosition((prev) => {
      if (!prev) return [agentLat, agentLng]
      return [
        prev[0] + (agentLat - prev[0]) * 0.2,
        prev[1] + (agentLng - prev[1]) * 0.2,
      ]
    })
  }, [agentLat, agentLng])

  // Fetch road route via OSRM
  useEffect(() => {
    if (!agentLat || !agentLng || !customerLat || !customerLng) return

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${agentLng},${agentLat};${customerLng},${customerLat}?overview=full&geometries=geojson`
        )
        const data = await res.json()
        const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        )
        setRoute(coords)
      } catch (err) {
        console.error('Route fetch error:', err)
      }
    }

    fetchRoute()
  }, [agentLat, agentLng, customerLat, customerLng])

  if (!customerLat || !customerLng) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-3xl">
        <p className="text-slate-400 font-bold text-sm">Customer location unavailable</p>
      </div>
    )
  }

  const center: [number, number] = agentPosition || [customerLat, customerLng]

  return (
    <>
      {/* Leaflet pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <ResizeMap />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* 🏠 Customer marker */}
        <Marker position={[customerLat, customerLng]} icon={homeIcon} />

        {/* 🛵 Agent marker */}
        {agentPosition && (
          <Marker position={agentPosition} icon={bikeIcon} />
        )}

        {/* 🛣️ Road route line */}
        {route.length > 0 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{ color: '#800000', weight: 5, opacity: 0.8, dashArray: undefined }}
            />
            <FitBounds points={route} />
          </>
        )}
      </MapContainer>
    </>
  )
}
