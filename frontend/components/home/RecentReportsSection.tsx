'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Inbox, MapPin } from 'lucide-react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'

function relativeTime(d: string) {
  if (!d) return ''
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return "a l'instant"
  if (m < 60) return `il y a ${m}min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  return `il y a ${Math.floor(h / 24)}j`
}

const sev = (s: string) => {
  const value = (s || '').toUpperCase()
  if (value === 'HIGH' || value === 'CRITICAL') return 'var(--urb-danger)'
  if (value === 'MEDIUM') return 'var(--urb-gold)'
  return 'var(--urb-success)'
}

export function RecentReportsSection() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get('/incidents/recent')
      .then((r) => {
        const d = r.data
        setIncidents(Array.isArray(d) ? d : d?.content ?? [])
      })
      .catch(() => setError('Impossible de charger les derniers signalements.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-white py-12">
      <div className="page-shell">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-t1">Signalements recents</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-t2">
              Les derniers problemes remontes par les citoyens et pris en charge par les services.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/incidents">
              Tout consulter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : incidents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-10 text-center">
            <Inbox className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 text-sm font-semibold text-t1">Aucun signalement recent</p>
            <p className="mt-1 text-sm text-t2">Les nouvelles declarations apparaitront ici.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {incidents.slice(0, 6).map((inc) => (
              <Link
                key={inc.id}
                href={`/incidents/${encodeURIComponent(inc.referenceCode || inc.id)}`}
                className="group rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow"
                style={{ borderLeft: `4px solid ${sev(inc.severity)}` }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="min-w-0 truncate text-xs font-semibold text-t3">
                    {inc.category?.icon ? `${inc.category.icon} ` : ''}
                    {inc.category?.name ?? 'Categorie'}
                  </span>
                  <span className="shrink-0 text-xs text-t3">{relativeTime(inc.createdAt)}</span>
                </div>
                <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-snug text-t1 group-hover:text-primary">
                  {inc.title}
                </h3>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-t2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate">{inc.sector?.name ?? 'Marrakech'}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="font-mono text-[11px] font-bold text-primary">{inc.referenceCode}</span>
                  <StatusBadge status={inc.status} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
