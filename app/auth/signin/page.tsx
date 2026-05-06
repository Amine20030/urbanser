'use client'

import Link from 'next/link'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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

          <form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
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
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              Se connecter
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
