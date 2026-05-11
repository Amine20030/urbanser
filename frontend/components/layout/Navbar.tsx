'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SignalerModal } from '@/components/shared/SignalerModal'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <nav style={{
      background: '#0e1218',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
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
        color: '#e8edf3',
        textDecoration: 'none',
        fontSize: '14px'
      }}>
        🏙 UrbanOps
      </Link>

      {/* Desktop Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }} className="desktop-nav">
        <Link href="/incidents" style={{
          color: '#7a8899',
          textDecoration: 'none',
          fontSize: '13px'
        }}>
          Signalements
        </Link>
        <Link href="/auth/signin" style={{
          color: '#7a8899',
          textDecoration: 'none',
          fontSize: '13px'
        }}>
          Se connecter
        </Link>
        <Link href="/auth/signup" style={{
          background: '#1d4ed8',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '7px',
          fontWeight: 600
        }}>
          S&apos;inscrire
        </Link>
        <button onClick={() => setModalOpen(true)} style={{
          background: '#3b82f6',
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

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#e8edf3',
          fontSize: '18px',
          cursor: 'pointer'
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '52px',
          left: 0,
          right: 0,
          background: '#0e1218',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link href="/incidents" style={{
            color: '#7a8899',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '0.5rem 0'
          }}>
            Signalements
          </Link>
          <Link href="/auth/signin" style={{
            color: '#7a8899',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '0.5rem 0'
          }}>
            Se connecter
          </Link>
          <Link href="/auth/signup" style={{
            background: '#1d4ed8',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '0.75rem 1rem',
            borderRadius: '7px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            S&apos;inscrire
          </Link>
        </div>
      )}
      
      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </nav>
  )
}
