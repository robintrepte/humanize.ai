'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") ?? "dark"
    setIsDarkMode(currentTheme === "dark")
    document.body.classList.toggle("dark", currentTheme === "dark")
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
    const newTheme = !isDarkMode ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    document.body.classList.toggle("dark", !isDarkMode)
  }

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
          <Button onClick={toggleDarkMode} variant="ghost" size="icon">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 