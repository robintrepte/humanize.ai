import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { createMollieClient, SequenceType } from '@mollie/api-client';
import prisma from '@/lib/prisma';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

interface CustomerMetadata {
  userId: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan: planName } = await req.json();

    const plan = await prisma.plan.findFirst({
      where: {
        name: { equals: planName, mode: 'insensitive' },
        isActive: true
      }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Create or retrieve customer
    let customer;
    try {
      const customersPage = await mollieClient.customers.page();
      customer = customersPage.find(c => 
        c.metadata && (c.metadata as CustomerMetadata).userId === session.user.id.toString()
      );
    } catch (error) {
      console.error('Error finding customer:', error);
    }

    if (!customer) {
      customer = await mollieClient.customers.create({
        name: session.user.username || session.user.email || 'Unknown',
        email: session.user.email!,
        metadata: { userId: session.user.id.toString() }
      });
    }

    // Create first payment
    const payment = await mollieClient.payments.create({
      customerId: customer.id,
      amount: {
        currency: 'USD',
        value: plan.price.toFixed(2)
      },
      description: `${plan.name} Monthly Subscription - First Payment`,
      metadata: {
        userId: session.user.id.toString(),
        planId: plan.id.toString(),
        credits: plan.credits.toString(),
        isFirstPayment: true
      },
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook`,
      redirectUrl: `${process.env.NEXTAUTH_URL}/credits?success=true`,
      sequenceType: SequenceType.first
    });
    
    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (error) {
    console.error('Mollie checkout error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 