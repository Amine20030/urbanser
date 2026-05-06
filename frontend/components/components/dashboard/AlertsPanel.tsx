'use client'

import { ALERTS } from '@/lib/mockData'
import { getSeverityColor } from '@/lib/utils'

export function AlertsPanel() {
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
        {ALERTS.map((alert, index) => (
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
                <span>{alert.service}</span>
                <span className="text-[var(--t3)]">·</span>
                <span className="text-[var(--t3)]">{alert.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
