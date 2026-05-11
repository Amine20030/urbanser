'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { statsApi } from '@/lib/api'
import { HourlyActivity } from '@/lib/types'
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'

export function ActivityChart() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<HourlyActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    statsApi
      .getHourly()
      .then((res: { data: HourlyActivity[] }) => {
        setData(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les données')
        setLoading(false)
      })
  }, [])

  if (!mounted || loading) {
    return <ChartSkeleton />
  }

  if (error) {
    return (
      <div className="h-[250px]">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
      <h3 className="text-[13px] font-medium text-[var(--t1)] mb-4">
        Activité 24h / Évènements par service
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLighting" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="hour"
              stroke="var(--t3)"
              tick={{ fill: 'var(--t3)', fontSize: 10 }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--t3)"
              tick={{ fill: 'var(--t3)', fontSize: 10 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'var(--t1)' }}
              itemStyle={{ color: 'var(--t2)' }}
            />
            <Area
              type="monotone"
              dataKey="transport"
              stackId="1"
              stroke="#06b6d4"
              fill="url(#colorTransport)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="water"
              stackId="1"
              stroke="#8b5cf6"
              fill="url(#colorWater)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="waste"
              stackId="1"
              stroke="#22c55e"
              fill="url(#colorWaste)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="lighting"
              stackId="1"
              stroke="#f59e0b"
              fill="url(#colorLighting)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-[10px] text-[var(--t2)]">Transport</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[10px] text-[var(--t2)]">Eau</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-[var(--t2)]">Déchets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] text-[var(--t2)]">Éclairage</span>
        </div>
      </div>
    </div>
  )
}
