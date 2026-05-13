'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { authAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      window.dispatchEvent(new Event('urbanops-auth-changed'))
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-mesh-light dark:bg-mesh-dark" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-lg shadow-lg">
              🏙
            </span>
            <span className="text-2xl font-bold tracking-tight text-t1">UrbanOps</span>
          </Link>
        </div>

        <Card className="border-border/80 shadow-glass backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl">Connexion</CardTitle>
            <CardDescription className="text-center">Accédez au tableau de bord opérationnel.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-t3 hover:bg-hover hover:text-t1"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring/40"
                />
                <Label htmlFor="remember" className="normal-case tracking-normal text-t2">
                  Se souvenir de moi
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion…' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <p>
                <span className="text-t2">Pas encore de compte ? </span>
                <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
                  S&apos;inscrire
                </Link>
              </p>
              <div className="border-t border-border pt-4">
                <Link href="/" className="text-t3 transition-colors hover:text-t2">
                  Continuer en tant que citoyen →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
