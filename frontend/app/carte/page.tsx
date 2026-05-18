'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getSeverityColor } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'

const MapView = dynamic(() => import('@/components/shared/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-xl border border-border bg-card text-sm text-t3">
      Chargement de la carte de Marrakech…
    </div>
  ),
})

type MapIncident = {
  id: number
  referenceCode?: string
  title: string
  latitude: number
  longitude: number
  severity: string
  status: string
  categoryName?: string
  category?: string | { name?: string; icon?: string }
}

function normalizeStatus(s: string) {
  return s.toLowerCase() as 'open' | 'in_progress' | 'resolved'
}

function categoryLabel(incident: MapIncident) {
  if (incident.categoryName) return incident.categoryName
  if (typeof incident.category === 'string') return incident.category
  return incident.category?.name || 'Autre'
}

function incidentRef(incident: MapIncident) {
  return incident.referenceCode || `#${incident.id}`
}

function incidentHref(incident: MapIncident) {
  return `/incidents/${encodeURIComponent(incident.referenceCode || String(incident.id))}`
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
        (i.title || '').toLowerCase().includes(q) ||
        categoryLabel(i).toLowerCase().includes(q) ||
        incidentRef(i).toLowerCase().includes(q)
    )
  }, [incidents, searchQuery])

  const categoryStats = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const i of incidents) {
      const label = categoryLabel(i)
      acc[label] = (acc[label] || 0) + 1
    }
    return Object.entries(acc)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [incidents])

  const maxCat = categoryStats[0]?.count || 1

  return (
    <DashboardShell className="flex h-screen flex-col">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-0 flex-1">
          <div className="absolute left-4 top-4 z-[500] w-[min(100%-2rem,22rem)]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t3" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer par titre, catégorie, référence…"
                className="h-11 border-border/80 bg-card/90 pl-10 shadow-lg backdrop-blur-md"
              />
            </div>
          </div>

          <div className="absolute inset-0 min-h-[400px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-t3">Chargement de la carte…</div>
            ) : (
              <MapView height="100%" showAllStatuses={true} />
            )}
          </div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-border bg-sidebar/50 p-4 backdrop-blur-md lg:w-[320px] lg:border-l lg:border-t-0"
        >
          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle>Incidents par catégorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryStats.map((row) => (
                <div key={row.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-t2">{row.name}</span>
                      <span className="font-mono text-xs text-t1">{row.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(row.count / maxCat) * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle>Liste ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
              {filtered.map((incident) => (
                <Link
                  key={incident.id}
                  href={incidentHref(incident)}
                  className="block rounded-lg border border-border bg-bg-hover/40 p-3 transition-all hover:border-primary/35 hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-primary">{incidentRef(incident)}</span>
                    <StatusBadge status={normalizeStatus(incident.status)} size="sm" />
                  </div>
                  <h4 className="mb-1 line-clamp-2 text-xs font-medium text-t1">{incident.title}</h4>
                  <p className="text-[10px] text-t3">{categoryLabel(incident)}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.aside>
      </div>
    </DashboardShell>
  )
}
