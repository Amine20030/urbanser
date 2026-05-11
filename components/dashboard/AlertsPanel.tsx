'use client'

import { useState, useEffect } from 'react'
import { alertApi } from '@/lib/api'
import { Alert } from '@/lib/types'
import { getSeverityColor } from '@/lib/utils'
import { AlertSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState, EmptyState } from '@/components/shared/ErrorState'

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    alertApi
      .getRecent()
      .then((res: { data: Alert[] }) => {
        setAlerts(res.data.slice(0, 6))
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les alertes')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-medium text-[var(--t1)]">Alertes en direct</h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <AlertSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] h-full">
        <ErrorState message={error} />
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-medium text-[var(--t1)]">Alertes en direct</h3>
        </div>
        <EmptyState message="Aucune alerte récente" />
      </div>
    )
  }

  return (
    <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-[var(--t1)]">
          Alertes en direct
        </h3>
        <span className="text-[9px] uppercase tracking-[1px] text-[var(--t3)] font-mono">
          Notifications prioritaires
        </span>
      </div>

      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] animate-slide-in-right"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Severity indicator */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-3 h-3 rounded-full ${
                  alert.severity === 'HIGH' ? 'animate-pulse' : ''
                }`}
                style={{ backgroundColor: getSeverityColor(alert.severity) }}
              />
              <div
                className="w-1 h-full rounded-full min-h-[40px]"
                style={{ backgroundColor: `${getSeverityColor(alert.severity)}20` }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-[var(--t1)] mb-1 line-clamp-1">
                {alert.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-[var(--t2)]">
                <span>{alert.incident.title}</span>
                <span className="text-[var(--t3)]">·</span>
                <span className="text-[var(--t3)]">{new Date(alert.sentAt).toLocaleTimeString('fr-FR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
