import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMollieClient } from "@mollie/api-client";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

interface CustomerMetadata {
  userId: string;
  [key: string]: unknown;
}

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [u] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!u) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (u.subscriptionStatus === "active" && !u.subscriptionId) {
      await db
        .update(user)
        .set({ subscriptionStatus: "canceled_end_period" })
        .where(eq(user.id, u.id));
      return NextResponse.json({
        message: "Subscription cancelled successfully",
      });
    }

    if (u.subscriptionId) {
      try {
        const customers = await mollieClient.customers.page();
        const customer = customers.find(
          (c) =>
            c.metadata &&
            (c.metadata as CustomerMetadata).userId === u.id.toString()
        );
        if (customer) {
          try {
            await mollieClient.customerSubscriptions.cancel(
              u.subscriptionId,
              { customerId: customer.id }
            );
          } catch (mollieError) {
            console.error("Mollie cancellation error:", mollieError);
          }
        }
      } catch (error) {
        console.error("Error in Mollie operations:", error);
      }
    }

    await db
      .update(user)
      .set({ subscriptionStatus: "canceled_end_period" })
      .where(eq(user.id, u.id));

    return NextResponse.json({
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Error in main try block:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
      },
      { status: 500 }
    );
  }
}
