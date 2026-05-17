'use client'

import { useState, useEffect, FormEvent } from 'react'
import { categoryAPI, sectorAPI, incidentAPI } from '@/lib/api'
import { Check, UploadCloud } from 'lucide-react'

interface SignalerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignalerModal({ isOpen, onClose }: SignalerModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<{ id: number; name: string; icon?: string }[]>([])
  const [sectors, setSectors] = useState<{ id: number; name: string; centerLat?: number; centerLng?: number }[]>([])

  const [categoryId, setCategoryId] = useState('')
  const [sectorId, setSectorId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)

  const [aiResult, setAiResult] = useState<any>(null)

  useEffect(() => {
    if (!isOpen) return
    setStep(1)
    setTitle(''); setDescription(''); setCategoryId(''); setSectorId(''); setPhoto(null); setError(null); setAiResult(null)

    const fetchData = async () => {
      try {
        const [catRes, secRes] = await Promise.all([categoryAPI.getAll(), sectorAPI.getAll()])
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data?.content ?? [])
        setSectors(Array.isArray(secRes.data) ? secRes.data : secRes.data?.content ?? [])
      } catch (err) {}
    }
    fetchData()
  }, [isOpen])

  const goNext = () => {
    setError(null)
    if (step === 1 && !categoryId) { setError('Veuillez sélectionner une catégorie'); return }
    if (step === 2 && !sectorId) { setError('Veuillez sélectionner un secteur'); return }
    if (step === 2 && (!title.trim() || !description.trim())) { setError('Titre et description requis'); return }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    const catId = parseInt(categoryId, 10); const secId = parseInt(sectorId, 10);
    const sec = sectors.find(s => s.id === secId);
    const lat = sec?.centerLat ?? 31.6295; const lng = sec?.centerLng ?? -7.9811;

    setLoading(true); setError(null)
    try {
      const formData = new FormData()
      formData.append('data', new Blob([JSON.stringify({ title, description, categoryId: catId, sectorId: secId, latitude: lat, longitude: lng })], { type: 'application/json' }))
      if (photo) formData.append('photo', photo)

      const res = await incidentAPI.create(formData)
      setAiResult(res.data)
      setStep(3)
      window.dispatchEvent(new CustomEvent('incident-created'))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission')
    } finally { setLoading(false) }
  }

  const sevBg = (s:string) => s==='HIGH'?'var(--urb-danger)':s==='MEDIUM'?'var(--urb-gold)':'var(--urb-success)'

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{
        background: 'white', borderRadius: 16, width: '100%', maxWidth: 640,
        boxShadow: 'var(--urb-shadow-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* STEP INDICATOR */}
        <div style={{
          padding: '24px 32px 16px', borderBottom: '1px solid var(--urb-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          {[ {num:1, label:'Catégorie'}, {num:2, label:'Détails'}, {num:3, label:'Résultat IA'} ].map((s, i, arr) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: s.num!==3 ? 1 : 0 }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                 <div style={{
                   width: 32, height: 32, borderRadius: '50%',
                   background: step > s.num ? 'var(--urb-accent)' : step === s.num ? 'var(--urb-primary)' : 'white',
                   border: step >= s.num ? 'none' : '2px solid var(--urb-border-dk)',
                   color: step >= s.num ? 'white' : 'var(--urb-text-3)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700
                 }}>
                   {step > s.num ? <Check size={16}/> : s.num}
                 </div>
                 <span style={{
                   fontSize: 11, fontWeight: step >= s.num ? 700 : 500,
                   color: step >= s.num ? 'var(--urb-text)' : 'var(--urb-text-3)'
                 }}>
                   {s.label}
                 </span>
               </div>
               {s.num !== 3 && (
                 <div style={{
                   flex: 1, height: 2, margin: '0 16px', alignSelf: 'flex-start', marginTop: 15,
                   background: step > s.num ? 'var(--urb-accent)' : 'var(--urb-border)'
                 }}/>
               )}
            </div>
          ))}
        </div>

        <div style={{ padding: 32, flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
          {error && (
             <div style={{ background: 'var(--urb-danger-lt)', color: 'var(--urb-danger)', padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
               {error}
             </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>De quoi s'agit-il ?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {categories.map(cat => (
                  <div key={cat.id} onClick={() => setCategoryId(String(cat.id))} style={{
                    border: categoryId===String(cat.id) ? '2px solid var(--urb-primary)' : '1px solid var(--urb-border)',
                    background: categoryId===String(cat.id) ? 'var(--urb-primary-lt)' : 'white',
                    borderRadius: 10, padding: '14px 8px', textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.icon || '❔'}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--urb-text)' }}>{cat.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Où se situe le problème ? (Secteur)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {sectors.map(sec => (
                    <div key={sec.id} onClick={() => setSectorId(String(sec.id))} style={{
                      border: sectorId===String(sec.id) ? '2px solid var(--urb-primary)' : '1px solid var(--urb-border)',
                      background: sectorId===String(sec.id) ? 'var(--urb-primary-lt)' : 'white',
                      borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, transition: 'all 0.15s'
                    }}>
                      {sec.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Titre court</label>
                <input value={title} onChange={e => setTitle(e.target.value)} style={{
                  width: '100%', border: '1px solid var(--urb-border)', padding: '12px 14px', borderRadius: 8,
                  fontSize: 14, outline: 'none'
                }} placeholder="Ex: Fuite d'eau importante" className="focus-ring"/>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700 }}>Description détaillée</label>
                  <span style={{ fontSize: 11, color: 'var(--urb-text-3)' }}>{description.length}/500</span>
                </div>
                <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 500))} rows={4} style={{
                  width: '100%', border: '1px solid var(--urb-border)', padding: '12px 14px', borderRadius: 8,
                  fontSize: 14, outline: 'none', resize: 'vertical'
                }} className="focus-ring" placeholder="Précisez la situation exacte..."/>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Photo (optionnel)</label>
                <div style={{
                  border: '2px dashed var(--urb-border-dk)', borderRadius: 10, padding: 32,
                  textAlign: 'center', cursor: 'pointer', background: 'var(--urb-bg)', position: 'relative'
                }}>
                   <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0]||null)} style={{
                     position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'
                   }}/>
                   <UploadCloud size={32} color="var(--urb-text-3)" style={{ margin: '0 auto 12px' }}/>
                   <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--urb-text-2)' }}>
                     {photo ? photo.name : "Glissez une photo ou cliquez ici"}
                   </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && aiResult && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
               <div style={{
                 width: 80, height: 80, borderRadius: '50%', background: 'var(--urb-success-lt)', color: 'var(--urb-success)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
               }}>
                 <Check size={40} />
               </div>
               <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Signalement Reçu</h2>
               <p style={{ color: 'var(--urb-text-2)', marginBottom: 32 }}>L'IA UrbanOps a classifié votre incident avec succès.</p>

               <div style={{ 
                 background: 'var(--urb-bg)', borderRadius: 12, padding: 24,
                 border: '1px solid var(--urb-border)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16
               }}>
                 <div>
                   <div style={{ fontSize: 11, color: 'var(--urb-text-3)', fontWeight: 700, textTransform: 'uppercase' }}>Référence officielle</div>
                   <div style={{ fontSize: 24, fontFamily: 'monospace', color: 'var(--urb-primary)', fontWeight: 800 }}>{aiResult.referenceCode}</div>
                 </div>
                 
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <div style={{ fontSize: 11, color: 'var(--urb-text-3)', fontWeight: 700, textTransform: 'uppercase' }}>Sévérité IA</div>
                     <div style={{ fontSize: 16, fontWeight: 800, color: sevBg(aiResult.severity), marginTop: 4 }}>
                       {aiResult.severity}
                     </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: 11, color: 'var(--urb-text-3)', fontWeight: 700, textTransform: 'uppercase' }}>Autorité Alertée</div>
                     <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--urb-text)', marginTop: 4 }}>
                       ✉️ {aiResult.authorityNotified || 'Autorité locale'}
                     </div>
                   </div>
                 </div>

                 <div>
                   <div style={{ fontSize: 11, color: 'var(--urb-text-3)', fontWeight: 700, textTransform: 'uppercase' }}>Analyse détaillée</div>
                   <div style={{ fontSize: 13, color: 'var(--urb-text)', fontStyle: 'italic', marginTop: 4, background: 'var(--urb-surface)', padding: 12, borderRadius: 8, border: '1px solid var(--urb-border)' }}>
                     "{aiResult.aiAnalysisResult || 'Classification par IA effectuée.'}"
                   </div>
                   <div style={{ marginTop: 8, height: 4, background: 'var(--urb-border)', borderRadius: 2, overflow: 'hidden' }}>
                     <div style={{ height: '100%', width: '92%', background: 'var(--urb-accent)' }}/>
                   </div>
                   <div style={{ fontSize: 10, color: 'var(--urb-text-3)', textAlign: 'right', marginTop: 4 }}>Confiance IA : 92%</div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{
          padding: '20px 32px', borderTop: '1px solid var(--urb-border)', background: 'var(--urb-bg)',
          display: 'flex', justifyContent: 'space-between', gap: 16
        }}>
          {!loading && step !== 3 ? (
             <button onClick={onClose} style={{
               background: 'transparent', color: 'var(--urb-text-2)', border: 'none',
               fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '10px'
             }}>Annuler</button>
          ) : <div/>}

          {step === 1 && (
             <button onClick={goNext} style={{
               background: 'var(--urb-primary)', color: 'white', border: 'none', borderRadius: 8,
               padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer'
             }}>Suivant →</button>
          )}

           {step === 2 && (
             <button onClick={handleSubmit} disabled={loading} style={{
               background: 'var(--urb-primary)', color: 'white', border: 'none', borderRadius: 8,
               padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
             }}>{loading ? 'Analyse par l\'IA...' : 'Soumettre le problème'}</button>
          )}

          {step === 3 && (
             <button onClick={onClose} style={{
               background: 'var(--urb-accent)', color: 'white', border: 'none', borderRadius: 8,
               padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginLeft: 'auto'
             }}>Terminer</button>
          )}
        </div>
      </div>
    </div>
  )
}
