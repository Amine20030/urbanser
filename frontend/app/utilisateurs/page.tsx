'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { userAPI } from '@/lib/api'

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
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar />
      <main className="ml-[220px] p-6">
        <h1 className="text-xl font-semibold text-[var(--t1)] mb-2">Utilisateurs</h1>
        <p className="text-sm text-[var(--t3)] mb-6">
          Liste des comptes (réservée aux administrateurs).
        </p>

        {loading && <p className="text-[var(--t3)]">Chargement…</p>}

        {forbidden && (
          <div className="max-w-lg rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Vous n’avez pas les droits d’administrateur pour consulter cette page. Les citoyens peuvent utiliser
            le tableau de bord et signaler des incidents.
          </div>
        )}

        {error && (
          <div className="max-w-lg rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !forbidden && !error && (
          <div className="overflow-x-auto rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--t3)] text-xs uppercase">
                  <th className="py-3 px-4">Nom</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Secteur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map((u) => (
                  <tr key={u.id} className="text-[var(--t1)]">
                    <td className="py-2 px-4">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-2 px-4 font-mono text-xs text-[var(--t2)]">{u.email}</td>
                    <td className="py-2 px-4">{u.role}</td>
                    <td className="py-2 px-4 text-[var(--t2)]">{u.sector ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="p-6 text-center text-[var(--t3)]">Aucun utilisateur.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
