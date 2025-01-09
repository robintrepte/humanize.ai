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
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const paymentId = body;
    const payment = await mollieClient.payments.get(paymentId);

    interface PaymentMetadata {
      userId: string;
      planId: string;
      credits: string;
    }

    if (payment.status === 'paid') {
      const metadata = payment.metadata as PaymentMetadata;
      const userId = parseInt(metadata.userId);
      const planId = parseInt(metadata.planId);
      const credits = parseInt(metadata.credits);

      console.log('Parsed payment metadata:', { userId, planId, credits });

      if (userId && planId && credits) {
        try {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              credits: {
                increment: credits
              },
              planId: planId,
              subscriptionStatus: 'active',
              currentPeriodEnd: nextMonth,
            }
          });

          console.log('User updated:', updatedUser);

          if (payment.subscriptionId) {
            const subscriptionUpdate = await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionId: payment.subscriptionId
              }
            });
            console.log('Subscription ID updated:', subscriptionUpdate);
          }
        } catch (error) {
          console.error('Error updating user:', error);
          throw error; // Re-throw to be caught by outer try-catch
        }
      } else {
        console.error('Invalid metadata values:', { userId, planId, credits });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 