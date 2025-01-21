import { NextResponse } from 'next/server';
import { AIClient } from '@/lib/ai-client';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options"
import { PrismaClient } from '@prisma/client'

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as 'openai' | 'anthropic',
  model: process.env.AI_MODEL || 'gpt-4',
  temperature: 0.7,
  maxTokens: 2048,
});

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, contentType, tone, requiredCredits } = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.credits < requiredCredits) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: user.credits - requiredCredits }
    });

    const systemPrompt = `You are a professional content writer. Generate ${contentType} content with a ${tone} tone. 
    The content should be well-structured, engaging, and optimized for the specific content type.
    Ensure the output is natural and human-like.`;

    const result = await aiClient.complete([
      {
        role: "system",
        content: systemPrompt
      },
      { role: "user", content: prompt }
    ]);

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error('Error in generate:', error);
    return NextResponse.json({ error: 'Failed to generate text' }, { status: 500 });
  }
} 