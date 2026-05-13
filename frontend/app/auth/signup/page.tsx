'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { authAPI, sectorAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-mesh-light dark:bg-mesh-dark" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
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
            <CardTitle className="text-center text-xl">Créer un compte</CardTitle>
            <CardDescription className="text-center">Rejoignez la communauté des signaleurs.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fn">Prénom</Label>
                  <Input id="fn" required minLength={2} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ln">Nom</Label>
                  <Input id="ln" required minLength={2} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="em">Email</Label>
                <Input
                  id="em"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ph">Téléphone (optionnel)</Label>
                <Input id="ph" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212612345678" />
                <p className="text-[11px] text-t3">Chiffres ou + suivi des chiffres (8–20 caractères).</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sec">Quartier (optionnel)</Label>
                <select
                  id="sec"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-bg-base/80 px-3 text-sm text-t1 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-bg-hover/50"
                >
                  <option value="">—</option>
                  {sectors.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pw">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="pw"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-t3 hover:bg-hover"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pw2">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="pw2"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-t3 hover:bg-hover"
                    aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="alerts"
                  checked={alertsEnabled}
                  onChange={(e) => setAlertsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary"
                />
                <Label htmlFor="alerts" className="normal-case tracking-normal text-t2">
                  Recevoir des alertes pour mon quartier
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Création…' : 'Créer mon compte'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm">
              <span className="text-t2">Déjà inscrit ? </span>
              <Link href="/auth/signin" className="font-semibold text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
