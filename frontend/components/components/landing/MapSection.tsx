'use client'

import { useState } from 'react'
import { MapView } from '@/components/shared/MapView'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { INCIDENTS } from '@/lib/mockData'
import { getSeverityColor } from '@/lib/utils'

export function MapSection() {
  const [isSignalerOpen, setIsSignalerOpen] = useState(false)
  const [clickLocation, setClickLocation] = useState<{ lat: number; lng: number } | undefined>()

  const handleMapClick = (lat: number, lng: number) => {
    setClickLocation({ lat, lng })
    setIsSignalerOpen(true)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--t1)] mb-1">
              Carte des incidents
            </h2>
            <p className="text-sm text-[var(--t2)]">
              📍 {INCIDENTS.length} signalements actifs sur Marrakech
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSeverityColor('HIGH') }}
              />
              <span className="text-[var(--t2)]">Haute</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSeverityColor('MED') }}
              />
              <span className="text-[var(--t2)]">Moyenne</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSeverityColor('LOW') }}
              />
              <span className="text-[var(--t2)]">Faible</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-[12px] overflow-hidden border border-[var(--border)] opacity-0 animate-fade-up delay-100">
          <MapView
            incidents={INCIDENTS}
            height="520px"
            onMapClick={handleMapClick}
          />
        </div>

        {/* Map hint */}
        <p className="text-center text-xs text-[var(--t3)] mt-4">
          Cliquez n&apos;importe où sur la carte pour signaler un problème
        </p>
      </div>

      <SignalerModal
        isOpen={isSignalerOpen}
        onClose={() => setIsSignalerOpen(false)}
        initialLocation={clickLocation}
      />
    </section>
  )
}
