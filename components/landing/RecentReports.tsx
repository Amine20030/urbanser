'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { incidentApi } from '@/lib/api'
import { Incident } from '@/lib/types'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getCategoryIcon } from '@/lib/utils'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState, EmptyState } from '@/components/shared/ErrorState'

export function RecentReports() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    incidentApi
      .getRecent()
      .then((res) => {
        setIncidents(res.data.slice(0, 6))
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les signalements récents')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-[var(--t1)]">Signalements récents</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} retry={() => window.location.reload()} />
        </div>
      </section>
    )
  }

  if (incidents.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <EmptyState message="Aucun signalement récent" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-[var(--t1)]">Signalements récents</h2>
          <Link
            href="/incidents"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Voir tous les signalements
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident, index) => (
            <div
              key={incident.id}
              className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] card-hover opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(incident.category.name)}</span>
                  <span className="text-xs text-[var(--t3)] font-mono">{incident.referenceCode}</span>
                </div>
                <SeverityBadge severity={incident.severity} size="sm" />
              </div>

              {/* Title */}
              <h3 className="text-sm font-medium text-[var(--t1)] mb-2 line-clamp-2">
                {incident.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--t2)]">{incident.sector.name}</span>
                  <span className="text-[var(--t3)]">·</span>
                  <span className="text-xs text-[var(--t3)]">
                    {new Date(incident.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <StatusBadge status={incident.status.toLowerCase() as 'open' | 'in_progress' | 'resolved'} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
