'use client'
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('@/components/shared/MapView'), {
  ssr: false,
  loading: () => (
    <div style={{height:480,background:'#f1f5f9',borderRadius:12,
      display:'flex',alignItems:'center',justifyContent:'center',
      color:'#64748b',fontSize:14}}>
      Chargement de la carte...
    </div>
  )
})
export function LiveMapSection({ onSignaler }: { onSignaler?: () => void }) {
  return (
    <section style={{padding:'0', background:'#fafaf9'}}>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'24px 32px 16px', maxWidth:1400, margin:'0 auto'
      }}>
        <h2 style={{fontSize:20, fontWeight:700, color:'#1c1917', margin:0}}>
          🗺 Carte en temps réel — Marrakech
        </h2>
        <button onClick={onSignaler} style={{
          background:'#c2410c', color:'white', border:'none',
          borderRadius:8, padding:'8px 18px', fontSize:12,
          fontWeight:700, cursor:'pointer'
        }}>+ Signaler ici</button>
      </div>
      <div style={{padding:'0 32px 32px', maxWidth:1400, margin:'0 auto'}}>
        <MapView height="480px" onMapClick={onSignaler} />
      </div>
    </section>
  )
}
