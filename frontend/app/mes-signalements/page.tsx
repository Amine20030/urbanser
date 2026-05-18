'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { canAccessAdminDashboard } from '@/lib/auth'

type IncidentRow = {
  id: number
  referenceCode: string
  title: string
  severity: string
  status: string
  createdAt: string
  sector?: { name?: string }
  category?: { name?: string }
}

function statusLabel(status: string) {
  if (status === 'OPEN') return { text: 'Ouvert', emoji: '🔴' }
  if (status === 'IN_PROGRESS') return { text: 'En cours', emoji: '🟡' }
  return { text: 'Résolu', emoji: '✅' }
}

function severityStyles(severity: string) {
  if (severity === 'HIGH') return 'bg-red-500/15 text-red-600 dark:text-red-400'
  if (severity === 'MEDIUM') return 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
  return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
}

export default function MesSignalementsPage() {
  const router = useRouter()
  const [incidents, setIncidents] = useState<IncidentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('urbanops_token')
    if (!token) {
      router.push('/auth/signin')
      return
    }
    if (canAccessAdminDashboard()) {
      router.push('/dashboard')
      return
    }
    fetchMyIncidents()
  }, [router])

  const fetchMyIncidents = async () => {
    try {
      setLoading(true)
      const res = await api.get('/incidents/my')
      setIncidents(res.data || [])
    } catch (e) {
      console.error('Failed to fetch incidents', e)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = incidents.length
    const open = incidents.filter((i) => i.status === 'OPEN').length
    const inProgress = incidents.filter((i) => i.status === 'IN_PROGRESS').length
    const resolved = incidents.filter((i) => i.status === 'RESOLVED').length
    return { total, open, inProgress, resolved }
  }, [incidents])

  const kpiCards = [
    { label: 'Mes signalements', value: stats.total, icon: '📋' },
    { label: 'Ouverts', value: stats.open, icon: '🔴' },
    { label: 'En cours', value: stats.inProgress, icon: '🟡' },
    { label: 'Résolus', value: stats.resolved, icon: '✅' },
  ]

  return (
    <DashboardShell>
      <main className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-t1">Tableau de bord</h1>
            <p className="mt-1 text-sm text-t3">
              Suivez vos signalements et l&apos;avancement des interventions.
            </p>
          </motion.div>
          <Button onClick={() => setModalOpen(true)}>+ Nouveau signalement</Button>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? kpiCards.map((card) => (
                <Skeleton key={`kpi-skeleton-${card.label}`} className="h-28 rounded-xl" />
              ))
            : kpiCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-border/80">
                    <CardContent className="flex items-center gap-4 p-5">
                      <span className="text-2xl">{card.icon}</span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-t3">
                          {card.label}
                        </p>
                        <p className="text-2xl font-bold tabular-nums text-t1">{card.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        <Card className="border-border/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mes signalements</CardTitle>
            <Link href="/carte" className="text-sm font-medium text-primary hover:underline">
              Voir la carte →
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <motion.div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </motion.div>
            ) : incidents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <p className="text-4xl">📭</p>
                <h2 className="mt-4 text-lg font-semibold text-t1">
                  Aucun signalement pour le moment
                </h2>
                <p className="mt-2 text-sm text-t3">
                  Signalez un problème dans votre quartier pour contribuer à Marrakech.
                </p>
                <Button className="mt-6" onClick={() => setModalOpen(true)}>
                  Faire mon premier signalement
                </Button>
              </motion.div>
            ) : (
              <motion.div className="space-y-3">
                {incidents.map((inc) => {
                  const st = statusLabel(inc.status)
                  return (
                    <motion.div
                      key={inc.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <motion.div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">
                            {inc.referenceCode}
                          </span>
                          <span className="font-semibold text-t1">{inc.title}</span>
                        </motion.div>
                        <p className="mt-2 text-xs text-t3">
                          {new Date(inc.createdAt).toLocaleDateString('fr-FR')} ·{' '}
                          {inc.sector?.name ?? 'Secteur inconnu'} ·{' '}
                          {inc.category?.name ?? 'Autre'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${severityStyles(inc.severity)}`}
                        >
                          {inc.severity}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase text-t2">
                          {st.emoji} {st.text}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </main>

      <SignalerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          fetchMyIncidents()
        }}
      />
    </DashboardShell>
  )
}
