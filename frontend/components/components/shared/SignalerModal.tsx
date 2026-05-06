'use client'

import { useState, useCallback } from 'react'
import { X, Camera, Upload, Check, Loader2, MapPin } from 'lucide-react'
import { CATEGORIES, SECTORS, Category, getAuthorityForCategory } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface SignalerModalProps {
  isOpen: boolean
  onClose: () => void
  initialLocation?: { lat: number; lng: number }
}

type Step = 1 | 2 | 3

export function SignalerModal({ isOpen, onClose, initialLocation }: SignalerModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [description, setDescription] = useState('')
  const [sector, setSector] = useState('')
  const [location, setLocation] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [detectedSeverity, setDetectedSeverity] = useState<'HIGH' | 'MED' | 'LOW'>('MED')

  const resetForm = useCallback(() => {
    setStep(1)
    setSelectedCategory(null)
    setDescription('')
    setSector('')
    setLocation('')
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setDetectedSeverity('MED')
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  const handleNext = () => {
    if (step === 1 && selectedCategory) {
      setStep(2)
    } else if (step === 2 && description && sector) {
      setStep(3)
      setIsAnalyzing(true)
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
        // Simulate severity detection based on keywords
        if (description.toLowerCase().includes('danger') || description.toLowerCase().includes('critique')) {
          setDetectedSeverity('HIGH')
        } else if (description.toLowerCase().includes('important') || description.toLowerCase().includes('urgent')) {
          setDetectedSeverity('MED')
        } else {
          setDetectedSeverity('LOW')
        }
      }, 2000)
    }
  }

  const getSeverityLabel = (severity: 'HIGH' | 'MED' | 'LOW') => {
    switch (severity) {
      case 'HIGH':
        return 'Haute criticité'
      case 'MED':
        return 'Criticité moyenne'
      case 'LOW':
        return 'Faible criticité'
    }
  }

  const getSeverityColor = (severity: 'HIGH' | 'MED' | 'LOW') => {
    switch (severity) {
      case 'HIGH':
        return 'text-red-400'
      case 'MED':
        return 'text-amber-400'
      case 'LOW':
        return 'text-green-400'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[12px] w-full max-w-lg max-h-[90vh] overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--t1)]">
            Signaler un problème
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 p-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-medium transition-colors',
                  step >= s
                    ? 'bg-blue-600 text-white'
                    : 'bg-[var(--bg-hover)] text-[var(--t2)]'
                )}
              >
                {step > s ? <Check size={14} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    'w-8 h-0.5 rounded-full transition-colors',
                    step > s ? 'bg-blue-600' : 'bg-[var(--border)]'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[var(--t2)] text-sm">
                Sélectionnez la catégorie du problème que vous souhaitez signaler :
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={cn(
                      'p-4 rounded-[10px] border text-left transition-all duration-150',
                      selectedCategory === cat.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[var(--border)] bg-[var(--bg-hover)] hover:border-[var(--border2)]'
                    )}
                  >
                    <span className="text-2xl mb-2 block">{cat.icon}</span>
                    <span className="text-sm font-medium text-[var(--t1)]">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* AI Notice Box */}
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🤖</span>
                  <p className="text-xs text-blue-300 leading-relaxed">
                    L&apos;IA analysera votre photo et description pour détecter
                    la criticité et enverra automatiquement une alerte à l&apos;autorité
                    compétente (Police, ONEE, RADEEMA, Commune…).
                  </p>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-[11px] uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Photo
                </label>
                <div className="border-2 border-dashed border-[var(--border)] hover:border-[var(--border2)] rounded-[10px] p-6 text-center cursor-pointer transition-colors">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-[var(--t2)]" />
                  <p className="text-sm text-[var(--t1)] mb-1">
                    📷 Glissez une photo ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-[var(--t3)]">
                    L&apos;IA analysera automatiquement la criticité
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le problème (français, arabe ou darija)…"
                  className="w-full h-24 p-3 rounded-[8px] bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>

              {/* Sector Select */}
              <div>
                <label className="block text-[11px] uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Secteur
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full p-3 rounded-[8px] bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">Sélectionnez un secteur</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-[1px] text-[var(--t3)] font-mono mb-2">
                  Lieu précis
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Rue, avenue, point de repère..."
                    className="w-full pl-10 pr-3 py-3 rounded-[8px] bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--t1)] text-sm placeholder:text-[var(--t3)] focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 mx-auto mb-4 text-blue-500 animate-spin" />
                  <p className="text-[var(--t1)] font-medium mb-1">Analyse IA en cours...</p>
                  <p className="text-sm text-[var(--t2)]">
                    Détection de la catégorie et évaluation de la criticité
                  </p>
                </div>
              ) : analysisComplete ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-lg font-semibold text-[var(--t1)] mb-1">
                      Signalement envoyé !
                    </p>
                    <p className="text-sm text-[var(--t2)]">
                      Votre signalement a été transmis à{' '}
                      <span className="text-blue-400 font-medium">
                        {selectedCategory && getAuthorityForCategory(selectedCategory)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)]">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--t1)]">Catégorie détectée</p>
                        <p className="text-xs text-[var(--t2)]">
                          {selectedCategory && CATEGORIES.find(c => c.value === selectedCategory)?.label}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)]">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--t1)]">Niveau de criticité</p>
                        <p className={cn('text-xs font-medium', getSeverityColor(detectedSeverity))}>
                          {getSeverityLabel(detectedSeverity)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border)]">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--t1)]">Autorité alertée</p>
                        <p className="text-xs text-blue-400 font-medium">
                          {selectedCategory && getAuthorityForCategory(selectedCategory)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
          {step > 1 && !analysisComplete ? (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
            >
              Retour
            </button>
          ) : (
            <div />
          )}

          {analysisComplete ? (
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              Terminer
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedCategory) ||
                (step === 2 && (!description || !sector))
              }
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-[var(--bg-hover)] disabled:text-[var(--t3)] disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {step === 3 ? 'Envoyer' : 'Continuer'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
