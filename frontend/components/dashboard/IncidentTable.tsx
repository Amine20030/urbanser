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
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              ID
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Titre
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Secteur
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Autorité
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Criticité
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Statut
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/80">
          {filtered.map((incident) => (
            <tr
              key={incident.id}
              className="transition-colors hover:bg-muted/50"
            >
              <td className="px-4 py-3 font-mono text-xs text-primary">{incident.id}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/incidents/${encodeURIComponent(incident.id)}`}
                  className="font-medium text-t1 underline-offset-4 hover:text-primary hover:underline"
                >
                  {incident.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-xs text-t2">{incident.sector}</td>
              <td className="px-4 py-3 text-xs text-t2">{incident.authority}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white/30"
                    style={{ backgroundColor: getSeverityColor(incident.severity) }}
                  />
                  <span className="text-xs text-t2">{incident.severity}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={incident.status} size="sm" />
              </td>
              <td className="px-4 py-3 font-mono text-[11px] text-t3">{incident.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="py-10 text-center text-sm text-t3">Aucun incident trouvé</div>
      )}
    </div>
  )
}
