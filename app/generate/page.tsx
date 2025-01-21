"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GenerateContent from "./GenerateContent";
import { PenTool, Loader2 } from "lucide-react";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 py-6 border-b">
        <div className="w-full mx-auto px-8">
          <h1 className="text-2xl flex items-center gap-4 justify-center md:justify-start">
            <PenTool size={24} />
            AI Text Generator
          </h1>
        </div>
      </header>
      <div className="flex-1 flex">
        <main className="flex-1 p-8">
          <GenerateContent />
        </main>
      </div>
    </div>
  );
} 