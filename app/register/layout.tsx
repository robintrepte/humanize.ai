import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your HumanizeAI account. Get free credits to humanize AI-generated text and bypass AI detectors.",
  robots: { index: true, follow: true },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
