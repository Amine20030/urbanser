'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { statsAPI } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ActivityChart() {
  const [data, setData] = useState<{ hour: number; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsAPI
      .getHourly()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Skeleton className="h-[280px] w-full rounded-xl" />
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
        Erreur graphique : {error}
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1)

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Activité (aujourd&apos;hui)</CardTitle>
        <CardDescription>Volume d&apos;incidents par heure</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-44 items-end gap-1">
          {data.map((item, idx) => (
            <div key={idx} className="group relative flex flex-1 flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(6, (item.count / maxValue) * 100)}%` }}
                transition={{ delay: idx * 0.02, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full min-h-[6px] rounded-t-md bg-gradient-to-t from-sky-600/80 to-cyan-400/90 opacity-90 shadow-sm group-hover:opacity-100"
                title={`${item.count} incident(s) à ${item.hour}h`}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-wide text-t3">
          <span>{data[0]?.hour}h</span>
          <span>{data[Math.floor(data.length / 2)]?.hour}h</span>
          <span>{data[data.length - 1]?.hour}h</span>
        </div>
      </CardContent>
    </Card>
  )
}
