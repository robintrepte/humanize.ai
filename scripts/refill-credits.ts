import "dotenv/config";
import { db } from "../lib/db";
import { user, plan } from "../db/schema";
import { eq, and, isNotNull, gte } from "drizzle-orm";

async function refillCredits() {
  try {
    const usersWithPlans = await db
      .select({
        user: user,
        plan: plan,
      })
      .from(user)
      .innerJoin(plan, eq(user.planId, plan.id))
      .where(
        and(
          eq(user.subscriptionStatus, "active"),
          isNotNull(user.currentPeriodEnd),
          gte(user.currentPeriodEnd, new Date()),
          isNotNull(user.planId)
        )
      );

    console.log(
      `Found ${usersWithPlans.length} users with active subscriptions`
    );

    for (const row of usersWithPlans) {
      if (row.plan) {
        await db
          .update(user)
          .set({ credits: row.plan.credits })
          .where(eq(user.id, row.user.id));
        console.log(
          `Refilled credits for user ${row.user.id} to ${row.plan.credits}`
        );
      }
    }

    console.log("Credit refill completed successfully");
  } catch (error) {
    console.error("Error refilling credits:", error);
  }
}

refillCredits();
