import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const humanizationId = parseInt(resolvedParams.id);

    const humanization = await prisma.humanization.findFirst({
      where: {
        id: humanizationId,
        userId: session.user.id
      }
    });

    if (!humanization) {
      return NextResponse.json({ error: 'Humanization not found' }, { status: 404 });
    }

    return NextResponse.json({ humanization });
  } catch (error) {
    console.error('Error fetching humanization:', error);
    return NextResponse.json({ error: 'Failed to fetch humanization' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const humanizationId = parseInt(resolvedParams.id);

    const humanization = await prisma.humanization.findFirst({
      where: {
        id: humanizationId,
        userId: session.user.id
      }
    });

    if (!humanization) {
      return NextResponse.json({ error: 'Humanization not found' }, { status: 404 });
    }

    await prisma.humanization.delete({
      where: {
        id: humanizationId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting humanization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 