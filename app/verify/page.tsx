import { Header } from "@/components/Header"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 px-4 sm:px-0">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">E-Mail login</h1>
            <p className="text-muted-foreground">Bitte klicke auf den Link in der E-Mail die du erhalten hast, um dich anzumelden.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

