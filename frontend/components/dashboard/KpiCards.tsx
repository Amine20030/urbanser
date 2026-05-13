'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
        Erreur stats : {error}
      </div>
    )
  }

  const total = data?.totalIncidents || 0
  const open = data?.openIncidents || 0
  const inProgress = data?.inProgressIncidents || 0
  const resolved = data?.resolvedIncidents || 0

  const cards = [
    { label: 'Total incidents', value: total, icon: '📋', color: '#0ea5e9' },
    { label: 'Ouverts', value: open, icon: '⚠️', color: '#f59e0b' },
    { label: 'En cours', value: inProgress, icon: '⏱', color: '#8b5cf6' },
    { label: 'Résolus', value: resolved, icon: '✓', color: '#22c55e' },
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
          <KpiStatCard label={card.label} displayedValue={card.value} icon={card.icon} color={card.color} />
        </motion.div>
      ))}
    </div>
  )
}

function KpiStatCard({
  label,
  displayedValue,
  icon,
  color,
}: {
  label: string
  displayedValue: number
  icon: string
  color: string
}) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    const target = displayedValue
    if (target === 0) return setDisplayed(0)
    const step = Math.max(1, Math.ceil(target / 40))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setDisplayed(current)
      if (current >= target) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [displayedValue])

  return (
    <div
      className="bg-card dark:bg-card/80"
      style={{
        border: '1px solid #e2e8f0',
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: '20px 24px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            color: '#94a3b8',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', lineHeight: 1 }} className="dark:text-t1">
          {displayed}
        </div>
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        {icon}
      </div>
    </div>
  )
}
