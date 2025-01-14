import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        planId: null,
        subscriptionId: null,
        subscriptionStatus: null,
        currentPeriodEnd: null
      },
      include: {
        plan: true
      }
    });

    return NextResponse.json({ message: 'Subscription reset successfully', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Error resetting subscription' }, { status: 500 });
  }
}
