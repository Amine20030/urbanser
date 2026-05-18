'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-stone-950 text-white">
      <div className="page-shell grid gap-8 py-8 sm:grid-cols-[1.2fr_1fr] sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-black">U</span>
            <div>
              <p className="text-sm font-black">UrbanOps</p>
              <p className="text-xs text-white/55">Supervision urbaine intelligente - Marrakech</p>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/58">
            Plateforme de signalement, suivi des incidents, alertes et coordination municipale.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/62 sm:justify-end">
          <Link href="/incidents" className="hover:text-white">Incidents</Link>
          <Link href="/carte" className="hover:text-white">Carte</Link>
          <Link href="/auth/signin" className="hover:text-white">Connexion</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs text-white/40">
        2026 UrbanOps - ELHEZZAM Mohamed Amine - BOUCETTA Khalil
      </div>
    </footer>
  )
}
