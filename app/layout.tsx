import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import LayoutWrapper from "@/components/LayoutWrapper";

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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}
