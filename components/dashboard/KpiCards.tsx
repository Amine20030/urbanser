'use client'

import { useEffect, useState } from 'react'
import { INCIDENTS } from '@/lib/mockData'

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
  const openCount = INCIDENTS.filter((i) => i.status === 'open').length
  const inProgressCount = INCIDENTS.filter((i) => i.status === 'in_progress').length
  const resolvedCount = INCIDENTS.filter((i) => i.status === 'resolved').length
  const highSeverityCount = INCIDENTS.filter((i) => i.severity === 'HIGH').length

  const kpis = [
    {
      title: 'INCIDENTS OUVERTS',
      value: openCount,
      color: '#ef4444',
      accentColor: '#ef4444',
      delta: '↓12% vs hier',
      deltaPositive: false,
    },
    {
      title: 'EN COURS',
      value: inProgressCount,
      color: '#f59e0b',
      accentColor: '#f59e0b',
      delta: '↑5% vs hier',
      deltaPositive: true,
    },
    {
      title: 'RÉSOLUS 24H',
      value: resolvedCount,
      color: '#22c55e',
      accentColor: '#22c55e',
      delta: '↑18% vs hier',
      deltaPositive: true,
    },
    {
      title: 'CRITICITÉ HAUTE',
      value: highSeverityCount,
      color: '#8b5cf6',
      accentColor: '#8b5cf6',
      delta: '↓3% vs hier',
      deltaPositive: true,
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
