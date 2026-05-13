'use client'

import { Building2, Droplets, Lightbulb, Trash2, Bus, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { statsAPI } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import type { LucideIcon } from 'lucide-react'

/** Matches backend `StatsResponse.ServiceHealth` JSON (serviceName, percentage, color). */
type ServiceHealthDTO = {
  serviceName?: string
  percentage?: number
  color?: string
  categoryName?: string
  healthPercent?: number
  activeCount?: number
}

const icons: Record<string, LucideIcon> = {
  Transport: Bus,
  Eau: Droplets,
  Déchets: Trash2,
  Éclairage: Lightbulb,
  Électricité: Lightbulb,
  Voirie: AlertCircle,
  Sécurité: AlertCircle,
  'Espaces verts': Building2,
}

const accents = [
  'from-emerald-500/15 to-teal-500/5 border-emerald-500/20',
  'from-amber-500/15 to-yellow-500/5 border-amber-500/20',
  'from-sky-500/15 to-cyan-500/5 border-sky-500/20',
  'from-orange-500/15 to-rose-500/5 border-orange-500/20',
  'from-violet-500/15 to-purple-500/5 border-violet-500/20',
  'from-slate-500/15 to-zinc-500/5 border-slate-500/20',
]

function labelFor(service: ServiceHealthDTO): string {
  return (service.serviceName ?? service.categoryName ?? 'Catégorie').trim() || 'Catégorie'
}

function percentFor(service: ServiceHealthDTO): number {
  const v = service.percentage ?? service.healthPercent
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0
}

export function ServiceCards() {
  const [data, setData] = useState<ServiceHealthDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsAPI
      .getServicesHealth()
      .then((res) => {
        const raw = res.data
        const list = Array.isArray(raw) ? raw : []
        setData(list)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
        Erreur : {error}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-t3">
        Aucune donnée par catégorie pour le moment (aucun incident catégorisé).
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {data.map((service, index) => {
        const name = labelFor(service)
        const pct = percentFor(service)
        const Icon = icons[name] || Building2
        const accent = accents[index % accents.length]
        return (
          <motion.div
            key={`${name}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Card
              className={`h-full cursor-pointer border bg-gradient-to-br shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md ${accent}`}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/60">
                    <Icon className="h-3.5 w-3.5 text-t1" />
                  </span>
                  <span className="truncate text-xs font-medium text-t2" title={name}>
                    {name}
                  </span>
                </div>
                <div className="font-mono text-xl font-bold tabular-nums text-t1">{pct}%</div>
                <p className="mt-1 text-[10px] font-medium leading-snug text-t3">Taux de résolution (catégorie)</p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
