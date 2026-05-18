'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { canAccessAdminDashboard, getCurrentRole } from '@/lib/auth'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
}

function buildNavItems(): NavItem[] {
  const staff = canAccessAdminDashboard()
  const items: NavItem[] = [
    {
      href: staff ? '/dashboard' : '/mes-signalements',
      label: 'Tableau de bord',
      icon: staff ? LayoutDashboard : ClipboardList,
    },
    { href: '/carte', label: 'Carte', icon: Map },
    { href: '/incidents', label: 'Incidents', icon: FileText },
  ]

  if (staff) {
    items.push(
      { href: '/alertes', label: 'Alertes', icon: AlertTriangle },
      { href: '/utilisateurs', label: 'Utilisateurs', icon: Users },
    )
  }

  items.push({ href: '/parametres', label: 'Parametres', icon: Settings })
  return items
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [role, setRole] = useState<string>('')

  useEffect(() => {
    const refresh = () => {
      setNavItems(buildNavItems())
      setRole(getCurrentRole())
    }
    refresh()
    globalThis.addEventListener('urbanops-auth-changed', refresh)
    globalThis.addEventListener('storage', refresh)
    return () => {
      globalThis.removeEventListener('urbanops-auth-changed', refresh)
      globalThis.removeEventListener('storage', refresh)
    }
  }, [])

  function logout() {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.removeItem('urbanops_token')
      globalThis.localStorage.removeItem('urbanops_user')
      globalThis.dispatchEvent(new Event('urbanops-auth-changed'))
    }
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-16 w-full flex-row border-b border-border bg-sidebar/95 shadow-card backdrop-blur-xl md:h-screen md:w-[220px] md:flex-col md:border-b-0 md:border-r lg:w-60">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-16 items-center px-4 md:border-b md:border-border"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-black text-white shadow-sm">
            U
          </span>
          <div className="min-w-0">
            <span className="block text-sm font-bold text-t1">UrbanOps</span>
            {role && (
              <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-t3">
                {role === 'ADMIN' ? 'Administrateur' : role === 'MANAGER' ? 'Gestionnaire' : 'Citoyen'}
              </span>
            )}
          </div>
        </Link>
      </motion.div>

      <nav className="hidden flex-1 space-y-1 overflow-y-auto p-3 md:block">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-t1 shadow-sm ring-1 ring-primary/25'
                    : 'text-t2 hover:bg-hover hover:text-t1'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                    isActive
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-transparent bg-muted/60 text-t3 group-hover:border-border group-hover:text-t2'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="ml-auto border-l border-border p-3 md:ml-0 md:border-l-0 md:border-t"
      >
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-t2 transition-colors hover:bg-red-500/10 hover:text-red-500 md:w-full"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/60">
            <LogOut className="h-4 w-4" />
          </span>
          <span className="hidden md:inline">Deconnexion</span>
        </button>
      </motion.div>
    </aside>
  )
}
