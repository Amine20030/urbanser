'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { canAccessAdminDashboard, getCurrentRole, getStoredUser, getTokenPayload } from '@/lib/auth'

type Tab = 'overview' | 'incidents' | 'users' | 'alerts' | 'map'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const activeTab: Tab = (tabParam && ['overview', 'incidents', 'users', 'alerts', 'map'].includes(tabParam)) 
                         ? tabParam 
                         : 'overview'

  const [stats, setStats] = useState<any>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmId, setConfirmId] = useState<number|null>(null)

  const [user, setUser] = useState<any>(null)
  const [authReady, setAuthReady] = useState(false)

  const handleTabChange = (t: Tab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', t)
    router.push(`/dashboard?${params.toString()}`)
  }

  useEffect(() => {
    const token = localStorage.getItem('urbanops_token')
    if (!token) {
      router.push('/auth/signin')
      return
    }
    if (!canAccessAdminDashboard()) {
      router.push('/mes-signalements')
      return
    }
    const p = getTokenPayload()
    const rawUser = localStorage.getItem('urbanops_user')
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser))
      } catch {
        setUser(null)
      }
    } else if (p) {
      setUser({
        firstName:
          (typeof p.firstName === 'string' && p.firstName) ||
          (typeof p.sub === 'string' ? p.sub.split('@')[0] : 'Admin'),
      })
    }
    setAuthReady(true)
  }, [router])

  const fetchAll = useCallback(async () => {
    if (!localStorage.getItem('urbanops_token') || !canAccessAdminDashboard()) return
    setLoading(true)
    try {
      const [s, i, u, a] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/incidents?page=0&size=50&sortBy=createdAt&sortDir=desc'),
        api.get('/users?page=0&size=50'),
        api.get('/alerts?page=0&size=50'),
      ])
      setStats(s.data)
      const iList = i.data?.content ?? i.data ?? []
      setIncidents(Array.isArray(iList) ? iList : [])
      setUsers(u.data?.content ?? (Array.isArray(u.data) ? u.data : []))
      setAlerts(a.data?.content ?? (Array.isArray(a.data) ? a.data : []))
    } catch (e) {
      console.error('Dashboard fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authReady) fetchAll()
  }, [authReady, fetchAll])

  const changeIncidentStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/incidents/${id}/status`, { status })
      fetchAll()
    } catch {}
  }

  const deactivateUser = async (id: number, email: string) => {
    try {
      await api.delete(`/users/${id}`)
      fetchAll()
    } catch {}
  }

  const acknowledgeAlert = async (id: number) => {
    try {
      await api.patch(`/alerts/${id}/acknowledge`)
      fetchAll()
    } catch {}
  }

  const resendAlert = async (id: number) => {
    try { await api.post(`/alerts/${id}/resend`) } catch {}
  }

  const navItem = (id: Tab, icon: string, label: string) => {
    const active = activeTab === id
    return (
      <button onClick={() => handleTabChange(id)} style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '10px 16px', background: active ? 'rgba(194,65,12,0.15)' : 'transparent',
        border: 'none', borderLeft: active ? '2px solid var(--urb-primary)' : '2px solid transparent',
        color: active ? 'var(--urb-primary-lt)' : 'rgba(255,255,255,0.6)',
        fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s'
      }} onMouseEnter={e => {if(!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}}
         onMouseLeave={e => {if(!active) e.currentTarget.style.background = 'transparent'}}>
        <span style={{fontSize:16}}>{icon}</span>
        {label}
        {id === 'alerts' && alerts.filter(a=>!a.acknowledged).length > 0 && (
          <span style={{
            marginLeft: 'auto', background: 'var(--urb-primary)', color: 'white',
            borderRadius: 10, fontSize: 10, padding: '2px 6px', fontWeight: 700
          }}>
            {alerts.filter(a=>!a.acknowledged).length}
          </span>
        )}
      </button>
    )
  }

  const kpiCard = (label: string, val: number, icon: string, accentColor: string) => (
    <div style={{
      background: 'var(--urb-surface)', border: '1px solid var(--urb-border)',
      borderLeft: `4px solid ${accentColor}`, borderRadius: 'var(--urb-radius)',
      padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8,
      boxShadow: 'var(--urb-shadow)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--urb-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--urb-text)', marginTop: 4 }}>
            {val}
          </div>
        </div>
        <div style={{ background: `color-mix(in srgb, ${accentColor} 10%, transparent)`, color: accentColor, width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
          {icon}
        </div>
      </div>
    </div>
  )

  const sevColor = (s:string) => s==='HIGH'?'#dc2626':s==='MEDIUM'?'#d97706':'#059669'
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--urb-bg)', display: 'flex' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 220, height: '100vh', position: 'fixed', left: 0, top: 0,
        background: '#1c1917', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: '20px 0', zIndex: 50
      }}>
        <div style={{ padding: '0 20px', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--urb-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>U</div>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'white', letterSpacing: '-0.01em' }}>UrbanOps</span>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItem('overview', '📊', "Vue d'ensemble")}
          {navItem('incidents', '⚠️', 'Incidents')}
          {navItem('alerts', '🔔', 'Alertes')}
          {navItem('users', '👥', 'Utilisateurs')}
          
          <div style={{ margin: '20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left'
            }}>
              <span style={{fontSize:16}}>⚙️</span> Paramètres
            </button>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--urb-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.firstName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.firstName || 'Admin'}</span>
              <span style={{ color: 'var(--urb-primary)', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>ADMINISTRATEUR</span>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('urbanops_token'); router.push('/') }} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white',
            borderRadius: 6, padding: '6px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.15s'
          }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: 220, flex: 1, padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--urb-text)' }}>
            {activeTab === 'overview' ? 'Vue d\'ensemble' :
             activeTab === 'incidents' ? 'Incidents' :
             activeTab === 'users' ? 'Utilisateurs' : 'Alertes'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--urb-text-3)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button onClick={fetchAll} style={{ background: 'white', border: '1px solid var(--urb-border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--urb-text-2)' }}>
              Actualiser
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {kpiCard('Total Incidents', stats?.totalIncidents??0, '📋', 'var(--urb-primary)')}
            {kpiCard('Ouverts', stats?.openIncidents??0, '🔴', 'var(--urb-danger)')}
            {kpiCard('En cours', stats?.inProgressIncidents??0, '🟡', 'var(--urb-gold)')}
            {kpiCard('Résolus', stats?.resolvedIncidents??0, '✅', 'var(--urb-success)')}
          </div>
        )}

        {activeTab === 'incidents' && (
          <div style={{ background: 'var(--urb-surface)', border: '1px solid var(--urb-border)', borderRadius: 'var(--urb-radius)', overflow: 'hidden', boxShadow: 'var(--urb-shadow)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--urb-bg)', borderBottom: '1px solid var(--urb-border)' }}>
                  {['Réf.', 'Sévérité', 'Titre', 'Statut', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--urb-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid var(--urb-border)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--urb-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--urb-surface)'}>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'var(--urb-primary)', fontWeight: 700, fontSize: 13 }}>
                      {inc.referenceCode}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: sevColor(inc.severity) }} title={inc.severity} />
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--urb-text)', fontSize: 14 }}>
                      {inc.title}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        background: inc.status==='OPEN'?'var(--urb-danger-lt)':inc.status==='IN_PROGRESS'?'var(--urb-gold-lt)':'var(--urb-success-lt)',
                        color: inc.status==='OPEN'?'var(--urb-danger)':inc.status==='IN_PROGRESS'?'var(--urb-gold)':'var(--urb-success)',
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 
                      }}>
                        {inc.status==='OPEN'?'🔴 Ouvert':inc.status==='IN_PROGRESS'?'🟡 En cours':'✅ Résolu'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--urb-text-3)', fontSize: 12 }}>
                      {new Date(inc.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {inc.status !== 'RESOLVED' && (
                        <button onClick={() => changeIncidentStatus(inc.id, 'RESOLVED')} style={{
                          background: 'white', border: '1px solid var(--urb-border-dk)', borderRadius: 6,
                          padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--urb-text-2)'
                        }}>
                          Résoudre
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ background: 'var(--urb-surface)', border: '1px solid var(--urb-border)', borderRadius: 'var(--urb-radius)', overflow: 'hidden', boxShadow: 'var(--urb-shadow)' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--urb-bg)', borderBottom: '1px solid var(--urb-border)' }}>
                  {['Utilisateur', 'Email', 'Rôle', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--urb-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isDisabled = u.isActive === false
                  const isAd = u.role?.includes('ADMIN')
                  return (
                  <tr key={u.id} style={{ 
                    borderBottom: '1px solid var(--urb-border)', 
                    opacity: isDisabled ? 0.5 : 1, transition: 'background 0.1s' 
                  }} onMouseEnter={e => e.currentTarget.style.background = 'var(--urb-bg)'}
                     onMouseLeave={e => e.currentTarget.style.background = 'var(--urb-surface)'}>
                    <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: isAd ? 'var(--urb-primary-lt)' : 'var(--urb-accent-lt)', color: isAd ? 'var(--urb-primary-dk)' : 'var(--urb-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>
                        {u.firstName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--urb-text)', fontSize: 14 }}>{u.firstName} {u.lastName}</span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--urb-text-2)', fontSize: 13, textDecoration: isDisabled ? 'line-through' : 'none' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 14 }} title={isAd ? 'Admin' : 'Citoyen'}>
                        {isAd ? '🛡' : '👤'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {!isDisabled && !isAd && (
                        confirmId === u.id ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--urb-text-2)', alignSelf: 'center', marginRight: 8 }}>Confirmer?</span>
                            <button onClick={() => { deactivateUser(u.id, u.email); setConfirmId(null) }} style={{ background: 'var(--urb-danger)', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Oui</button>
                            <button onClick={() => setConfirmId(null)} style={{ background: 'var(--urb-text-3)', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Non</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmId(u.id)} style={{
                            background: 'transparent', border: '1px solid var(--urb-danger)', color: 'var(--urb-danger)',
                            borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                          }}>
                            🚫 Désactiver
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{padding:40, textAlign:'center'}}>Chargement du tableau de bord...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
