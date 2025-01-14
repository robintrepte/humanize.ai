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
    console.log('Starting subscription cancellation process');
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log('No valid session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching user data for ID:', session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User subscription status:', user.subscriptionStatus);
    console.log('User subscription ID:', user.subscriptionId);

    // If user has active status but no subscription ID, just update the local status
    if (user.subscriptionStatus === 'active' && !user.subscriptionId) {
      console.log('User has active status but no subscription ID, updating local status');
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: 'canceled',
          subscriptionId: null,
          planId: null,
          currentPeriodEnd: null
        }
      });
      return NextResponse.json({ message: 'Subscription cancelled successfully' });
    }

    if (user.subscriptionId) {
      try {
        console.log('Fetching Mollie customers');
        const customers = await mollieClient.customers.page();
        console.log('Found customers:', customers.length);
        
        const customer = customers.find(c => {
          console.log('Checking customer metadata:', c.metadata);
          return c.metadata && (c.metadata as CustomerMetadata).userId === user.id.toString();
        });

        if (customer) {
          console.log('Found Mollie customer:', customer.id);
          console.log('Attempting to cancel subscription:', user.subscriptionId);

          try {
            await mollieClient.customerSubscriptions.cancel(user.subscriptionId, {
              customerId: customer.id
            });
            console.log('Successfully cancelled Mollie subscription');
          } catch (mollieError) {
            console.error('Mollie cancellation error:', mollieError);
          }
        }
      } catch (error) {
        console.error('Error in Mollie operations:', error);
      }
    }

    // Always update local status
    console.log('Updating user status in database');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionId: null,
        planId: null,
        currentPeriodEnd: null
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