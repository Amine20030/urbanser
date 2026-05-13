'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

export type MapPoint = {
  id: number | string
  lat: number
  lng: number
  title: string
  subtitle?: string
  color: string
}

function isValidCoord(lat: number, lng: number) {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
}

export function IncidentsLeafletMap({
  points,
  height = '400px',
  center = [31.6295, -7.9811] as [number, number],
  zoom = 12,
}: {
  points: MapPoint[]
  height?: string
  center?: [number, number]
  zoom?: number
}) {
  const valid = points.filter((p) => isValidCoord(p.lat, p.lng))
  
  // To prevent Next SSR hydration mismatch with theme
  const [mounted, setMounted] = React.useState(false)
  const { theme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ height, width: '100%', borderRadius: '12px', background: 'var(--bg-card)' }} />
  }

  const isLight = theme === 'light'
  const tileUrl = isLight 
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  
  const attribution = isLight
    ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    : '&copy; OpenStreetMap &copy; CARTO'

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '12px' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution={attribution}
        url={tileUrl}
      />
      {isLight && (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />
      )}
      {valid.map((p) => (
        <CircleMarker
          key={String(p.id)}
          center={[p.lat, p.lng]}
          radius={9}
          pathOptions={{
            color: p.color,
            fillColor: p.color,
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm max-w-[220px]">
              <div className="font-semibold">{p.title}</div>
              {p.subtitle ? <div className="text-gray-600 mt-1">{p.subtitle}</div> : null}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
