interface ErrorStateProps {
  message: string
  retry?: () => void
}

export function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-400 text-2xl mb-2">⚠</div>
      <p className="text-[#7a8899] text-sm mb-3">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="text-xs px-3 py-1.5 rounded-md bg-[#131920] border border-white/10 text-[#e8edf3] hover:border-white/20 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}

export function OfflineBanner() {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
      bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2
      text-amber-400 text-xs font-mono flex items-center gap-2"
    >
      <span>⚠</span> Backend non connecté — données simulées
    </div>
  )
}

export function EmptyState({ message = 'Aucune donnée disponible' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-[#3a4556] text-2xl mb-2">📭</div>
      <p className="text-[#7a8899] text-sm">{message}</p>
    </div>
  )
}
