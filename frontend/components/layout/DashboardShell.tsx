'use client'

import { motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'

export function DashboardShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-mesh-light dark:bg-mesh-dark opacity-100"
        aria-hidden
      />
      <Sidebar />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn('relative min-h-screen pt-16 md:pl-[220px] md:pt-0 lg:pl-60', className)}
      >
        {children}
      </motion.div>
    </div>
  )
}
