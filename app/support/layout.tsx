import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Contact HumanizeAI support. Get help with the AI humanizer, billing, or technical issues.",
  alternates: { canonical: "/support" },
  robots: { index: true, follow: true },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
