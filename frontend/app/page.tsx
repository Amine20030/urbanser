import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { MapSection } from '@/components/landing/MapSection'
import { RecentReports } from '@/components/landing/RecentReports'
import { HowItWorks } from '@/components/landing/HowItWorks'

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <Navbar />
      <HeroSection />
      <MapSection />
      <RecentReports />
      <HowItWorks />
      <Footer />
    </main>
  )
}
