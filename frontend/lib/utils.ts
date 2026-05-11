import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx for conditional logic
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get color for severity level
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
    case 'HIGH':
      return '#ef4444'
    case 'MED':
    case 'MEDIUM':
      return '#f59e0b'
    case 'LOW':
      return '#22c55e'
    default:
      return '#7a8899'
  }
}

/**
 * Get French label for severity
 */
export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return 'Critique'
    case 'HIGH':
      return 'Élevé'
    case 'MED':
    case 'MEDIUM':
      return 'Moyen'
    case 'LOW':
      return 'Faible'
    default:
      return severity
  }
}

/**
 * Get French label for status
 */
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
