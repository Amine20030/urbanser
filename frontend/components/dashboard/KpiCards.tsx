'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Clock3, ClipboardList } from 'lucide-react'
import { statsAPI } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

export function KpiCards() {
  const [data, setData] = useState<{
    totalIncidents?: number
    openIncidents?: number
    inProgressIncidents?: number
    resolvedIncidents?: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsAPI
      .getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-700">
        Erreur stats : {error}
      </div>
    )
  }

  const cards = [
    { label: 'Total incidents', value: data?.totalIncidents || 0, icon: ClipboardList, color: '#b9441f' },
    { label: 'Ouverts', value: data?.openIncidents || 0, icon: AlertCircle, color: '#dc2626' },
    { label: 'En cours', value: data?.inProgressIncidents || 0, icon: Clock3, color: '#c7832f' },
    { label: 'Resolus', value: data?.resolvedIncidents || 0, icon: CheckCircle2, color: '#166534' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.35 }}
        >
          <KpiStatCard {...card} />
        </motion.div>
      ))}
    </div>
  )
}

function KpiStatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: typeof ClipboardList
  color: string
}) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    if (value === 0) {
      setDisplayed(0)
      return
    }
    const step = Math.max(1, Math.ceil(value / 40))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, value)
      setDisplayed(current)
      if (current >= value) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div
      className="flex items-start justify-between rounded-lg border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-glow"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-t3">{label}</div>
        <div className="text-3xl font-black leading-none text-t1">{displayed}</div>
      </div>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-md border"
        style={{ background: `${color}14`, borderColor: `${color}30`, color }}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  )
}
