'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Camera, LayoutGrid, List, MapPin } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

function relativeTime(dateStr: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "a l'instant"
  if (mins < 60) return `il y a ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}

const sev = (s: string) => {
  const value = (s || '').toUpperCase()
  if (value === 'HIGH' || value === 'CRITICAL') return 'var(--urb-danger)'
  if (value === 'MEDIUM') return 'var(--urb-gold)'
  return 'var(--urb-success)'
}

const filters = [
  ['Tous', 'Tous'],
  ['OPEN', 'Ouverts'],
  ['IN_PROGRESS', 'En cours'],
  ['RESOLVED', 'Resolus'],
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [activeFilter, setFilter] = useState('Tous')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8080/api/v1/incidents?page=0&size=100&sortBy=createdAt&sortDir=desc')
        if (res.ok) {
          const body = await res.json()
          setIncidents(body.content || body)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchRealData()
  }, [])

  const filtered = incidents.filter((i) => (activeFilter === 'Tous' ? true : i.status === activeFilter))

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="page-shell py-8 sm:py-10">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Signalements publics</p>
            <h1 className="text-3xl font-black tracking-tight text-t1">Explorateur d'incidents</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-t2">
              Consultez les problemes signales par les citoyens a Marrakech et leur etat de traitement.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="shrink-0">
            <Camera className="h-4 w-4" />
            Signaler
          </Button>
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {filters.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                  activeFilter === value
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-bg-base text-t2 hover:border-primary/30 hover:text-t1'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="sm:ml-auto"
            onClick={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            {viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(['a', 'b', 'c', 'd', 'e', 'f'] as const).map((slot) => (
              <Skeleton key={`incident-grid-skeleton-${slot}`} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-t3">
            Aucun incident trouve pour ce filtre.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((inc) => (
              <IncidentCard key={inc.id} incident={inc} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
            {filtered.map((inc, i) => (
              <IncidentListRow key={inc.id} incident={inc} last={i === filtered.length - 1} />
            ))}
          </div>
        )}
      </main>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function IncidentCard({ incident }: { incident: any }) {
  return (
    <Link
      href={`/incidents/${encodeURIComponent(incident.referenceCode || incident.id)}`}
      className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow"
    >
      <div className="h-1" style={{ background: sev(incident.severity) }} />
      <div className="p-5">
        <div className="mb-3 flex justify-between gap-3">
          <span className="min-w-0 truncate text-xs font-semibold text-t3">
            {incident.category?.icon ? `${incident.category.icon} ` : ''}
            {incident.category?.name ?? 'Categorie'}
          </span>
          <span className="shrink-0 text-xs text-t3">{relativeTime(incident.createdAt)}</span>
        </div>
        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-snug text-t1 group-hover:text-primary">
          {incident.title}
        </h3>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-t2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="truncate">{incident.sector?.name ?? 'Marrakech'}</span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="font-mono text-[11px] font-bold text-primary">{incident.referenceCode}</span>
          <StatusBadge status={incident.status} size="sm" />
        </div>
      </div>
    </Link>
  )
}

function IncidentListRow({ incident, last }: { incident: any; last: boolean }) {
  return (
    <Link
      href={`/incidents/${encodeURIComponent(incident.referenceCode || incident.id)}`}
      className={cn('flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center', !last && 'border-b border-border')}
    >
      <div className="h-10 w-1 rounded-full sm:shrink-0" style={{ background: sev(incident.severity) }} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-t1">{incident.title}</div>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-t3">
          <span className="font-mono font-bold text-primary">{incident.referenceCode}</span>
          <span>{incident.category?.name ?? 'Categorie'}</span>
          <span>{incident.sector?.name ?? 'Marrakech'}</span>
        </div>
      </div>
      <span className="text-xs text-t3">{relativeTime(incident.createdAt)}</span>
      <StatusBadge status={incident.status} size="sm" />
    </Link>
  )
}
