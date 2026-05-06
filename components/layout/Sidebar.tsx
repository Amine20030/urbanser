'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Bell,
  PlusCircle,
  Bus,
  Droplets,
  Trash2,
  Lightbulb,
  Activity,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const [isSignalerOpen, setIsSignalerOpen] = useState(false)

  const mainNav = [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/carte', label: 'Carte', icon: Map },
  ]

  const managementNav = [
    { href: '/incidents', label: 'Incidents', icon: AlertTriangle, badge: 15 },
    { href: '/alertes', label: 'Alertes', icon: Bell, badge: 3 },
    {
      href: '#',
      label: 'Signaler',
      icon: PlusCircle,
      onClick: () => setIsSignalerOpen(true),
    },
  ]

  const servicesNav = [
    { href: '#', label: 'Transport & Trafic', icon: Bus },
    { href: '#', label: 'Eau & Assainissement', icon: Droplets },
    { href: '#', label: 'Collecte Déchets', icon: Trash2 },
    { href: '#', label: 'Éclairage Public', icon: Lightbulb },
  ]

  const NavItem = ({
    href,
    label,
    icon: Icon,
    badge,
    onClick,
  }: {
    href: string
    label: string
    icon: React.ElementType
    badge?: number
    onClick?: () => void
  }) => {
    const isActive = pathname === href

    const content = (
      <>
        <Icon className="w-4 h-4" />
        <span className="flex-1 text-sm">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-red-500/20 text-red-400">
            {badge}
          </span>
        )}
      </>
    )

    const className = cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--bg-hover)] transition-colors relative group',
      isActive && 'text-[var(--t1)] bg-[var(--bg-hover)]'
    )

    if (onClick) {
      return (
        <button onClick={onClick} className={className}>
          {content}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r" />
          )}
        </button>
      )
    }

    return (
      <Link href={href} className={className}>
        {content}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r" />
        )}
      </Link>
    )
  }

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col z-40">
        {/* Logo */}
        <div className="p-4 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-bold text-[var(--t1)]">UrbanOps</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Vue d'ensemble */}
          <div>
            <h3 className="px-3 text-[9px] uppercase tracking-[2px] text-[var(--t3)] font-mono mb-2">
              Vue d&apos;ensemble
            </h3>
            <nav className="space-y-1">
              {mainNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
          </div>

          {/* Gestion */}
          <div>
            <h3 className="px-3 text-[9px] uppercase tracking-[2px] text-[var(--t3)] font-mono mb-2">
              Gestion
            </h3>
            <nav className="space-y-1">
              {managementNav.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="px-3 text-[9px] uppercase tracking-[2px] text-[var(--t3)] font-mono mb-2">
              Services
            </h3>
            <nav className="space-y-1">
              {servicesNav.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </nav>
          </div>
        </div>

        {/* System status */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[var(--t2)]">Système opérationnel</span>
          </div>
        </div>
      </aside>

      <SignalerModal
        isOpen={isSignalerOpen}
        onClose={() => setIsSignalerOpen(false)}
      />
    </>
  )
}
