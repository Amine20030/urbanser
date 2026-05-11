'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { authApi, sectorApi } from '@/lib/api'
import { Sector } from '@/lib/types'

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
    sectorApi.getAll().then((res: { data: Sector[] }) => setSectors(res.data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      const res = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        sector: sectors.find((s: Sector) => String(s.id) === sector)?.name,
      })
      const { token, user } = res.data
      
      localStorage.setItem('urbanops_token', token)
      localStorage.setItem('urbanops_user', JSON.stringify(user))
      
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-[var(--t1)]">UrbanOps</span>
          </Link>
        </div>

        {/* Card */}
        <div className="p-8 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)]">
          <h1 className="text-xl font-semibold text-[var(--t1)] text-center mb-6">
            Rejoindre UrbanOps
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 6XX XXX XXX"
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Sector */}
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Quartier
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm focus:outline-none focus:border-blue-500/50"
              >
                <option value="">Sélectionnez un quartier</option>
                {sectors.map((s: Sector) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            {/* Alerts checkbox */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Link */}
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
