import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#e8edf3] mb-4">404</h1>
        <p className="text-xl text-[#7a8899] mb-8">Page non trouvee</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-[#1d4ed8] text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
        >
          Retour a l accueil
        </Link>
      </div>
    </div>
  );
}
