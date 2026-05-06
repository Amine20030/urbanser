'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { INCIDENTS } from '@/lib/mockData'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getCategoryIcon } from '@/lib/utils'

export function RecentReports() {
  const recentIncidents = INCIDENTS.slice(0, 6)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-[var(--t1)]">
            Signalements récents
          </h2>
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
          {recentIncidents.map((incident, index) => (
            <div
              key={incident.id}
              className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] card-hover opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(incident.category)}</span>
                  <span className="text-xs text-[var(--t3)] font-mono">{incident.id}</span>
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
                  <span className="text-xs text-[var(--t2)]">{incident.sector}</span>
                  <span className="text-[var(--t3)]">·</span>
                  <span className="text-xs text-[var(--t3)]">{incident.date}</span>
                </div>
                <StatusBadge status={incident.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
