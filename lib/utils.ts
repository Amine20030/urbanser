import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'HIGH':
      return '#ef4444'
    case 'MED':
      return '#f59e0b'
    case 'LOW':
      return '#22c55e'
    default:
      return '#7a8899'
  }
}

export function getSeverityBgColor(severity: string): string {
  switch (severity) {
    case 'HIGH':
      return 'bg-red-500/10 border-red-500/30 text-red-400'
    case 'MED':
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    case 'LOW':
      return 'bg-green-500/10 border-green-500/30 text-green-400'
    default:
      return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return '#ef4444'
    case 'in_progress':
      return '#f59e0b'
    case 'resolved':
      return '#22c55e'
    default:
      return '#7a8899'
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'open':
      return 'bg-red-500/10 border-red-500/30 text-red-400'
    case 'in_progress':
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    case 'resolved':
      return 'bg-green-500/10 border-green-500/30 text-green-400'
    default:
      return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'open':
      return 'Ouvert'
    case 'in_progress':
      return 'En cours'
    case 'resolved':
      return 'Résolu'
    default:
      return status
  }
}

export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'HIGH':
      return 'Haute'
    case 'MED':
      return 'Moyenne'
    case 'LOW':
      return 'Faible'
    default:
      return severity
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Transport': '🚌',
    'Eau': '💧',
    'Déchets': '🗑️',
    'Éclairage': '💡',
    'Électricité': '⚡',
    'Voirie': '🚧',
    'Sécurité': '🚨',
    'Espaces verts': '🌳',
  }
  return icons[category] || '📍'
}

export function getAuthorityForCategory(category: string): string {
  const authorities: Record<string, string> = {
    'Transport': 'Police',
    'Eau': 'RADEEMA',
    'Déchets': 'Commune',
    'Éclairage': 'Commune',
    'Électricité': 'ONEE',
    'Voirie': 'Commune',
    'Sécurité': 'Police',
    'Espaces verts': 'Commune',
  }
  return authorities[category] || 'Commune'
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getIncidentById(id: string) {
  // This would be imported from mockData, but to avoid circular imports
  // we'll use a dynamic import pattern when needed
  return null
}

export function filterIncidents(
  incidents: any[],
  filters: {
    category?: string | null
    severity?: string | null
    status?: string | null
    search?: string
  }
) {
  return incidents.filter((incident) => {
    if (filters.category && incident.category?.name !== filters.category) return false
    if (filters.severity && incident.severity !== filters.severity) return false
    if (filters.status && incident.status?.toLowerCase() !== filters.status?.toLowerCase()) return false
    if (filters.search) {
      const search = filters.search.toLowerCase()
      const match =
        incident.title.toLowerCase().includes(search) ||
        incident.description.toLowerCase().includes(search) ||
        incident.sector.toLowerCase().includes(search) ||
        incident.authority.toLowerCase().includes(search)
      if (!match) return false
    }
    return true
  })
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Transport': '#06b6d4',
    'Eau': '#3b82f6',
    'Déchets': '#22c55e',
    'Éclairage': '#f59e0b',
    'Électricité': '#ef4444',
    'Voirie': '#8b5cf6',
    'Sécurité': '#dc2626',
    'Espaces verts': '#10b981',
  }
  return colors[category] || '#7a8899'
}
