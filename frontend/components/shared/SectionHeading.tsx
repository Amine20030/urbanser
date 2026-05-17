import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <p className="mb-3 inline-flex rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-t3 shadow-sm backdrop-blur-md">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-2xl font-black tracking-tight text-t1 sm:text-4xl">{title}</h2>
      {description ? (
        <p
          className={cn(
            'mt-3 text-pretty text-sm leading-7 text-t2 sm:text-base',
            align === 'center' && 'mx-auto max-w-2xl'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
