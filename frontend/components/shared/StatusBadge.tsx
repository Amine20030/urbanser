import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

function normalizeKey(status: string): string {
  const u = (status || '').toUpperCase().replace(/-/g, '_')
  if (u === 'IN_PROGRESS') return 'IN_PROGRESS'
  if (u === 'RESOLVED') return 'RESOLVED'
  if (u === 'OPEN') return 'OPEN'
  const low = (status || '').toLowerCase()
  if (low === 'in_progress') return 'IN_PROGRESS'
  if (low === 'resolved') return 'RESOLVED'
  return 'OPEN'
}

const statusConfig: Record<string, { bg: string; color: string; text: string }> = {
  OPEN: { bg: '#fef2f2', color: '#dc2626', text: '🔴 Ouvert' },
  IN_PROGRESS: { bg: '#fffbeb', color: '#d97706', text: '🟡 En cours' },
  RESOLVED: { bg: '#f0fdf4', color: '#16a34a', text: '✅ Résolu' },
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const key = normalizeKey(status)
  const config = statusConfig[key] ?? {
    bg: '#f1f5f9',
    color: '#64748b',
    text: status || '—',
  }

  return (
    <span
      className={cn('inline-flex items-center font-semibold', size === 'sm' && 'text-[10px]')}
      style={{
        background: config.bg,
        color: config.color,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: size === 'sm' ? 11 : 12,
        fontWeight: key === 'RESOLVED' ? 600 : 700,
      }}
    >
      {config.text}
    </span>
  )
}
