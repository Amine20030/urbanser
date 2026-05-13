'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { IncidentTable } from '@/components/dashboard/IncidentTable'
import { INCIDENTS, Category, Severity, Status } from '@/lib/mockData'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn, getSeverityLabel, getStatusLabel } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function IncidentsPage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [activeSeverity, setActiveSeverity] = useState<Severity | null>(null)
  const [activeStatus, setActiveStatus] = useState<Status | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-mesh-light opacity-60 dark:bg-mesh-dark dark:opacity-100" aria-hidden />
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-t1">Incidents</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-t2">
            <Badge variant="outline">Total {totalCount}</Badge>
            <Badge variant="warning">Ouverts {openCount}</Badge>
            <Badge variant="secondary">En cours {inProgressCount}</Badge>
            <Badge variant="success">Résolus {resolvedCount}</Badge>
          </div>
        </motion.div>

        <div className="mb-6 space-y-4 rounded-xl border border-border/80 bg-card/60 p-4 shadow-sm backdrop-blur-md sm:p-5">
          <FilterRow label="Catégorie">
            {categories.map((cat) => (
              <FilterPill
                key={cat ?? 'all'}
                label={cat ?? 'Tous'}
                isActive={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </FilterRow>
          <FilterRow label="Criticité">
            {severities.map((sev) => (
              <FilterPill
                key={sev ?? 'all'}
                label={sev ? getSeverityLabel(sev) : 'Tous'}
                isActive={activeSeverity === sev}
                onClick={() => setActiveSeverity(sev)}
              />
            ))}
          </FilterRow>
          <FilterRow label="Statut">
            {statuses.map((stat) => (
              <FilterPill
                key={stat ?? 'all'}
                label={stat ? getStatusLabel(stat) : 'Tous'}
                isActive={activeStatus === stat}
                onClick={() => setActiveStatus(stat)}
              />
            ))}
          </FilterRow>
          <div className="max-w-lg pt-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, description, secteur…"
              className="h-10"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-card backdrop-blur-md"
        >
          <IncidentTable
            filters={{
              category: activeCategory,
              severity: activeSeverity,
              status: activeStatus,
              search: searchQuery,
            }}
          />
        </motion.div>
      </main>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-[90] gap-2 rounded-full px-6 shadow-glow"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="h-5 w-5" />
        Signaler
      </Button>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <Footer />
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-t3 sm:w-28">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
        isActive
          ? 'border-transparent bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
          : 'border-border bg-muted/40 text-t2 hover:border-primary/30 hover:text-t1'
      )}
    >
      {label}
    </button>
  )
}
