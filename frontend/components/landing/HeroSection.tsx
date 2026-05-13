'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { SignalerModal } from '@/components/shared/SignalerModal'

interface Stats {
  totalIncidents: number
  openIncidents: number
  inProgressIncidents: number
  resolvedIncidents: number
}

export function HeroSection() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    // Debug: Log environment variable
    console.log('[HeroSection] API URL:', process.env.NEXT_PUBLIC_API_URL)
    
    const fetchStats = async () => {
      try {
        console.log('[HeroSection] Fetching stats...')
        const response = await api.get('/stats/dashboard')
        console.log('[HeroSection] Stats received:', response.data)
        setStats(response.data)
      } catch (err: unknown) {
        console.error('[HeroSection] Fetch error:', err)
        const ax = err as { response?: { data?: { message?: string } }; message?: string }
        setError(ax.response?.data?.message || ax.message || 'Impossible de charger les statistiques.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="relative" style={{
      padding: '4rem 1.5rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        color: 'var(--t1)',
        marginBottom: '1rem',
        lineHeight: 1.1
      }}>
        Signalez les incidents urbains
        <br />
        <span style={{ color: '#3b82f6' }}>de Marrakech</span>
      </h1>

      <p style={{
        fontSize: '1.125rem',
        color: 'var(--t2)',
        maxWidth: '600px',
        margin: '0 auto 2rem',
        lineHeight: 1.6
      }}>
        UrbanOps connecte citoyens et autorités locales pour une gestion
        efficace des problèmes urbains : éclairage, voirie, propreté, et plus.
      </p>

      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap'
      }}>
        <button onClick={() => setModalOpen(true)} style={{
          background: '#1d4ed8',
          color: '#fff',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '15px',
          border: 'none',
          cursor: 'pointer'
        }}>
          📍 Signaler un incident
        </button>
        <Link href="/carte" style={{
          background: 'var(--bg-card)',
          color: 'var(--t1)',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '15px',
          border: '1px solid var(--border)'
        }}>
          Voir la carte
        </Link>
      </div>

      {/* Stats */}
      {loading && (
        <div style={{ color: '#7a8899', fontSize: '14px' }}>
          Chargement des statistiques...
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          color: '#ef4444',
          padding: '1rem',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '0 auto',
          fontSize: '14px'
        }}>
          ⚠️ Erreur: {error}
        </div>
      )}

      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <StatCard label="Total" value={Number(stats.totalIncidents ?? 0)} color="#3b82f6" />
          <StatCard label="Ouverts" value={Number(stats.openIncidents ?? 0)} color="#f59e0b" />
          <StatCard label="En cours" value={Number(stats.inProgressIncidents ?? 0)} color="#8b5cf6" />
          <StatCard label="Résolus" value={Number(stats.resolvedIncidents ?? 0)} color="#10b981" />
        </div>
      )}

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem 1rem'
    }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: color
      }}>
        {value.toLocaleString()}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--t2)',
        marginTop: '0.25rem'
      }}>
        {label}
      </div>
    </div>
  )
}
