'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import api from '@/lib/api'

interface MapIncident {
  id: number; title: string
  latitude: number; longitude: number
  severity: string; status: string
  category?: { name: string; icon: string }
  authorityNotified?: string
}

function getSeverityColor(severity: string): string {
  switch(severity?.toUpperCase()) {
    case 'HIGH':   return '#ef4444'
    case 'CRITICAL': return '#ef4444'
    case 'MEDIUM': return '#f59e0b'
    case 'LOW':    return '#22c55e'
    default:       return '#6b7280'
  }
}

function getSeverityLabel(s: string) {
  switch(s?.toUpperCase()) {
    case 'HIGH':   return '🔴 ÉLEVÉ'
    case 'CRITICAL': return '🔴 CRITIQUE'
    case 'MEDIUM': return '🟡 MOYEN'
    case 'LOW':    return '🟢 FAIBLE'
    default:       return s
  }
}

// Component to handle map click to report
function MapClickHandler({ onMapClick }: { onMapClick?: () => void }) {
  const map = useMap()
  useEffect(() => {
    if (!onMapClick) return
    const handler = () => onMapClick()
    map.on('click', handler)
    return () => { map.off('click', handler) }
  }, [map, onMapClick])
  return null
}

export default function MapView({
  height = '480px',
  onMapClick,
  showAllStatuses = true,
}: {
  height?: string
  onMapClick?: () => void
  showAllStatuses?: boolean
}) {
  const [incidents, setIncidents] = useState<MapIncident[]>([])
  const [loading, setLoading] = useState(true)

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await api.get('/incidents/map')
      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? []
      // Validate coordinates before adding to map
      const valid = data.filter((inc: MapIncident) =>
        inc.latitude && inc.longitude &&
        Math.abs(inc.latitude) <= 90 &&
        Math.abs(inc.longitude) <= 180 &&
        (showAllStatuses || inc.status !== 'RESOLVED')
      )
      setIncidents(valid)
    } catch (err) {
      console.error('Map fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [showAllStatuses])

  useEffect(() => {
    fetchIncidents()
    // Auto-refresh every 30 seconds so new incidents appear without reload
    const interval = setInterval(fetchIncidents, 30000)
    window.addEventListener('incident-created', fetchIncidents)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('incident-created', fetchIncidents)
    }
  }, [fetchIncidents])

  // Memoize markers to prevent unnecessary re-renders (performance)
  const markers = useMemo(() => incidents.map(inc => (
    <CircleMarker
      key={inc.id}
      center={[inc.latitude, inc.longitude]}  // ← MUST be [lat, lng]
      radius={10}
      pathOptions={{
        fillColor: getSeverityColor(inc.severity),
        color: 'white',
        weight: 2,
        fillOpacity: 0.9,
      }}
    >
      <Popup>
        <div style={{ minWidth: 200, fontFamily: 'sans-serif' }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
            {inc.category?.icon || '📍'} {inc.title}
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
            {inc.category?.name}
          </div>
          <div style={{ fontSize: 11, marginBottom: 4 }}>
            <b>Danger :</b> {getSeverityLabel(inc.severity)}
          </div>
          <div style={{ fontSize: 11, marginBottom: 4 }}>
            <b>Statut :</b> {inc.status === 'OPEN' ? '🔴 Ouvert'
              : inc.status === 'IN_PROGRESS' ? '🟡 En cours'
              : '✅ Résolu'}
          </div>
          {inc.authorityNotified && (
            <div style={{ fontSize: 11, color: '#1d4ed8' }}>
              ✉ {inc.authorityNotified}
            </div>
          )}
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            #{inc.id} · {inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  )), [incidents])

  return (
    <div style={{ position: 'relative', height, borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: '#f8fafc', zIndex: 999
        }}>
          <span style={{ color: '#64748b', fontSize: 14 }}>Chargement de la carte...</span>
        </div>
      )}

      {/* Incident count badge */}
      <div style={{
        position: 'absolute', top: 12, left: 50, zIndex: 999,
        background: 'white', borderRadius: 8, padding: '6px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: 12,
        fontWeight: 600, color: '#1e293b', display: 'flex', gap: 8, alignItems: 'center'
      }}>
        📍 {incidents.length} signalement{incidents.length !== 1 ? 's' : ''}
        <button
          onClick={fetchIncidents}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0 }}
          title="Actualiser"
        >🔄</button>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 30, right: 10, zIndex: 999,
        background: 'white', borderRadius: 8, padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: 11
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>Niveau de danger</div>
        {[['#ef4444','Élevé'],['#f59e0b','Moyen'],['#22c55e','Faible']].map(([c,l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            <span style={{ color: '#475569' }}>{l}</span>
          </div>
        ))}
        {onMapClick && (
          <button
            onClick={onMapClick}
            style={{
              marginTop: 8, width: '100%', padding: '4px 8px',
              background: '#1d4ed8', color: 'white', border: 'none',
              borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600
            }}
          >+ Signaler ici</button>
        )}
      </div>

      <MapContainer
        center={[31.6295, -7.9811]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        preferCanvas={true}  // ← USE CANVAS renderer for better performance
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM &copy; CARTO'
          maxZoom={19}
          subdomains="abcd"
        />
        <MapClickHandler onMapClick={onMapClick} />
        {markers}
      </MapContainer>
    </div>
  )
}
