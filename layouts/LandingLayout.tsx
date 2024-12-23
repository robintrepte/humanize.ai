import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface LandingLayoutProps {
  children: ReactNode
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">HumanizeAI</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Button asChild variant="default">
              <Link href="/login">Sign In</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HumanizeAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 