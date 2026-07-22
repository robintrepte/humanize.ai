import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";

/** Server-side credit cost for humanize (must match client preview formula). */
export function calculateHumanizeCredits(textLength: number): number {
  return Math.max(0, Math.ceil(Math.max(0, textLength) / 5));
}

/** Flat cost for simple generate completions. */
export const GENERATE_CREDITS = 5;

/** Flat cost for generate outline. */
export const OUTLINE_CREDITS = 5;

/** Flat cost per generated content section. */
export const CONTENT_SECTION_CREDITS = 2;

/**
 * Atomically deduct credits if the user has enough.
 * Returns remaining credits, or null if insufficient / not found.
 */
export async function deductCreditsAtomic(
  userId: number,
  cost: number
): Promise<number | null> {
  if (cost <= 0) {
    const [current] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    return current?.credits ?? null;
  }

  const [updated] = await db
    .update(user)
    .set({ credits: sql`${user.credits} - ${cost}` })
    .where(and(eq(user.id, userId), gte(user.credits, cost)))
    .returning({ credits: user.credits });

  return updated?.credits ?? null;
}
