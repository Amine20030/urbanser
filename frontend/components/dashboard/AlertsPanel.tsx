'use client'

import { AlertTriangle, Bell, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { alertAPI } from '@/lib/api'
import { getSeverityColor } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

type AlertItem = { id: number | string; title: string; severity: string; sentAt: string }

function renderAlertActions(alert: AlertItem, onAck: (id: number) => void) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0"
      aria-label="Acquitter"
      onClick={() => {
        const id = Number(alert.id)
        if (!Number.isNaN(id)) {
          onAck(id)
        }
      }}
    >
      <Check className="h-3.5 w-3.5 text-t3" />
    </Button>
  )
}

export function AlertsPanel() {
  const [data, setData] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshAlerts = () => {
    alertAPI.getRecent().then((res) => setData(res.data))
  }

  const handleAcknowledge = (id: number) => {
    alertAPI.acknowledge(id).then(() => refreshAlerts())
  }

  useEffect(() => {
    alertAPI
      .getRecent()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton className="h-[280px] w-full rounded-xl" />
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
        Erreur alertes : {error}
      </div>
    )
  }

  const highAlerts = data.filter((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL')
  const otherAlerts = data.filter((a) => a.severity !== 'HIGH' && a.severity !== 'CRITICAL')

  return (
    <Card className="border-border/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Alertes récentes</CardTitle>
        <div className="flex items-center gap-1 text-t3">
          <Bell className="h-3.5 w-3.5" />
          <span className="text-xs font-mono">{data.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
          {highAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-3"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-snug text-t1">{alert.title}</p>
                  <p className="mt-0.5 text-[10px] text-t3">{new Date(alert.sentAt).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {otherAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start justify-between gap-2 rounded-xl border border-border bg-muted/40 p-3"
            >
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: getSeverityColor(alert.severity) }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-snug text-t1">{alert.title}</p>
                  <p className="text-[10px] text-t3">{new Date(alert.sentAt).toLocaleString()}</p>
                </div>
              </div>
              {renderAlertActions(alert, handleAcknowledge)}
            </div>
          ))}

          {data.length === 0 && <p className="py-6 text-center text-xs text-t3">Aucune alerte active</p>}
        </div>
      </CardContent>
    </Card>
  )
}
