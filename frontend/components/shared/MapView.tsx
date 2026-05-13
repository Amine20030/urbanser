'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { useTheme } from 'next-themes'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { Layers, Maximize2, Flame, RefreshCw, MapPinned } from 'lucide-react'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MapIncident {
  id: number
  title: string
  latitude: number
  longitude: number
  severity: string
  status: string
  category?: { name: string; icon: string }
  authorityNotified?: string
}

function getSeverityColor(severity: string): string {
  switch (severity?.toUpperCase()) {
    case 'HIGH':
    case 'CRITICAL':
      return '#ef4444'
    case 'MEDIUM':
    case 'MED':
      return '#f59e0b'
    case 'LOW':
      return '#22c55e'
    default:
      return '#64748b'
  }
}

function getSeverityLabel(s: string) {
  switch (s?.toUpperCase()) {
    case 'HIGH':
      return 'Élevé'
    case 'CRITICAL':
      return 'Critique'
    case 'MEDIUM':
    case 'MED':
      return 'Moyen'
    case 'LOW':
      return 'Faible'
    default:
      return s
  }
}

function MapClickHandler({ onMapClick }: { onMapClick?: () => void }) {
  const map = useMap()
  useEffect(() => {
    if (!onMapClick) return
    const handler = () => onMapClick()
    map.on('click', handler)
    return () => {
      map.off('click', handler)
    }
  }, [map, onMapClick])
  return null
}

function IncidentMarkers({ incidents }: { incidents: MapIncident[] }) {
  return (
    <>
      {incidents.map((inc) => {
        const color = getSeverityColor(inc.severity)
        return (
          <CircleMarker
            key={inc.id}
            center={[inc.latitude, inc.longitude]}
            radius={11}
            pathOptions={{
              fillColor: color,
              color: 'rgba(255,255,255,0.9)',
              weight: 2,
              fillOpacity: 0.92,
              className:
                inc.severity?.toUpperCase().includes('HIGH') || inc.severity === 'CRITICAL' ? 'marker-high' : '',
            }}
          >
            <Popup className="rounded-xl">
              <div className="max-w-[240px] space-y-1.5 p-1 font-sans text-sm text-t1">
                <div className="font-semibold leading-snug">
                  {inc.category?.icon ? `${inc.category.icon} ` : ''}
                  {inc.title}
                </div>
                <div className="text-xs text-t2">{inc.category?.name}</div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span
                    className="rounded-md px-2 py-0.5 font-semibold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {getSeverityLabel(inc.severity)}
                  </span>
                  <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-t2">
                    {inc.status === 'OPEN'
                      ? 'Ouvert'
                      : inc.status === 'IN_PROGRESS'
                        ? 'En cours'
                        : inc.status === 'RESOLVED'
                          ? 'Résolu'
                          : inc.status}
                  </span>
                </div>
                {inc.authorityNotified && (
                  <div className="text-xs text-primary">✉ {inc.authorityNotified}</div>
                )}
                <div className="font-mono text-[10px] text-t3">
                  #{inc.id} · {inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </>
  )
}

function HeatmapLayer({ incidents, visible }: { incidents: MapIncident[]; visible: boolean }) {
  if (!visible) return null
  return (
    <>
      {incidents.map((inc) => (
        <CircleMarker
          key={`heat-${inc.id}`}
          center={[inc.latitude, inc.longitude]}
          radius={38}
          pathOptions={{
            fillColor: getSeverityColor(inc.severity),
            color: 'transparent',
            weight: 0,
            fillOpacity: 0.12,
          }}
        />
      ))}
    </>
  )
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
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [incidents, setIncidents] = useState<MapIncident[]>([])
  const [loading, setLoading] = useState(true)
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets')
  const [heatmap, setHeatmap] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await api.get('/incidents/map')
      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? []
      const valid = data.filter(
        (inc: MapIncident) =>
          inc.latitude &&
          inc.longitude &&
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
    setMounted(true)
    return () => {
      if (typeof window !== 'undefined') {
        document.querySelectorAll('.leaflet-container').forEach((c) => {
          const el = c as HTMLElement & { _leaflet_id?: number | null }
          if (el._leaflet_id) {
            el._leaflet_id = null
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    fetchIncidents()
    const interval = setInterval(fetchIncidents, 30000)
    window.addEventListener('incident-created', fetchIncidents)
    return () => {
      clearInterval(interval)
      window.removeEventListener('incident-created', fetchIncidents)
    }
  }, [fetchIncidents])

  const isDark = resolvedTheme === 'dark'

  const streetUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const satelliteUrl =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  const labelsUrl =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'

  const fullscreen = () => {
    void wrapRef.current?.requestFullscreen?.()
  }

  if (!mounted) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-xl border border-border bg-card text-sm text-t3"
        style={{ height }}
      >
        Initialisation de la carte…
      </div>
    )
  }

  return (
    <div
      id="urbanops-map-wrap"
      ref={wrapRef}
      className="relative overflow-hidden rounded-xl border border-border shadow-card"
      style={{ height }}
    >
      {loading && (
        <div className="absolute inset-0 z-[800] flex items-center justify-center bg-background/85 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-t2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Chargement des signalements…
          </div>
        </div>
      )}

      <div className="absolute left-3 top-3 z-[900] flex flex-wrap items-center gap-2">
        <div className="glass-panel flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-t1 shadow-sm">
          <MapPinned className="h-3.5 w-3.5 text-primary" />
          {incidents.length} point{incidents.length !== 1 ? 's' : ''}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 gap-1 bg-card/90 text-xs backdrop-blur-md"
          onClick={() => fetchIncidents()}
          title="Actualiser"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Sync
        </Button>
      </div>

      <div className="absolute right-3 top-3 z-[900] flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card/95 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors',
              mapStyle === 'streets' ? 'bg-primary/15 text-primary' : 'text-t2 hover:bg-hover'
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            Plan
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={cn(
              'flex items-center gap-2 border-t border-border px-3 py-2 text-left text-xs font-medium transition-colors',
              mapStyle === 'satellite' ? 'bg-primary/15 text-primary' : 'text-t2 hover:bg-hover'
            )}
          >
            <Layers className="h-3.5 w-3.5 rotate-180" />
            Satellite
          </button>
        </div>
        <Button
          type="button"
          variant={heatmap ? 'default' : 'secondary'}
          size="sm"
          className="h-8 justify-start gap-1 bg-card/95 text-xs backdrop-blur-md"
          onClick={() => setHeatmap((h) => !h)}
          title="Couche densité (heatmap simplifiée)"
        >
          <Flame className="h-3.5 w-3.5" />
          Densité
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 gap-1 bg-card/95 text-xs backdrop-blur-md"
          onClick={fullscreen}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Plein écran
        </Button>
      </div>

      <div className="absolute bottom-8 right-3 z-[900] max-w-[200px] rounded-lg border border-border bg-card/95 p-3 text-[11px] shadow-md backdrop-blur-md">
        <div className="mb-2 font-bold text-t1">Niveau de danger</div>
        {[
          ['#ef4444', 'Élevé / critique'],
          ['#f59e0b', 'Moyen'],
          ['#22c55e', 'Faible'],
        ].map(([c, l]) => (
          <div key={l} className="mb-1 flex items-center gap-2 text-t2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c }} />
            {l}
          </div>
        ))}
        {onMapClick && (
          <Button type="button" size="sm" className="mt-3 w-full text-xs" onClick={onMapClick}>
            + Signaler ici
          </Button>
        )}
      </div>

      <MapContainer
        key="marrakech-map"
        center={[31.6295, -7.9811]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        preferCanvas
      >
        {mapStyle === 'satellite' ? (
          <>
            <TileLayer url={satelliteUrl} attribution="Tiles © Esri" maxZoom={19} />
            <TileLayer url={labelsUrl} attribution="" maxZoom={19} opacity={0.85} />
          </>
        ) : (
          <TileLayer
            url={streetUrl}
            attribution="© OpenStreetMap © CARTO"
            maxZoom={19}
            subdomains="abcd"
          />
        )}
        <MapClickHandler onMapClick={onMapClick} />
        <HeatmapLayer incidents={incidents} visible={heatmap} />
        <MarkerClusterGroup chunkedLoading maxClusterRadius={60} showCoverageOnHover={false} spiderfyOnMaxZoom>
          <IncidentMarkers incidents={incidents} />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
