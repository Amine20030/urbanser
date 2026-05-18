'use client'

import dynamic from 'next/dynamic'
import { MapPinned, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MapView = dynamic(() => import('@/components/shared/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-sm text-t3">
      Chargement de la carte...
    </div>
  ),
})

export function LiveMapSection({ onSignaler }: Readonly<{ onSignaler?: () => void }>) {
  return (
    <section className="bg-bg-base py-10">
      <div className="page-shell">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm">
              <MapPinned className="h-3.5 w-3.5" />
              Carte en temps reel
            </p>
            <h2 className="text-2xl font-black tracking-tight text-t1">Signalements actifs a Marrakech</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-t2">
              Une vue operationnelle simple pour reperer les zones sensibles, les services concernes et les priorites.
            </p>
          </div>
          {onSignaler ? (
            <Button onClick={onSignaler} className="shrink-0">
              <Plus className="h-4 w-4" />
              Signaler ici
            </Button>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card p-2 shadow-card sm:p-3">
          <MapView height="min(62vh, 520px)" onMapClick={onSignaler} />
        </div>
      </div>
    </section>
  )
}
