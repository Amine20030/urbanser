'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { IncidentTable } from '@/components/dashboard/IncidentTable'
import { INCIDENTS, Category, Severity, Status } from '@/lib/mockData'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn, getSeverityLabel, getStatusLabel } from '@/lib/utils'

export default function IncidentsPage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [activeSeverity, setActiveSeverity] = useState<Severity | null>(null)
  const [activeStatus, setActiveStatus] = useState<Status | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories: (Category | null)[] = [
    null,
    'Transport',
    'Eau',
    'Déchets',
    'Éclairage',
    'Électricité',
    'Voirie',
  ]

  const severities: (Severity | null)[] = [null, 'HIGH', 'MED', 'LOW']
  const statuses: (Status | null)[] = [null, 'open', 'in_progress', 'resolved']

  const totalCount = INCIDENTS.length
  const openCount = INCIDENTS.filter((i) => i.status === 'open').length
  const inProgressCount = INCIDENTS.filter((i) => i.status === 'in_progress').length
  const resolvedCount = INCIDENTS.filter((i) => i.status === 'resolved').length

  const FilterPill = ({
    label,
    isActive,
    onClick,
  }: {
    label: string
    isActive: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--t2)] hover:text-[var(--t1)] hover:border-[var(--border2)]'
      )}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--t1)] mb-2">Incidents</h1>

            {/* Stats summary */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <span className="text-[var(--t2)]">
                Total: <span className="text-[var(--t1)] font-mono">{totalCount}</span>
              </span>
              <span className="text-[var(--t3)]">·</span>
              <span className="text-[var(--t2)]">
                Ouverts: <span className="text-red-400 font-mono">{openCount}</span>
              </span>
              <span className="text-[var(--t3)]">·</span>
              <span className="text-[var(--t2)]">
                En cours: <span className="text-amber-400 font-mono">{inProgressCount}</span>
              </span>
              <span className="text-[var(--t3)]">·</span>
              <span className="text-[var(--t2)]">
                Résolus: <span className="text-green-400 font-mono">{resolvedCount}</span>
              </span>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              {/* Category filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--t3)] font-mono uppercase tracking-wider mr-2">
                  Catégorie:
                </span>
                {categories.map((cat) => (
                  <FilterPill
                    key={cat ?? 'all'}
                    label={cat ?? 'Tous'}
                    isActive={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </div>

              {/* Severity filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--t3)] font-mono uppercase tracking-wider mr-2">
                  Criticité:
                </span>
                {severities.map((sev) => (
                  <FilterPill
                    key={sev ?? 'all'}
                    label={sev ? getSeverityLabel(sev) : 'Tous'}
                    isActive={activeSeverity === sev}
                    onClick={() => setActiveSeverity(sev)}
                  />
                ))}
              </div>

              {/* Status filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--t3)] font-mono uppercase tracking-wider mr-2">
                  Statut:
                </span>
                {statuses.map((stat) => (
                  <FilterPill
                    key={stat ?? 'all'}
                    label={stat ? getStatusLabel(stat) : 'Tous'}
                    isActive={activeStatus === stat}
                    onClick={() => setActiveStatus(stat)}
                  />
                ))}
              </div>

              {/* Search */}
              <div className="pt-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, description, secteur..."
                  className="w-full max-w-md px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
            <IncidentTable
              filters={{
                category: activeCategory,
                severity: activeSeverity,
                status: activeStatus,
                search: searchQuery,
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
