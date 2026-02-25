import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { plan } from "@/db/schema";

export async function getPricingPlans() {
  return db
    .select()
    .from(plan)
    .where(eq(plan.isActive, true))
    .orderBy(asc(plan.price));
}
