'use client'
import { useEffect } from 'react'

export function Toast({ message, type, onClose }: { message: string; type: 'success'|'error'; onClose: () => void }) {
  useEffect(() => { 
    const t = setTimeout(onClose, 4000); 
    return () => clearTimeout(t) 
  }, [onClose])
  
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      background: type === 'success' ? '#22c55e' : '#ef4444',
      color: 'white', padding: '12px 20px', borderRadius: 10,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)', fontSize: 14,
      fontWeight: 600, animation: 'slideIn 0.2s ease',
      display: 'flex', gap: 10, alignItems: 'center'
    }}>
      {type === 'success' ? '✅' : '❌'} {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16 }}>×</button>
    </div>
  )
}
