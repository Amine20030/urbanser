'use client'

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Signalez',
      description: 'Décrivez le problème urbain que vous observez avec photos et localisation précise.'
    },
    {
      number: '02',
      title: 'Analyse IA',
      description: 'Notre système analyse automatiquement l\'incident et détermine sa criticité.'
    },
    {
      number: '03',
      title: 'Transmission',
      description: 'L\'alerte est transmise aux autorités compétentes selon le type d\'incident.'
    },
    {
      number: '04',
      title: 'Suivi',
      description: 'Suivez l\'avancement de la résolution en temps réel via votre tableau de bord.'
    }
  ]

  return (
    <section style={{
      background: '#0b0f14',
      padding: '4rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#e8edf3',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Comment ça marche
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#7a8899',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Quatre étapes simples pour contribuer à une ville plus sûre
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {steps.map((step, idx) => (
            <StepCard
              key={idx}
              number={step.number}
              title={step.title}
              description={step.description}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({
  number,
  title,
  description,
  isLast
}: {
  number: string
  title: string
  description: string
  isLast: boolean
}) {
  return (
    <div style={{
      position: 'relative',
      padding: '1.5rem'
    }}>
      {/* Connector Line */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          top: '2.5rem',
          right: '-0.75rem',
          width: '1.5rem',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(59,130,246,0.3), transparent)',
          display: 'none' // Hidden on mobile, shown on larger screens via CSS
        }} className="step-connector" />
      )}

      {/* Number Badge */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '1rem',
        fontFamily: 'monospace'
      }}>
        {number}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '16px',
        fontWeight: 600,
        color: '#e8edf3',
        margin: '0 0 0.5rem'
      }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '13px',
        color: '#7a8899',
        lineHeight: 1.6,
        margin: 0
      }}>
        {description}
      </p>
    </div>
  )
}
