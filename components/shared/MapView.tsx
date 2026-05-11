'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapIncident, Severity } from '@/lib/types'
import { getSeverityColor } from '@/lib/utils'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)

interface MapViewProps {
  incidents: MapIncident[]
  center?: [number, number]
  zoom?: number
  height?: string
  onMarkerClick?: (incident: MapIncident) => void
  onMapClick?: (lat: number, lng: number) => void
  className?: string
}

export function MapView({
  incidents,
  center = [31.6295, -7.9811],
  zoom = 13,
  height = '520px',
  onMarkerClick,
  onMapClick,
  className = '',
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null)

  useEffect(() => {
    setIsMounted(true)
    import('leaflet').then((L) => {
      setLeaflet(L)
    })
  }, [])

  useEffect(() => {
    if (leaflet) {
      // Fix Leaflet default icon issue in Next.js
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    }
  }, [leaflet])

  const getMarkerRadius = (severity: Severity) => {
    switch (severity) {
      case 'HIGH':
        return 12
      case 'MED':
        return 10
      case 'LOW':
        return 8
      default:
        return 10
    }
  }

  const getMarkerClass = (severity: Severity) => {
    if (severity === 'HIGH') {
      return 'animate-pulse-glow'
    }
    return ''
  }

  if (!isMounted || !leaflet) {
    return (
      <div
        className={`bg-[var(--bg-card)] rounded-[10px] border border-[var(--border)] flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-[var(--t2)] text-sm">Chargement de la carte...</div>
      </div>
    )
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%', borderRadius: '10px' }}
        className={`rounded-[10px] overflow-hidden ${className}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {incidents.map((incident) => (
          <CircleMarker
            key={incident.id}
            center={[incident.latitude, incident.longitude]}
            radius={getMarkerRadius(incident.severity)}
            pathOptions={{
              fillColor: getSeverityColor(incident.severity),
              fillOpacity: 0.8,
              color: getSeverityColor(incident.severity),
              weight: 2,
              className: getMarkerClass(incident.severity),
            }}
            eventHandlers={{
              click: () => onMarkerClick?.(incident),
            }}
          >
            <Popup className="dark-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm text-[var(--t1)] mb-1">
                  {incident.title}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--t3)]">Statut:</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                    style={{
                      backgroundColor:
                        incident.status === 'OPEN'
                          ? 'rgba(239, 68, 68, 0.1)'
                          : incident.status === 'IN_PROGRESS'
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(34, 197, 94, 0.1)',
                      color:
                        incident.status === 'OPEN'
                          ? '#ef4444'
                          : incident.status === 'IN_PROGRESS'
                          ? '#f59e0b'
                          : '#22c55e',
                    }}
                  >
                    {incident.status === 'OPEN'
                      ? 'Ouvert'
                      : incident.status === 'IN_PROGRESS'
                      ? 'En cours'
                      : 'Résolu'}
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </>
  )
}
