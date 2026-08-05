/**
 * Simple in-memory sliding-window rate limiter.
 * Sufficient for a single-instance Vercel deployment's login route; if you scale
 * to multiple regions/instances, swap the Map for Upstash Redis (same interface).
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}
