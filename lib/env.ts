/**
 * Environment variable helpers for production readiness.
 */

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value == null || String(value).trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

export function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value != null ? String(value).trim() || undefined : undefined;
}

const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NEXT_PHASE === "phase-export";

/** Validate critical production env. Skipped during Next.js build/prerender. */
export function assertProductionEnv(): void {
  if (process.env.NODE_ENV !== "production" || isBuildPhase) return;

  const required = ["DATABASE_URL", "AUTH_SECRET"];
  const missing = required.filter((key) => {
    const v = process.env[key];
    return v == null || String(v).trim() === "";
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(", ")}`
    );
  }

  const secret = process.env.AUTH_SECRET!;
  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters in production");
  }
}
