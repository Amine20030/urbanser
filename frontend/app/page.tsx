'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { LiveMapSection } from '@/components/home/LiveMapSection'
import { RecentReportsSection } from '@/components/home/RecentReportsSection'
import { SignalerModal } from '@/components/shared/SignalerModal'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-bg-base">
      <Navbar />
      <HeroSection onSignaler={() => setModalOpen(true)} />
      <LiveMapSection onSignaler={() => setModalOpen(true)} />
      <RecentReportsSection />
      <Footer />
      <SignalerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
