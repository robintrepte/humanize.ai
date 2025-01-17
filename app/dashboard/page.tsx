"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, BookmarkIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { PricingDialog } from "@/components/PricingDialog";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPricingDialog, setShowPricingDialog] = useState(false);

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

  const tools = [
    {
      title: "AI Text Humanizer",
      description: "Transform AI-generated text into natural, human-like content",
      icon: <Sparkles className="h-8 w-8" />,
      href: "/humanize",
      color: "text-blue-500",
    },
    {
      title: "AI Detector",
      description: "Check if text was written by AI or a human",
      icon: <Shield className="h-8 w-8" />,
      href: "/detector",
      color: "text-green-500",
    },
    {
      title: "Saved Texts",
      description: "Access your previously humanized texts",
      icon: <BookmarkIcon className="h-8 w-8" />,
      href: "/saved",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 py-6 border-b">
        <div className="w-full mx-auto px-8">
          <h1 className="text-2xl flex items-center gap-4 justify-center md:justify-start">
            Welcome back, {session.user?.username || "User"}!
          </h1>
        </div>
      </header>
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className={`${tool.color}`}>
                      {tool.icon}
                    </div>
                    <h2 className="text-xl font-semibold">{tool.title}</h2>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Available Credits</h2>
                    <p className="text-3xl font-bold">{session.user?.credits || 0}</p>
                  </div>
                  <Button onClick={() => setShowPricingDialog(true)}>
                    Buy Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <PricingDialog 
        open={showPricingDialog} 
        onOpenChange={setShowPricingDialog}
      />
    </div>
  );
} 