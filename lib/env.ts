/**
 * Environment variable helpers for production readiness.
 * Use getRequiredEnv() where a var is mandatory; throws with a clear message if missing.
 */

/**
 * Returns the value of an env var or throws. Use for required vars (e.g. in API routes).
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value == null || String(value).trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

/**
 * Returns the value of an env var or undefined. Use for optional vars.
 */
export function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value != null ? String(value).trim() || undefined : undefined;
}
