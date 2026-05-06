'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { INCIDENTS, Incident, Category, Status, Severity } from '@/lib/mockData'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { filterIncidents, getCategoryIcon, cn } from '@/lib/utils'

type SortField = 'id' | 'title' | 'category' | 'sector' | 'severity' | 'authority' | 'status' | 'date'
type SortDirection = 'asc' | 'desc'

interface IncidentTableProps {
  filters?: {
    category?: Category | null
    severity?: Severity | null
    status?: Status | null
    search?: string
  }
}

export function IncidentTable({ filters = {} }: IncidentTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const filteredIncidents = filterIncidents(INCIDENTS, filters)

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    let comparison = 0
    if (sortField === 'id') {
      comparison = a.id.localeCompare(b.id)
    } else if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title)
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category)
    } else if (sortField === 'sector') {
      comparison = a.sector.localeCompare(b.sector)
    } else if (sortField === 'severity') {
      const severityOrder = { HIGH: 0, MED: 1, LOW: 2 }
      comparison = severityOrder[a.severity] - severityOrder[b.severity]
    } else if (sortField === 'authority') {
      comparison = a.authority.localeCompare(b.authority)
    } else if (sortField === 'status') {
      const statusOrder = { open: 0, in_progress: 1, resolved: 2 }
      comparison = statusOrder[a.status] - statusOrder[b.status]
    } else if (sortField === 'date') {
      // Simple string comparison for now
      comparison = a.date.localeCompare(b.date)
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-[var(--t3)]" />
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-blue-400" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-400" />
    )
  }

  const TableHeader = ({
    field,
    children,
    className = '',
  }: {
    field: SortField
    children: React.ReactNode
    className?: string
  }) => (
    <th
      className={cn(
        'px-3 py-3 text-left text-[10px] uppercase tracking-[1px] text-[var(--t3)] font-mono cursor-pointer hover:text-[var(--t1)] transition-colors',
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <TableHeader field="id" className="w-[80px]">
              ID
            </TableHeader>
            <TableHeader field="title">Problème</TableHeader>
            <TableHeader field="category" className="w-[100px]">
              Catégorie
            </TableHeader>
            <TableHeader field="sector" className="w-[100px]">
              Secteur
            </TableHeader>
            <TableHeader field="severity" className="w-[100px]">
              Criticité
            </TableHeader>
            <TableHeader field="authority" className="w-[120px]">
              Autorité
            </TableHeader>
            <TableHeader field="status" className="w-[100px]">
              Statut
            </TableHeader>
            <TableHeader field="date" className="w-[100px]">
              Date
            </TableHeader>
            <th className="px-3 py-3 text-left text-[10px] uppercase tracking-[1px] text-[var(--t3)] font-mono w-[60px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedIncidents.map((incident) => (
            <tr
              key={incident.id}
              className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <td className="px-3 py-3">
                <span className="text-xs font-mono text-cyan-400">{incident.id}</span>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{getCategoryIcon(incident.category)}</span>
                  <span className="text-sm text-[var(--t1)] line-clamp-1">{incident.title}</span>
                </div>
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t2)]">{incident.category}</span>
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t2)]">{incident.sector}</span>
              </td>
              <td className="px-3 py-3">
                <SeverityBadge severity={incident.severity} size="sm" />
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t2)]">{incident.authority}</span>
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={incident.status} size="sm" />
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t3)]">{incident.date}</span>
              </td>
              <td className="px-3 py-3">
                <button
                  className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors"
                  aria-label="Voir les détails"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
