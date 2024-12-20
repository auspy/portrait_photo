import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const getIdentifier = (userId: string, plan: "free" | "pro" = "free") =>
  `user_${userId}_${plan}`;

const cache = new Map();
// Create a new ratelimiter that allows 2 requests per 30 days for free users
export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "30 d"),
  analytics: true,
  prefix: "image_generation",
  ephemeralCache: cache,
});

// Rate limit configuration for different plans
export const RATE_LIMITS = {
  free: {
    limit: 2,
    window: "30 days",
  },
  pro: {
    limit: Infinity,
    window: "unlimited",
  },
} as const;

// Helper to check if user can generate without consuming the limit
export async function checkUserCanGenerate(
  userId: string,
  plan: "free" | "pro" = "free"
) {
  if (plan === "pro")
    return Infinity;

  const identifier = getIdentifier(userId, plan);
  // Get the current state without consuming by using rate: 0
  const remaining = await rateLimiter.getRemaining(identifier);
  return Math.max(0, remaining);
}

// Helper to consume a rate limit token after successful generation
export async function consumeRateLimit(
  userId: string,
  plan: "free" | "pro" = "free"
) {
  if (plan === "pro") return true;
  console.log("Consuming rate limit for free user");

  const identifier = getIdentifier(userId, plan);
  const { success } = await rateLimiter.limit(identifier);
  return success;
}
