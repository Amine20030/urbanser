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
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    setMounted(true)

    const fetchData = () => {
      statsApi
        .getHourly()
        .then((res: { data: HourlyActivity[] }) => {
          setData([...res.data])
          setLastUpdated(new Date().toLocaleTimeString('fr-FR'))
          setError(null)
          setLoading(false)
        })
        .catch(() => {
          setError('Impossible de charger les données')
          setLoading(false)
        })
    }

    fetchData()

    const interval = setInterval(fetchData, 10000)

    return () => clearInterval(interval)
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
    <div className="p-5 rounded-[14px] bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
      <div className="mb-5">
        <h3 className="text-[15px] font-semibold text-[var(--t1)]">
          Activité (aujourd’hui)
        </h3>

        <p className="text-[12px] text-[var(--t2)] mt-1">
          Volume d’incidents par heure
        </p>

        <p className="text-[10px] text-[var(--t3)] mt-2">
          Dernière mise à jour : {lastUpdated}
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            key={lastUpdated}
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(234,88,12,0.12)"
            />

            <XAxis
              dataKey="hour"
              stroke="var(--t3)"
              tick={{ fill: 'var(--t3)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 12]}
              allowDecimals={false}
              stroke="var(--t3)"
              tick={{ fill: 'var(--t3)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              }}
              labelStyle={{ color: 'var(--t1)' }}
              itemStyle={{ color: '#ea580c' }}
            />

            <Area
              type="monotone"
              dataKey="count"
              stroke="#ea580c"
              fill="url(#colorIncidents)"
              strokeWidth={5}
              dot={{
                r: 6,
                fill: '#ea580c',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                fill: '#fb923c',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              isAnimationActive
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 mt-5">
        <span className="w-3 h-3 rounded-full bg-orange-600" />

        <span className="text-[11px] text-[var(--t2)]">
          Nombre d’incidents
        </span>
      </div>
    </div>
  )
}