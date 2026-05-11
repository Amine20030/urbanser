'use client'

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

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '12px' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
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
