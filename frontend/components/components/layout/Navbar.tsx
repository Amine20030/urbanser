'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Building2 } from 'lucide-react'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignalerOpen, setIsSignalerOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/incidents', label: 'Tous les signalements' },
    { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <span className="text-lg font-bold text-[var(--t1)]">UrbanOps</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsSignalerOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                📷 Signaler
              </button>
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border2)] text-[var(--t1)] text-sm font-medium transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border2)] text-[var(--t1)] text-sm font-medium transition-colors"
              >
                S&apos;inscrire
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--t2)] hover:text-[var(--t1)]"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden border-t border-[var(--border)] bg-[var(--bg-base)]',
            isMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[var(--border)] space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsSignalerOpen(true)
                }}
                className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                📷 Signaler un problème
              </button>
              <Link
                href="/auth/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-4 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border2)] text-[var(--t1)] text-sm font-medium transition-colors text-center"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border2)] text-[var(--t1)] text-sm font-medium transition-colors text-center"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <SignalerModal
        isOpen={isSignalerOpen}
        onClose={() => setIsSignalerOpen(false)}
      />
    </>
  )
}
