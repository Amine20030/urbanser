'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  FileText,
  Settings,
  Users,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/carte', label: 'Carte', icon: Map },
  { href: '/incidents', label: 'Incidents', icon: FileText },
  { href: '/alertes', label: 'Alertes', icon: AlertTriangle },
  { href: '/utilisateurs', label: 'Utilisateurs', icon: Users },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('urbanops_token')
      localStorage.removeItem('urbanops_user')
    }
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-border bg-sidebar/90 backdrop-blur-xl shadow-card lg:w-60">
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 text-base shadow-md">
            🏙
          </span>
          <span className="text-sm font-bold tracking-tight text-t1">UrbanOps</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
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
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/10 text-t1 shadow-sm ring-1 ring-primary/25'
                    : 'text-t2 hover:bg-hover hover:text-t1'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                    isActive
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-transparent bg-muted/50 text-t3 group-hover:border-border group-hover:text-t2'
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

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-t2 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
            <LogOut className="h-4 w-4" />
          </span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
