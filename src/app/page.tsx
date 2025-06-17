import { DashboardFeature } from '@/components/dashboard/dashboard-feature'
import Features from '@/components/main-frontend/features'
import Hero from '@/components/main-frontend/hero'
import HowItWorks from '@/components/main-frontend/how-it-works'
import FAQ from '@/components/main-frontend/faq'
import Footer from '@/components/main-frontend/footer'

export default function Home() {
  return <div>
    {/* <DashboardFeature /> */}
    <Hero />
    <Features />
    <HowItWorks />
    <FAQ />
    <Footer />
    {/* <DashboardFeature /> */}
  </div> 
}
