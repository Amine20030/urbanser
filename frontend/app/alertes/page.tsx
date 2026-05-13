'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ALERTS } from '@/lib/mockData'
import { getSeverityColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AlertesPage() {
  const highAlerts = ALERTS.filter((a) => a.severity === 'HIGH')
  const medAlerts = ALERTS.filter((a) => a.severity === 'MED')
  const lowAlerts = ALERTS.filter((a) => a.severity === 'LOW')

  const AlertGroup = ({
    title,
    alerts,
    severity,
    headerClass,
  }: {
    title: string
    alerts: typeof ALERTS
    severity: 'HIGH' | 'MED' | 'LOW'
    headerClass: string
  }) => {
    if (alerts.length === 0) return null

    return (
      <div className="mb-8">
        <div
          className={cn(
            'flex items-center justify-between rounded-t-xl px-4 py-3 text-sm font-bold text-white shadow-sm',
            headerClass
          )}
        >
          <h3>{title}</h3>
          <Badge variant="secondary" className="border-white/30 bg-white/15 text-white">
            {alerts.length}
          </Badge>
        </div>
        <Card className="rounded-t-none border-t-0 shadow-md">
          <CardContent className="space-y-2 p-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:border-primary/25"
              >
                <div
                  className="mt-0.5 h-full min-h-[48px] w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: getSeverityColor(severity) }}
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2 w-2 shrink-0 rounded-full',
                        severity === 'HIGH' && 'animate-pulse'
                      )}
                      style={{ backgroundColor: getSeverityColor(severity) }}
                    />
                    <h4 className="truncate text-sm font-semibold text-t1">{alert.title}</h4>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-t2">
                    <span>
                      {alert.service} <span className="text-t3">·</span> {alert.time}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-t2 transition-colors hover:bg-hover hover:text-t1"
                    >
                      <Check className="h-3 w-3" />
                      Marquer résolu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  const serviceAlertCounts = ALERTS.reduce(
    (acc, alert) => {
      acc[alert.service] = (acc[alert.service] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const maxCount = Math.max(...Object.values(serviceAlertCounts), 1)

  return (
    <DashboardShell>
      <main className="p-4 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-t1 sm:text-3xl">Alertes</h1>
          <p className="mt-1 text-sm text-t2">
            <span className="font-mono font-semibold text-red-500">{highAlerts.length}</span> critiques
            <span className="mx-2 text-t3">·</span>
            <span className="font-mono font-semibold text-amber-500">{medAlerts.length}</span> moyennes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <AlertGroup
              title="HAUTE CRITICITÉ"
              alerts={highAlerts}
              severity="HIGH"
              headerClass="bg-gradient-to-r from-red-600 to-rose-500"
            />
            <AlertGroup
              title="CRITICITÉ MOYENNE"
              alerts={medAlerts}
              severity="MED"
              headerClass="bg-gradient-to-r from-amber-500 to-orange-500"
            />
            <AlertGroup
              title="FAIBLE CRITICITÉ"
              alerts={lowAlerts}
              severity="LOW"
              headerClass="bg-gradient-to-r from-emerald-600 to-teal-500"
            />
          </div>

          <aside>
            <Card className="border-border/80 lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Par service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(serviceAlertCounts).map(([service, count]) => (
                  <div key={service}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-t2">{service}</span>
                      <span className="font-mono text-t1">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / maxCount) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </DashboardShell>
  )
}
