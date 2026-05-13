'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Bell, Settings, User } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { ServiceCards } from '@/components/dashboard/ServiceCards'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { IncidentTable } from '@/components/dashboard/IncidentTable'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDate] = useState(() => {
    const date = new Date()
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  })

  return (
    <DashboardShell>
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/75 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-xs text-t2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Live · {currentDate}</span>
          </div>

          <div className="relative w-full max-w-md flex-1 lg:mx-6">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t3" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un incident, un secteur…"
              className="h-10 border-border/80 bg-card/80 pl-10 backdrop-blur-md"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="relative border-border/80 bg-card/80 backdrop-blur-md"
                onClick={() => setNotifOpen((o) => !o)}
                aria-label="Notifications"
                aria-expanded={notifOpen}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  2
                </span>
              </Button>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card/95 py-2 text-sm shadow-xl backdrop-blur-xl"
                >
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-t3">Notifications</p>
                  <ul className="max-h-48 overflow-y-auto">
                    <li className="border-t border-border px-3 py-2 text-t2">
                      Rapport quotidien UrbanOps (tâche planifiée côté serveur).
                    </li>
                    <li className="border-t border-border px-3 py-2 text-t2">
                      Vérifiez les incidents à forte criticité sur la carte.
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
            <Button className="hidden sm:inline-flex" onClick={() => setModalOpen(true)}>
              Signaler
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="border-border/80 bg-card/80 backdrop-blur-md"
              onClick={() => router.push('/parametres')}
              aria-label="Paramètres"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <div className="ml-1 flex items-center gap-2 border-l border-border pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-md">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden text-sm font-medium text-t1 sm:inline">Opérateur</span>
            </div>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="space-y-6 p-4 sm:p-6"
      >
        <KpiCards />
        <ServiceCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityChart />
          <AlertsPanel />
        </div>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Tous les incidents</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <IncidentTable filters={{ search: searchQuery }} />
          </CardContent>
        </Card>
      </motion.div>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardShell>
  )
}
