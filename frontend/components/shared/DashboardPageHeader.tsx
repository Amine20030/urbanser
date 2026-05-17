import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-t3 shadow-sm backdrop-blur-md">
            {Icon ? <Icon className="h-3.5 w-3.5 text-primary" /> : null}
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-balance text-2xl font-black tracking-tight text-t1 sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-t2">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
