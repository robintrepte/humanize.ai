import dynamic from 'next/dynamic'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'
import { LandingStructuredData } from '@/components/landing/StructuredData'

const Why = dynamic(() => import('@/components/landing/Why').then(m => ({ default: m.Why })), { ssr: true })
const Testimonials = dynamic(() => import('@/components/landing/Testimonials').then(m => ({ default: m.Testimonials })), { ssr: true })
const FAQ = dynamic(() => import('@/components/landing/FAQ').then(m => ({ default: m.FAQ })), { ssr: true })

export const metadata = {
  title: 'Humanize AI-Generated Text | Bypass AI Detectors',
  description:
    'Transform AI-generated text into natural, human-like writing. Bypass GPTZero, ZeroGPT, Turnitin and other AI detectors. Multiple languages. Free credits.',
  openGraph: {
    title: 'HumanizeAI – Humanize AI-Generated Text | Bypass AI Detectors',
    description:
      'Transform AI-generated text into natural, human-like writing. Bypass AI detectors with our advanced humanizer. Multiple languages and writing levels.',
    url: '/',
  },
  alternates: { canonical: '/' },
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground" aria-label="Landing page">
      <LandingStructuredData />
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
