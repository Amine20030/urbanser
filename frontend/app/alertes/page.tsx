'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { alertAPI } from '@/lib/api'
import { canAccessAdminDashboard } from '@/lib/auth'
import { getSeverityColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type AlertRow = {
  id: number
  incidentId?: number
  incidentReference?: string
  severity: string
  title: string
  message?: string
  sentTo?: string
  sentAt?: string
  acknowledged?: boolean
}

const SEVERITY_ORDER = ['HIGH', 'MEDIUM', 'LOW'] as const
const SEVERITY_LABELS: Record<string, string> = {
  HIGH: 'HAUTE CRITICITÉ',
  MEDIUM: 'CRITICITÉ MOYENNE',
  LOW: 'FAIBLE CRITICITÉ',
}
const HEADER_GRADIENT: Record<string, string> = {
  HIGH: 'bg-red-700',
  MEDIUM: 'bg-amber-600',
  LOW: 'bg-emerald-700',
}

export default function AlertesPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<AlertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await alertAPI.getAll({ page: 0, size: 100 })
      const list = res.data?.content ?? (Array.isArray(res.data) ? res.data : [])
      setAlerts(list)
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { message?: string } } }
      if (ax.response?.status === 401 || ax.response?.status === 403) {
        router.push('/auth/signin')
        return
      }
      setError(ax.response?.data?.message || 'Impossible de charger les alertes.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('urbanops_token')
    if (!token) {
      router.push('/auth/signin')
      return
    }
    if (!canAccessAdminDashboard()) {
      router.push('/mes-signalements')
      return
    }
    loadAlerts()
  }, [router, loadAlerts])

  const acknowledge = async (id: number) => {
    try {
      await alertAPI.acknowledge(id)
      await loadAlerts()
    } catch {
      setError('Échec de l’acquittement.')
    }
  }

  const bySeverity = (sev: string) => alerts.filter((a) => a.severity === sev)
  const highCount = bySeverity('HIGH').length
  const medCount = bySeverity('MEDIUM').length
  const lowCount = bySeverity('LOW').length

  const serviceCounts = alerts.reduce(
    (acc, a) => {
      const key = a.sentTo?.split('@')[1]?.split('.')[0] ?? a.sentTo ?? 'Autre'
      acc[key] = (acc[key] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const maxService = Math.max(...Object.values(serviceCounts), 1)

  return (
    <DashboardShell>
      <main className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-t1 sm:text-3xl">Alertes</h1>
            <p className="mt-1 text-sm text-t2">
              <span className="font-mono font-semibold text-red-500">{highCount}</span> critiques
              <span className="mx-2 text-t3">·</span>
              <span className="font-mono font-semibold text-amber-500">{medCount}</span> moyennes
              <span className="mx-2 text-t3">·</span>
              <span className="font-mono font-semibold text-emerald-500">{lowCount}</span> faibles
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadAlerts} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Actualiser
          </Button>
        </motion.div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && alerts.length === 0 ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {SEVERITY_ORDER.map((sev) => {
                const group = bySeverity(sev)
                if (group.length === 0) return null
                return (
                  <div key={sev}>
                    <div
                      className={cn(
                        'flex items-center justify-between rounded-t-xl px-4 py-3 text-sm font-bold text-white shadow-sm',
                        HEADER_GRADIENT[sev]
                      )}
                    >
                      <h3>{SEVERITY_LABELS[sev]}</h3>
                      <Badge variant="secondary" className="border-white/30 bg-white/15 text-white">
                        {group.length}
                      </Badge>
                    </div>
                    <Card className="rounded-t-none border-t-0 shadow-card">
                      <CardContent className="space-y-2 p-4">
                        {group.map((alert) => (
                          <div
                            key={alert.id}
                            className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <motion.div
                                className="mt-1 h-full min-h-[40px] w-1 shrink-0 rounded-full"
                                style={{ backgroundColor: getSeverityColor(sev) }}
                              />
                              <div className="min-w-0">
                                <motion.div className="mb-1 flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-primary">
                                    {alert.incidentReference ?? `#${alert.incidentId}`}
                                  </span>
                                  {alert.acknowledged && (
                                    <span className="text-[10px] font-bold text-emerald-600">
                                      Acquittée
                                    </span>
                                  )}
                                </motion.div>
                                <h4 className="text-sm font-semibold text-t1">{alert.title}</h4>
                                {alert.message && (
                                  <p className="mt-1 text-xs text-t2">{alert.message}</p>
                                )}
                                <p className="mt-2 text-[11px] text-t3">
                                  {alert.sentTo && <>{alert.sentTo} · </>}
                                  {alert.sentAt
                                    ? new Date(alert.sentAt).toLocaleString('fr-FR')
                                    : '—'}
                                </p>
                              </div>
                            </div>
                            {!alert.acknowledged && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="shrink-0 gap-1"
                                onClick={() => acknowledge(alert.id)}
                              >
                                <Check className="h-3.5 w-3.5" />
                                Acquitter
                              </Button>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
              {alerts.length === 0 && !error && (
                <p className="py-16 text-center text-sm text-t3">Aucune alerte pour le moment.</p>
              )}
            </div>

            <aside>
              <Card className="border-border/80 lg:sticky lg:top-24">
                <CardContent className="space-y-4 p-4 pt-6">
                  <h3 className="text-sm font-bold text-t1">Par destinataire</h3>
                  {Object.keys(serviceCounts).length === 0 ? (
                    <p className="text-xs text-t3">—</p>
                  ) : (
                    Object.entries(serviceCounts).map(([service, count]) => (
                      <div key={service}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="truncate text-t2">{service}</span>
                          <span className="font-mono text-t1">{count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / maxService) * 100}%` }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </main>
    </DashboardShell>
  )
}
