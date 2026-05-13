import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--bg-base)',
        foreground: 'var(--t1)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--bg-card)',
          foreground: 'var(--t1)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        sidebar: 'var(--bg-sidebar)',
        'bg-base': 'var(--bg-base)',
        'bg-card': 'var(--bg-card)',
        'bg-hover': 'var(--bg-hover)',
        t1: 'var(--t1)',
        t2: 'var(--t2)',
        t3: 'var(--t3)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        glass: 'var(--shadow-glass)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-light':
          'radial-gradient(ellipse 120% 80% at 50% -30%, rgba(14, 165, 233, 0.18), transparent 55%), radial-gradient(ellipse 80% 60% at 100% 0%, rgba(99, 102, 241, 0.12), transparent 45%), radial-gradient(ellipse 70% 50% at 0% 100%, rgba(16, 185, 129, 0.08), transparent 50%)',
        'mesh-dark':
          'radial-gradient(ellipse 120% 80% at 50% -25%, rgba(56, 189, 248, 0.14), transparent 55%), radial-gradient(ellipse 90% 60% at 100% 10%, rgba(129, 140, 248, 0.12), transparent 45%), radial-gradient(ellipse 70% 50% at 0% 90%, rgba(45, 212, 191, 0.06), transparent 50%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.35)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
