'use client'

import { Camera, Brain, Send } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      emoji: '📷',
      title: 'Photographiez',
      description: 'Le citoyen prend une photo du problème',
    },
    {
      icon: Brain,
      emoji: '🤖',
      title: "L'IA analyse",
      description: 'Détecte catégorie, niveau de danger, autorité compétente',
    },
    {
      icon: Send,
      emoji: '✉️',
      title: 'Alerte envoyée',
      description: "L'autorité reçoit une alerte instantanée par email",
    },
  ]

  return (
    <section id="comment-ca-marche" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-semibold text-[var(--t1)] mb-2">
            Comment ça marche
          </h2>
          <p className="text-sm text-[var(--t2)]">
            Trois étapes simples pour signaler un problème urbain
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center gap-4 md:gap-8">
              <div
                className="flex flex-col items-center text-center p-6 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] w-[240px] opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-4xl mb-4">{step.emoji}</span>
                <h3 className="text-sm font-semibold text-[var(--t1)] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--t2)] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center">
                  <svg
                    width="40"
                    height="2"
                    viewBox="0 0 40 2"
                    fill="none"
                    className="text-[var(--t3)]"
                  >
                    <path
                      d="M0 1H38"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M38 1L35 0V2L38 1Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
