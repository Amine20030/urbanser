'use client'

import { AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { statsAPI } from '@/lib/api'

export function KpiCards() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array(4).fill(0).map((_,i) => <div key={i} className="h-24 bg-[var(--bg-card)] animate-pulse rounded-[10px] border border-[var(--border)]" />)}</div>
  if (error) return <div className="p-4 rounded-[10px] bg-red-500/10 text-red-500 border border-red-500/20">Erreur stats: {error}</div>

  const total = data?.totalIncidents || 0
  const open = data?.openIncidents || 0
  const inProgress = data?.inProgressIncidents || 0
  const resolved = data?.resolvedIncidents || 0

  const cards = [
    {
      title: 'Total incidents',
      value: total,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20',
    },
    {
      title: 'Ouverts',
      value: open,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      title: 'En cours',
      value: inProgress,
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/20',
    },
    {
      title: 'Résolus',
      value: resolved,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-400/10 border-green-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className={`p-4 rounded-[10px] border ${card.bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--t2)] uppercase tracking-wider">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className={`text-2xl font-bold ${card.color} font-mono`}>
              <AnimatedNumber value={card.value} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    const target = value
    if (target === 0) return setDisplayed(0)
    const step = Math.max(1, Math.ceil(target / 40))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setDisplayed(current)
      if (current >= target) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [value])
  return <>{displayed}</>
}
