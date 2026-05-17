'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
function relativeTime(d: string) {
  if (!d) return ''
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'à l\'instant'
  if (m < 60) return `il y a ${m}min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  return `il y a ${Math.floor(h/24)}j`
}
const sev = (s:string) => s==='HIGH'?'#ef4444':s==='MEDIUM'?'#f59e0b':'#22c55e'
export function RecentReportsSection() {
  const [incidents, setIncidents] = useState<any[]>([])
  useEffect(() => {
    api.get('/incidents/recent').then(r => {
      const d = r.data
      setIncidents(Array.isArray(d) ? d : d?.content ?? [])
    }).catch(() => {})
  }, [])
  return (
    <section style={{padding:'48px 32px', background:'white', maxWidth:1400, margin:'0 auto'}}>
      <h2 style={{fontSize:22, fontWeight:700, color:'#1c1917', marginBottom:24}}>
        Signalements récents
      </h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16}}>
        {incidents.slice(0,6).map(inc => (
          <article key={inc.id} style={{
            border:'1px solid #e7e5e4',
            borderLeft:`4px solid ${sev(inc.severity)}`,
            borderRadius:10, padding:16, background:'white',
            transition:'box-shadow 0.15s, transform 0.15s',
            cursor:'pointer'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'
            ;(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow='none'
            ;(e.currentTarget as HTMLElement).style.transform='translateY(0)'
          }}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
              <span style={{fontSize:11, color:'#a8a29e'}}>
                {inc.category?.icon} {inc.category?.name}
              </span>
              <span style={{fontSize:10, color:'#a8a29e'}}>{relativeTime(inc.createdAt)}</span>
            </div>
            <h3 style={{fontSize:13, fontWeight:700, color:'#1c1917', marginBottom:8,
              display:'-webkit-box', WebkitLineClamp:2,
              WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.4}}>
              {inc.title}
            </h3>
            <div style={{fontSize:11, color:'#57534e', marginBottom:10}}>📍 {inc.sector?.name}</div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{fontFamily:'monospace', fontSize:10, color:'#c2410c', fontWeight:600}}>
                {inc.referenceCode}
              </span>
              <span style={{
                background: inc.status==='OPEN'?'#fef2f2':inc.status==='IN_PROGRESS'?'#fffbeb':'#f0fdf4',
                color: inc.status==='OPEN'?'#dc2626':inc.status==='IN_PROGRESS'?'#d97706':'#059669',
                padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600
              }}>
                {inc.status==='OPEN'?'🔴 Ouvert':inc.status==='IN_PROGRESS'?'🟡 En cours':'✅ Résolu'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
