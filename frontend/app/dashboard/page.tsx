'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { ServiceCards } from '@/components/dashboard/ServiceCards'
import { IncidentTable } from '@/components/dashboard/IncidentTable'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import api, { alertAPI, authAPI } from '@/lib/api'
import { canAccessAdminDashboard, getStoredUser, getTokenPayload } from '@/lib/auth'
import { getSeverityColor } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MapView = dynamic(() => import('@/components/shared/MapView'), {
  ssr: false,
  loading: () => (
    <motion.div className="flex h-[min(70vh,640px)] items-center justify-center rounded-xl border border-border bg-card text-sm text-t3">
      Chargement de la carte…
    </motion.div>
  ),
})

type Tab = 'overview' | 'incidents' | 'alerts' | 'users' | 'map' | 'settings'

type AlertRow = {
  id: number
  incidentId?: number
  incidentReference?: string
  severity: string
  title: string
  message?: string
  sentTo?: string
  sentAt?: string
  acknowledged?: boolean
}

type UserRow = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  isActive?: boolean
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: "Vue d'ensemble" },
  { id: 'incidents', label: 'Incidents' },
  { id: 'alerts', label: 'Alertes' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'map', label: 'Carte' },
  { id: 'settings', label: 'Paramètres' },
]

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const activeTab: Tab =
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : 'overview'

  const [authReady, setAuthReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [users, setUsers] = useState<UserRow[]>([])
  const [alerts, setAlerts] = useState<AlertRow[]>([])
  const [profile, setProfile] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    role?: string
    phone?: string
    sector?: string
  } | null>(null)
  const [confirmUserId, setConfirmUserId] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('urbanops_token')
    if (!token) {
      router.push('/auth/signin')
      return
    }
    if (!canAccessAdminDashboard()) {
      router.push('/mes-signalements')
      return
    }
    const stored = getStoredUser()
    const payload = getTokenPayload()
    if (stored) setProfile(stored)
    else if (payload?.sub)
      setProfile({ email: String(payload.sub), firstName: String(payload.firstName ?? 'Admin') })
    setAuthReady(true)
  }, [router])

  const fetchData = useCallback(async () => {
    if (!localStorage.getItem('urbanops_token') || !canAccessAdminDashboard()) return
    setLoading(true)
    setFetchError(null)
    try {
      const [i, u, a, me] = await Promise.all([
        api.get('/incidents?page=0&size=50&sortBy=createdAt&sortDir=desc'),
        api.get('/users?page=0&size=50'),
        api.get('/alerts?page=0&size=50'),
        authAPI.getMe().catch(() => null),
      ])
      const iList = i.data?.content ?? (Array.isArray(i.data) ? i.data : [])
      setIncidents(Array.isArray(iList) ? iList : [])
      setUsers(u.data?.content ?? (Array.isArray(u.data) ? u.data : []))
      setAlerts(a.data?.content ?? (Array.isArray(a.data) ? a.data : []))
      if (me?.data) {
        setProfile(me.data)
        localStorage.setItem('urbanops_user', JSON.stringify(me.data))
      }
    } catch (e: unknown) {
      const ax = e as { response?: { status?: number; data?: { message?: string } } }
      if (ax.response?.status === 401) {
        router.push('/auth/signin')
        return
      }
      setFetchError(ax.response?.data?.message || 'Impossible de charger les données du tableau de bord.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (authReady) fetchData()
  }, [authReady, fetchData])

  const setTab = (t: Tab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', t)
    router.push(`/dashboard?${params.toString()}`)
  }

  const changeIncidentStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/incidents/${id}/status`, { status })
      await fetchData()
    } catch {
      setFetchError('Échec de la mise à jour du statut.')
    }
  }

  const deactivateUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`)
      setConfirmUserId(null)
      await fetchData()
    } catch {
      setFetchError('Impossible de désactiver cet utilisateur.')
    }
  }

  const acknowledgeAlert = async (id: number) => {
    try {
      await alertAPI.acknowledge(id)
      await fetchData()
    } catch {
      setFetchError('Impossible de valider l’alerte.')
    }
  }

  const logout = () => {
    localStorage.removeItem('urbanops_token')
    localStorage.removeItem('urbanops_user')
    router.push('/')
  }

  const unackedAlerts = alerts.filter((a) => !a.acknowledged).length
  const tabTitle = TABS.find((t) => t.id === activeTab)?.label ?? 'Tableau de bord'

  return (
    <DashboardShell className="flex flex-col">
      <header className="border-b border-border bg-card/75 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-t1">{tabTitle}</h1>
            <p className="mt-0.5 text-sm text-t3">
              Supervision urbaine — données en direct depuis l’API UrbanOps.
            </p>
          </motion.div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            disabled={loading}
            className="shrink-0 gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Actualiser
          </Button>
        </div>

        <nav className="mt-4 flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/30'
                  : 'text-t2 hover:bg-muted hover:text-t1'
              }`}
            >
              {t.label}
              {t.id === 'alerts' && unackedAlerts > 0 && (
                <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unackedAlerts}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        {fetchError && (
          <div className="mb-4 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {fetchError}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <KpiCards />
            <ServiceCards />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ActivityChart />
              <AlertsPanel key={loading ? 'loading' : 'ready'} />
            </div>
            <Card className="border-border/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Derniers incidents</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setTab('incidents')}>
                  Voir tout →
                </Button>
              </CardHeader>
              <CardContent>
                {loading && incidents.length === 0 ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <IncidentTable
                    incidents={incidents.slice(0, 8)}
                    isAdmin
                    changeStatus={changeIncidentStatus}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'incidents' && (
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>Tous les incidents ({incidents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && incidents.length === 0 ? (
                <motion.div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </motion.div>
              ) : (
                <IncidentTable incidents={incidents} isAdmin changeStatus={changeIncidentStatus} />
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {(['HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => {
              const group = alerts.filter((a) => a.severity === sev)
              if (group.length === 0) return null
              const labels = { HIGH: 'Haute criticité', MEDIUM: 'Moyenne', LOW: 'Faible' }
              return (
                <Card key={sev} className="overflow-hidden border-border/80">
                  <div
                    className="flex items-center justify-between px-4 py-3 text-sm font-bold text-white"
                    style={{ backgroundColor: getSeverityColor(sev) }}
                  >
                    <span>{labels[sev]}</span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{group.length}</span>
                  </div>
                  <CardContent className="divide-y divide-border p-0">
                    {group.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary">
                              {alert.incidentReference ?? `#${alert.incidentId}`}
                            </span>
                            {alert.acknowledged && (
                              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                Acquittée
                              </span>
                            )}
                          </div>
                          <p className="mt-1 font-semibold text-t1">{alert.title}</p>
                          {alert.message && (
                            <p className="mt-1 text-sm text-t2">{alert.message}</p>
                          )}
                          <p className="mt-2 text-xs text-t3">
                            {alert.sentTo && <>→ {alert.sentTo} · </>}
                            {alert.sentAt
                              ? new Date(alert.sentAt).toLocaleString('fr-FR')
                              : '—'}
                          </p>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Acquitter
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
            {!loading && alerts.length === 0 && (
              <p className="py-16 text-center text-sm text-t3">Aucune alerte enregistrée.</p>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Utilisateurs ({users.length})</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/utilisateurs">Gestion avancée</Link>
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-t3">
                    <th className="pb-3 pr-4">Nom</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Rôle</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => {
                    const isAdmin = u.role === 'ADMIN'
                    const inactive = u.isActive === false
                    return (
                      <tr key={u.id} className={inactive ? 'opacity-50' : ''}>
                        <td className="py-3 pr-4 font-medium text-t1">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="py-3 pr-4 text-t2">{u.email}</td>
                        <td className="py-3 pr-4 text-t2">{u.role}</td>
                        <td className="py-3">
                          {!inactive && !isAdmin && (
                            confirmUserId === u.id ? (
                              <span className="flex gap-2">
                                <Button size="sm" variant="destructive" onClick={() => deactivateUser(u.id)}>
                                  Confirmer
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setConfirmUserId(null)}>
                                  Annuler
                                </Button>
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => setConfirmUserId(u.id)}
                              >
                                Désactiver
                              </Button>
                            )
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {!loading && users.length === 0 && (
                <p className="py-12 text-center text-t3">Aucun utilisateur.</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'map' && (
          <Card className="overflow-hidden border-border/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Carte des incidents</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/carte">Plein écran</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
              <div className="h-[min(70vh,640px)] w-full overflow-hidden rounded-xl border border-border">
                <MapView />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="mx-auto max-w-xl border-border/80">
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile ? (
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-t3">Nom</dt>
                    <dd className="mt-1 text-t1">
                      {profile.firstName} {profile.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-t3">Email</dt>
                    <dd className="mt-1 font-mono text-t1">{profile.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-t3">Rôle</dt>
                    <dd className="mt-1 text-t1">{profile.role}</dd>
                  </div>
                  {profile.phone && (
                    <div>
                      <dt className="text-xs font-semibold uppercase text-t3">Téléphone</dt>
                      <dd className="mt-1 text-t1">{profile.phone}</dd>
                    </div>
                  )}
                  {profile.sector && (
                    <div>
                      <dt className="text-xs font-semibold uppercase text-t3">Secteur</dt>
                      <dd className="mt-1 text-t1">{profile.sector}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-t3">Chargement du profil…</p>
              )}
              <div className="flex flex-wrap gap-3 border-t border-border pt-6">
                <Button variant="destructive" onClick={logout}>
                  Se déconnecter
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/parametres">Page paramètres</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </DashboardShell>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-t3">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Chargement du tableau de bord…
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
