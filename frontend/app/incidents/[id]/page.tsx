'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { incidentAPI } from '@/lib/api'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Severity } from '@/lib/mockData'

function labelRef(x: unknown): string {
  if (x == null) return '—'
  if (typeof x === 'string') return x
  if (typeof x === 'object' && x !== null && 'name' in x) return String((x as { name: string }).name)
  return '—'
}

function normalizeStatus(s: string) {
  return s.toLowerCase() as 'open' | 'in_progress' | 'resolved'
}

function isNumericId(value: string) {
  return /^\d+$/.test(value)
}

function severityForBadge(s: string): Severity {
  const u = (s || 'MEDIUM').toUpperCase()
  if (u === 'CRITICAL' || u === 'HIGH' || u === 'LOW' || u === 'MED' || u === 'MEDIUM') {
    return u as Severity
  }
  return 'MEDIUM'
}

export default function IncidentDetailPage() {
  const params = useParams()
  const raw = decodeURIComponent(String(params.id ?? ''))
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!raw) {
      setLoading(false)
      setError('Identifiant manquant')
      return
    }
    const load = async () => {
      try {
        const res = isNumericId(raw)
          ? await incidentAPI.getById(Number(raw))
          : await incidentAPI.getByReference(raw)
        setData(res.data as Record<string, unknown>)
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } }
        setError(ax.response?.data?.message || 'Incident introuvable.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [raw])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link
          href="/incidents"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-t2 transition-colors hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux incidents
        </Link>

        {loading && <p className="text-t3">Chargement…</p>}
        {error && (
          <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-card backdrop-blur-md sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-sm font-semibold text-primary">
                {String(data.referenceCode ?? '')}
              </span>
              <div className="flex flex-wrap gap-2">
                <SeverityBadge severity={severityForBadge(String(data.severity ?? ''))} size="sm" />
                <StatusBadge status={normalizeStatus(String(data.status ?? ''))} size="sm" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-t1">{String(data.title ?? '')}</h1>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-t2">{String(data.description ?? '')}</p>
            <dl className="grid grid-cols-1 gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm sm:grid-cols-2 sm:p-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Catégorie</dt>
                <dd className="mt-1 font-medium text-t1">{labelRef(data.category)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Secteur</dt>
                <dd className="mt-1 font-medium text-t1">{labelRef(data.sector)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Latitude</dt>
                <dd className="mt-1 font-mono text-t1">{String(data.latitude ?? '')}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Longitude</dt>
                <dd className="mt-1 font-mono text-t1">{String(data.longitude ?? '')}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Créé le</dt>
                <dd className="mt-1 text-t1">{String(data.createdAt ?? '')}</dd>
              </div>
            </dl>
          </motion.article>
        )}
      </main>
      <Footer />
    </div>
  )
}
