import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

const siteName = "HumanizeAI";
const defaultTitle = "HumanizeAI – Humanize AI-Generated Text | Bypass AI Detectors";
const defaultDescription =
  "Transform AI-generated text into natural, human-like writing. Bypass AI detectors (GPTZero, ZeroGPT, Turnitin) with our advanced humanizer. Multiple languages and writing levels. Free credits to start.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ??
      (process.env.NEXT_PUBLIC_DOMAIN?.startsWith("http")
        ? process.env.NEXT_PUBLIC_DOMAIN
        : `http://${process.env.NEXT_PUBLIC_DOMAIN ?? "localhost:3003"}`)
  ),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "AI humanizer",
    "AI detector bypass",
    "humanize text",
    "AI writing",
    "GPTZero bypass",
    "Turnitin",
    "ZeroGPT",
    "humanize AI content",
  ],
  authors: [{ name: siteName, url: "/" }],
  creator: siteName,
  publisher: siteName,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: "/" },
  verification: {
    // Optional: add when you have them
    // google: "your-google-verification",
    // yandex: "your-yandex-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Apply saved theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");var dark=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)||!t;document.documentElement.classList.toggle("dark",dark);})();`,
          }}
        />
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
