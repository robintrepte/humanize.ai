import { faqItems } from "@/lib/landing-content";

const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? "https://humanize.ai";

export function LandingStructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HumanizeAI",
    url: baseUrl,
    description:
      "HumanizeAI transforms AI-generated text into natural, human-like writing and helps bypass AI detectors.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@twentyfirst.ai",
      contactType: "customer support",
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HumanizeAI",
    url: baseUrl,
    description:
      "Transform AI-generated text into natural, human-like writing. Bypass AI detectors with our advanced humanizer.",
    publisher: { "@id": `${baseUrl}/#organization` },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...organization,
            "@id": `${baseUrl}/#organization`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
