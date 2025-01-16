import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { createMollieClient } from '@mollie/api-client';
import SubscriptionContent from "./SubscriptionContent";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        plan: true 
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <h2 className="font-semibold">Error</h2>
          <p>Failed to load user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/");
  }

  let subscription;
  let error;
  
  if (user.subscriptionId && process.env.MOLLIE_API_KEY) {
    try {
      const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
      const customers = await mollieClient.customers.page();
      const customer = customers.find(c => 
        c.metadata && (c.metadata as any).userId === user.id.toString()
      );

      if (customer) {
        subscription = await mollieClient.customerSubscriptions.get(
          user.subscriptionId,
          { customerId: customer.id }
        );
      }
    } catch (e) {
      console.error('Error fetching subscription:', e);
      error = 'Unable to load subscription details. Some features may be limited.';
    }
  }

  // Create a complete user object with all subscription fields
  const completeUser = {
    ...user,
    subscriptionStatus: user.subscriptionStatus || session.user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd || session.user.currentPeriodEnd
  };

  return <SubscriptionContent user={completeUser} subscription={subscription} error={error} />;
} 