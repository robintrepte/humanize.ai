"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

export default function UserProfileOverview({ user, currentUser }: { 
  user: any; 
  currentUser: any 
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") ?? "dark";
    setIsDarkMode(currentTheme === "dark");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full space-y-8 max-w-6xl my-8">
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative inline-block">
            <Avatar className="h-36 w-36 border-2 border-primary">
              <AvatarImage src={user.image || "/default-avatar.png"} alt="Profilbild" />
              <AvatarFallback className="text-6xl">{user.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center sm:text-left mt-4 sm:mt-0">
            <h1 className="text-4xl font-bold">{user.username}</h1>
          </div>
        </div>
      </div>

      {currentUser && currentUser.username === user.username && (
        <Link href="/profile/edit" className="block w-full">
          <Button variant="secondary" className="w-full">
            <Pencil className="w-4 h-4 mr-2" />
            Profil bearbeiten
          </Button>
        </Link>
      )}
    </div>
  );
}
