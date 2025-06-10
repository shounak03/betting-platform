import { DashboardFeature } from '@/components/dashboard/dashboard-feature'
import Features from '@/components/main-frontend/features'
import Hero from '@/components/main-frontend/hero'
import HowItWorks from '@/components/main-frontend/how-it-works'
import FAQ from '@/components/main-frontend/faq'

export default function Home() {
  return <div>
    <Hero />
    <Features />
    <HowItWorks />
    <FAQ />
    {/* <DashboardFeature /> */}
  </div> 
}
