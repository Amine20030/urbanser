'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import type { MapPoint } from '@/components/map/IncidentsLeafletMap'

const LeafletMap = dynamic(
  () => import('@/components/map/IncidentsLeafletMap').then((m) => m.IncidentsLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7a8899',
        }}
      >
        Chargement de la carte…
      </div>
    ),
  }
)

interface Incident {
  id: number
  referenceCode: string
  title: string
  latitude: number
  longitude: number
  severity: string
  status: string
  categoryName: string
}

export function MapSection() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await api.get('/incidents/map')
        setIncidents(response.data ?? [])
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } }
        setError(ax.response?.data?.message || 'Impossible de charger la carte.')
      } finally {
        setLoading(false)
      }
    }
    fetchIncidents()
  }, [])

  const points: MapPoint[] = useMemo(
    () =>
      incidents.map((i) => ({
        id: i.id,
        lat: i.latitude,
        lng: i.longitude,
        title: i.title,
        subtitle: `${i.referenceCode} · ${i.categoryName}`,
        color: getSeverityColor(i.severity),
      })),
    [incidents]
  )

  return (
    <section
      style={{
        background: '#0b0f14',
        padding: '4rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#e8edf3',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          Carte des incidents
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#7a8899',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Carte interactive (zoom, déplacement, popups) — signalements actifs
        </p>

        <div
          style={{
            background: '#0e1218',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.07)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                color: '#7a8899',
              }}
            >
              Chargement de la carte…
            </div>
          )}

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                color: '#ef4444',
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              <div>
                <p>Erreur de chargement</p>
                <p style={{ fontSize: '12px', marginTop: '0.5rem' }}>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div style={{ position: 'relative' }}>
              <LeafletMap points={points} height="420px" zoom={12} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  pointerEvents: 'none',
                }}
              >
                <LegendItem color="#ef4444" label="Critique" />
                <LegendItem color="#f59e0b" label="Élevé" />
                <LegendItem color="#3b82f6" label="Moyen" />
                <LegendItem color="#10b981" label="Faible" />
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/incidents"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Voir tous les incidents →
          </Link>
        </div>
      </div>
    </section>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '12px',
        color: '#e8edf3',
        background: 'rgba(0,0,0,0.55)',
        padding: '4px 10px',
        borderRadius: 8,
      }}
    >
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
      {label}
    </div>
  )
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return '#ef4444'
    case 'HIGH':
      return '#f59e0b'
    case 'MEDIUM':
      return '#3b82f6'
    case 'LOW':
      return '#10b981'
    default:
      return '#7a8899'
  }
}
