/**
 * In-memory rate limiter for auth/register. Per-instance only (serverless: per cold start).
 * For multi-instance limits, use Redis (e.g. @upstash/ratelimit) or your host’s rate limiting.
 */

const windowMs = 60 * 1000; // 1 minute
const maxAttempts = 10; // per IP per window

const store = new Map<
  string,
  { count: number; resetAt: number }
>();

function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function checkAuthRateLimit(request: Request): boolean {
  const id = getClientId(request);
  const now = Date.now();
  const entry = store.get(id);

  if (!entry) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (now >= entry.resetAt) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count += 1;
  if (entry.count > maxAttempts) return false;
  return true;
}
