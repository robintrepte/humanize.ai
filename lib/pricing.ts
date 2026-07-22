import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { plan, type Plan } from "@/db/schema";

/** Static fallback used when DB is unavailable (e.g. CI build without Postgres). */
export const FALLBACK_PRICING_PLANS: Plan[] = [
  {
    id: 1,
    name: "Starter",
    price: 9,
    credits: 1000,
    description: "Perfect for trying HumanizeAI",
    features: ["1,000 credits / month", "All writing levels", "Email support"],
    isPopular: false,
    isActive: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: 2,
    name: "Pro",
    price: 29,
    credits: 5000,
    description: "For regular creators and teams",
    features: [
      "5,000 credits / month",
      "Priority processing",
      "All languages",
      "Priority support",
    ],
    isPopular: true,
    isActive: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: 3,
    name: "Business",
    price: 79,
    credits: 20000,
    description: "High-volume production use",
    features: [
      "20,000 credits / month",
      "Highest priority",
      "Dedicated support",
      "Usage insights",
    ],
    isPopular: false,
    isActive: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

export async function getPricingPlans(): Promise<Plan[]> {
  try {
    return await db
      .select()
      .from(plan)
      .where(eq(plan.isActive, true))
      .orderBy(asc(plan.price));
  } catch (error) {
    console.warn(
      "[pricing] Falling back to static plans (database unavailable):",
      error instanceof Error ? error.message : error
    );
    return FALLBACK_PRICING_PLANS;
  }
}
