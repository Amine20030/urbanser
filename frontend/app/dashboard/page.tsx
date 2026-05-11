'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Settings, User } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { ServiceCards } from '@/components/dashboard/ServiceCards'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { IncidentTable } from '@/components/dashboard/IncidentTable'
import { SignalerModal } from '@/components/shared/SignalerModal'

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDate] = useState(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
    return date.toLocaleDateString('fr-FR', options)
  })

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar />

      {/* Main content */}
      <main className="ml-[220px] min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border)] px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Live indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-[var(--t2)]">
                Live · {currentDate}
              </span>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un incident, un secteur..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                  aria-label="Notifications"
                  aria-expanded={notifOpen}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    2
                  </span>
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-xl z-50 py-2 text-sm">
                    <p className="px-3 py-2 text-[var(--t3)] text-xs uppercase tracking-wide">Notifications</p>
                    <ul className="max-h-48 overflow-y-auto">
                      <li className="px-3 py-2 text-[var(--t2)] border-t border-[var(--border)]">
                        Rapport quotidien UrbanOps (tâche planifiée côté serveur).
                      </li>
                      <li className="px-3 py-2 text-[var(--t2)] border-t border-[var(--border)]">
                        Vérifiez les incidents à forte criticité sur la carte.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <button onClick={() => setModalOpen(true)} className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                Signaler un problème
              </button>
              <button
                type="button"
                onClick={() => router.push('/parametres')}
                className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                aria-label="Paramètres"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-[var(--t1)]">OP</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 space-y-6">
          {/* KPI Cards */}
          <KpiCards />

          {/* Service Cards */}
          <ServiceCards />

          {/* Chart + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityChart />
            <AlertsPanel />
          </div>

          {/* Incidents Table */}
          <div className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]">
            <h3 className="text-[13px] font-medium text-[var(--t1)] mb-4">
              Tous les incidents
            </h3>
            <IncidentTable filters={{ search: searchQuery }} />
          </div>
        </div>
        <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </main>
    </div>
  )
}
