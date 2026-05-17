'use client'
export function Footer() {
  return (
    <footer style={{
      background:'#1c1917', color:'rgba(255,255,255,0.5)',
      padding:'32px', textAlign:'center', fontSize:12,
      borderTop:'1px solid rgba(255,255,255,0.06)'
    }}>
      <div style={{fontWeight:700, color:'rgba(255,255,255,0.8)', marginBottom:6}}>
        🏙 UrbanOps
      </div>
      <div>Système intelligent de supervision urbaine — Marrakech, Maroc</div>
      <div style={{marginTop:8, fontSize:11}}>
        © 2026 UrbanOps · ELHEZZAM Mohamed Amine · BOUCETTA Khalil
      </div>
    </footer>
  )
}
