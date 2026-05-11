'use client'

import { useEffect, useState } from 'react'
import { statsApi } from '@/lib/api'
import { DashboardStats } from '@/lib/types'
import { CardsSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'

interface KpiCardProps {
  title: string
  value: number
  color: string
  accentColor: string
  delta: string
  deltaPositive: boolean
  index: number
}

function AnimatedValue({ value, duration = 500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span className="font-mono tabular-nums">{count}</span>
}

function KpiCard({ title, value, color, accentColor, delta, deltaPositive, index }: KpiCardProps) {
  return (
    <div
      className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] card-hover relative overflow-hidden opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: accentColor }}
      />

      <div className="pt-2">
        <h3 className="text-[9px] uppercase tracking-[2px] text-[var(--t3)] font-mono mb-3">
          {title}
        </h3>
        <div className="flex items-end justify-between">
          <div
            className="text-[28px] sm:text-[34px] font-bold font-mono leading-none"
            style={{ color }}
          >
            <AnimatedValue value={value} />
          </div>
          <div
            className={`text-xs font-mono ${
              deltaPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {delta}
          </div>
        </div>
      </div>
    </div>
  )
}

export function KpiCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsApi
      .getDashboard()
      .then((res: { data: DashboardStats }) => {
        setStats(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les statistiques')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <CardsSkeleton count={4} />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!stats) {
    return null
  }

  const kpis = [
    {
      title: 'INCIDENTS OUVERTS',
      value: stats.openIncidents,
      color: '#ef4444',
      accentColor: '#ef4444',
      delta: `${stats.resolutionRate}% taux résolution`,
      deltaPositive: true,
    },
    {
      title: 'EN COURS',
      value: stats.inProgressIncidents,
      color: '#f59e0b',
      accentColor: '#f59e0b',
      delta: 'En traitement',
      deltaPositive: true,
    },
    {
      title: 'RÉSOLUS 24H',
      value: stats.resolvedLast24h,
      color: '#22c55e',
      accentColor: '#22c55e',
      delta: 'Dernières 24h',
      deltaPositive: true,
    },
    {
      title: 'CRITICITÉ HAUTE',
      value: stats.highSeverityCount,
      color: '#8b5cf6',
      accentColor: '#8b5cf6',
      delta: 'Prioritaires',
      deltaPositive: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <KpiCard key={kpi.title} {...kpi} index={index} />
      ))}
    </div>
  )
}
