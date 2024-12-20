import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HumanizeAI",
  description: "HumanizeAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <div className="flex md:flex-row flex-col h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <main className="h-full">
                {children}
              </main>
            </div>
          </div>
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}
