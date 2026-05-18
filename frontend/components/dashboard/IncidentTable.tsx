'use client'

import Link from 'next/link'
import { CheckCircle2, Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getSeverityColor } from '@/lib/utils'

interface IncidentTableProps {
  incidents: any[]
  isAdmin?: boolean
  changeStatus?: (id: number, status: string) => void
}

export function IncidentTable({ incidents, isAdmin = false, changeStatus }: IncidentTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left">
              {['Ref', 'Titre', 'Categorie / secteur', 'Criticite', 'Statut', 'Date', isAdmin ? 'Actions' : null]
                .filter(Boolean)
                .map((h) => (
                  <th key={String(h)} className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-t3">
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {incidents.map((incident) => {
              const idAttr = incident.referenceCode || incident.reference || incident.id
              const catName = incident.category?.name || incident.category || '-'
              const secName = incident.sector?.name || incident.sector || '-'
              const dateStr = incident.createdAt
                ? new Date(incident.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : incident.date || '-'

              return (
                <tr key={incident.id} className="transition-colors hover:bg-muted/35">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-bold text-primary">{idAttr}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/incidents/${encodeURIComponent(incident.referenceCode || incident.id)}`}
                      className="line-clamp-2 font-semibold text-t1 underline-offset-4 hover:text-primary hover:underline"
                    >
                      {incident.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-t2">
                    <div className="font-semibold text-t1">{catName}</div>
                    <div className="mt-0.5 text-t3">{secName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-black/5"
                        style={{ backgroundColor: getSeverityColor(incident.severity) }}
                      />
                      <span className="text-xs font-medium text-t2">{incident.severity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={incident.status} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-t3">{dateStr}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {incident.status !== 'IN_PROGRESS' && incident.status !== 'RESOLVED' && (
                          <Button size="sm" variant="outline" onClick={() => changeStatus?.(incident.id, 'IN_PROGRESS')}>
                            <Clock3 className="h-3.5 w-3.5" />
                            Prendre
                          </Button>
                        )}
                        {incident.status !== 'RESOLVED' ? (
                          <Button size="sm" variant="secondary" onClick={() => changeStatus?.(incident.id, 'RESOLVED')}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Resolu
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Resolu
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {incidents.length === 0 && (
        <div className="px-4 py-12 text-center text-sm text-t3">Aucun incident trouve</div>
      )}
    </div>
  )
}
