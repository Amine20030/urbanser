'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getSeverityColor } from '@/lib/utils'
import api from '@/lib/api'
import type { MapPoint } from '@/components/map/IncidentsLeafletMap'

const LeafletMap = dynamic(
  () => import('@/components/map/IncidentsLeafletMap').then((m) => m.IncidentsLeafletMap),
  { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center text-[var(--t3)]">Chargement…</div> }
)

type MapIncident = {
  id: number
  referenceCode: string
  title: string
  latitude: number
  longitude: number
  severity: string
  status: string
  categoryName: string
}

function normalizeStatus(s: string) {
  return s.toLowerCase() as 'open' | 'in_progress' | 'resolved'
}

export default function CartePage() {
  const [incidents, setIncidents] = useState<MapIncident[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    api
      .get<MapIncident[]>('/incidents/map')
      .then((res) => setIncidents(res.data ?? []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return incidents
    return incidents.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.categoryName.toLowerCase().includes(q) ||
        i.referenceCode.toLowerCase().includes(q)
    )
  }, [incidents, searchQuery])

  const points: MapPoint[] = useMemo(
    () =>
      filtered.map((i) => ({
        id: i.id,
        lat: i.latitude,
        lng: i.longitude,
        title: i.title,
        subtitle: `${i.referenceCode} · ${i.categoryName}`,
        color: getSeverityColor(i.severity),
      })),
    [filtered]
  )

  const categoryStats = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const i of incidents) {
      acc[i.categoryName] = (acc[i.categoryName] || 0) + 1
    }
    return Object.entries(acc)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [incidents])

  const maxCat = categoryStats[0]?.count || 1

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar />

      <main className="ml-[220px] h-screen flex">
        <div className="flex-1 relative min-h-0 h-[100vh]">
          <div className="absolute top-4 left-4 z-[500] w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer par titre, catégorie, référence…"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50 shadow-lg"
              />
            </div>
          </div>

          <div className="absolute inset-0 w-full min-h-[400px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-[var(--t3)]">Chargement de la carte…</div>
            ) : (
              <LeafletMap points={points} height="100%" zoom={12} />
            )}
          </div>
        </div>

        <aside className="w-[300px] bg-[var(--bg-sidebar)] border-l border-[var(--border)] p-4 space-y-4 overflow-y-auto shrink-0">
          <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
            <h3 className="text-[13px] font-medium text-[var(--t1)] mb-4">Incidents par catégorie</h3>
            <div className="space-y-3">
              {categoryStats.map((row) => (
                <div key={row.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--t2)]">{row.name}</span>
                      <span className="text-xs font-mono text-[var(--t1)]">{row.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-hover)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(row.count / maxCat) * 100}%`,
                          backgroundColor: getSeverityColor('MED'),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
            <h3 className="text-[13px] font-medium text-[var(--t1)] mb-4">Liste ({filtered.length})</h3>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {filtered.map((incident) => (
                <Link
                  key={incident.id}
                  href={`/incidents/${encodeURIComponent(incident.referenceCode)}`}
                  className="block p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-cyan-400">{incident.referenceCode}</span>
                    <StatusBadge status={normalizeStatus(incident.status)} size="sm" />
                  </div>
                  <h4 className="text-xs text-[var(--t1)] mb-1 line-clamp-2">{incident.title}</h4>
                  <p className="text-[10px] text-[var(--t3)]">{incident.categoryName}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
