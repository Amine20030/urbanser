'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
        const res = /^INC-/i.test(raw)
          ? await incidentAPI.getByReference(raw)
          : await incidentAPI.getById(Number(raw))
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
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link
          href="/incidents"
          className="inline-flex items-center gap-2 text-sm text-[var(--t2)] hover:text-[var(--t1)] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux incidents
        </Link>

        {loading && <p className="text-[var(--t3)]">Chargement…</p>}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
        )}

        {!loading && !error && data && (
          <article className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <span className="text-sm font-mono text-cyan-400">{String(data.referenceCode ?? '')}</span>
              <div className="flex gap-2">
                <SeverityBadge severity={severityForBadge(String(data.severity ?? ''))} size="sm" />
                <StatusBadge status={normalizeStatus(String(data.status ?? ''))} size="sm" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-[var(--t1)]">{String(data.title ?? '')}</h1>
            <p className="text-sm text-[var(--t2)] whitespace-pre-wrap">{String(data.description ?? '')}</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[var(--t3)] text-xs uppercase tracking-wide">Catégorie</dt>
                <dd className="text-[var(--t1)]">{labelRef(data.category)}</dd>
              </div>
              <div>
                <dt className="text-[var(--t3)] text-xs uppercase tracking-wide">Secteur</dt>
                <dd className="text-[var(--t1)]">{labelRef(data.sector)}</dd>
              </div>
              <div>
                <dt className="text-[var(--t3)] text-xs uppercase tracking-wide">Latitude</dt>
                <dd className="text-[var(--t1)] font-mono">{String(data.latitude ?? '')}</dd>
              </div>
              <div>
                <dt className="text-[var(--t3)] text-xs uppercase tracking-wide">Longitude</dt>
                <dd className="text-[var(--t1)] font-mono">{String(data.longitude ?? '')}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--t3)] text-xs uppercase tracking-wide">Créé le</dt>
                <dd className="text-[var(--t1)]">{String(data.createdAt ?? '')}</dd>
              </div>
            </dl>
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}
