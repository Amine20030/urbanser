'use client'

import { useState, useEffect, FormEvent } from 'react'
import { categoryAPI, sectorAPI, incidentAPI } from '@/lib/api'
import { Toast } from './Toast'

interface SignalerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignalerModal({ isOpen, onClose }: SignalerModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null)

  const [categories, setCategories] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sectorId, setSectorId] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)

  const [aiResult, setAiResult] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setTitle('')
      setDescription('')
      setCategoryId('')
      setSectorId('')
      setLatitude('')
      setLongitude('')
      setPhoto(null)
      setError(null)
      setAiResult(null)

      if (categories.length === 0) {
        Promise.all([categoryAPI.getAll(), sectorAPI.getAll()]).then(([catRes, secRes]) => {
          setCategories(catRes.data)
          setSectors(secRes.data)
        }).catch(err => console.error("Failed to fetch form data", err))
      }
    }
  }, [isOpen])

  const handleSectorChange = (id: string) => {
    setSectorId(id)
    const sector = sectors.find(s => s.id === Number(id))
    if (sector?.centerLat && sector?.centerLng) {
      setLatitude(String(sector.centerLat))
      setLongitude(String(sector.centerLng))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title || !description || !categoryId || !sectorId) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      const lat = parseFloat(latitude) || sectors.find(s=>s.id===Number(sectorId))?.centerLat || 31.6295
      const lng = parseFloat(longitude) || sectors.find(s=>s.id===Number(sectorId))?.centerLng || -7.9811

      formData.append('data', new Blob([JSON.stringify({
        title,
        description,
        categoryId: parseInt(categoryId),
        sectorId: parseInt(sectorId),
        latitude: lat,
        longitude: lng
      })], { type: 'application/json' }))
      
      if (photo) {
        formData.append('photo', photo)
      }

      const res = await incidentAPI.create(formData)
      setAiResult(res.data)
      setStep(3)
      window.dispatchEvent(new CustomEvent('incident-created'))
      setToast({ message: "Incident signalé avec succès !", type: 'success' })
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || "Erreur lors de la création de l'incident"
      setError(msg)
      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'HIGH': case 'CRITICAL': return { bg: '#ef4444', text: 'Critique / Élevé' }
      case 'MEDIUM': return { bg: '#f59e0b', text: 'Moyen' }
      case 'LOW': return { bg: '#22c55e', text: 'Faible' }
      default: return { bg: '#3b82f6', text: severity }
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{
        background: '#131920',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#e8edf3', margin: 0 }}>
            {step === 3 ? "Signalement Envoyé" : "Signaler un problème"}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#7a8899', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

        {step === 1 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#e8edf3', fontSize: '14px' }}>Titre *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} placeholder="Ex: Câble exposé" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#e8edf3', fontSize: '14px' }}>Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} style={inputStyle} placeholder="Détails du problème..."></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label style={{ color: '#e8edf3', fontSize: '14px' }}>Catégorie *</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={inputStyle}>
                  <option value="">Sélectionnez</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label style={{ color: '#e8edf3', fontSize: '14px' }}>Secteur *</label>
                <select value={sectorId} onChange={(e) => handleSectorChange(e.target.value)} required style={inputStyle}>
                  <option value="">Sélectionnez</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label style={{ color: '#e8edf3', fontSize: '14px' }}>Latitude *</label>
                <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label style={{ color: '#e8edf3', fontSize: '14px' }}>Longitude *</label>
                <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#e8edf3', fontSize: '14px' }}>Photo (Optionnel)</label>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} style={{ color: '#7a8899', fontSize: '14px' }} />
            </div>

            <button type="submit" disabled={loading} style={{
              background: '#3b82f6', color: '#fff', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '1rem'
            }}>
              {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
            </button>
          </form>
        )}

        {step === 3 && aiResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#7a8899', margin: '0 0 0.5rem 0' }}>Référence</p>
              <h3 style={{ color: '#e8edf3', fontSize: '2rem', margin: 0 }}>{aiResult.referenceCode}</h3>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1.5rem' }}>
              <h4 style={{ color: '#e8edf3', marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Analyse IA</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ display: 'block', color: '#7a8899', fontSize: '12px', marginBottom: '4px' }}>Sévérité</span>
                  <span style={{ 
                    display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    background: `${getSeverityStyle(aiResult.severity).bg}20`,
                    color: getSeverityStyle(aiResult.severity).bg 
                  }}>
                    {getSeverityStyle(aiResult.severity).text}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#7a8899', fontSize: '12px', marginBottom: '4px' }}>Catégorie détectée</span>
                  <span style={{ color: '#e8edf3', fontSize: '14px' }}>{aiResult.category?.name || "N/A"}</span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ display: 'block', color: '#7a8899', fontSize: '12px', marginBottom: '4px' }}>Autorité notifiée</span>
                  <span style={{ color: '#e8edf3', fontSize: '14px' }}>{aiResult.authorityNotified}</span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ display: 'block', color: '#7a8899', fontSize: '12px', marginBottom: '4px' }}>Note de l'IA</span>
                  <span style={{ color: '#e8edf3', fontSize: '14px', fontStyle: 'italic' }}>{aiResult.aiAnalysisResult}</span>
                </div>
              </div>
            </div>

            <button onClick={onClose} style={{
              background: '#3b82f6', color: '#fff', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, width: '100%'
            }}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  background: '#0b0f14',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '0.75rem',
  color: '#e8edf3',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box' as 'border-box'
}
