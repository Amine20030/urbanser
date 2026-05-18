'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

export function ServiceStatus({ intervalMs = 10000 }: { intervalMs?: number }) {
  const [online, setOnline] = useState<boolean | null>(null)
  const [checkedAt, setCheckedAt] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true

    const check = async () => {
      try {
        const res = await api.get('/stats/jms/status')
        if (!mounted) return
        // treat any 2xx response as online
        setOnline(Boolean(res.status && res.status >= 200 && res.status < 300))
        setCheckedAt(Date.now())
      } catch (e) {
        if (!mounted) return
        setOnline(false)
        setCheckedAt(Date.now())
      }
    }

    void check()
    const id = setInterval(check, intervalMs)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [intervalMs])

  let title = `Hors ligne · vérifié ${checkedAt ? new Date(checkedAt).toLocaleTimeString() : ''}`
  if (online === null) title = 'Vérification du statut…'
  else if (online) title = `Service en ligne · vérifié ${checkedAt ? new Date(checkedAt).toLocaleTimeString() : ''}`
  
  let ringColor = 'bg-amber-300/60'
  if (online) ringColor = 'animate-ping bg-emerald-400'
  else if (online === false) ringColor = 'bg-zinc-400/60'
  
  let dotColor = 'bg-amber-400'
  if (online) dotColor = 'bg-emerald-500'
  else if (online === false) dotColor = 'bg-zinc-500'
  
  let statusText = 'Hors ligne'
  if (online === null) statusText = 'Vérification…'
  else if (online) statusText = 'Service en ligne'

  return (
    <span className="ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-t2" title={title} aria-live="polite">
      <span className="relative flex h-2 w-2">
        <span
          className={
            'absolute inline-flex h-full w-full rounded-full opacity-75 ' + ringColor
          }
        />
        <span className={
          'relative inline-flex h-2 w-2 rounded-full ' + dotColor
        } />
      </span>
      <span className="text-sm font-semibold">
        {statusText}
      </span>
    </span>
  )
}

export default ServiceStatus
