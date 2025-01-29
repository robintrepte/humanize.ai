import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

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