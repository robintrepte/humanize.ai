import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { createMollieClient } from "@mollie/api-client";
import { db } from "@/lib/db";
import { user, webhookLog } from "@/db/schema";
import { and, eq, like, sql } from "drizzle-orm";

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

function verifyMollieSignature(rawBody: string, signature: string | null, secret: string | undefined): boolean {
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  const headersList = await headers();
  const requestHeaders = Object.fromEntries(headersList.entries());
  const rawBody = await req.text();
  const signature = headersList.get("x-mollie-signature") ?? null;
  const webhookSecret = process.env.MOLLIE_WEBHOOK_SECRET;

  if (process.env.NODE_ENV === "production" && !webhookSecret) {
    console.error("MOLLIE_WEBHOOK_SECRET is required in production");
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 500 });
  }

  if (webhookSecret && !verifyMollieSignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const bodyText =
    (rawBody.startsWith("{") ? (() => { try { return (JSON.parse(rawBody) as { id?: string }).id ?? ""; } catch { return ""; } })() : null) ??
    new URLSearchParams(rawBody).get("id") ??
    "";

  if (!bodyText) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Idempotency: ignore already-processed payment/subscription ids
  const [alreadyProcessed] = await db
    .select({ id: webhookLog.id })
    .from(webhookLog)
    .where(
      and(
        eq(webhookLog.status, "success"),
        like(webhookLog.payload, `%${bodyText.slice(0, 64)}%`)
      )
    )
    .limit(1);

  if (alreadyProcessed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    let type: "payment" | "subscription";
    let status: string;
    let metadata: unknown;
    let responseBody: unknown;

    if (bodyText.startsWith("sub_")) {
      const [subscriptionId, customerId] = bodyText.split(",");
      const subscription =
        await mollieClient.customerSubscriptions.get(subscriptionId, {
          customerId,
        });

      if (!subscription) {
        throw new Error("Invalid subscription ID");
      }

      type = "subscription";
      status = subscription.status ?? "";
      metadata = subscription.metadata;
      responseBody = subscription;

      await handleSubscriptionWebhook(subscription);
    } else {
      const payment = await mollieClient.payments.get(bodyText);

      if (!payment) {
        throw new Error("Invalid payment ID");
      }

      type = "payment";
      status = payment.status ?? "";
      metadata = payment.metadata;
      responseBody = payment;

      if (payment.status === "paid") {
        await handleSubscriptionPayment(payment);
      }
    }

    const endTime = Date.now();

    await db.insert(webhookLog).values({
      type,
      status: "success",
      payload: JSON.stringify({ id: bodyText, status, metadata }),
      requestHeaders: JSON.stringify(requestHeaders),
      requestBody: rawBody.slice(0, 2000),
      responseStatus: 200,
      responseBody: JSON.stringify(responseBody),
      processingTimeMs: endTime - startTime,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    const endTime = Date.now();
    console.error("Webhook error:", error);

    await db.insert(webhookLog).values({
      type: "webhook",
      status: "error",
      payload: bodyText || "",
      error: error instanceof Error ? error.message : "Unknown error",
      requestHeaders: JSON.stringify(requestHeaders),
      requestBody: (rawBody || "").slice(0, 2000),
      responseStatus: 500,
      responseBody: JSON.stringify({ error: "Internal server error" }),
      processingTimeMs: endTime - startTime,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionWebhook(subscription: {
  status?: string;
  id?: string;
  nextPaymentDate?: string;
  metadata?: unknown;
}) {
  const metadata = subscription.metadata as { userId?: string } | undefined;
  const userId = parseInt(metadata?.userId ?? "0", 10);

  switch (subscription.status) {
    case "active":
      await db
        .update(user)
        .set({
          subscriptionStatus: "active",
          subscriptionId: subscription.id ?? null,
          currentPeriodEnd: subscription.nextPaymentDate
            ? new Date(subscription.nextPaymentDate)
            : null,
        })
        .where(eq(user.id, userId));
      break;
    case "canceled":
    case "suspended":
      await db
        .update(user)
        .set({
          subscriptionStatus: subscription.status,
        })
        .where(eq(user.id, userId));
      break;
  }
}

async function handleSubscriptionPayment(payment: {
  status?: string;
  metadata?: unknown;
  customerId?: string;
  amount?: { value: string };
  description?: string;
  paidAt?: string;
}) {
  if (payment.status === "paid" && (payment.metadata as { isFirstPayment?: boolean })?.isFirstPayment) {
    const metadata = payment.metadata as { userId?: string; credits?: string; planId?: string };
    const userId = parseInt(metadata.userId ?? "0", 10);
    const credits = parseInt(metadata.credits ?? "0", 10);
    const planId = parseInt(metadata.planId ?? "0", 10);

    const subscription =
      await mollieClient.customerSubscriptions.create({
        customerId: payment.customerId!,
        amount: {
          currency: "USD",
          value: payment.amount?.value ?? "0",
        },
        interval: "1 month",
        description: (payment.description ?? "").replace(
          " - First Payment",
          ""
        ),
        metadata: {
          userId: metadata.userId,
          planId: metadata.planId,
          credits: metadata.credits,
        },
        webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook`,
      });

    const nextPeriod = payment.paidAt
      ? new Date(
          new Date(payment.paidAt).setMonth(
            new Date(payment.paidAt).getMonth() + 1
          )
        )
      : null;

    await db
      .update(user)
      .set({
        credits: sql`${user.credits} + ${credits}`,
        subscriptionId: subscription.id,
        subscriptionStatus: "active",
        planId,
        currentPeriodEnd: nextPeriod,
      })
      .where(eq(user.id, userId));
  } else if (payment.status === "paid") {
    const metadata = payment.metadata as { userId?: string; credits?: string };
    const userId = parseInt(metadata?.userId ?? "0", 10);
    const credits = parseInt(metadata?.credits ?? "0", 10);

    const nextPeriod = payment.paidAt
      ? new Date(
          new Date(payment.paidAt).setMonth(
            new Date(payment.paidAt).getMonth() + 1
          )
        )
      : null;

    await db
      .update(user)
      .set({
        credits: sql`${user.credits} + ${credits}`,
        currentPeriodEnd: nextPeriod,
      })
      .where(eq(user.id, userId));
  }
}
