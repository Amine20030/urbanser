'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const MapView = dynamic(() => import('@/components/shared/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-t3">
      Chargement de la carte de Marrakech…
    </div>
  ),
})

export function MapSection() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-t1 sm:text-3xl">Carte des incidents</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-t2 sm:text-base">
            Visualisez les signalements, la criticité et les zones d&apos;activité — zoom, déplacements et popups
            interactifs.
          </p>
        </motion.div>

        <Card className="overflow-hidden border-border/80 shadow-card">
          <CardHeader className="border-b border-border/60 bg-muted/30 pb-4">
            <CardTitle className="text-base sm:text-lg">Vue opérationnelle</CardTitle>
            <CardDescription>Données rafraîchies automatiquement depuis l&apos;API UrbanOps.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <MapView height="480px" showAllStatuses />
            <div className="mt-6 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/incidents">Voir tous les incidents</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
