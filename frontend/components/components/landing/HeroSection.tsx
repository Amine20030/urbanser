'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SignalerModal } from '@/components/shared/SignalerModal'
import { STATS } from '@/lib/mockData'

function AnimatedCounter({ target, duration = 500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return (
    <span className="font-mono tabular-nums">
      {count.toLocaleString('fr-FR')}
    </span>
  )
}

export function HeroSection() {
  const [isSignalerOpen, setIsSignalerOpen] = useState(false)

  const stats = [
    { value: STATS.totalReports, label: 'Signalements' },
    { value: STATS.resolved, label: 'Résolus' },
    { value: STATS.totalCitizens, label: 'Citoyens actifs' },
    { value: '< 2 min', label: 'Temps de réponse IA', isText: true },
  ]

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[var(--t1)] leading-tight mb-6 opacity-0 animate-fade-up">
          Marrakech signale,
          <br />
          <span className="text-cyan-400">la ville répond.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--t2)] max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up delay-100">
          Photographiez un problème urbain. Notre IA l&apos;analyse, le classe,
          et alerte l&apos;autorité compétente en quelques secondes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-up delay-200">
          <button
            onClick={() => setIsSignalerOpen(true)}
            className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all hover:scale-105 flex items-center gap-2"
          >
            📷 Signaler un problème
          </button>
          <Link
            href="/incidents"
            className="px-8 py-4 rounded-lg border border-[var(--border)] hover:border-[var(--border2)] text-[var(--t1)] font-medium text-base transition-all hover:bg-[var(--bg-hover)]"
          >
            Voir tous les signalements
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto opacity-0 animate-fade-up delay-300">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-4 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] card-hover"
              style={{ animationDelay: `${350 + index * 50}ms` }}
            >
              <div className="text-[28px] sm:text-[34px] font-bold font-mono text-[var(--t1)] leading-none mb-1">
                {stat.isText ? stat.value : <AnimatedCounter target={stat.value} />}
              </div>
              <div className="text-xs sm:text-sm text-[var(--t2)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <SignalerModal
        isOpen={isSignalerOpen}
        onClose={() => setIsSignalerOpen(false)}
      />
    </section>
  )
}
