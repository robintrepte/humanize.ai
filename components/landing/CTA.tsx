import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section id="cta" className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to humanize your AI-generated content?</h2>
        <p className="text-xl mb-8">Start transforming your text today with our powerful AI humanizer.</p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/register">Get Started for Free</Link>
        </Button>
        <p className="mt-4 text-sm">No credit card required. 250 free credits.</p>
      </div>
    </section>
  )
} 