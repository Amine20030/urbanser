export function StatsPills() {
  return (
    <div style={{display:'flex', gap:24, marginTop:40, flexWrap:'wrap', justifyContent: 'center'}}>
      {[
        {n:'1 284',l:'Signalements'},
        {n:'89%',l:'Résolus'},
        {n:'< 2min',l:'Analyse IA'},
        {n:'8',l:'Secteurs couverts'},
      ].map(({n,l}, i) => (
        <div key={i} style={{textAlign:'center'}}>
          <div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--urb-primary-lt)'}}>{n}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',
            letterSpacing:'0.06em'}}>{l}</div>
        </div>
      ))}
    </div>
  )
}
