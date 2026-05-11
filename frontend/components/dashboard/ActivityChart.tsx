'use client'

import { useState, useEffect } from 'react'
import { statsAPI } from '@/lib/api'

export function ActivityChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsAPI.getHourly()
       .then(res => setData(res.data))
       .catch(err => setError(err.message))
       .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-[238px] bg-[var(--bg-card)] animate-pulse rounded-[10px] border border-[var(--border)]" />
  if (error) return <div className="p-4 rounded-[10px] bg-red-500/10 text-red-500 border border-red-500/20 max-h-[238px]">Erreur chart: {error}</div>

  const maxValue = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-[var(--t1)]">
          Activité (Aujourd'hui)
        </h3>
        <span className="text-xs text-[var(--t3)]">Incidents par heure</span>
      </div>

      <div className="h-40 flex items-end gap-1 mb-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t"
              style={{ height: `${(item.count / maxValue) * 100}%` }}
              title={`${item.count} incidents à ${item.hour}h`}
            />
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[10px] text-[var(--t3)] uppercase">
        <span className="flex-1 text-left">{data[0]?.hour}h</span>
        <span className="flex-1 text-center">{data[Math.floor(data.length/2)]?.hour}h</span>
        <span className="flex-1 text-right">{data[data.length-1]?.hour}h</span>
      </div>
    </div>
  )
}
