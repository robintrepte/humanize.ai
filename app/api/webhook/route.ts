import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createMollieClient } from '@mollie/api-client';
import prisma from '@/lib/prisma';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('mollie-signature');

    if (!signature) {
      await prisma.webhookLog.create({
        data: {
          type: 'subscription',
          status: 'error',
          payload: body,
          error: 'Missing signature'
        }
      });
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Handle both payment and subscription webhooks
    let type: 'payment' | 'subscription';
    let status: string;
    let metadata: any;

    if (body.startsWith('sub_')) {
      // Subscription webhook
      const [subscriptionId, customerId] = body.split(',');
      const subscription = await mollieClient.customerSubscriptions.get(subscriptionId, { customerId });
      type = 'subscription';
      status = subscription?.status;
      metadata = subscription?.metadata;

      await handleSubscriptionWebhook(subscription);
    } else {
      // Payment webhook
      const payment = await mollieClient.payments.get(body);
      type = 'payment';
      status = payment?.status;
      metadata = payment?.metadata;

      if (payment?.subscriptionId) {
        await handleSubscriptionPayment(payment);
      }
    }

    // Log the webhook
    await prisma.webhookLog.create({
      data: {
        type,
        status: 'success',
        payload: JSON.stringify({ id: body, status, metadata })
      }
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    await prisma.webhookLog.create({
      data: {
        type: 'webhook',
        status: 'error',
        payload: await req.text(),
        error: error instanceof Error ? error.message : 'Unknown error'
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
  if (payment.status === 'paid') {
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