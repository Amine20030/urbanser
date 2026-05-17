import Image from 'next/image'
import zellijImage from '@/images/imgs/zeliij1.jpg'
import palmImage from '@/images/imgs/palm-palm-tree.png'
import { cn } from '@/lib/utils'

type PageBackdropProps = {
  variant?: 'public' | 'dashboard' | 'auth'
  className?: string
}

export function PageBackdrop({ variant = 'public', className }: PageBackdropProps) {
  const isDashboard = variant === 'dashboard'
  const isAuth = variant === 'auth'

  return (
    <div className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)} aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fbf3e7_0%,#f1d5b6_40%,#f8ead4_70%,#fdf7ee_100%)] dark:bg-[linear-gradient(135deg,#100c10_0%,#1d1110_45%,#111827_100%)]" />
      <div className="moroccan-tile absolute inset-0 opacity-[0.22] dark:opacity-[0.13]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(91,39,30,0.08)_0_1px,transparent_1px_100%),linear-gradient(180deg,rgba(13,111,82,0.05)_0_1px,transparent_1px_100%)] bg-[size:56px_56px] opacity-55 dark:opacity-20" />

      <div
        className={cn(
          'absolute overflow-hidden rounded-lg border border-white/35 shadow-[0_20px_80px_rgba(15,23,42,0.10)]',
          isDashboard
            ? '-right-20 top-20 h-52 w-72 opacity-[0.10] md:w-[28rem]'
            : '-right-10 top-20 h-64 w-[22rem] opacity-[0.16] sm:h-80 sm:w-[34rem]',
          isAuth && 'left-1/2 right-auto top-8 h-64 w-[34rem] -translate-x-1/2 opacity-[0.14]'
        )}
      >
        <Image src={zellijImage} alt="" fill sizes="560px" className="object-cover" priority={variant === 'public'} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-orange-200/10 to-emerald-950/20 dark:from-black/35 dark:to-orange-300/10" />
      </div>

      <div
        className={cn(
          'absolute overflow-hidden rounded-lg border border-white/30 shadow-[0_16px_70px_rgba(15,23,42,0.08)]',
          isDashboard
            ? 'bottom-10 left-10 hidden h-36 w-56 opacity-[0.08] lg:block'
            : 'bottom-12 left-4 h-40 w-64 opacity-[0.12] sm:left-10 sm:h-52 sm:w-80',
          isAuth && 'bottom-4 left-1/2 h-44 w-72 -translate-x-1/2 opacity-[0.10]'
        )}
      >
        <Image src={zellijImage} alt="" fill sizes="360px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/65 via-white/15 to-transparent dark:from-black/45" />
      </div>

      <Image
        src={palmImage}
        alt=""
        width={260}
        height={260}
        className={cn(
          'absolute object-contain opacity-[0.045] dark:invert dark:opacity-[0.055]',
          isDashboard ? 'right-8 top-1/2 hidden h-48 w-48 lg:block' : 'bottom-24 right-4 h-52 w-52 sm:right-16'
        )}
      />
    </div>
  )
}
