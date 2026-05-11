'use client'

import Link from 'next/link'
import { INCIDENTS } from '@/lib/mockData'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getSeverityColor } from '@/lib/utils'

interface IncidentTableProps {
  filters?: {
    category?: string | null
    severity?: string | null
    status?: string | null
    search?: string
  }
}

export function IncidentTable({ filters }: IncidentTableProps) {
  let filtered = [...INCIDENTS]

  if (filters) {
    if (filters.category) {
      filtered = filtered.filter((i) => i.category === filters.category)
    }
    if (filters.severity) {
      filtered = filtered.filter((i) => i.severity === filters.severity)
    }
    if (filters.status) {
      filtered = filtered.filter((i) => i.status === filters.status)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.sector.toLowerCase().includes(q)
      )
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--t3)] uppercase tracking-wider">
              ID
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--t3)] uppercase tracking-wider">
              Titre
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--t3)] uppercase tracking-wider">
              Secteur
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--t3)] uppercase tracking-wider">
              Autorité
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--t3)] uppercase tracking-wider">
              Criticité
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--t3)] uppercase tracking-wider">
              Statut
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--t3)] uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {filtered.map((incident) => (
            <tr
              key={incident.id}
              className="hover:bg-[var(--bg-hover)] transition-colors"
            >
              <td className="py-3 px-4 text-xs font-mono text-cyan-400">
                {incident.id}
              </td>
              <td className="py-3 px-4 text-sm text-[var(--t1)]">
                <Link
                  href={`/incidents/${encodeURIComponent(incident.id)}`}
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {incident.title}
                </Link>
              </td>
              <td className="py-3 px-4 text-xs text-[var(--t2)]">
                {incident.sector}
              </td>
              <td className="py-3 px-4 text-xs text-[var(--t2)]">
                {incident.authority}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getSeverityColor(incident.severity) }}
                  />
                  <span className="text-xs text-[var(--t2)]">
                    {incident.severity}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={incident.status} size="sm" />
              </td>
              <td className="py-3 px-4 text-xs text-[var(--t3)]">
                {incident.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-[var(--t3)]">
          Aucun incident trouvé
        </div>
      )}
    </div>
  )
}
