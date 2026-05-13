'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { userAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type UserRow = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  sector?: string | null
}

export default function UtilisateursPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [forbidden, setForbidden] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userAPI
      .getAll({ page: 0, size: 100 })
      .then((res) => {
        const page = res.data as { content?: UserRow[] }
        setUsers(page.content ?? [])
      })
      .catch((err: { response?: { status?: number; data?: { message?: string } } }) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setForbidden(true)
        } else {
          setError(err.response?.data?.message || 'Impossible de charger les utilisateurs.')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardShell>
      <main className="p-4 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-t1">Utilisateurs</h1>
          <p className="mt-1 text-sm text-t3">Liste des comptes (administrateurs).</p>
        </motion.div>

        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        )}

        {forbidden && (
          <div className="max-w-xl rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            Vous n&apos;avez pas les droits d&apos;administrateur pour consulter cette page.
          </div>
        )}

        {error && (
          <div className="max-w-xl rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !forbidden && !error && (
          <Card className="overflow-hidden border-border/80">
            <CardHeader>
              <CardTitle>Annuaire</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-t3">
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Rôle</th>
                      <th className="px-4 py-3">Secteur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/80">
                    {users.map((u) => (
                      <tr key={u.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium text-t1">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-t2">{u.email}</td>
                        <td className="px-4 py-3 text-t2">{u.role}</td>
                        <td className="px-4 py-3 text-t2">{u.sector ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && <p className="p-8 text-center text-t3">Aucun utilisateur.</p>}
            </CardContent>
          </Card>
        )}
      </main>
    </DashboardShell>
  )
}
