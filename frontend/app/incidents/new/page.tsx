'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import api, { categoryAPI, sectorAPI, incidentAPI } from '@/lib/api'

type Category = { id: number; name: string }
type Sector = { id: number; name: string; centerLat?: number; centerLng?: number }

const DEFAULT_LAT = 31.6295
const DEFAULT_LNG = -7.9811

export default function NewIncidentPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sectorId, setSectorId] = useState('')
  const [latitude, setLatitude] = useState(String(DEFAULT_LAT))
  const [longitude, setLongitude] = useState(String(DEFAULT_LNG))
  const [photo, setPhoto] = useState<File | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [catRes, secRes] = await Promise.all([categoryAPI.getAll(), sectorAPI.getAll()])
        if (cancelled) return
        setCategories(catRes.data ?? [])
        setSectors(secRes.data ?? [])
      } catch {
        if (!cancelled) setError('Impossible de charger catégories et secteurs. Vérifiez que le backend est démarré.')
      } finally {
        if (!cancelled) setLoadingMeta(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const s = sectors.find((x) => String(x.id) === sectorId)
    if (s?.centerLat != null && s?.centerLng != null) {
      setLatitude(String(s.centerLat))
      setLongitude(String(s.centerLng))
    }
  }, [sectorId, sectors])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!categoryId || !sectorId) {
      setError('Choisissez une catégorie et un secteur.')
      return
    }
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Latitude et longitude invalides.')
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      categoryId: Number(categoryId),
      sectorId: Number(sectorId),
      latitude: lat,
      longitude: lng,
    }

    const form = new FormData()
    form.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    if (photo) form.append('photo', photo)

    setSubmitting(true)
    try {
      await incidentAPI.create(form)
      router.push('/incidents')
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      const msg =
        ax.response?.data?.message ||
        (typeof ax.response?.data === 'object' && ax.response?.data !== null
          ? JSON.stringify(ax.response.data)
          : null) ||
        'Échec de l’envoi du signalement.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--t1)]">
      <header className="border-b border-[var(--border)] px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--t2)] hover:text-[var(--t1)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l’accueil
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-xl font-semibold mb-2">Signaler un incident</h1>
        <p className="text-sm text-[var(--t3)] mb-8">
          Décrivez le problème et indiquez l’emplacement (coordonnées mises à jour selon le secteur choisi).
        </p>

        {loadingMeta ? (
          <p className="text-sm text-[var(--t3)]">Chargement…</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wide text-[var(--t3)] mb-1">Titre</label>
              <input
                required
                minLength={5}
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
                placeholder="Ex. : Nid-de-poule avenue X"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-[var(--t3)] mb-1">Description</label>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
                placeholder="Détails utiles pour les services…"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-[var(--t3)] mb-1">Catégorie</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-[var(--t3)] mb-1">Secteur</label>
                <select
                  required
                  value={sectorId}
                  onChange={(e) => setSectorId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-[var(--t3)] mb-1">Latitude</label>
                <input
                  required
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-[var(--t3)] mb-1">Longitude</label>
                <input
                  required
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-[var(--t3)] mb-1">Photo (optionnel)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-[var(--t2)]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {submitting ? 'Envoi…' : 'Envoyer le signalement'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
