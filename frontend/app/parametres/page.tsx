'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StoredUser = {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
}

export default function ParametresPage() {
  const router = useRouter()
  const [user, setUser] = useState<StoredUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('urbanops_user')
      setUser(raw ? (JSON.parse(raw) as StoredUser) : null)
    } catch {
      setUser(null)
    }
  }, [])

  function logout() {
    localStorage.removeItem('urbanops_token')
    localStorage.removeItem('urbanops_user')
    router.push('/')
  }

  return (
    <DashboardShell>
      <main className="mx-auto max-w-2xl p-4 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-t1">Paramètres</h1>
          <p className="mt-1 text-sm text-t3">Session locale et préférences.</p>
        </motion.div>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Profil (navigateur)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user ? (
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
              </dl>
            ) : (
              <p className="text-sm text-t3">Non connecté — connectez-vous pour afficher le profil.</p>
            )}

            <div className="flex flex-wrap gap-3 border-t border-border pt-6">
              <Button variant="destructive" onClick={logout}>
                Se déconnecter sur cet appareil
              </Button>
              <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </DashboardShell>
  )
}
