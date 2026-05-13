import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { MapSection } from '@/components/landing/MapSection'
import { RecentReports } from '@/components/landing/RecentReports'
import { HowItWorks } from '@/components/landing/HowItWorks'

export default function Home() {
  return (
    <main 
      className="dark:bg-[var(--bg-base)] dark:bg-none"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: '100% auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        backgroundAttachment: 'local',
        backgroundColor: '#f8fafc',
        position: 'relative'
      }}
    >
      <div 
        className="dark:hidden"
        style={{
          position: 'absolute', inset: 0,
          background: "rgba(255,255,255,0.38)",
          backdropFilter: "blur(2px)",
          zIndex: 0
        }}
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
