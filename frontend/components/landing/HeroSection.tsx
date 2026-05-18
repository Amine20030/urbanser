'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import ServiceStatus from './ServiceStatus'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Stats {
  totalIncidents?: number
  openIncidents?: number
  inProgressIncidents?: number
  resolvedIncidents?: number
  totalCitizens?: number
}

export function HeroSection() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats/dashboard')
        setStats(response.data)
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } }; message?: string }
        setError(ax.response?.data?.message || ax.message || 'Impossible de charger les statistiques.')
      } finally {
        setLoading(false)
      }
    }
    void fetchStats()
  }, [])

  return (
    <section className="relative px-4 pb-16 pt-12 text-center sm:px-6 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-t2 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Supervision urbaine — Marrakech</span>
          <ServiceStatus />
        </div>

        <h1
          className="text-balance font-black leading-[1.1] tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Marrakech
          </span>{' '}
          <span className="text-t1">signale,</span>
          <br />
          <span className="text-t1">la ville répond.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-t2 sm:text-lg">
          Photographiez un problème. Notre IA l&apos;analyse en secondes.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="gap-2 px-8 py-6 text-base shadow-lg shadow-primary/25"
            onClick={() => setModalOpen(true)}
          >
            📷 Signaler maintenant
          </Button>
          <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base" asChild>
            <Link href="/carte">Voir la carte →</Link>
          </Button>
        </div>
      </motion.div>

      <div className="mx-auto mt-14 max-w-4xl">
        {loading && (
          <div className="flex justify-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 flex-1 rounded-full" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-4 py-3 shadow-card backdrop-blur-md sm:gap-4 sm:px-8"
          >
            <HeroStat label="Signalements" value={Number(stats.totalIncidents ?? 0)} delay={0} />
            <span className="hidden text-t3 sm:inline">·</span>
            <HeroStat label="Résolus" value={Number(stats.resolvedIncidents ?? 0)} delay={0.06} />
            <span className="hidden text-t3 sm:inline">·</span>
            <HeroStat label="Citoyens" value={Number(stats.totalCitizens ?? 0)} delay={0.12} />
            <span className="hidden text-t3 sm:inline">·</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-bold tabular-nums text-primary sm:text-base"
            >
              &lt;2min IA
            </motion.span>
          </motion.div>
        )}
      </div>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}

function HeroStat({ label, value, delay }: { label: string; value: number; delay: number }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    if (value === 0) {
      setDisplayed(0)
      return
    }
    const step = Math.max(1, Math.ceil(value / 45))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, value)
      setDisplayed(current)
      if (current >= value) clearInterval(timer)
    }, 22)
    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35 }}
      className="inline-flex min-w-[5.5rem] flex-col items-center sm:min-w-0"
    >
      <span className="font-mono text-lg font-extrabold tabular-nums text-t1 sm:text-xl">{displayed}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-t3">{label}</span>
    </motion.span>
  )
}
