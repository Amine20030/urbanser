'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] bg-[var(--bg-sidebar)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="h-[52px] flex items-center px-4 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--t1)]">🏙 UrbanOps</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                  : 'text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--bg-hover)]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-[var(--t2)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
