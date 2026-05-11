'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

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
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar />
      <main className="ml-[220px] p-6 max-w-2xl">
        <h1 className="text-xl font-semibold text-[var(--t1)] mb-2">Paramètres</h1>
        <p className="text-sm text-[var(--t3)] mb-8">
          Session locale et préférences minimales (le compte est géré côté serveur).
        </p>

        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4">
          <h2 className="text-sm font-medium text-[var(--t1)]">Profil (navigateur)</h2>
          {user ? (
            <dl className="text-sm space-y-2 text-[var(--t2)]">
              <div>
                <dt className="text-[var(--t3)] text-xs uppercase">Nom</dt>
                <dd>
                  {user.firstName} {user.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--t3)] text-xs uppercase">Email</dt>
                <dd className="font-mono">{user.email}</dd>
              </div>
              <div>
                <dt className="text-[var(--t3)] text-xs uppercase">Rôle</dt>
                <dd>{user.role}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-[var(--t3)]">
              Non connecté — les paramètres de profil détaillés seront disponibles après connexion.
            </p>
          )}

          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-3">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-600/90 text-white text-sm font-medium hover:bg-red-500"
            >
              Se déconnecter sur cet appareil
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--t1)] hover:bg-[var(--bg-hover)]"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
