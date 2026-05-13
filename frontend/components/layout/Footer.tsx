'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-bg-base/80 py-10 text-center backdrop-blur-sm dark:bg-[#05080c]/90">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" aria-hidden />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl px-4"
      >
        <p className="text-sm text-t2">© {new Date().getFullYear()} UrbanOps — Marrakech, Maroc</p>
        <p className="mt-2 text-xs text-t3">
          Plateforme de supervision urbaine et de gestion des incidents municipaux.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-xs font-medium text-t3">
          <Link href="/incidents" className="transition-colors hover:text-primary">
            Incidents
          </Link>
          <Link href="/carte" className="transition-colors hover:text-primary">
            Carte
          </Link>
          <Link href="/auth/signin" className="transition-colors hover:text-primary">
            Espace pro
          </Link>
        </div>
      </motion.div>
    </footer>
  )
}
