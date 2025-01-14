import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { createMollieClient } from '@mollie/api-client';
import SubscriptionContent from "./SubscriptionContent";

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      plan: true 
    }
  });

  if (!user) {
    redirect("/");
  }

  let subscription;
  if (user.subscriptionId) {
    try {
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
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  }

  // Create a complete user object with all subscription fields
  const completeUser = {
    ...user,
    subscriptionStatus: user.subscriptionStatus || session.user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd || session.user.currentPeriodEnd
  };

  return <SubscriptionContent user={completeUser} subscription={subscription} />;
} 