'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { SignalerModal } from '@/components/shared/SignalerModal'

function getCurrentUser() {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('urbanops_token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { email: payload.sub, role: payload.role }
  } catch { return null }
}

export function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{email: string, role: string} | null>(null)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('urbanops_theme') || 'light'
    setTheme(savedTheme)
    if (savedTheme === 'dark') document.documentElement.classList.add('dark')
    
    // Load user
    const u = getCurrentUser()
    setUser(u)

    const handleStorageChange = () => setUser(getCurrentUser())
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('urbanops_theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('urbanops_token')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav style={{
      background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link href="/" style={{
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 700,
        color: 'var(--t1)',
        textDecoration: 'none',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{fontSize: '24px'}}>🏙</span> UrbanOps
      </Link>

      {/* Center Navigation */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href="/" style={linkStyle}>Accueil</Link>
        <Link href="/?map=true" style={linkStyle}>Carte</Link>
        <Link href="/incidents" style={linkStyle}>Signalements</Link>
        <Link href="/about" style={linkStyle}>Comment ça marche</Link>
      </div>

      {/* Right Navigation */}
      <div style={{
        display: 'flex',
        gap: '1.2rem',
        alignItems: 'center'
      }}>
        
        {mounted && (
          <button 
            onClick={toggleTheme}
            style={{ color: 'var(--t1)', border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {mounted && user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {(user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') && (
              <Link href="/dashboard" style={linkStyle}>Tableau de bord</Link>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-hover)', padding: '4px 12px', borderRadius: '20px' }}>
              <span style={{ fontSize: '13px', color: 'var(--t1)', fontWeight: 500 }}>{user.email.split('@')[0]}</span>
              <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                {user.role}
              </span>
            </div>

            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LogOut size={16} /> <span style={{fontSize: '13px'}}>Déconnexion</span>
            </button>
          </div>
        ) : (
          mounted && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/auth/signin" style={{
                color: 'var(--blue)',
                textDecoration: 'none',
                fontSize: '13px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                border: '1px solid var(--blue)'
              }}>
                Se connecter
              </Link>
              <Link href="/auth/signup" style={{
                background: 'var(--blue)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                S'inscrire
              </Link>
            </div>
          )
        )}

        <button onClick={() => setModalOpen(true)} style={{
          background: '#3b82f6',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '13px',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
        }}>
          Signaler un problème
        </button>
      </div>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </nav>
  )
}

const linkStyle = {
  color: 'var(--t2)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'color 0.2s'
}
