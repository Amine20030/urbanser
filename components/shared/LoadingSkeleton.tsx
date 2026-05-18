export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-[#131920] border border-white/7 rounded-[10px] p-4">
      <div className="h-3 bg-white/10 rounded w-1/3 mb-3" />
      <div className="h-8 bg-white/10 rounded w-1/2 mb-2" />
      <div className="h-2 bg-white/10 rounded w-1/4" />
    </div>
  )
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={`card-skeleton-${i + 1}`} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={`table-row-skeleton-${i + 1}`} className="flex gap-4">
          <div className="h-4 bg-white/10 rounded w-24" />
          <div className="h-4 bg-white/10 rounded flex-1" />
          <div className="h-4 bg-white/10 rounded w-16" />
          <div className="h-4 bg-white/10 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="animate-pulse bg-[#0b0f14] h-full w-full flex items-center justify-center rounded-[12px]">
      <span className="text-[#3a4556] text-sm font-mono">Chargement de la carte…</span>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse bg-[#131920] border border-white/7 rounded-[10px] p-4 h-[250px]">
      <div className="h-3 bg-white/10 rounded w-1/3 mb-4" />
      <div className="h-full bg-white/5 rounded" />
    </div>
  )
}

export function AlertSkeleton() {
  return (
    <div className="animate-pulse bg-[#131920] border border-white/7 rounded-[10px] p-4">
      <div className="flex items-start gap-3">
        <div className="w-3 h-3 bg-white/10 rounded-full" />
        <div className="flex-1">
          <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-2 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

