'use client'

import { getSeverityColor } from '@/lib/utils'
import { INCIDENTS } from '@/lib/mockData'

interface MapViewProps {
  incidents?: typeof INCIDENTS
  height?: string
}

export function MapView({ incidents = INCIDENTS, height = '400px' }: MapViewProps) {
  return (
    <div
      className="relative w-full bg-[var(--bg-card)] overflow-hidden"
      style={{ height }}
    >
      {/* Map background with grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] to-[#0e1218]">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-white/20"
              style={{ top: `${(i + 1) * 10}%` }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>

        {/* Marrakech label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-sm font-medium text-[var(--t2)]">Marrakech</span>
          <p className="text-xs text-[var(--t3)] mt-1">{incidents.length} incidents</p>
        </div>

        {/* Incident dots */}
        {incidents.slice(0, 8).map((incident, idx) => (
          <div
            key={incident.id}
            className="absolute w-3 h-3 rounded-full animate-pulse"
            style={{
              left: `${15 + (idx % 4) * 20}%`,
              top: `${25 + Math.floor(idx / 4) * 30}%`,
              backgroundColor: getSeverityColor(incident.severity),
              boxShadow: `0 0 10px ${getSeverityColor(incident.severity)}`,
            }}
            title={incident.title}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
        {[
          { color: '#ef4444', label: 'Critique' },
          { color: '#f59e0b', label: 'Élevé' },
          { color: '#3b82f6', label: 'Moyen' },
          { color: '#22c55e', label: 'Faible' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-[var(--t3)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
