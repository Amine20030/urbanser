'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { MapView } from '@/components/shared/MapView'
import { INCIDENTS } from '@/lib/mockData'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getSeverityColor } from '@/lib/utils'

export default function CartePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIncidents = INCIDENTS.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate incidents by service
  const serviceCounts = INCIDENTS.reduce((acc, incident) => {
    acc[incident.authority] = (acc[incident.authority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const serviceStats = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar />

      <main className="ml-[220px] h-screen flex">
        {/* Map - takes remaining space */}
        <div className="flex-1 relative">
          {/* Search overlay */}
          <div className="absolute top-4 left-4 z-[400] w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer par secteur ou catégorie..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50 shadow-lg"
              />
            </div>
          </div>

          <MapView incidents={filteredIncidents} height="100vh" />
        </div>

        {/* Right panel */}
        <aside className="w-[300px] bg-[var(--bg-sidebar)] border-l border-[var(--border)] p-4 space-y-4 overflow-y-auto">
          {/* Service stats */}
          <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
            <h3 className="text-[13px] font-medium text-[var(--t1)] mb-4">
              Incidents par service
            </h3>
            <div className="space-y-3">
              {serviceStats.map((service) => (
                <div key={service.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--t2)]">{service.name}</span>
                      <span className="text-xs font-mono text-[var(--t1)]">{service.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-hover)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(service.count / INCIDENTS.length) * 100}%`,
                          backgroundColor: getSeverityColor('MED'),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent incidents */}
          <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] flex-1">
            <h3 className="text-[13px] font-medium text-[var(--t1)] mb-4">
              Derniers incidents
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {INCIDENTS.slice(0, 6).map((incident) => (
                <div
                  key={incident.id}
                  className="p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)]"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-cyan-400">{incident.id}</span>
                    <StatusBadge status={incident.status} size="sm" />
                  </div>
                  <h4 className="text-xs text-[var(--t1)] mb-1 line-clamp-1">
                    {incident.title}
                  </h4>
                  <p className="text-[10px] text-[var(--t3)]">{incident.date}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
