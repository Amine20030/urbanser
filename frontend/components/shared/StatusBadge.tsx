import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: {
    label: 'Ouvert',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
  in_progress: {
    label: 'En cours',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  resolved: {
    label: 'Résolu',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    color: 'text-gray-400',
    bg: 'bg-gray-400/10 border-gray-400/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        config.bg,
        config.color,
        size === 'sm' && 'text-[10px] px-1.5'
      )}
    >
      {config.label}
    </span>
  )
}
