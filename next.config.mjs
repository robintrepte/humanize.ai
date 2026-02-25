/** @type {import('next').NextConfig} */
import { hostname } from 'os';

const currentDomain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3003';

const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NODE_ENV === 'production'
      ? `https://${currentDomain}`
      : `http://localhost:3003`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'humanize.twentyfirst.media',
      },
      {
        protocol: 'https',
        hostname: currentDomain,
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
