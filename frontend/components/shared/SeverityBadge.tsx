import { cn, getSeverityColor, getSeverityLabel } from '@/lib/utils'
import { Severity } from '@/lib/mockData'

interface SeverityBadgeProps {
  severity: Severity
  size?: 'sm' | 'md'
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const color = getSeverityColor(severity)
  const label = getSeverityLabel(severity)

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        size === 'sm' && 'text-[10px] px-1.5'
      )}
      style={{
        color,
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
      }}
    >
      {label}
    </span>
  )
}
