/** @type {import('next').NextConfig} */

const currentDomain = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3003";
const isProd = process.env.NODE_ENV === "production";
const siteOrigin = isProd ? `https://${currentDomain}` : `http://localhost:3003`;

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  // Theme bootstrap script + JSON-LD use inline; keep tight otherwise.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${siteOrigin} https://api.mollie.com https://api.openai.com https://api.anthropic.com`,
  "worker-src 'self' blob:",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig = {
  env: {
    NEXTAUTH_URL: siteOrigin,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "humanize.twentyfirst.media",
      },
      {
        protocol: "https",
        hostname: currentDomain.replace(/:\d+$/, "") || currentDomain,
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
    ];
    if (isProd) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      });
    }
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
