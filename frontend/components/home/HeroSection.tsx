'use client'
import { useState } from 'react'
export function HeroSection({ onSignaler }: { onSignaler?: () => void }) {
  return (
    <section style={{
      minHeight:'100vh', position:'relative',
      backgroundImage:"url('/images/background.jpg')",
      backgroundSize:'100% auto', backgroundPosition:'center top',
      backgroundRepeat:'no-repeat', backgroundColor:'#1c1917',
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{
        position:'absolute', inset:0,
        background:'rgba(28,25,23,0.58)', zIndex:0
      }}/>
      <div style={{position:'relative', zIndex:1, textAlign:'center', padding:'0 24px', maxWidth:680}}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:6,
          background:'rgba(194,65,12,0.85)', color:'white',
          padding:'4px 14px', borderRadius:20, fontSize:11,
          fontWeight:700, letterSpacing:'0.08em', marginBottom:20,
          textTransform:'uppercase'
        }}>🇲🇦 Marrakech · Supervision Urbaine Intelligente</div>
        <h1 style={{
          fontSize:'clamp(2.5rem,6vw,4.2rem)', fontWeight:900,
          lineHeight:1.05, color:'white', marginBottom:16,
          letterSpacing:'-0.02em'
        }}>
          La ville signale.<br/>
          <span style={{color:'#fed7aa'}}>L'IA répond.</span>
        </h1>
        <p style={{
          fontSize:'clamp(1rem,2vw,1.2rem)', color:'rgba(255,255,255,0.72)',
          maxWidth:500, margin:'0 auto 32px', lineHeight:1.6
        }}>
          Photographiez un problème urbain. Notre intelligence artificielle
          l'analyse, évalue le danger et alerte l'autorité compétente en secondes.
        </p>
        <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
          <button onClick={onSignaler} style={{
            background:'#c2410c', color:'white', border:'none',
            borderRadius:10, padding:'14px 28px', fontSize:14,
            fontWeight:700, cursor:'pointer'
          }}>📷 Signaler maintenant</button>
          <a href="/carte" style={{
            color:'white', border:'1px solid rgba(255,255,255,0.3)',
            borderRadius:10, padding:'14px 28px', fontSize:14,
            fontWeight:500, textDecoration:'none', display:'inline-block'
          }}>Voir la carte →</a>
        </div>
        <div style={{display:'flex', gap:32, justifyContent:'center', marginTop:48, flexWrap:'wrap'}}>
          {[['1 284','Signalements'],['89%','Résolus'],['< 2min','Analyse IA'],['8','Secteurs']].map(([n,l]) => (
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontSize:'1.6rem', fontWeight:800, color:'#fed7aa'}}>{n}</div>
              <div style={{fontSize:10, color:'rgba(255,255,255,0.55)',
                textTransform:'uppercase', letterSpacing:'0.06em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
