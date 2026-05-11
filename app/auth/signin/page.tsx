'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { authApi } from '@/lib/api'

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await authApi.login({ email, password })
      const { token, user } = res.data
      
      if (rememberMe) {
        localStorage.setItem('urbanops_token', token)
        localStorage.setItem('urbanops_user', JSON.stringify(user))
      } else {
        sessionStorage.setItem('urbanops_token', token)
        sessionStorage.setItem('urbanops_user', JSON.stringify(user))
      }
      
      // Redirect based on role
      router.push(user.role === 'ADMIN' ? '/dashboard' : '/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4">
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
            Connexion à UrbanOps
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Remember me */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Links */}
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
