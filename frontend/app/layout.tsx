import type { Metadata } from 'next'
import 'leaflet/dist/leaflet.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'UrbanOps - Smart Urban Supervision for Marrakech',
  description: 'AI-powered urban incident reporting and monitoring system for the city of Marrakech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen bg-[var(--bg-base)]">
        {children}
      </body>
    </html>
  )
}
