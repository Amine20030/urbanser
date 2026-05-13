'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Signalez',
      description: 'Décrivez le problème urbain avec photos et localisation précise.',
    },
    {
      number: '02',
      title: 'Analyse IA',
      description: "Le système analyse automatiquement l'incident et estime la criticité.",
    },
    {
      number: '03',
      title: 'Transmission',
      description: "L'alerte est routée vers les autorités compétentes selon la catégorie.",
    },
    {
      number: '04',
      title: 'Suivi',
      description: 'Suivez la résolution en temps quasi réel depuis votre espace sécurisé.',
    },
  ]

  return (
    <section id="how" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-t1 sm:text-3xl">Comment ça marche</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-t2 sm:text-base">
            Quatre étapes simples pour contribuer à une ville plus sûre et plus réactive.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <Card className="group h-full border-border/80 bg-card/80 shadow-card backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
                <CardContent className="p-5 pt-6">
                  <div className="mb-4 inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 px-3 font-mono text-sm font-bold text-white shadow-md">
                    {step.number}
                  </div>
                  <h3 className="text-base font-semibold text-t1">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-t2">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
