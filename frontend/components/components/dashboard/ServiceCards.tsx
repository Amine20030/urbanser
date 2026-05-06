'use client'

import { SERVICE_STATS } from '@/lib/mockData'

interface ServiceCardProps {
  name: string
  percentage: number
  color: string
  index: number
}

function ServiceCard({ name, percentage, color, index }: ServiceCardProps) {
  return (
    <div
      className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] card-hover opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium text-[var(--t1)]">{name}</h3>
        <span className="text-lg font-bold font-mono" style={{ color }}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--bg-hover)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}

export function ServiceCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {SERVICE_STATS.map((service, index) => (
        <ServiceCard key={service.name} {...service} index={index} />
      ))}
    </div>
  )
}
