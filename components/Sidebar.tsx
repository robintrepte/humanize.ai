"use client";

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Home, Users, Moon, Sun, Menu, X, ChevronLeft, ChevronRight, Gem, HelpCircle, Wallet, Settings, LogOut, BookmarkIcon, Shield, History, PenTool } from "lucide-react"
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
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { data: session } = useSession()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const currentPath = usePathname()

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

  const isActive = (path: string) => currentPath === path

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
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Image
                  src={isDarkMode ? "/images/twentyfirst-ai-logo-white.svg" : "/images/twentyfirst-ai-logo-black.svg"}
                  alt="21AI Logo"
                  width={isCollapsed ? 32 : 64}
                  height={isCollapsed ? 32 : 64}
                  className={`h-auto ${isCollapsed ? 'w-8' : 'w-16'}`}
                />
              </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4 space-y-2 flex flex-col items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button
                        variant="ghost"
                        className={`w-full h-12 text-sm flex items-center ${
                          isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                        } ${isActive('/dashboard') ? 'bg-accent' : ''}`}
                        asChild
                      >
                        <Link href="/dashboard">
                          <Home className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                          {!isCollapsed && <span className="ml-4">Dashboard</span>}
                        </Link>
                      </Button>
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>

              {session && (
                <Link href="/saved" className="w-full">
                  <Button
                    variant="ghost"
                    className={`w-full h-12 text-sm flex items-center ${
                      isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                    } ${isActive('/saved') ? 'bg-accent' : ''}`}
                  >
                    <BookmarkIcon className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                    {!isCollapsed && <span className="ml-4">Saved Texts</span>}
                  </Button>
                </Link>
              )}

              {/* Tools Section */}
              <div className="w-full text-left px-4 pt-4">
                <span className="text-sm font-semibold text-muted-foreground">Tools:</span>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button
                        variant="ghost"
                        className={`w-full h-12 text-sm flex items-center ${
                          isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                        } ${isActive('/generate') ? 'bg-accent' : ''}`}
                        disabled={!session}
                        asChild={!!session}
                      >
                        {session ? (
                          <Link href="/generate">
                            <PenTool className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                            {!isCollapsed && <span className="ml-4">Text Generator</span>}
                          </Link>
                        ) : (
                          <>
                            <PenTool className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                            {!isCollapsed && <span className="ml-4">Text Generator</span>}
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!session && (
                    <TooltipContent>
                      <p>Please login to access Text Generator</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button
                        variant="ghost"
                        className={`w-full h-12 text-sm flex items-center ${
                          isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                        } ${isActive('/humanize') ? 'bg-accent' : ''}`}
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button
                        variant="ghost"
                        className={`w-full h-12 text-sm flex items-center ${
                          isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                        } ${isActive('/detector') ? 'bg-accent' : ''}`}
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
            </nav>

            {/* Bottom Sections */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Credits and Help */}
              <div className="p-4 space-y-4">
                {session && (
                  <>
                    <Button
                      variant="ghost"
                      className={`w-full h-12 text-sm flex items-center text-blue-500 ${
                        isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                      }`}
                      onClick={() => {
                        console.log('Session user:', session?.user);
                        console.log('Subscription status:', session?.user?.subscriptionStatus);
                        console.log('Current period end:', session?.user?.currentPeriodEnd);
                        console.log('Is date valid:', session?.user?.currentPeriodEnd &&
                          new Date(session.user.currentPeriodEnd) > new Date());

                        const hasActiveSubscription = (session?.user?.subscriptionStatus === 'active' ||
                          (session?.user?.subscriptionStatus === 'canceled_end_period' &&
                           session?.user?.currentPeriodEnd &&
                           new Date(session.user.currentPeriodEnd) > new Date()));
                          
                        if (hasActiveSubscription) {
                          router.push('/subscription');
                        } else {
                          setShowPricingDialog(true);
                        }
                      }}
                    >
                      {session?.user?.subscriptionStatus === 'active' ||
                        (session?.user?.subscriptionStatus === 'canceled_end_period' &&
                         session?.user?.currentPeriodEnd &&
                         new Date(session.user.currentPeriodEnd) > new Date()) ? (
                        <>
                          <Settings className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                          {!isCollapsed && <span className="ml-4">Manage Subscription</span>}
                        </>
                      ) : (
                        <>
                          <Gem className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                          {!isCollapsed && <span className="ml-4">Buy Credits</span>}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full h-12 text-sm flex items-center ${
                        isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                      }`}
                      onClick={() => setShowHelpDialog(true)}
                    >
                      <HelpCircle className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                      {!isCollapsed && <span className="ml-4">Help</span>}
                    </Button>

                    {/* Admin Menu */}
                    {session.user?.role === "admin" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`w-full h-12 text-sm flex items-center text-red-500 ${
                              isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
                            }`}
                          >
                            <Settings className="!h-6 !w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                            {!isCollapsed && (
                              <div className="ml-4 flex items-center justify-between flex-1">
                                <span>Admin</span>
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-56">
                          <DropdownMenuItem asChild>
                            <Link href="/admin/users" className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              <span>Users</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/plans" className="flex items-center">
                              <Gem className="mr-2 h-4 w-4" />
                              <span>Plans</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/webhooks" className="flex items-center">
                              <History className="mr-2 h-4 w-4" />
                              <span>Webhook Logs</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
        currentPlan={null}
      />

      <HelpDialog
        open={showHelpDialog}
        onOpenChange={setShowHelpDialog}
      />
    </>
  )
} 