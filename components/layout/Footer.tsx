'use client'

import Link from 'next/link'
import { Building2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#080c0f] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <span className="text-lg font-bold text-[var(--t1)]">UrbanOps</span>
            </Link>
            <p className="text-sm text-[var(--t2)] leading-relaxed">
              Plateforme de supervision urbaine intelligente pour la ville de Marrakech.
              Signalez, analysez, résolvez.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[2px] text-[var(--t3)] font-mono mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/incidents"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Signalements
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/carte"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Carte
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs uppercase tracking-[2px] text-[var(--t3)] font-mono mb-4">
              Légal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--border)]">
          <p className="text-center text-xs text-[var(--t3)]">
            © 2025 UrbanOps — Marrakech, Maroc
          </p>
        </div>
      </div>
    </footer>
  )
}
