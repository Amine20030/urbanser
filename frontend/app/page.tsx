import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { LiveMapSection } from '@/components/home/LiveMapSection'
import { RecentReportsSection } from '@/components/home/RecentReportsSection'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--urb-bg)' }}>
      <Navbar />
      <HeroSection />
      <LiveMapSection />
      <RecentReportsSection />
      <Footer />
    </main>
  )
}
