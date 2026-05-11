'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { incidentApi } from '@/lib/api'
import { Incident } from '@/lib/types'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getCategoryIcon, cn } from '@/lib/utils'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState, EmptyState } from '@/components/shared/ErrorState'

type SortField = 'id' | 'title' | 'category' | 'sector' | 'severity' | 'authority' | 'status' | 'date'
type SortDirection = 'asc' | 'desc'

interface IncidentTableProps {
  filters?: {
    category?: string | null
    severity?: string | null
    status?: string | null
    search?: string
  }
}

export function IncidentTable({ filters = {} }: IncidentTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    incidentApi
      .getAll({ page: 0, size: 50 })
      .then((res: { data: { content: Incident[] } }) => {
        setIncidents(res.data.content)
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les incidents')
        setLoading(false)
      })
  }, [])

  // Filter incidents based on props
  const filteredIncidents = incidents.filter((incident) => {
    if (filters.category && incident.category.name !== filters.category) return false
    if (filters.severity && incident.severity !== filters.severity) return false
    if (filters.status && incident.status.toLowerCase() !== filters.status.toLowerCase()) return false
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return (
        incident.title.toLowerCase().includes(search) ||
        incident.description.toLowerCase().includes(search) ||
        incident.sector.name.toLowerCase().includes(search) ||
        incident.category.name.toLowerCase().includes(search)
      )
    }
    return true
  })

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    let comparison = 0
    if (sortField === 'id') {
      comparison = String(a.id).localeCompare(String(b.id))
    } else if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title)
    } else if (sortField === 'category') {
      comparison = a.category.name.localeCompare(b.category.name)
    } else if (sortField === 'sector') {
      comparison = a.sector.name.localeCompare(b.sector.name)
    } else if (sortField === 'severity') {
      const severityOrder = { HIGH: 0, MED: 1, LOW: 2 }
      comparison = severityOrder[a.severity] - severityOrder[b.severity]
    } else if (sortField === 'authority') {
      comparison = (a.authorityNotified || '').localeCompare(b.authorityNotified || '')
    } else if (sortField === 'status') {
      const statusOrder = { OPEN: 0, IN_PROGRESS: 1, RESOLVED: 2 }
      comparison = statusOrder[a.status] - statusOrder[b.status]
    } else if (sortField === 'date') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  if (loading) {
    return <TableSkeleton rows={5} />
  }

  if (error) {
    return <ErrorState message={error} retry={() => window.location.reload()} />
  }

  if (sortedIncidents.length === 0) {
    return <EmptyState message="Aucun incident trouvé" />
  }

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
                <span className="text-xs font-mono text-cyan-400">{incident.referenceCode}</span>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{getCategoryIcon(incident.category.name)}</span>
                  <span className="text-sm text-[var(--t1)] line-clamp-1">{incident.title}</span>
                </div>
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t2)]">{incident.category.name}</span>
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t2)]">{incident.sector.name}</span>
              </td>
              <td className="px-3 py-3">
                <SeverityBadge severity={incident.severity} size="sm" />
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t2)]">{incident.authorityNotified || '-'}</span>
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={incident.status.toLowerCase() as 'open' | 'in_progress' | 'resolved'} size="sm" />
              </td>
              <td className="px-3 py-3">
                <span className="text-xs text-[var(--t3)]">{new Date(incident.createdAt).toLocaleDateString('fr-FR')}</span>
              </td>
              <td className="px-3 py-3">
                <Link
                  href={`/incidents/${incident.referenceCode}`}
                  className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors inline-block"
                  aria-label="Voir les détails"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
