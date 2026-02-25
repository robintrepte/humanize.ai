import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config for proxy/middleware (no Node-only deps like DB/bcrypt).
 * Full config with providers and adapter is in auth.ts.
 */
export default {
  providers: [], // Providers are in auth.ts; this file is for edge/proxy only
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/login",
  },
} satisfies NextAuthConfig;
