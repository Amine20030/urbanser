'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { SignalerModal } from '@/components/shared/SignalerModal'

function relativeTime(dateStr: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff/60000)
  if (mins < 1) return 'à l\'instant'
  if (mins < 60) return `il y a ${mins}min`
  const hours = Math.floor(mins/60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours/24)
  return `il y a ${days}j`
}

const sev = (s:string) => s==='HIGH'?'var(--urb-danger)':s==='MEDIUM'?'var(--urb-gold)':'var(--urb-success)'

const StatusPill = ({ status }: { status: string }) => {
  const isO = status === 'OPEN'
  const isP = status === 'IN_PROGRESS'
  return (
    <span style={{
      background: isO ? 'var(--urb-danger-lt)' : isP ? 'var(--urb-gold-lt)' : 'var(--urb-success-lt)',
      color: isO ? 'var(--urb-danger)' : isP ? 'var(--urb-gold)' : 'var(--urb-success)',
      padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em'
    }}>
      {isO ? '🔴 OUVERT' : isP ? '🟡 EN COURS' : '✅ RÉSOLU'}
    </span>
  )
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [activeFilter, setFilter] = useState('Tous')
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8080/api/v1/incidents?page=0&size=100&sortBy=createdAt&sortDir=desc')
        if(res.ok) {
          const body = await res.json()
          setIncidents(body.content || body)
        }
      } catch (e) {} finally {
        setLoading(false)
      }
    }
    fetchRealData()
  }, [])

  const filtered = incidents.filter(i => activeFilter === 'Tous' ? true : i.status === activeFilter)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--urb-bg)' }}>
      <Navbar />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--urb-text)' }}>
              Explorateur d'incidents
            </h1>
            <p style={{ color: 'var(--urb-text-2)', fontSize: 15 }}>
              Consultez publiquement les problèmes signalés par les citoyens à Marrakech.
            </p>
          </div>
          <button onClick={() => setModalOpen(true)} style={{
            background: 'var(--urb-primary)', color: 'white', border: 'none', borderRadius: 8,
            padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(194,65,12,0.4)', transition: 'transform 0.15s'
          }}>
            📷 Signaler
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['Tous','OPEN','IN_PROGRESS','RESOLVED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: '1px solid',
                background: activeFilter===s ? 'var(--urb-primary)' : 'white',
                color: activeFilter===s ? 'white' : 'var(--urb-text-2)',
                borderColor: activeFilter===s ? 'var(--urb-primary)' : 'var(--urb-border)',
                transition: 'all 0.15s'
              }}
            >
              {s==='Tous'?'Tous':s==='OPEN'?'🔴 Ouverts':s==='IN_PROGRESS'?'🟡 En cours':'✅ Résolus'}
            </button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              style={{
                fontSize: 13, padding: '8px 16px', border: '1px solid var(--urb-border)',
                borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600, color: 'var(--urb-text)'
              }}>
              {viewMode === 'grid' ? '☰ Vue Liste' : '⊞ Vue Grille'}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--urb-text-3)', fontSize: 16 }}>Chargement des incidents...</div>
        ) : (
          viewMode === 'grid' ? (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
               {filtered.map(inc => (
                 <article key={inc.id} style={{
                   background: 'var(--urb-surface)', border: '1px solid var(--urb-border)',
                   borderRadius: 'var(--urb-radius-lg)', overflow: 'hidden',
                   boxShadow: 'var(--urb-shadow)', transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'pointer'
                 }} onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = 'var(--urb-shadow-md)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                 }} onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'var(--urb-shadow)'
                    e.currentTarget.style.transform = 'translateY(0)'
                 }}>
                   <div style={{ height: 4, background: sev(inc.severity) }}/>
                   <div style={{ padding: '20px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                       <span style={{ fontSize: 12, color: 'var(--urb-text-3)', fontWeight: 600 }}>
                         {inc.category?.icon} {inc.category?.name}
                       </span>
                       <span style={{ fontSize: 11, color: 'var(--urb-text-3)' }}>
                         {relativeTime(inc.createdAt)}
                       </span>
                     </div>
                     <h3 style={{
                       fontSize: 15, fontWeight: 700, color: 'var(--urb-text)',
                       marginBottom: 10, lineHeight: 1.4, height: 42,
                       display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                     }}>
                       {inc.title}
                     </h3>
                     <div style={{ fontSize: 12, color: 'var(--urb-text-2)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                       📍 <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{inc.sector?.name}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--urb-border)', paddingTop: 16 }}>
                       <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--urb-primary)', fontWeight: 700 }}>
                         #{inc.referenceCode}
                       </span>
                       <StatusPill status={inc.status}/>
                     </div>
                   </div>
                 </article>
               ))}
             </div>
          ) : (
            <div style={{ background: 'var(--urb-surface)', border: '1px solid var(--urb-border)', borderRadius: 'var(--urb-radius-lg)', overflow: 'hidden' }}>
              {filtered.map((inc, i) => (
                <div key={inc.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                  borderBottom: i === filtered.length-1 ? 'none' : '1px solid var(--urb-border)',
                  background: 'var(--urb-surface)', transition: 'background 0.1s', cursor: 'pointer'
                }} onMouseEnter={e => e.currentTarget.style.background = 'var(--urb-bg)'}
                   onMouseLeave={e => e.currentTarget.style.background = 'var(--urb-surface)'}>
                  <div style={{ width: 4, height: 40, background: sev(inc.severity), borderRadius: 2 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--urb-text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inc.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--urb-text-3)', display: 'flex', gap: 12 }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--urb-primary)', fontWeight: 600 }}>{inc.referenceCode}</span>
                      <span>{inc.category?.name}</span>
                      <span>📍 {inc.sector?.name}</span>
                    </div>
                  </div>
                  <div style={{ color: 'var(--urb-text-3)', fontSize: 12 }}>{relativeTime(inc.createdAt)}</div>
                  <div><StatusPill status={inc.status}/></div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
