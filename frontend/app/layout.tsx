import type { Metadata } from 'next'
import 'leaflet/dist/leaflet.css'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'UrbanOps - Smart Urban Supervision for Marrakech',
  description: 'AI-powered urban incident reporting and monitoring system for the city of Marrakech',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased selection:bg-primary/20 selection:text-t1">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
