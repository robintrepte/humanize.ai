import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { settings, step } = await req.json()

    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        settings,
        currentStep: step,
        status: 'in_progress'
      }
    })

    return NextResponse.json({ generationId: generation.id })
  } catch (error) {
    console.error('Error saving generation:', error)
    return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  console.log('PATCH request received');
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      console.error('Invalid ID:', id);
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    console.log('Updating generation with ID:', id);

    const { outline, content, step } = await req.json()
    console.log('Received data:', { outline, content, step });

    const updateData: any = {
      updatedAt: new Date()
    }

    if (outline) updateData.outline = outline
    if (content) updateData.content = content
    if (step) updateData.currentStep = step

    const generation = await prisma.generation.update({
      where: { id },
      data: updateData
    })

    console.log('Generation updated successfully:', generation);

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating generation:', error)
    return NextResponse.json({ error: 'Failed to update generation' }, { status: 500 })
  }
} 