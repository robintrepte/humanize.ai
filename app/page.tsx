import { Header } from '@/components/landing/Header'
import { Hero } from '@/components//landing/Hero'
import { Features } from '@/components/landing/Features'
import { Testimonials } from '@/components/landing/Testimonials'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'
import { Why } from '@/components/landing/Why'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <Why />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
