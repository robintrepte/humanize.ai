'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") ?? "dark"
    setIsDarkMode(currentTheme === "dark")
  }, [])

  return (
    <footer className="bg-background py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src={isDarkMode ? "/images/twentyfirst-ai-logo-white.svg" : "/images/twentyfirst-ai-logo-black.svg"}
                alt="21AI Logo"
                width={64}
                height={64}
                sizes="64px"
                className="h-16 w-16 mr-2"
              />
            </Link>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link href="/imprint" className="text-sm text-muted-foreground hover:text-foreground">
              Imprint
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Twentyfirst Media Group. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 