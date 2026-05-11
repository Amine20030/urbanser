'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-[#e8edf3] mb-4">Une erreur est survenue</h2>
        <p className="text-[#7a8899] mb-6">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={reset}
            className="px-6 py-3 bg-[#1d4ed8] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reessayer
          </button>
          <a 
            href="/"
            className="px-6 py-3 bg-transparent border border-[rgba(255,255,255,0.1)] text-[#e8edf3] rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}
