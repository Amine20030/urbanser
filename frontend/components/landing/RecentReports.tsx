'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/shared/StatusBadge'

type NamedRef = string | { name?: string }

interface Incident {
  id: number
  referenceCode?: string
  title: string
  description?: string
  severity: string
  status: string
  category?: NamedRef
  sector?: NamedRef
  createdAt?: string
}

function refLabel(ref: NamedRef | undefined | null): string {
  if (ref == null) return '—'
  return typeof ref === 'string' ? ref : (ref.name ?? '—')
}

function normalizeStatus(s: string) {
  const u = (s || '').toUpperCase()
  if (u === 'IN_PROGRESS') return 'IN_PROGRESS' as const
  if (u === 'RESOLVED') return 'RESOLVED' as const
  return 'OPEN' as const
}

function SeverityBadge({ severity }: Readonly<{ severity: string }>) {
  const u = (severity || '').toUpperCase()
  const config =
    (
      {
        HIGH: { bg: '#fef2f2', color: '#dc2626', text: '⛔ ÉLEVÉ' },
        CRITICAL: { bg: '#fef2f2', color: '#dc2626', text: '⛔ CRITIQUE' },
        MEDIUM: { bg: '#fffbeb', color: '#d97706', text: '⚠️ MOYEN' },
        MED: { bg: '#fffbeb', color: '#d97706', text: '⚠️ MOYEN' },
        LOW: { bg: '#f0fdf4', color: '#16a34a', text: '✅ FAIBLE' },
      } as Record<string, { bg: string; color: string; text: string }>
    )[u] ?? { bg: '#f1f5f9', color: '#64748b', text: severity }
  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {config.text}
    </span>
  )
}

export function RecentReports() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await api.get('/incidents?page=0&size=5&sort=createdAt,desc')
        const raw = response.data
        const list = Array.isArray(raw) ? raw : raw?.content ?? []
        setIncidents(list)
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } }; message?: string }
        setError(ax.response?.data?.message || ax.message || 'Échec du chargement des incidents.')
      } finally {
        setLoading(false)
      }
    }
    fetchIncidents()
  }, [])

  const list = Array.isArray(incidents) ? incidents : []

  return (
    <section className="border-t border-border bg-bg-base/80 px-4 py-16 backdrop-blur-sm dark:bg-[#05080c]/90 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-t1 sm:text-3xl">Derniers signalements</h2>
          <p className="mt-2 text-sm text-t2 sm:text-base">Les incidents récemment signalés par les citoyens.</p>
        </div>

        {loading && (
          <div className="space-y-3">
            {(['r1', 'r2', 'r3'] as const).map((slot) => (
              <Skeleton key={`report-skeleton-${slot}`} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-center text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <Card className="border-dashed border-border/80 p-10 text-center">
            <p className="text-t2">Aucun incident signalé pour le moment.</p>
            <Button asChild className="mt-4">
              <Link href="/incidents/new">Soyez le premier à signaler</Link>
            </Button>
          </Card>
        )}

        {!loading && !error && list.length > 0 && (
          <div className="space-y-3">
            {list.map((incident, i) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <IncidentRow incident={incident} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button variant="secondary" asChild>
            <Link href="/incidents">Voir tous les signalements</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function IncidentRow({ incident }: Readonly<{ incident: Incident }>) {
  const u = (incident.severity || '').toUpperCase()
  let borderLeftColor = '#22c55e'
  if (u === 'HIGH' || u === 'CRITICAL') borderLeftColor = '#ef4444'
  else if (u === 'MEDIUM' || u === 'MED') borderLeftColor = '#f59e0b'

  const href =
    incident.referenceCode != null && String(incident.referenceCode).length > 0
      ? `/incidents/${encodeURIComponent(incident.referenceCode)}`
      : `/incidents/${incident.id}`

  return (
    <Link
      href={href}
      className="block rounded-[10px] border border-[#e2e8f0] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)] dark:border-slate-700 dark:bg-card"
      style={{ borderLeft: `4px solid ${borderLeftColor}`, padding: '14px 16px' }}
    >
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-t1 sm:text-base">{incident.title}</h3>
        <span className="shrink-0 font-mono text-[11px] text-t3">
          {incident.referenceCode ?? `#${incident.id}`}
        </span>
      </div>
      {incident.description ? (
        <p className="line-clamp-2 text-xs leading-relaxed text-t2 sm:text-sm">{incident.description}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{refLabel(incident.category)}</Badge>
        <Badge variant="secondary">{refLabel(incident.sector)}</Badge>
        <SeverityBadge severity={incident.severity} />
        <StatusBadge status={normalizeStatus(incident.status)} size="sm" />
        <span className="ml-auto text-[11px] text-t3">{formatDate(incident.createdAt)}</span>
      </div>
    </Link>
  )
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
