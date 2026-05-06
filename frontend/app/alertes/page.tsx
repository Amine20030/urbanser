'use client'

import { Check } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { ALERTS } from '@/lib/mockData'
import { getSeverityColor, getSeverityLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function AlertesPage() {
  const highAlerts = ALERTS.filter((a) => a.severity === 'HIGH')
  const medAlerts = ALERTS.filter((a) => a.severity === 'MED')
  const lowAlerts = ALERTS.filter((a) => a.severity === 'LOW')

  const AlertGroup = ({
    title,
    alerts,
    severity,
    headerColor,
  }: {
    title: string
    alerts: typeof ALERTS
    severity: 'HIGH' | 'MED' | 'LOW'
    headerColor: string
  }) => {
    if (alerts.length === 0) return null

    return (
      <div className="mb-6">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-t-lg"
          style={{ backgroundColor: headerColor }}
        >
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono">
            {alerts.length}
          </span>
        </div>
        <div className="space-y-2 p-4 rounded-b-lg bg-[var(--bg-card)] border border-[var(--border)] border-t-0">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)]"
            >
              {/* Severity bar */}
              <div
                className="w-1 h-full min-h-[50px] rounded-full"
                style={{ backgroundColor: getSeverityColor(severity) }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      severity === 'HIGH' && 'animate-pulse'
                    )}
                    style={{ backgroundColor: getSeverityColor(severity) }}
                  />
                  <h4 className="text-sm font-medium text-[var(--t1)] line-clamp-1">
                    {alert.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--t2)]">
                    <span>{alert.service}</span>
                    <span className="text-[var(--t3)]">·</span>
                    <span className="text-[var(--t3)]">{alert.time}</span>
                  </div>
                  <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--bg-base)] transition-colors">
                    <Check className="w-3 h-3" />
                    Marquer résolu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Stats by service
  const serviceAlertCounts = ALERTS.reduce((acc, alert) => {
    acc[alert.service] = (acc[alert.service] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const maxCount = Math.max(...Object.values(serviceAlertCounts))

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar />

      <main className="ml-[220px] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--t1)] mb-1">Alertes</h1>
            <p className="text-sm text-[var(--t2)]">
              <span className="text-red-400 font-mono">{highAlerts.length}</span> critiques
              <span className="text-[var(--t3)] mx-2">·</span>
              <span className="text-amber-400 font-mono">{medAlerts.length}</span> moyennes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main alert list */}
          <div className="lg:col-span-2">
            <AlertGroup
              title="HAUTE CRITICITÉ"
              alerts={highAlerts}
              severity="HIGH"
              headerColor="#ef4444"
            />
            <AlertGroup
              title="CRITICITÉ MOYENNE"
              alerts={medAlerts}
              severity="MED"
              headerColor="#f59e0b"
            />
            <AlertGroup
              title="FAIBLE CRITICITÉ"
              alerts={lowAlerts}
              severity="LOW"
              headerColor="#22c55e"
            />
          </div>

          {/* Stats sidebar */}
          <aside className="space-y-4">
            <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
              <h3 className="text-[13px] font-medium text-[var(--t1)] mb-4">
                Alertes par service
              </h3>
              <div className="space-y-3">
                {Object.entries(serviceAlertCounts).map(([service, count]) => (
                  <div key={service} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--t2)]">{service}</span>
                        <span className="text-xs font-mono text-[var(--t1)]">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--bg-hover)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
