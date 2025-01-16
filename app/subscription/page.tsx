import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { createMollieClient } from '@mollie/api-client';
import SubscriptionContent from "./SubscriptionContent";

interface MollieSubscription {
  id: string;
  mode: string;
  createdAt: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  times?: number;
  timesRemaining?: number;
  interval: string;
  startDate: string;
  nextPaymentDate: string;
  description: string;
  method: string | null;
  mandateId: string | null;
  metadata: any;
  canceledAt: string | null;
  webhookUrl: string;
}

export default async function SubscriptionPage() {
  try {
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
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to fetch user data');
    }

    if (!user) {
      redirect("/");
    }

    let subscription;
    let error;
    
    if (user.subscriptionId && process.env.MOLLIE_API_KEY) {
      try {
        const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
        
        // First try to get customers
        let customers;
        try {
          customers = await mollieClient.customers.page();
        } catch (mollieError) {
          console.error('Mollie customers error:', mollieError);
          throw new Error('Failed to fetch Mollie customers');
        }

        const customer = customers.find(c => 
          c.metadata && (c.metadata as any).userId === user.id.toString()
        );

        if (customer) {
          try {
            const subscriptionData = await mollieClient.customerSubscriptions.get(
              user.subscriptionId,
              { customerId: customer.id }
            ) as MollieSubscription;
            
            // Convert the Mollie subscription class to a plain object
            subscription = {
              ...subscriptionData,
              customerId: customer.id
            };
          } catch (subError) {
            console.error('Subscription fetch error:', subError);
            error = 'Unable to load subscription details';
          }
        }
      } catch (e) {
        console.error('Mollie client error:', e);
        error = 'Unable to connect to payment provider';
      }
    }

    const completeUser = {
      ...user,
      subscriptionStatus: user.subscriptionStatus || session.user.subscriptionStatus,
      currentPeriodEnd: user.currentPeriodEnd || session.user.currentPeriodEnd
    };

    return <SubscriptionContent user={completeUser} subscription={subscription} error={error} />;
  } catch (error) {
    console.error('Top level error:', error);
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <h2 className="font-semibold">Error</h2>
          <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }
} 