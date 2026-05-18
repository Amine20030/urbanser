'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authAPI } from '@/lib/api'
import { getDashboardPath } from '@/lib/auth'

type UserProfile = {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  phone?: string
  sector?: string
}

export default function ParametresPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('urbanops_token')
    if (!token) {
      router.push('/auth/signin')
      return
    }

    authAPI
      .getMe()
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('urbanops_user', JSON.stringify(res.data))
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem('urbanops_user')
          if (raw) setUser(JSON.parse(raw) as UserProfile)
          else setError('Impossible de charger le profil. Reconnectez-vous.')
        } catch {
          setError('Impossible de charger le profil.')
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  function logout() {
    localStorage.removeItem('urbanops_token')
    localStorage.removeItem('urbanops_user')
    globalThis.dispatchEvent(new Event('urbanops-auth-changed'))
    router.push('/')
  }

  return (
    <DashboardShell>
      <main className="mx-auto max-w-2xl p-4 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-t1">Paramètres</h1>
          <p className="mt-1 text-sm text-t3">Profil connecté via l’API UrbanOps.</p>
        </motion.div>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Mon compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {error && !loading && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {!loading && user && (
              <dl className="space-y-4 text-sm text-t2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Nom</dt>
                  <dd className="mt-1 text-t1">
                    {user.firstName} {user.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Email</dt>
                  <dd className="mt-1 font-mono text-t1">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Rôle</dt>
                  <dd className="mt-1 text-t1">{user.role}</dd>
                </div>
                {user.phone && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Téléphone</dt>
                    <dd className="mt-1 text-t1">{user.phone}</dd>
                  </div>
                )}
                {user.sector && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-t3">Secteur</dt>
                    <dd className="mt-1 text-t1">{user.sector}</dd>
                  </div>
                )}
              </dl>
            )}

            {!loading && !user && !error && (
              <p className="text-sm text-t3">Aucune donnée de profil.</p>
            )}

            <div className="flex flex-wrap gap-3 border-t border-border pt-6">
              <Button variant="destructive" onClick={logout}>
                Se déconnecter
              </Button>
              <Button variant="secondary" onClick={() => router.push(getDashboardPath())}>
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </DashboardShell>
  )
}
