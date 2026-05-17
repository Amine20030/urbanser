import Image from 'next/image'
import palmImage from '@/images/imgs/palm-palm-tree.png'
import zellijImage from '@/images/imgs/zeliij1.jpg'
import { cn } from '@/lib/utils'

type BrandMarkProps = {
  className?: string
  markClassName?: string
  textClassName?: string
  compact?: boolean
}

export function BrandMark({ className, markClassName, textClassName, compact = false }: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/35 bg-[#f8faf7] shadow-sm',
          markClassName
        )}
      >
        <Image src={zellijImage} alt="" fill sizes="40px" className="object-cover opacity-50" aria-hidden />
        <span className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/35 to-emerald-200/40" />
        <Image
          src={palmImage}
          alt=""
          width={24}
          height={24}
          className="relative z-10 h-6 w-6 object-contain opacity-85 dark:invert"
          aria-hidden
        />
      </span>
      {!compact && (
        <span className={cn('text-base font-bold tracking-tight text-t1 sm:text-lg', textClassName)}>
          UrbanOps
        </span>
      )}
    </span>
  )
}
