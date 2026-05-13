'use client'

import { useState, useEffect, FormEvent } from 'react'
import { categoryAPI, sectorAPI, incidentAPI } from '@/lib/api'
import { Toast } from './Toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SignalerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignalerModal({ isOpen, onClose }: SignalerModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [categories, setCategories] = useState<{ id: number; name: string; icon?: string }[]>([])
  const [sectors, setSectors] = useState<
    { id: number; name: string; centerLat?: number; centerLng?: number }[]
  >([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sectorId, setSectorId] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)

  const [aiResult, setAiResult] = useState<{
    referenceCode?: string
    severity?: string
    category?: { name?: string }
    authorityNotified?: string
    aiAnalysisResult?: string
  } | null>(null)

  useEffect(() => {
    if (!isOpen) return
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

    const fetchData = async () => {
      try {
        const [catRes, secRes] = await Promise.all([categoryAPI.getAll(), sectorAPI.getAll()])
        const catData = catRes.data
        const secData = secRes.data
        const cats = Array.isArray(catData) ? catData : catData?.content ?? []
        const secs = Array.isArray(secData) ? secData : secData?.content ?? []
        setCategories(cats)
        setSectors(secs)
      } catch (err) {
        console.error('Failed to load categories/sectors:', err)
      }
    }
    void fetchData()
  }, [isOpen])

  const handleSectorChange = (value: string) => {
    setSectorId(value)
    const sec = sectors.find((s) => String(s.id) === value)
    if (sec?.centerLat != null && sec?.centerLng != null) {
      setLatitude(String(sec.centerLat))
      setLongitude(String(sec.centerLng))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title?.trim() || !description?.trim()) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    const catId = parseInt(categoryId, 10)
    const secId = parseInt(sectorId, 10)
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (Number.isNaN(catId) || catId <= 0) {
      setError('Veuillez sélectionner une catégorie')
      return
    }
    if (Number.isNaN(secId) || secId <= 0) {
      setError('Veuillez sélectionner un secteur')
      return
    }
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Coordonnées invalides')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()

      formData.append(
        'data',
        new Blob(
          [
            JSON.stringify({
              title: title.trim(),
              description: description.trim(),
              categoryId: catId,
              sectorId: secId,
              latitude: lat,
              longitude: lng,
            }),
          ],
          { type: 'application/json' }
        )
      )

      if (photo) {
        formData.append('photo', photo)
      }

      const res = await incidentAPI.create(formData)
      setAiResult(res.data)
      setStep(3)
      window.dispatchEvent(new CustomEvent('incident-created'))
      setToast({ message: 'Incident signalé avec succès !', type: 'success' })
    } catch (err: unknown) {
      console.error(err)
      const ax = err as { response?: { data?: { message?: string } } }
      const msg = ax.response?.data?.message || "Erreur lors de la création de l'incident"
      setError(msg)
      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'HIGH':
      case 'CRITICAL':
        return { bg: '#ef4444', text: 'Critique / Élevé' }
      case 'MEDIUM':
        return { bg: '#f59e0b', text: 'Moyen' }
      case 'LOW':
        return { bg: '#22c55e', text: 'Faible' }
      default:
        return { bg: '#3b82f6', text: severity }
    }
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-bg-base/80 px-3 py-2.5 text-sm text-t1 shadow-sm placeholder:text-t3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-bg-hover/50'

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-border/80 bg-card/95 backdrop-blur-xl sm:max-w-xl">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <DialogHeader>
          <DialogTitle>{step === 3 ? 'Signalement envoyé' : 'Signaler un problème'}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="uo-title">Titre *</Label>
              <Input
                id="uo-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ex : câble exposé"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uo-desc">Description *</Label>
              <textarea
                id="uo-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className={cn(fieldClass, 'min-h-[96px] resize-y')}
                placeholder="Détails du problème…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="uo-cat">Catégorie *</Label>
                <select
                  id="uo-cat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className={fieldClass}
                >
                  <option value="">-- Choisir une catégorie --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.icon ? `${c.icon} ` : ''}
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="uo-sec">Secteur *</Label>
                <select
                  id="uo-sec"
                  value={sectorId}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  required
                  className={fieldClass}
                >
                  <option value="">-- Choisir un secteur --</option>
                  {sectors.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="uo-lat">Latitude *</Label>
                <Input
                  id="uo-lat"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uo-lng">Longitude *</Label>
                <Input
                  id="uo-lng"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="uo-photo">Photo (optionnel)</Label>
              <input
                id="uo-photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="text-xs text-t2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Envoi en cours…' : 'Envoyer le signalement'}
            </Button>
          </form>
        )}

        {step === 3 && aiResult && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-t3">Référence</p>
              <p className="mt-1 font-mono text-2xl font-bold text-t1">{aiResult.referenceCode}</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h4 className="mb-3 text-sm font-semibold text-t1">Analyse IA</h4>
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-t3">Sévérité</dt>
                  <dd className="mt-1">
                    <span
                      className="inline-flex rounded-md px-2 py-0.5 text-xs font-bold text-white"
                      style={{
                        backgroundColor: getSeverityStyle(aiResult.severity ?? '').bg,
                      }}
                    >
                      {getSeverityStyle(aiResult.severity ?? '').text}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-t3">Catégorie détectée</dt>
                  <dd className="mt-1 text-t1">{aiResult.category?.name ?? 'N/A'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-t3">Autorité notifiée</dt>
                  <dd className="mt-1 text-t1">{aiResult.authorityNotified}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-t3">Note de l&apos;IA</dt>
                  <dd className="mt-1 italic text-t2">{aiResult.aiAnalysisResult}</dd>
                </div>
              </dl>
            </div>

            <Button className="w-full" onClick={onClose}>
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
