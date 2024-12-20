"use client"

import { Header } from "@/components/Header"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { House } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Willkommen</h1>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            {session ? (
              <>
                <Link href="/">
                  <Button variant="outline" className="flex items-center justify-center h-12 w-full sm:w-auto">
                    <House className="mr-2" />
                    Startseite
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="h-10 w-full sm:w-auto">
                  Anmelden
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
