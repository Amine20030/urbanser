'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { authAPI, sectorAPI } from '@/lib/api'

type Sector = { id: number; name: string }

function normalizePhone(raw: string): string | undefined {
  const t = raw.trim()
  if (!t) return undefined
  const digits = t.replace(/\s/g, '').replace(/-/g, '')
  return digits || undefined
}

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [sectors, setSectors] = useState<Sector[]>([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sector, setSector] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    sectorAPI
      .getAll()
      .then((res) => setSectors(res.data ?? []))
      .catch(() => {})
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    const phoneVal = normalizePhone(phone)
    setLoading(true)
    try {
      await authAPI.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: phoneVal,
        sector: sector || undefined,
        receiveAlerts: alertsEnabled,
      })
      router.push('/auth/signin')
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      setError(ax.response?.data?.message || 'Inscription impossible. Email déjà utilisé ou données invalides.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-[var(--t1)]">UrbanOps</span>
          </Link>
        </div>

        <div className="p-8 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)]">
          <h1 className="text-xl font-semibold text-[var(--t1)] text-center mb-6">
            Rejoindre UrbanOps
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Téléphone (optionnel)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212612345678"
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
              />
              <p className="mt-1 text-[11px] text-[var(--t3)]">Chiffres uniquement ou + suivi des chiffres (8–20 caractères).</p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Quartier (optionnel)
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm focus:outline-none focus:border-blue-500/50"
              >
                <option value="">—</option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--t3)] hover:text-[var(--t2)]"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--t3)] hover:text-[var(--t2)]"
                  aria-label={
                    showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="alerts"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-hover)] text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="alerts" className="text-sm text-[var(--t2)]">
                Je souhaite recevoir des alertes pour mon quartier
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              <span className="text-[var(--t2)]">Déjà inscrit ? </span>
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Se connecter →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
