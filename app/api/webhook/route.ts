import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createMollieClient } from '@mollie/api-client';
import prisma from '@/lib/prisma';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export async function POST(req: Request) {
  const startTime = Date.now();
  const headersList = await headers();
  const requestHeaders = Object.fromEntries(headersList.entries());
  const formData = await req.formData();
  const bodyText = formData.get('id')?.toString() || '';
  
  try {
    // Handle both payment and subscription webhooks
    let type: 'payment' | 'subscription';
    let status: string;
    let metadata: any;
    let responseBody: any;

    if (bodyText.startsWith('sub_')) {
      // Subscription webhook
      const [subscriptionId, customerId] = bodyText.split(',');
      const subscription = await mollieClient.customerSubscriptions.get(subscriptionId, { customerId });
      
      if (!subscription) {
        throw new Error('Invalid subscription ID');
      }

      type = 'subscription';
      status = subscription?.status;
      metadata = subscription?.metadata;
      responseBody = subscription;

      await handleSubscriptionWebhook(subscription);
    } else {
      // Payment webhook
      const payment = await mollieClient.payments.get(bodyText);
      
      if (!payment) {
        throw new Error('Invalid payment ID');
      }

      type = 'payment';
      status = payment?.status;
      metadata = payment?.metadata;
      responseBody = payment;

      // Process any paid payment
      if (payment.status === 'paid') {
        await handleSubscriptionPayment(payment);
      }
    }

    const endTime = Date.now();
    
    // Log the webhook
    await prisma.webhookLog.create({
      data: {
        type,
        status: 'success',
        payload: JSON.stringify({ id: bodyText, status, metadata }),
        requestHeaders: JSON.stringify(requestHeaders),
        requestBody: bodyText,
        responseStatus: 200,
        responseBody: JSON.stringify(responseBody),
        processingTimeMs: endTime - startTime
      }
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    const endTime = Date.now();
    console.error('Webhook error:', error);
    
    await prisma.webhookLog.create({
      data: {
        type: 'webhook',
        status: 'error',
        payload: bodyText || '',
        error: error instanceof Error ? error.message : 'Unknown error',
        requestHeaders: JSON.stringify(requestHeaders),
        requestBody: bodyText || '',
        responseStatus: 500,
        responseBody: JSON.stringify({ error: 'Internal server error' }),
        processingTimeMs: endTime - startTime
      }
    });
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleSubscriptionWebhook(subscription: any) {
  const metadata = subscription.metadata;
  const userId = parseInt(metadata.userId);

  switch (subscription.status) {
    case 'active':
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: 'active',
          subscriptionId: subscription.id,
          currentPeriodEnd: new Date(subscription.nextPaymentDate)
        }
      });
      break;
    case 'canceled':
    case 'suspended':
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: subscription.status
        }
      });
      break;
  }
}

async function handleSubscriptionPayment(payment: any) {
  if (payment.status === 'paid' && payment.metadata?.isFirstPayment) {
    const metadata = payment.metadata;
    const userId = parseInt(metadata.userId);
    const credits = parseInt(metadata.credits);
    const planId = parseInt(metadata.planId);

    // Create subscription after first payment
    const subscription = await mollieClient.customerSubscriptions.create({
      customerId: payment.customerId,
      amount: {
        currency: 'USD',
        value: payment.amount.value
      },
      interval: '1 month',
      description: `${payment.description.replace(' - First Payment', '')}`,
      metadata: {
        userId: metadata.userId,
        planId: metadata.planId,
        credits: metadata.credits
      },
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook`
    });

    // Update user with subscription details
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: credits },
        subscriptionId: subscription.id,
        subscriptionStatus: 'active',
        planId: planId,
        currentPeriodEnd: new Date(
          new Date(payment.paidAt).setMonth(
            new Date(payment.paidAt).getMonth() + 1
          )
        )
      }
    });
  } else if (payment.status === 'paid') {
    // Handle regular subscription payments
    const metadata = payment.metadata;
    const userId = parseInt(metadata.userId);
    const credits = parseInt(metadata.credits);

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: credits },
        currentPeriodEnd: new Date(
          new Date(payment.paidAt).setMonth(
            new Date(payment.paidAt).getMonth() + 1
          )
        )
      }
    });
  }
} 