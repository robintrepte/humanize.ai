"use client";

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current path
  const pathname = usePathname();
  
  // Check if current path is login or register
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLandingPage = pathname === "/";

  // Don't show sidebar on auth pages or landing page
  const showSidebar = !isAuthPage && !isLandingPage;

  if (showSidebar) {
    return (
      <div className="flex md:flex-row flex-col h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <main className="h-full">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <main className="h-full">
      {children}
    </main>
  );
} 