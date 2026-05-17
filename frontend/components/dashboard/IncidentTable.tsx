'use client'

import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getSeverityColor } from '@/lib/utils'

interface IncidentTableProps {
  incidents: any[]
  isAdmin?: boolean
  changeStatus?: (id: number, status: string) => void
}

export function IncidentTable({ incidents, isAdmin = false, changeStatus }: IncidentTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Réf
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Titre
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
              Catégorie / Secteur
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
            {isAdmin && (
              <th className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-t3">
                Actions Admin
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/80">
          {incidents.map((incident) => {
             // Handle both mock format and live API format
             const idAttr = incident.referenceCode || incident.reference || incident.id
             const catName = incident.category?.name || incident.category || '-'
             const secName = incident.sector?.name || incident.sector || '-'
             const dateStr = incident.createdAt ? new Date(incident.createdAt).toLocaleDateString('fr-FR', {
               day: '2-digit', month: 'short', year: 'numeric'
             }) : incident.date || '-'

             return (
              <tr
                key={incident.id}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-mono text-xs text-primary">{idAttr}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/incidents/${encodeURIComponent(incident.id)}`}
                    className="font-medium text-t1 underline-offset-4 hover:text-primary hover:underline"
                  >
                    {incident.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-t2">
                  <div className="font-medium text-t1">{catName}</div>
                  <div className="text-t3">{secName}</div>
                </td>
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
                <td className="px-4 py-3 font-mono text-[11px] text-t3">{dateStr}</td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div style={{display:'flex',gap:6}}>
                      {incident.status !== 'IN_PROGRESS' && incident.status !== 'RESOLVED' && (
                        <button
                          onClick={() => changeStatus && changeStatus(incident.id, 'IN_PROGRESS')}
                          style={{
                            fontSize:11, padding:'4px 10px', borderRadius:6,
                            background:'#fffbeb', color:'#d97706',
                            border:'1px solid #fcd34d', cursor:'pointer', fontWeight:600
                          }}
                        >⚡ Prendre en charge</button>
                      )}
                      {incident.status !== 'RESOLVED' && (
                        <button
                          onClick={() => changeStatus && changeStatus(incident.id, 'RESOLVED')}
                          style={{
                            fontSize:11, padding:'4px 10px', borderRadius:6,
                            background:'#f0fdf4', color:'#16a34a',
                            border:'1px solid #86efac', cursor:'pointer', fontWeight:600
                          }}
                        >✅ Marquer résolu</button>
                      )}
                      {incident.status === 'RESOLVED' && (
                        <span style={{fontSize:11,color:'#16a34a',fontWeight:600}}>
                          ✅ Résolu
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

      {incidents.length === 0 && (
        <div className="py-10 text-center text-sm text-t3">Aucun incident trouvé</div>
      )}
    </div>
  )
}
