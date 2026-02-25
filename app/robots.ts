import { MetadataRoute } from "next";

const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? "https://humanize.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard", "/humanize", "/generate/", "/saved/", "/credits", "/subscription", "/login", "/register", "/verify"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/privacy", "/imprint", "/support"],
        disallow: ["/api/", "/admin/", "/dashboard", "/humanize", "/generate/", "/saved/", "/credits", "/subscription", "/login", "/register", "/verify"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/privacy", "/imprint", "/support"],
        disallow: ["/api/", "/admin/", "/dashboard", "/humanize", "/generate/", "/saved/", "/credits", "/subscription", "/login", "/register", "/verify"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard", "/humanize", "/generate/", "/saved/", "/credits", "/subscription", "/login", "/register", "/verify"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
