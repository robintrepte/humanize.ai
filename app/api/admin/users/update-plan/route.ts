import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, planId } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        planId,
        subscriptionStatus: planId ? 'active' : null,
        currentPeriodEnd: planId ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      },
      include: {
        plan: true
      }
    });

    return NextResponse.json({ message: 'Plan updated successfully', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating plan' }, { status: 500 });
  }
} 