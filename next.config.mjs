/** @type {import('next').NextConfig} */
import { hostname } from 'os';

const currentDomain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';

const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NODE_ENV === 'production'
      ? `https://${currentDomain}`
      : `http://localhost:3000`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: 'play.tretu.de',
      },
      {
        protocol: 'https',
        hostname: currentDomain,
      },
    ],
  },
};

export default nextConfig;
