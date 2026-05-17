'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { SignalerModal } from '@/components/shared/SignalerModal'

type NavUser = {
  email: string
  role: string
  firstName: string
}

function getUser(): NavUser | null {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('urbanops_token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('urbanops_token')
      localStorage.removeItem('urbanops_user')
      return null
    }

    let stored: any = null
    try {
      const raw = localStorage.getItem('urbanops_user')
      if (raw) stored = JSON.parse(raw)
    } catch {}

    const rawRole = payload.role ?? stored?.role ?? payload.authorities?.[0] ?? 'CITIZEN'
    const role = String(rawRole).replace(/^ROLE_/, '')
    const email = payload.sub ?? stored?.email ?? ''
    const firstName = payload.firstName || stored?.firstName || email.split('@')[0] || 'Utilisateur'

    return { email, role, firstName }
  } catch {
    return null
  }
}

export function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<NavUser | null>(null)
  
  const pathname = usePathname()

  useEffect(() => {
    setUser(getUser())
    const handler = () => setUser(getUser())
    window.addEventListener('storage', handler)
    window.addEventListener('urbanops-auth-changed', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('urbanops-auth-changed', handler)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('urbanops_token')
    localStorage.removeItem('urbanops_user')
    setUser(null)
    window.location.href = '/'
  }

  const isAdmin = Boolean(user?.role?.includes('ADMIN'))

  const navLinkStyle = (path: string, exact: boolean = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path) && path !== '/'
    return {
      color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 500,
      borderBottom: isActive ? '2px solid var(--urb-primary)' : '2px solid transparent',
      padding: '18px 0',
      transition: 'color 0.15s'
    }
  }

  return (
    <>
      <nav style={{
        background: 'rgba(28,25,23,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 32px',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 200
      }}>
        {/* LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--urb-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: 'white'
          }}>U</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'white', letterSpacing: '-0.01em' }}>
            UrbanOps
          </span>
          <span style={{
            fontSize: 9, color: 'var(--urb-primary)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            border: '1px solid var(--urb-primary)', borderRadius: 4, padding: '1px 5px'
          }}>
            MARRAKECH
          </span>
        </Link>

        {/* CENTER LINKS (Desktop) */}
        <div style={{ display: 'none', gap: 32 }} className="md-flex">
          <style>{`
            @media (min-width: 768px) { .md-flex { display: flex !important; } .md-hidden { display: none !important; } }
          `}</style>
          
          <Link href="/" style={navLinkStyle('/', true)} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => {if(pathname!=='/')e.currentTarget.style.color='rgba(255,255,255,0.6)'}}>
            Accueil
          </Link>
          <Link href="/carte" style={navLinkStyle('/carte')} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => {if(pathname!=='/carte')e.currentTarget.style.color='rgba(255,255,255,0.6)'}}>
            Carte
          </Link>
          
          {!user ? (
            <Link href="/#how" style={navLinkStyle('/#how')} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}>
              Comment ça marche
            </Link>
          ) : isAdmin ? (
            <Link href="/dashboard" style={navLinkStyle('/dashboard')} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => {if(!pathname.startsWith('/dashboard'))e.currentTarget.style.color='rgba(255,255,255,0.6)'}}>
              Dashboard
            </Link>
          ) : (
            <Link href="/mes-signalements" style={navLinkStyle('/mes-signalements')} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => {if(!pathname.startsWith('/mes-signalements'))e.currentTarget.style.color='rgba(255,255,255,0.6)'}}>
              Tableau de bord
            </Link>
          )}
        </div>

        {/* RIGHT SIDE (Desktop) */}
        <div style={{ display: 'none', alignItems: 'center', gap: 16 }} className="md-flex">
          {!user ? (
            <>
              <Link href="/auth/signin" style={{
                color: 'white', fontSize: 13, fontWeight: 600, padding: '7px 16px',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8
              }}>
                Se connecter
              </Link>
              <Link href="/auth/signup" style={{
                background: 'var(--urb-primary)', color: 'white', fontSize: 13, fontWeight: 600,
                padding: '8px 16px', borderRadius: 8
              }}>
                S'inscrire
              </Link>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>👤 {user.firstName}</span>
                <span style={{
                  background: isAdmin ? 'var(--urb-primary)' : 'var(--urb-accent)',
                  color: 'white', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 12
                }}>
                  {isAdmin ? 'ADMIN' : 'CITOYEN'}
                </span>
              </div>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', 
                fontSize: 12, cursor: 'pointer', marginLeft: 8
              }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}>
                Déconnexion
              </button>
              <button onClick={() => setModalOpen(true)} style={{
                background: 'var(--urb-primary)', color: 'white', border: 'none',
                borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginLeft: 8
              }}>
                + Signaler
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md-hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{
          background:'transparent', border:'none', color:'white', cursor:'pointer'
        }}>
          {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>

        {/* MOBILE OVERLAY */}
        {mobileOpen && (
          <div className="md-hidden" style={{
            position:'absolute', top: 56, left: 0, right: 0, background:'rgba(28,25,23,0.98)',
            borderBottom:'1px solid rgba(255,255,255,0.1)', padding: 20, display:'flex', flexDirection:'column', gap: 20
          }}>
             <Link href="/" style={{color:'white', fontWeight:600}} onClick={() => setMobileOpen(false)}>Accueil</Link>
             <Link href="/carte" style={{color:'white', fontWeight:600}} onClick={() => setMobileOpen(false)}>Carte</Link>
             
             {!user ? (
               <>
                <Link href="/#how" style={{color:'white', fontWeight:600}} onClick={() => setMobileOpen(false)}>Comment ça marche</Link>
                <div style={{display:'flex', gap:10, marginTop:10}}>
                  <Link href="/auth/signin" style={{flex:1, textAlign:'center', color:'white', border:'1px solid rgba(255,255,255,0.2)', padding:'10px', borderRadius:8}}>Se connecter</Link>
                  <Link href="/auth/signup" style={{flex:1, textAlign:'center', background:'var(--urb-primary)', color:'white', padding:'10px', borderRadius:8}}>S'inscrire</Link>
                </div>
               </>
             ) : (
               <>
                {isAdmin ? (
                  <Link href="/dashboard" style={{color:'white', fontWeight:600}} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                ) : (
                  <Link href="/mes-signalements" style={{color:'white', fontWeight:600}} onClick={() => setMobileOpen(false)}>Tableau de bord</Link>
                )}
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 10, borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop: 20}}>
                  <div style={{color:'white', fontWeight:600}}>
                    {user.firstName} <span style={{background:isAdmin?'var(--urb-primary)':'var(--urb-accent)', fontSize:9, padding:'2px 6px', borderRadius:10}}>{isAdmin?'ADMIN':'CITOYEN'}</span>
                  </div>
                  <button onClick={handleLogout} style={{background:'transparent', border:'none', color:'rgba(255,255,255,0.6)'}}>Déconnexion</button>
                </div>
                <button onClick={() => {setModalOpen(true); setMobileOpen(false)}} style={{
                  background: 'var(--urb-primary)', color: 'white', border: 'none',
                  borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, width: '100%', marginTop:10
                }}>
                  Signaler un problème
                </button>
               </>
             )}
          </div>
        )}
      </nav>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
