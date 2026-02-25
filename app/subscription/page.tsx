import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, plan } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createMollieClient } from "@mollie/api-client";
import SubscriptionContent from "./SubscriptionContent";

export const metadata = {
  title: "Subscription",
  description:
    "Manage your HumanizeAI subscription. View plan, credits, and billing. Upgrade or cancel.",
  robots: { index: false, follow: true },
};

interface MollieSubscription {
  id: string;
  mode: string;
  createdAt: string;
  status: string;
  amount: { value: string; currency: string };
  times?: number;
  timesRemaining?: number;
  interval: string;
  startDate: string;
  nextPaymentDate: string;
  description: string;
  method: string | null;
  mandateId: string | null;
  metadata: unknown;
  canceledAt: string | null;
  webhookUrl: string;
}

export default async function SubscriptionPage() {
  try {
    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    let profileUser;
    try {
      const [u] = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);
      if (!u) {
        redirect("/");
      }
      let planRow = null;
      if (u.planId) {
        const [p] = await db
          .select()
          .from(plan)
          .where(eq(plan.id, u.planId))
          .limit(1);
        planRow = p ?? null;
      }
      profileUser = { ...u, plan: planRow };
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to fetch user data");
    }

    if (!profileUser) {
      redirect("/");
    }

    let subscription: (MollieSubscription & { customerId?: string }) | undefined;
    let error: string | undefined;

    if (
      profileUser.subscriptionId &&
      process.env.MOLLIE_API_KEY
    ) {
      try {
        const mollieClient = createMollieClient({
          apiKey: process.env.MOLLIE_API_KEY,
        });

        let customers;
        try {
          customers = await mollieClient.customers.page();
        } catch (mollieError) {
          console.error("Mollie customers error:", mollieError);
          throw new Error("Failed to fetch Mollie customers");
        }

        const customer = customers.find(
          (c) =>
            c.metadata &&
            (c.metadata as { userId?: string }).userId ===
              profileUser!.id.toString()
        );

        if (customer) {
          try {
            const subscriptionData =
              (await mollieClient.customerSubscriptions.get(
                profileUser.subscriptionId!,
                { customerId: customer.id }
              )) as MollieSubscription;

            subscription = {
              ...subscriptionData,
              customerId: customer.id,
            };
          } catch (subError) {
            console.error("Subscription fetch error:", subError);
            error = "Unable to load subscription details";
          }
        }
      } catch (e) {
        console.error("Mollie client error:", e);
        error = "Unable to connect to payment provider";
      }
    }

    const completeUser = {
      ...profileUser,
      subscriptionStatus:
        profileUser.subscriptionStatus ??
        session.user.subscriptionStatus ??
        null,
      currentPeriodEnd:
        profileUser.currentPeriodEnd ??
        session.user.currentPeriodEnd ??
        null,
    };

    return (
      <SubscriptionContent
        user={completeUser}
        subscription={subscription}
        error={error}
      />
    );
  } catch (err) {
    console.error("Top level error:", err);
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <h2 className="font-semibold">Error</h2>
          <p>
            {err instanceof Error
              ? err.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }
}
