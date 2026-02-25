'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") ?? "dark"
    setIsDarkMode(currentTheme === "dark")
    document.documentElement.classList.toggle("dark", currentTheme === "dark")
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
    const newTheme = !isDarkMode ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", !isDarkMode)
  }

  return (
    <header className="sticky top-0 z-50 py-2 bg-background/60 backdrop-blur">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6 max-w-7xl">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src={isDarkMode ? "/images/twentyfirst-ai-logo-white.svg" : "/images/twentyfirst-ai-logo-black.svg"}
            alt="21AI Logo"
            width={64}
            height={64}
            sizes="64px"
            className="h-16 w-16 mr-2"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4" aria-label="Main">
          <Button variant="ghost" asChild>
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="icon"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
    </header>
  )
} 