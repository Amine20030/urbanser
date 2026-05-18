'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, Plus, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { cn } from '@/lib/utils'

type NavUser = {
  email: string
  role: string
  firstName: string
}

function getUser(): NavUser | null {
  if (typeof globalThis === 'undefined' || !globalThis.localStorage) return null
  const token = localStorage.getItem('urbanops_token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('urbanops_token')
      localStorage.removeItem('urbanops_user')
      return null
    }

    let stored: any = null
    try {
      const raw = localStorage.getItem('urbanops_user')
      if (raw) stored = JSON.parse(raw)
    } catch {}

    const rawRole = payload.role ?? stored?.role ?? payload.authorities?.[0] ?? 'CITIZEN'
    const role = String(rawRole).replace(/^ROLE_/, '')
    const email = payload.sub ?? stored?.email ?? ''
    const firstName = payload.firstName || stored?.firstName || email.split('@')[0] || 'Utilisateur'

    return { email, role, firstName }
  } catch {
    return null
  }
}

export function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<NavUser | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setUser(getUser())
    const handler = () => setUser(getUser())
    globalThis.addEventListener('storage', handler)
    globalThis.addEventListener('urbanops-auth-changed', handler)
    return () => {
      globalThis.removeEventListener('storage', handler)
      globalThis.removeEventListener('urbanops-auth-changed', handler)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('urbanops_token')
    localStorage.removeItem('urbanops_user')
    setUser(null)
    globalThis.location.href = '/'
  }

  const isAdmin = Boolean(user?.role?.includes('ADMIN'))
  const links = [
    { href: '/', label: 'Accueil', exact: true },
    { href: '/carte', label: 'Carte' },
    user
      ? { href: isAdmin ? '/dashboard' : '/mes-signalements', label: isAdmin ? 'Dashboard' : 'Mes signalements' }
      : { href: '/#how', label: 'Comment ca marche' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-[#fffaf3]/94 text-t1 shadow-[0_8px_26px_rgba(63,37,23,0.08)] backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-black text-white shadow-sm">
              U
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black leading-tight">UrbanOps</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Marrakech
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => {
              const active = link.exact ? pathname === link.href : pathname.startsWith(link.href) && link.href !== '/#how'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'border-b-2 py-5 text-sm font-semibold transition-colors',
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-t2 hover:text-t1'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {!user ? (
              <>
                <Button variant="ghost" size="sm" className="text-t2 hover:bg-hover hover:text-t1" asChild>
                  <Link href="/auth/signin">Se connecter</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">S'inscrire</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="mr-2 flex items-center gap-2 rounded-md border border-border bg-muted/60 px-2.5 py-1.5">
                  <UserRound className="h-3.5 w-3.5 text-primary" />
                  <span className="max-w-[120px] truncate text-xs font-semibold">{user.firstName}</span>
                  <span className="rounded bg-primary/90 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                    {isAdmin ? 'Admin' : 'Citoyen'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-t2 hover:bg-hover hover:text-t1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Sortir
                </Button>
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Signaler
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-t1 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-[#fffaf3] px-4 py-4 md:hidden">
            <div className="mx-auto flex max-w-lg flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-t2 hover:bg-hover hover:text-t1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                {!user ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/auth/signin">Connexion</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/signup">Inscription</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleLogout}>
                      Deconnexion
                    </Button>
                    <Button onClick={() => { setModalOpen(true); setMobileOpen(false) }}>
                      Signaler
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
