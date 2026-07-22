import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMollieClient, SequenceType } from "@mollie/api-client";
import { db } from "@/lib/db";
import { plan } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import {
  checkCheckoutRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";
import { getRequiredEnv } from "@/lib/env";

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY || "test_missing",
});

interface CustomerMetadata {
  userId: string;
}

export async function POST(req: Request) {
  try {
    if (!checkCheckoutRateLimit(req)) {
      return rateLimitExceededResponse();
    }

    getRequiredEnv("MOLLIE_API_KEY");

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan: planName } = await req.json();

    const [planRow] = await db
      .select()
      .from(plan)
      .where(
        and(
          eq(plan.isActive, true),
          sql`lower(${plan.name}) = lower(${planName})`
        )
      )
      .limit(1);

    if (!planRow) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    let customer;
    try {
      const customersPage = await mollieClient.customers.page();
      customer = customersPage.find(
        (c) =>
          c.metadata &&
          (c.metadata as CustomerMetadata).userId ===
            session.user.id.toString()
      );
    } catch (error) {
      console.error("Error finding customer:", error);
    }

    if (!customer) {
      customer = await mollieClient.customers.create({
        name: session.user.username || session.user.email || "Unknown",
        email: session.user.email!,
        metadata: { userId: session.user.id.toString() },
      });
    }

    const payment = await mollieClient.payments.create({
      customerId: customer.id,
      amount: {
        currency: "USD",
        value: planRow.price.toFixed(2),
      },
      description: `${planRow.name} Monthly Subscription - First Payment`,
      metadata: {
        userId: session.user.id.toString(),
        planId: planRow.id.toString(),
        credits: planRow.credits.toString(),
        isFirstPayment: true,
      },
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook`,
      redirectUrl: `${process.env.NEXTAUTH_URL}/credits?success=true`,
      sequenceType: SequenceType.first,
    });

    return NextResponse.json({
      checkoutUrl: payment.getCheckoutUrl(),
    });
  } catch (error) {
    console.error("Mollie checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
