'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const MapView = dynamic(() => import('@/components/shared/MapView'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 480, background: '#f1f5f9', borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#64748b', fontSize: 14 }}>
      Chargement de la carte de Marrakech...
    </div>
  )
})

export function MapSection() {
  return (
    <section
      className="bg-transparent"
      style={{
        padding: '4rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--t1)',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          Carte des incidents
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--t2)',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Carte interactive (zoom, déplacement, popups) — signalements actifs
        </p>

        <MapView height="480px" showAllStatuses={true} />

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/incidents"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Voir tous les incidents →
          </Link>
        </div>
      </div>
    </section>
  )
}
