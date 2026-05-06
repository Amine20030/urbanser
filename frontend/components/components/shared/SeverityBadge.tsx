'use client'

import { Severity } from '@/lib/mockData'
import { getSeverityBgColor, getSeverityLabel } from '@/lib/utils'

interface SeverityBadgeProps {
  severity: Severity
  size?: 'sm' | 'md' | 'lg'
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-xs',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium font-mono
        ${getSeverityBgColor(severity)}
        ${sizeClasses[size]}
      `}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor:
            severity === 'HIGH'
              ? '#ef4444'
              : severity === 'MED'
              ? '#f59e0b'
              : '#22c55e',
        }}
      />
      {getSeverityLabel(severity)}
    </span>
  )
}
