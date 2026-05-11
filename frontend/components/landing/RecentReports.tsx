'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

/** API returns nested DTOs; keep union for resilience */
type NamedRef = string | { name?: string }

interface Incident {
  id: number
  referenceCode: string
  title: string
  description: string
  severity: string
  status: string
  category: NamedRef
  sector: NamedRef
  createdAt: string
}

function refLabel(ref: NamedRef | undefined | null): string {
  if (ref == null) return '—'
  return typeof ref === 'string' ? ref : (ref.name ?? '—')
}

export function RecentReports() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('[RecentReports] API URL:', process.env.NEXT_PUBLIC_API_URL)
    
    const fetchIncidents = async () => {
      try {
        console.log('[RecentReports] Fetching incidents...')
        const response = await api.get('/incidents?page=0&size=5&sort=createdAt,desc')
        console.log('[RecentReports] Incidents received:', response.data)
        setIncidents(response.data.content || [])
      } catch (err: any) {
        console.error('[RecentReports] Fetch error:', err)
        setError(err.response?.data?.message || err.message || 'Failed to fetch incidents')
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  return (
    <section style={{
      background: '#0e1218',
      padding: '4rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#e8edf3',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Derniers signalements
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#7a8899',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Les incidents récemment signalés par les citoyens
        </p>

        {loading && (
          <div style={{
            textAlign: 'center',
            color: '#7a8899',
            padding: '3rem'
          }}>
            Chargement des signalements...
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            color: '#ef4444',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            ⚠️ Erreur: {error}
          </div>
        )}

        {!loading && !error && incidents.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#7a8899',
            padding: '3rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <p>Aucun incident signalé pour le moment</p>
            <Link href="/incidents/new" style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              Soyez le premier à signaler →
            </Link>
          </div>
        )}

        {!loading && !error && incidents.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}

        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <Link href="/incidents" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.05)',
            color: '#e8edf3',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            Voir tous les signalements
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <div style={{
      background: '#0b0f14',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start'
    }}>
      {/* Severity Indicator */}
      <div style={{
        width: '4px',
        minWidth: '4px',
        height: '50px',
        borderRadius: '2px',
        background: getSeverityColor(incident.severity)
      }} />

      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#e8edf3',
            margin: 0
          }}>
            {incident.title}
          </h3>
          <span style={{
            fontSize: '11px',
            color: '#7a8899',
            fontFamily: 'monospace'
          }}>
            {incident.referenceCode}
          </span>
        </div>

        <p style={{
          fontSize: '13px',
          color: '#7a8899',
          margin: '0 0 0.75rem',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {incident.description}
        </p>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Badge text={refLabel(incident.category)} color="#3b82f6" />
          <Badge text={refLabel(incident.sector)} color="#7a8899" />
          <StatusBadge status={incident.status} />
          <span style={{
            fontSize: '11px',
            color: '#7a8899',
            marginLeft: 'auto'
          }}>
            {formatDate(incident.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      fontSize: '11px',
      color: color,
      background: `${color}15`,
      padding: '3px 8px',
      borderRadius: '4px',
      fontWeight: 500
    }}>
      {text}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'OPEN': '#f59e0b',
    'IN_PROGRESS': '#8b5cf6',
    'RESOLVED': '#10b981'
  }
  const labels: Record<string, string> = {
    'OPEN': 'Ouvert',
    'IN_PROGRESS': 'En cours',
    'RESOLVED': 'Résolu'
  }

  return (
    <span style={{
      fontSize: '11px',
      color: colors[status] || '#7a8899',
      background: `${colors[status] || '#7a8899'}15`,
      padding: '3px 8px',
      borderRadius: '4px',
      fontWeight: 500
    }}>
      {labels[status] || status}
    </span>
  )
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return '#ef4444'
    case 'HIGH': return '#f59e0b'
    case 'MEDIUM': return '#3b82f6'
    case 'LOW': return '#10b981'
    default: return '#7a8899'
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
