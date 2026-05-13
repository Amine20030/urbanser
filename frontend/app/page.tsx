import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { MapSection } from '@/components/landing/MapSection'
import { RecentReports } from '@/components/landing/RecentReports'
import { HowItWorks } from '@/components/landing/HowItWorks'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-mesh-light opacity-90 dark:bg-mesh-dark dark:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-[center_top] bg-no-repeat opacity-[0.14] mix-blend-overlay dark:opacity-[0.08]"
        aria-hidden
      />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <MapSection />
        <RecentReports />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  )
}
