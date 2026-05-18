'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { authAPI } from '@/lib/api'
import { getDashboardPath } from '@/lib/auth'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await authAPI.login(email.trim(), password)
      const token = data?.token
      if (!token) {
        setError('Réponse serveur invalide (pas de jeton).')
        return
      }
      globalThis.localStorage.setItem('urbanops_token', token)
      if (data.user) {
        globalThis.localStorage.setItem('urbanops_user', JSON.stringify(data.user))
      }
      globalThis.dispatchEvent(new Event('urbanops-auth-changed'))
      router.push(getDashboardPath())
    } catch (err: any) {
      const msg = err.response?.data?.message
      setError(
        msg || (err.response?.status === 401 ? 'Email ou mot de passe incorrect.' : 'Connexion impossible. Réessayez plus tard.')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
      
      {/* LEFT PANEL - BRANDING (Hidden on small screens) */}
      <div style={{
        flex: '0 0 40%', background: '#1c1917', padding: '60px 48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }} className="hidden md-flex">
        <style>{`
          @media (max-width: 768px) { .md-flex { display: none !important; } }
          .urban-input {
            width: 100%; border: none; border-bottom: 2px solid var(--urb-border);
            padding: 10px 0; font-size: 15px; outline: none; background: transparent;
            color: var(--urb-text); transition: border-color 0.15s;
          }
          .urban-input:focus { border-bottom-color: var(--urb-primary); }
        `}</style>

        {/* Decor */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'var(--urb-primary)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60%', height: '60%', background: 'var(--urb-accent)', opacity: 0.05, filter: 'blur(120px)', borderRadius: '50%' }}/>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: 'var(--urb-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: 'white'
            }}>U</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: '-0.01em' }}>
              UrbanOps
            </span>
          </Link>

          <h2 style={{ color: 'white', fontSize: 32, fontWeight: 800, marginTop: 60, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Ensemble,<br/>supervisons<br/>
            <span style={{ color: 'var(--urb-primary-lt)' }}>Marrakech.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 15, lineHeight: 1.5, maxWidth: 320 }}>
            Plateforme de supervision urbaine intelligente pour les citoyens et les autorités.
          </p>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              "Signalement géolocalisé précis",
              "Analyse IA en temps réel",
              "Alertes aux autorités compétentes"
            ].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 color="var(--urb-accent)" size={20}/>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative'
      }}>
        {/* Mobile Header (Only visible on small screens) */}
        <div style={{ position: 'absolute', top: 24, left: 24 }} className="md-hidden">
          <style>{`@media (min-width: 769px) { .md-hidden { display: none !important; } }`}</style>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--urb-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>U</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--urb-text)' }}>UrbanOps</span>
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--urb-text)', marginBottom: 8 }}>Bon retour.</h1>
          <p style={{ color: 'var(--urb-text-2)', fontSize: 14, marginBottom: 32 }}>
            Connectez-vous à votre compte pour continuer.
          </p>

          {error && (
            <div style={{ background: 'var(--urb-danger-lt)', borderLeft: '4px solid var(--urb-danger)', color: 'var(--urb-danger)', padding: '12px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label htmlFor="signin-email" style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--urb-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Adresse Email
              </label>
              <input id="signin-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                     className="urban-input" placeholder="vous@exemple.com"/>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label htmlFor="signin-password" style={{ fontSize: 12, fontWeight: 700, color: 'var(--urb-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mot de passe
                </label>
                <Link href="#" style={{ fontSize: 12, color: 'var(--urb-primary)', fontWeight: 600 }}>Oublié ?</Link>
              </div>
              <input id="signin-password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                     className="urban-input" style={{ paddingRight: 40 }} placeholder="••••••••"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 0, bottom: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--urb-text-3)'
              }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              background: 'var(--urb-primary)', color: 'white', border: 'none', borderRadius: 8,
              height: 48, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(194,65,12,0.3)', transition: 'all 0.15s', marginTop: 8
            }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14 }}>
            <span style={{ color: 'var(--urb-text-2)' }}>Pas encore de compte ? </span>
            <Link href="/auth/signup" style={{ color: 'var(--urb-primary)', fontWeight: 700 }}>Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
