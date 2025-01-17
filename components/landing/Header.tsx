import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 py-2 bg-background/60 backdrop-blur">
      <div className="flex justify-between items-center container px-4 md:px-6">
        <Link href="/dashboard" className="text-xl font-bold">
          21AI
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 