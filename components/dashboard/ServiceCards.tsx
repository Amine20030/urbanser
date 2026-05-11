'use client'

import { useState, useEffect } from 'react'
import { statsApi } from '@/lib/api'
import { ServiceHealth } from '@/lib/types'
import { CardsSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'

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
  const [services, setServices] = useState<ServiceHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsApi
      .getHealth()
      .then((res: { data: ServiceHealth[] }) => {
        setServices(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger la santé des services')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <CardsSkeleton count={4} />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service, index) => (
        <ServiceCard
          key={service.category}
          name={service.category}
          percentage={service.healthPercent}
          color={service.healthPercent > 80 ? '#22c55e' : service.healthPercent > 50 ? '#f59e0b' : '#ef4444'}
          index={index}
        />
      ))}
    </div>
  )
}
