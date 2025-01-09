"use client";

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Home, Users, Moon, Sun, Menu, X, ChevronLeft, ChevronRight, Gem, HelpCircle, Wallet, Settings, LogOut, BookmarkIcon, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { PricingDialog } from "@/components/PricingDialog"
import { HelpDialog } from "@/components/HelpDialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  const { data: session } = useSession()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const currentTheme = localStorage.getItem("theme") ?? "dark"
    setIsDarkMode(currentTheme === "dark")
    document.body.classList.toggle("dark", currentTheme === "dark")

    // Load collapsed state from localStorage
    const savedCollapsedState = localStorage.getItem("sidebarCollapsed")
    setIsCollapsed(savedCollapsedState === "true")
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
    const newTheme = !isDarkMode ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    document.body.classList.toggle("dark", !isDarkMode)
  }

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const newState = !prev
      localStorage.setItem("sidebarCollapsed", String(newState))
      return newState
    })
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md md:hidden hover:bg-accent"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar - Desktop and Mobile */}
      <AnimatePresence mode="wait">
        {(isMobileMenuOpen || (isClient && window.innerWidth >= 768)) && (
          <motion.div
            initial={{ x: -288 }}
            animate={{ x: 0, width: isCollapsed ? 72 : 288 }}
            exit={{ x: -288 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className={`fixed md:relative top-0 left-0 z-40 h-full bg-background border-r flex flex-col
              ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}
          >
            {/* Collapse Button Only */}
            <div className="p-4 flex justify-end">
              <Button
                onClick={toggleCollapse}
                variant="ghost"
                size="icon"
                className="hidden md:flex"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>

            {/* Logo Section - Now below collapse button */}
            <div className="flex justify-center pb-8 border-b">
              <Link href="/" className="flex items-center space-x-2">
                <span className={`font-bold ${isCollapsed ? 'text-xl' : 'text-3xl'}`}>21AI</span>
              </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4 space-y-4 flex flex-col items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button 
                        variant="ghost" 
                        className={`w-full h-14 text-base flex items-center ${
                          isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
                        }`}
                        disabled={!session}
                        asChild={!!session}
                      >
                        {session ? (
                          <Link href="/humanize">
                            <Sparkles className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                            {!isCollapsed && <span className="ml-4">Humanize Text</span>}
                          </Link>
                        ) : (
                          <>
                            <Sparkles className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                            {!isCollapsed && <span className="ml-4">Humanize Text</span>}
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!session && (
                    <TooltipContent>
                      <p>Please login to access Humanize</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              {/* Add Detector Navigation Item */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button 
                        variant="ghost" 
                        className={`w-full h-14 text-base flex items-center ${
                          isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
                        }`}
                        disabled={!session}
                        asChild={!!session}
                      >
                        {session ? (
                          <Link href="/detector">
                            <Shield className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                            {!isCollapsed && <span className="ml-4">AI Detector</span>}
                          </Link>
                        ) : (
                          <>
                            <Shield className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                            {!isCollapsed && <span className="ml-4">AI Detector</span>}
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!session && (
                    <TooltipContent>
                      <p>Please login to access AI Detector</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              {session && (
                <>
                  <Link href="/saved" className="w-full">
                    <Button 
                      variant="ghost" 
                      className={`w-full h-14 text-base flex items-center ${
                        isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
                      }`}
                    >
                      <BookmarkIcon className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                      {!isCollapsed && <span className="ml-4">Saved Texts</span>}
                    </Button>
                  </Link>
                  
                  {session?.user?.role === "admin" && (
                    <Link href="/admin/users" className="w-full">
                      <Button 
                        variant="ghost" 
                        className={`w-full h-14 text-base flex items-center ${
                          isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
                        }`}
                      >
                        <Users className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                        {!isCollapsed && <span className="ml-4">Benutzer</span>}
                      </Button>
                    </Link>
                  )}

                  <Link href="/admin/plans" className="w-full">
                    <Button 
                      variant="ghost" 
                      className={`w-full h-14 text-base flex items-center ${
                        isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
                      }`}
                    >
                      <Gem className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                      {!isCollapsed && <span className="ml-4">Tarife</span>}
                    </Button>
                  </Link>
                </>
              )}
            </nav>

            {/* Bottom Sections */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Credits and Help */}
              <div className="p-4 space-y-4">
                {session && (
                  <>
                    <Button 
                      variant="ghost" 
                      className={`w-full h-14 text-base flex items-center text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 ${
                        isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
                      }`}
                      onClick={() => setShowPricingDialog(true)}
                    >
                      <Gem className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                      {!isCollapsed && <span className="ml-4">Buy Credits</span>}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full h-14 text-base flex items-center ${
                        isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
                      }`}
                      onClick={() => setShowHelpDialog(true)}
                    >
                      <HelpCircle className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                      {!isCollapsed && <span className="ml-4">Help</span>}
                    </Button>
                  </>
                )}
              </div>

              {/* Theme and Profile */}
              <div className="border-t bg-background p-4">
                <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'items-center justify-between'} gap-4 ${!isCollapsed && 'px-2'}`}>
                  {session ? (
                    <div className={`flex items-center gap-2 ${isCollapsed && 'justify-center'}`}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={session.user?.image || "/default-avatar.png"} alt="Profile" />
                              <AvatarFallback>{session.user?.username?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && <span className="text-md font-medium text-base">{session.user?.username || "User"}</span>}
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="top" className="w-56">
                          <DropdownMenuItem 
                            className="border-b cursor-pointer flex items-center w-full py-3 text-base" 
                            onClick={() => setShowPricingDialog(true)}
                          >
                            <Gem className="mr-3 h-5 w-5 text-blue-500" />
                            <span className="flex-1">My Credits: {session.user?.credits || 0}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-md">
                            <Link href="/profile/edit" className="w-full cursor-pointer flex items-center py-3 text-base">
                              <Settings className="mr-3" />
                              Edit Account
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600 focus:text-red-600 flex items-center w-full py-3 text-base" 
                            onClick={() => signOut()}
                          >
                            <LogOut className="mr-3" />
                            Log out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    !isCollapsed && (
                      <Link href="/login">
                        <Button variant="outline" size="sm">
                          Login
                        </Button>
                      </Link>
                    )
                  )}
                  <Button onClick={toggleDarkMode} variant="ghost" size="icon">
                    {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <PricingDialog 
        open={showPricingDialog} 
        onOpenChange={setShowPricingDialog}
      />

      <HelpDialog 
        open={showHelpDialog} 
        onOpenChange={setShowHelpDialog}
      />
    </>
  )
} 