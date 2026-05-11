'use client'

import { Building2, Droplets, Lightbulb, Trash2, Bus, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { statsAPI } from '@/lib/api'

const icons: Record<string, any> = {
  'Transport': Bus,
  'Eau': Droplets,
  'Déchets': Trash2,
  'Éclairage': Lightbulb,
  'Électricité': Lightbulb,
  'Voirie': AlertCircle,
  'Sécurité': AlertCircle,
  'Espaces verts': Building2
}

const colors = ['text-emerald-400', 'text-yellow-400', 'text-blue-400', 'text-amber-400', 'text-purple-400', 'text-gray-400']
const bgs = ['bg-emerald-400/10', 'bg-yellow-400/10', 'bg-blue-400/10', 'bg-amber-400/10', 'bg-purple-400/10', 'bg-gray-400/10']

export function ServiceCards() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    statsAPI.getServicesHealth()
       .then(res => setData(res.data))
       .catch(err => setError(err.message))
       .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">{Array(6).fill(0).map((_,i) => <div key={i} className="h-20 bg-[var(--bg-card)] animate-pulse rounded-[10px] border border-[var(--border)]" />)}</div>
  if (error) return <div className="p-4 rounded-[10px] bg-red-500/10 text-red-500 border border-red-500/20">Erreur: {error}</div>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {data.map((service, index) => {
        const Icon = icons[service.categoryName] || Building2
        const color = colors[index % colors.length]
        const bg = bgs[index % bgs.length]

        return (
          <div
            key={service.categoryName}
            className="p-3 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border2)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${bg}`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <span className="text-xs font-medium text-[var(--t2)] truncate">
                {service.categoryName}
              </span>
            </div>
            <div className={`text-lg font-bold ${color} font-mono`}>
              {service.healthPercent}% <span className="text-[10px] font-normal opacity-70">({service.activeCount})</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
