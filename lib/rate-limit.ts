/**
 * In-memory rate limiter. Per-instance only (serverless: per cold start).
 * For multi-instance limits, use Redis (e.g. @upstash/ratelimit) or host rate limiting.
 */

type Bucket = { count: number; resetAt: number };

const stores = new Map<string, Map<string, Bucket>>();

function getStore(name: string): Map<string, Bucket> {
  let store = stores.get(name);
  if (!store) {
    store = new Map();
    stores.set(name, store);
  }
  return store;
}

export function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function checkLimit(
  storeName: string,
  id: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  const store = getStore(storeName);
  const now = Date.now();
  const entry = store.get(id);

  if (!entry || now >= entry.resetAt) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count += 1;
  if (entry.count > maxAttempts) return false;
  return true;
}

/** Auth/register: 10 attempts per IP per minute */
export function checkAuthRateLimit(request: Request): boolean {
  return checkLimit("auth", getClientId(request), 10, 60_000);
}

/** Expensive AI routes: 30 requests per IP per minute */
export function checkAiRateLimit(request: Request): boolean {
  return checkLimit("ai", getClientId(request), 30, 60_000);
}

/** Support form: 5 requests per IP per 10 minutes */
export function checkSupportRateLimit(request: Request): boolean {
  return checkLimit("support", getClientId(request), 5, 10 * 60_000);
}

/** Checkout: 10 requests per IP per minute */
export function checkCheckoutRateLimit(request: Request): boolean {
  return checkLimit("checkout", getClientId(request), 10, 60_000);
}

export function rateLimitExceededResponse() {
  return Response.json(
    { error: "Too many attempts. Please try again later." },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
