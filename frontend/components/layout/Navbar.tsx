'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { SignalerModal } from '@/components/shared/SignalerModal'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for component mount
  useEffect(() => setMounted(true), [])

  return (
    <nav style={{
      background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link href="/" style={{
        fontFamily: 'monospace',
        fontWeight: 700,
        color: 'var(--t1)',
        textDecoration: 'none',
        fontSize: '16px'
      }}>
        🏙 UrbanOps
      </Link>

      {/* Desktop Navigation */}
      <div style={{
        display: 'flex',
        gap: '1.2rem',
        alignItems: 'center'
      }} className="flex items-center">
        
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            style={{ color: 'var(--t1)', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        <Link href="/incidents" style={{
          color: 'var(--t2)',
          textDecoration: 'none',
          fontSize: '13px'
        }}>
          Signalements
        </Link>
        <Link href="/auth/signin" style={{
          color: 'var(--t2)',
          textDecoration: 'none',
          fontSize: '13px'
        }}>
          Se connecter
        </Link>
        <Link href="/auth/signup" style={{
          background: 'var(--blue)',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '7px',
          fontWeight: 600
        }}>
          S'inscrire
        </Link>
        <button onClick={() => setModalOpen(true)} style={{
          background: 'var(--blue)',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '7px',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer'
        }}>
          Signaler un problème
        </button>
      </div>

      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </nav>
  )
}
