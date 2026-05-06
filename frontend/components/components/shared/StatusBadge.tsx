'use client'

import { Status } from '@/lib/mockData'
import { getStatusBgColor, getStatusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-xs',
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium font-mono
        ${getStatusBgColor(status)}
        ${sizeClasses[size]}
      `}
    >
      {getStatusLabel(status)}
    </span>
  )
}
