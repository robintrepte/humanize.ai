"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Sparkles, Moon, Sun, Menu, X, Loader2, Gem } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const { data: session, status } = useSession()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") ?? "dark"; // Standardmäßig dark
    setIsDarkMode(currentTheme === "dark");
    document.body.classList.toggle("dark", currentTheme === "dark");
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
    const newTheme = !isDarkMode ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    document.body.classList.toggle("dark", !isDarkMode)
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="bg-background border-b px-4 py-3 flex items-center justify-between sm:px-6">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Sparkles className="h-6 w-6" />
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden sm:flex sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
        <ul className="flex items-center space-x-4">
          {session && (
            <>
              <li>
                <Link href="/">
                  <Button variant="link" size="sm">
                    Startseite
                  </Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Desktop Aktionen */}
      <div className="hidden sm:flex items-center gap-4">
        <Button onClick={toggleDarkMode} variant="ghost" size="icon">
          {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || "/default-avatar.png"} alt="Profilbild" />
                  <AvatarFallback>{session.user?.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Benutzermenü umschalten</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/${session.user?.username}`} className="flex items-center gap-2 p-2" prefetch={false}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || "/default-avatar.png"} alt="Profilbild" />
                  <AvatarFallback>{session.user?.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5 leading-none">
                  <div className="font-semibold">{session.user?.username || "Benutzer"}</div>
                  <div className="text-sm text-muted-foreground">{session.user?.email}</div>
                </div>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/${session.user?.username}/edit`} className="flex items-center gap-2" prefetch={false}>
                  <span>Profil bearbeiten</span>
                </Link>
              </DropdownMenuItem>
              {session?.user?.role === "admin" && (
                <>
                  <DropdownMenuItem>
                    <Link href="/admin/users" className="flex items-center gap-2" prefetch={false}>
                      <span>Benutzer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/admin/plans" className="flex items-center gap-2" prefetch={false}>
                      <Gem className="h-4 w-4" />
                      <span>Tarife</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut()}>
                <div className="flex items-center gap-2">
                  <span>Abmelden</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="outline" size="sm" className="rounded-full">
              Anmelden
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menü Button */}
      <div className="flex items-center sm:hidden">
        <button
          type="button"
          className="p-3 hover:bg-accent hover:text-accent-foreground rounded-md"
          aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menü */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-background sm:hidden"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full justify-center items-center relative">
              <button
                type="button"
                className="absolute top-4 right-4 p-3 hover:bg-accent hover:text-accent-foreground rounded-md"
                aria-label="Menü schließen"
                onClick={toggleMobileMenu}
              >
                <X size={24} />
              </button>
              {session && (
                <>
                  <Link href="/" onClick={toggleMobileMenu}>
                    <Button variant="link" size="lg" className="mb-4 text-4xl p-10">
                      Startseite
                    </Button>
                  </Link>
                </>
              )}
              <div className="flex items-center gap-6 mt-10">
                <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="rounded-full">
                  {isDarkMode ? <Moon /> : <Sun />}
                </Button>
                {status === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar>
                          <AvatarImage src={session.user?.image || "/default-avatar.png"} alt="Profilbild" />
                          <AvatarFallback>{session.user?.username?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Benutzermenü umschalten</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link href={`/${session.user?.username}`} className="flex items-center gap-2 p-2" prefetch={false}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session.user?.image || "/default-avatar.png"} alt="Profilbild" />
                          <AvatarFallback>{session.user?.username?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5 leading-none">
                          <div className="font-semibold">{session.user?.username || "Benutzer"}</div>
                          <div className="text-sm text-muted-foreground">{session.user?.email}</div>
                        </div>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/${session.user?.username}/edit`} className="flex items-center gap-2" prefetch={false}>
                          <span>Profil bearbeiten</span>
                        </Link>
                      </DropdownMenuItem>
                      {session?.user?.role === "admin" && (
                        <>
                          <DropdownMenuItem>
                            <Link href="/admin/users" className="flex items-center gap-2" prefetch={false}>
                              <span>Benutzer</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href="/admin/plans" className="flex items-center gap-2" prefetch={false}>
                              <Gem className="h-4 w-4" />
                              <span>Tarife</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => signOut()}>
                        <div className="flex items-center gap-2">
                          <span>Abmelden</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="rounded-full">
                      Anmelden
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
