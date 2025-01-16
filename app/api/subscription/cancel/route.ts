import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { createMollieClient } from '@mollie/api-client';
import prisma from '@/lib/prisma';

interface CustomerMetadata {
  userId: string;
  [key: string]: any;
}

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user has active status but no subscription ID, just update the local status
    if (user.subscriptionStatus === 'active' && !user.subscriptionId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: 'canceled_end_period',
        }
      });
      return NextResponse.json({ message: 'Subscription cancelled successfully' });
    }

    if (user.subscriptionId) {
      try {
        const customers = await mollieClient.customers.page();
        const customer = customers.find(c => {
          return c.metadata && (c.metadata as CustomerMetadata).userId === user.id.toString();
        });

        if (customer) {
          try {
            await mollieClient.customerSubscriptions.cancel(user.subscriptionId, {
              customerId: customer.id
            });
          } catch (mollieError) {
            console.error('Mollie cancellation error:', mollieError);
          }
        }
      } catch (error) {
        console.error('Error in Mollie operations:', error);
      }
    }

    // Update local status to canceled_end_period but keep other subscription data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled_end_period',
      }
    });

    return NextResponse.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error in main try block:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to cancel subscription' 
    }, { status: 500 });
  }
} 