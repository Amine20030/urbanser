'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, FormEvent } from 'react'
import { ArrowLeft, Camera, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { categoryAPI, sectorAPI, incidentAPI } from '@/lib/api'

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
        setCategories(Array.isArray(catRes.data) ? catRes.data : [])
        setSectors(Array.isArray(secRes.data) ? secRes.data : [])
      } catch {
        if (!cancelled) setError('Impossible de charger categories et secteurs. Verifiez que le backend est demarre.')
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
      setError('Choisissez une categorie et un secteur.')
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
        "Echec de l'envoi du signalement."
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    'w-full rounded-md border border-input bg-bg-base/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10'
  const labelClass = 'mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-t3'

  return (
    <div className="min-h-screen bg-bg-base text-t1">
      <header className="border-b border-border bg-card/85 px-4 py-4 shadow-sm backdrop-blur">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-t2 hover:text-t1">
          <ArrowLeft className="h-4 w-4" />
          Retour a l'accueil
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-lg border border-border bg-stone-950 p-6 text-white shadow-card">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary">
            <Camera className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Signaler un incident</h1>
          <p className="mt-3 text-sm leading-6 text-white/68">
            Decrivez le probleme, choisissez le secteur et ajoutez une photo si elle peut aider les services.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/72">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-200" />
              <span>Les coordonnees se pre-remplissent selon le secteur choisi.</span>
            </div>
            <div className="rounded-md border border-white/10 bg-white/8 p-3 text-xs leading-5">
              Les informations sont envoyees a l'API UrbanOps sans changer la logique backend existante.
            </div>
          </div>
        </aside>

        {loadingMeta ? (
          <Card>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Titre</label>
                <input
                  required
                  minLength={5}
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={fieldClass}
                  placeholder="Ex. : Nid-de-poule avenue X"
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={fieldClass}
                  placeholder="Details utiles pour les services..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Categorie</label>
                  <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={fieldClass}>
                    <option value="">Selectionner</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Secteur</label>
                  <select required value={sectorId} onChange={(e) => setSectorId(e.target.value)} className={fieldClass}>
                    <option value="">Selectionner</option>
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
                  <label className={labelClass}>Latitude</label>
                  <input required type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className={`${fieldClass} font-mono`} />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input required type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} className={`${fieldClass} font-mono`} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Photo (optionnel)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                  className="w-full rounded-md border border-dashed border-input bg-muted/40 px-3 py-3 text-sm text-t2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                />
              </div>

              <Button type="submit" disabled={submitting} className="h-12 w-full">
                {submitting ? 'Envoi...' : 'Envoyer le signalement'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
