'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { categoryAPI, sectorAPI, incidentAPI } from '@/lib/api'
import { Check, UploadCloud, X, Loader2, AlertCircle } from 'lucide-react'
import { getCategoryDisplayIcon } from '@/lib/categoryIcons'

type SignalerModalProps = Readonly<{
  isOpen: boolean
  onClose: () => void
}>

type Category = { id: number; name: string; icon?: string }
type Sector = { id: number; name: string; centerLat?: number; centerLng?: number }

const DEFAULT_LAT = 31.6295
const DEFAULT_LNG = -7.9811

export function SignalerModal({ isOpen, onClose }: SignalerModalProps) {
  const router = useRouter()
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [metaError, setMetaError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])

  const [categoryId, setCategoryId] = useState('')
  const [sectorId, setSectorId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [aiResult, setAiResult] = useState<{
    referenceCode?: string
    severity?: string
    authorityNotified?: string
    aiAnalysisResult?: string
  } | null>(null)

  const resetForm = useCallback(() => {
    setCategoryId('')
    setSectorId('')
    setTitle('')
    setDescription('')
    setPhoto(null)
    setSubmitError(null)
    setSuccess(false)
    setAiResult(null)
  }, [])

  const loadMeta = useCallback(async () => {
    setLoadingMeta(true)
    setMetaError(null)
    try {
      const [catRes, secRes] = await Promise.all([categoryAPI.getAll(), sectorAPI.getAll()])
      const cats = (Array.isArray(catRes.data) ? catRes.data : []).filter(
        (c: Category) =>
          !/trafic|assainissement|collecte des|éclairage public/i.test(c.name)
      )
      const secs = Array.isArray(secRes.data) ? secRes.data : []
      setCategories(cats)
      setSectors(secs)
      if (cats.length === 0) {
        setMetaError('Aucune catégorie disponible. Redémarrez le backend.')
      } else if (secs.length === 0) {
        setMetaError('Aucun secteur disponible. Vérifiez que le backend est démarré.')
      }
    } catch {
      setMetaError(
        'Impossible de charger catégories et secteurs. Vérifiez que le backend tourne sur le port 8080.'
      )
      setCategories([])
      setSectors([])
    } finally {
      setLoadingMeta(false)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    resetForm()
    loadMeta()
  }, [isOpen, resetForm, loadMeta])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async () => {
    setSubmitError(null)

    if (!categoryId) {
      setSubmitError('Choisissez une catégorie.')
      return
    }
    if (!sectorId) {
      setSubmitError('Choisissez un secteur.')
      return
    }
    const titleTrim = title.trim()
    const descTrim = description.trim()
    if (titleTrim.length < 5) {
      setSubmitError('Le titre doit contenir au moins 5 caractères.')
      return
    }
    if (descTrim.length < 10) {
      setSubmitError('La description doit contenir au moins 10 caractères.')
      return
    }

    const token =
      typeof globalThis !== 'undefined' ? globalThis.localStorage?.getItem('urbanops_token') : null
    if (!token) {
      setSubmitError('Vous devez être connecté pour envoyer un signalement.')
      return
    }

    const secId = Number.parseInt(sectorId, 10)
    const catId = Number.parseInt(categoryId, 10)
    const sec = sectors.find((s) => s.id === secId)
    const lat = sec?.centerLat ?? DEFAULT_LAT
    const lng = sec?.centerLng ?? DEFAULT_LNG

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append(
        'data',
        new Blob(
          [
            JSON.stringify({
              title: titleTrim,
              description: descTrim,
              categoryId: catId,
              sectorId: secId,
              latitude: lat,
              longitude: lng,
            }),
          ],
          { type: 'application/json' }
        )
      )
      if (photo) formData.append('photo', photo)

      const res = await incidentAPI.create(formData)
      setAiResult(res.data)
      setSuccess(true)
      globalThis.dispatchEvent(new CustomEvent('incident-created'))
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string }; status?: number } }
      if (ax.response?.status === 401) {
        setSubmitError('Session expirée. Reconnectez-vous.')
      } else {
        setSubmitError(ax.response?.data?.message || 'Erreur lors de l’envoi du signalement.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signaler-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose()
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div>
            <h2 id="signaler-title" className="text-lg font-bold text-stone-900">
              {success ? 'Signalement envoyé' : 'Nouveau signalement'}
            </h2>
            <p className="mt-0.5 text-sm text-stone-500">
              {success
                ? 'Votre incident a été enregistré.'
                : 'Décrivez le problème et choisissez catégorie + secteur.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {success && aiResult ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-8 w-8" />
              </div>
              <p className="font-mono text-2xl font-bold text-orange-700">
                {aiResult.referenceCode}
              </p>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-left text-sm">
                <p>
                  <span className="font-semibold text-stone-600">Sévérité :</span>{' '}
                  {aiResult.severity ?? '—'}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-stone-600">Autorité :</span>{' '}
                  {aiResult.authorityNotified ?? '—'}
                </p>
                {aiResult.aiAnalysisResult && (
                  <p className="mt-2 italic text-stone-700">{aiResult.aiAnalysisResult}</p>
                )}
              </div>
            </div>
          ) : loadingMeta ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-stone-500">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <p className="text-sm">Chargement des catégories…</p>
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              {metaError && (
                <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <div className="flex-1">
                    <p>{metaError}</p>
                    {metaError.includes('Connectez-vous') ? (
                      <button
                        type="button"
                        className="mt-2 font-semibold text-orange-700 underline"
                        onClick={() => {
                          handleClose()
                          router.push('/auth/signin')
                        }}
                      >
                        Se connecter
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="mt-2 font-semibold text-orange-700 underline"
                        onClick={() => loadMeta()}
                      >
                        Réessayer
                      </button>
                    )}
                  </div>
                </div>
              )}

              {submitError && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {submitError}
                </div>
              )}

              <fieldset className="space-y-3" disabled={categories.length === 0}>
                <legend className="text-sm font-bold text-stone-800">
                  Catégorie <span className="text-red-500">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {categories.map((cat) => {
                    const selected = categoryId === String(cat.id)
                    const Icon = getCategoryDisplayIcon(cat.name, cat.icon)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(String(cat.id))}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          selected
                            ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            selected ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </span>
                        <span className="text-center text-xs font-semibold leading-tight text-stone-800">
                          {cat.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <fieldset className="space-y-3" disabled={sectors.length === 0}>
                <legend className="text-sm font-bold text-stone-800">
                  Secteur <span className="text-red-500">*</span>
                </legend>
                <select
                  value={sectorId}
                  onChange={(e) => setSectorId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">— Choisir un secteur —</option>
                  {sectors.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </fieldset>

              <div className="space-y-2">
                <label htmlFor="incident-title" className="text-sm font-bold text-stone-800">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  id="incident-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder="Ex : Fuite d'eau avenue Mohammed VI"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                <p className="text-xs text-stone-500">Minimum 5 caractères</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="incident-desc" className="text-sm font-bold text-stone-800">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-stone-500">{description.length}/500</span>
                </div>
                <textarea
                  id="incident-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="Décrivez le problème : lieu précis, gravité, depuis quand…"
                  className="w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                <p className="text-xs text-stone-500">Minimum 10 caractères</p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-bold text-stone-800">Photo (optionnel)</span>
                <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-8 hover:border-orange-400 hover:bg-orange-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                  />
                  <UploadCloud className="mb-2 h-8 w-8 text-stone-400" />
                  <span className="text-sm font-medium text-stone-600">
                    {photo ? photo.name : 'Cliquez ou glissez une photo'}
                  </span>
                </label>
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
          {success ? (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
            >
              Terminer
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-200 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || loadingMeta || !!metaError}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Envoi en cours…' : 'Envoyer le signalement'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
