import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humanize Text",
  description:
    "Transform AI-generated text into natural, human-like writing. Choose language and writing level. Bypass AI detectors.",
  robots: { index: false, follow: true },
};

export default function HumanizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
