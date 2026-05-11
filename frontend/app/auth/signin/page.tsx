'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { authAPI } from '@/lib/api'

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await authAPI.login(email.trim(), password)
      const token = data?.token
      if (!token) {
        setError('Réponse serveur invalide (pas de jeton).')
        return
      }
      localStorage.setItem('urbanops_token', token)
      if (data.user) {
        localStorage.setItem('urbanops_user', JSON.stringify(data.user))
      }
      if (rememberMe) {
        localStorage.setItem('urbanops_remember', '1')
      } else {
        localStorage.removeItem('urbanops_remember')
      }
      router.push('/dashboard')
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { message?: string } } }
      const msg = ax.response?.data?.message
      setError(
        msg ||
          (ax.response?.status === 401
            ? 'Email ou mot de passe incorrect.'
            : 'Connexion impossible. Réessayez plus tard.')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-[var(--t1)]">UrbanOps</span>
          </Link>
        </div>

        <div className="p-8 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)]">
          <h1 className="text-xl font-semibold text-[var(--t1)] text-center mb-6">
            Connexion à UrbanOps
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-hover)] text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-sm text-[var(--t2)]">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm">
              <span className="text-[var(--t2)]">Pas encore de compte ? </span>
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
                S&apos;inscrire →
              </Link>
            </p>

            <div className="pt-4 border-t border-[var(--border)]">
              <Link
                href="/"
                className="text-sm text-[var(--t3)] hover:text-[var(--t2)] transition-colors"
              >
                Ou continuer en tant que citoyen →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
