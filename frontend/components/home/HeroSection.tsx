'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Camera, MapPinned } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignalerModal } from '@/components/shared/SignalerModal'

export function HeroSection({ onSignaler }: { onSignaler?: () => void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const openReporter = onSignaler ?? (() => setModalOpen(true))

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-stone-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,25,23,0.82),rgba(28,25,23,0.54)_48%,rgba(28,25,23,0.30))]" />
      <div className="moroccan-tile absolute inset-0 opacity-[0.08]" />

      <div className="page-shell relative grid min-h-[calc(100vh-4rem)] items-center py-16">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center rounded-full border border-orange-200/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-100 backdrop-blur-md">
            Marrakech - Supervision urbaine intelligente
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">
            La ville signale.
            <span className="block text-orange-200">Les services repondent.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/74 sm:text-lg">
            Photographiez un probleme urbain, localisez-le, puis suivez son traitement depuis une interface claire
            pensee pour Marrakech.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 px-6" onClick={openReporter}>
              <Camera className="h-4 w-4" />
              Signaler maintenant
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/25 bg-white/8 px-6 text-white hover:bg-white/14"
              asChild
            >
              <Link href="/carte">
                <MapPinned className="h-4 w-4" />
                Voir la carte
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['1 284', 'Signalements'],
              ['89%', 'Resolus'],
              ['2 min', 'Analyse IA'],
              ['8', 'Secteurs'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-2xl font-black text-orange-100">{n}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/52">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
