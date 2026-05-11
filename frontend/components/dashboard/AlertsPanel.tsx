'use client'

import { AlertTriangle, Bell, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { alertAPI } from '@/lib/api'
import { getSeverityColor } from '@/lib/utils'

export function AlertsPanel() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    alertAPI.getRecent()
       .then(res => setData(res.data))
       .catch(err => setError(err.message))
       .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-48 bg-[var(--bg-card)] animate-pulse rounded-[10px] border border-[var(--border)]" />
  if (error) return <div className="p-4 rounded-[10px] bg-red-500/10 text-red-500 border border-red-500/20 max-h-48">Erreur alertes: {error}</div>

  const highAlerts = data.filter((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL')
  const otherAlerts = data.filter((a) => a.severity !== 'HIGH' && a.severity !== 'CRITICAL')

  return (
    <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-[var(--t1)]">Alertes récentes</h3>
        <div className="flex items-center gap-1 text-[var(--t3)]">
          <Bell className="w-3.5 h-3.5" />
          <span className="text-xs">{data.length}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {/* High priority alerts */}
        {highAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--t1)] font-medium line-clamp-1">
                  {alert.title}
                </p>
                <p className="text-[10px] text-[var(--t3)] mt-0.5">
                  {new Date(alert.sentAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Other alerts */}
        {otherAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] flex items-start justify-between gap-2"
          >
            <div className="flex items-start gap-2 flex-1">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: getSeverityColor(alert.severity) }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--t1)] line-clamp-1">
                  {alert.title}
                </p>
                <p className="text-[10px] text-[var(--t3)]">
                  {new Date(alert.sentAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button className="p-1 hover:bg-[var(--bg-base)] rounded transition-colors flex-shrink-0">
              <Check className="w-3 h-3 text-[var(--t3)]" />
            </button>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-xs text-[var(--t3)] text-center py-4">
            Aucune alerte active
          </p>
        )}
      </div>
    </div>
  )
}
