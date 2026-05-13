'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, MapPin } from 'lucide-react'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavUser = {
  email: string
  role: string
  firstName: string
}

function getUser(): NavUser | null {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('urbanops_token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as {
      exp?: number
      sub?: string
      role?: string
      firstName?: string
      authorities?: string[]
    }
    if (payload.exp != null && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('urbanops_token')
      localStorage.removeItem('urbanops_user')
      return null
    }

    let stored: { role?: string; firstName?: string; email?: string } | null = null
    try {
      const raw = localStorage.getItem('urbanops_user')
      if (raw) stored = JSON.parse(raw) as { role?: string; firstName?: string; email?: string }
    } catch {
      stored = null
    }

    const rawRole = payload.role ?? stored?.role ?? payload.authorities?.[0] ?? 'CITIZEN'
    const role = String(rawRole).replace(/^ROLE_/, '')
    const email = typeof payload.sub === 'string' ? payload.sub : (stored?.email ?? '')
    const firstName =
      (typeof payload.firstName === 'string' && payload.firstName) ||
      (typeof stored?.firstName === 'string' && stored.firstName) ||
      email.split('@')[0] ||
      'Utilisateur'

    return { email, role, firstName }
  } catch {
    return null
  }
}

const navLinkClass =
  'text-sm font-medium text-t2 transition-colors hover:text-t1 relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full'

export function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<NavUser | null>(null)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    setUser(getUser())
    const handler = () => setUser(getUser())
    window.addEventListener('storage', handler)
    window.addEventListener('urbanops-auth-changed', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('urbanops-auth-changed', handler)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    localStorage.removeItem('urbanops_token')
    localStorage.removeItem('urbanops_user')
    setUser(null)
    window.location.href = '/'
  }

  const isDark = resolvedTheme === 'dark'
  const isAdmin = Boolean(user?.role?.includes('ADMIN'))

  return (
    <>
      <motion.nav
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'glass-nav sticky top-0 z-[100] h-16 px-4 sm:px-6',
          'supports-[backdrop-filter]:bg-card/60'
        )}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 text-lg shadow-md shadow-sky-500/25">
              🏙
            </span>
            <span className="text-base font-bold tracking-tight text-t1 sm:text-lg">UrbanOps</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className={navLinkClass}>
              Accueil
            </Link>
            <Link href="/carte" className={navLinkClass}>
              Carte
            </Link>
            <Link href="/incidents" className={navLinkClass}>
              Signalements
            </Link>
            <Link href="/#how" className={navLinkClass}>
              Comment ça marche
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 text-t1 md:hidden"
              aria-expanded={mobileOpen}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 text-t2 transition-colors hover:bg-hover hover:text-t1"
                aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </button>
            )}

            {mounted && user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span
                  style={{
                    background: isAdmin ? '#1d4ed8' : '#22c55e',
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {isAdmin ? '🛡 ADMIN' : '👤 CITOYEN'}
                </span>
                <span style={{ fontSize: 12, color: '#475569' }} className="dark:text-slate-400">
                  {user.firstName}
                </span>
                {isAdmin && (
                  <Link
                    href="/admin/users"
                    style={{ fontSize: 12, color: '#1d4ed8', textDecoration: 'none', fontWeight: 600 }}
                    className="dark:text-sky-400"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    background: 'none',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                  className="dark:border-slate-600 dark:text-slate-400"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              mounted && (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    href="/auth/signin"
                    style={{
                      fontSize: 13,
                      color: '#1d4ed8',
                      textDecoration: 'none',
                      border: '1px solid #1d4ed8',
                      borderRadius: 7,
                      padding: '6px 14px',
                    }}
                    className="dark:border-sky-400 dark:text-sky-400"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/signup"
                    style={{
                      fontSize: 13,
                      color: 'white',
                      textDecoration: 'none',
                      background: '#1d4ed8',
                      borderRadius: 7,
                      padding: '6px 14px',
                      fontWeight: 600,
                    }}
                    className="dark:bg-sky-500"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )
            )}

            <Button
              size="sm"
              className="hidden shadow-glow sm:inline-flex"
              onClick={() => setModalOpen(true)}
            >
              <MapPin className="h-4 w-4" />
              Signaler
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-card/95 px-4 py-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-medium text-t1" onClick={() => setMobileOpen(false)}>
                Accueil
              </Link>
              <Link href="/carte" className="text-sm font-medium text-t1" onClick={() => setMobileOpen(false)}>
                Carte
              </Link>
              <Link href="/incidents" className="text-sm font-medium text-t1" onClick={() => setMobileOpen(false)}>
                Signalements
              </Link>
              <Link href="/#how" className="text-sm font-medium text-t1" onClick={() => setMobileOpen(false)}>
                Comment ça marche
              </Link>
              {user && isAdmin && (
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user && (
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      style={{
                        background: isAdmin ? '#1d4ed8' : '#22c55e',
                        color: 'white',
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {isAdmin ? '🛡 ADMIN' : '👤 CITOYEN'}
                    </span>
                    <span className="text-sm text-t1">{user.firstName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="rounded-md border border-border py-2 text-sm text-t2"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
              {!user && mounted && (
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/auth/signin"
                    className="flex-1 rounded-md border border-primary py-2 text-center text-sm font-medium text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-semibold text-primary-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
              <Button className="w-full" onClick={() => { setModalOpen(true); setMobileOpen(false) }}>
                Signaler un problème
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
