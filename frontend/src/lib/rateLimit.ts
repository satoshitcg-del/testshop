// Simple in-memory rate limiter
// For production, use Redis or a service like Vercel KV

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // 100 requests per window

export function rateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up expired entries
  if (record && now > record.resetTime) {
    rateLimitStore.delete(ip);
  }

  const current = rateLimitStore.get(ip);

  if (!current) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  if (current.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: current.resetTime - now };
  }

  current.count++;
  return { allowed: true, remaining: MAX_REQUESTS - current.count, resetIn: current.resetTime - now };
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}
