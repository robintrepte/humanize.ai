import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'
import { AIClient } from '@/lib/ai-client'
import { PrismaClient } from '@prisma/client'

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as 'openai' | 'anthropic',
  model: process.env.AI_MODEL || 'gpt-4',
  temperature: 0.7,
  maxTokens: 2048,
})

const prisma = new PrismaClient()

const CREDITS_FOR_OUTLINE = 5 // Adjust this value as needed

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { settings } = await req.json()

    // Validate required settings
    if (!settings?.contentType || !settings?.prompt || !settings?.language || 
        !settings?.tone || !settings?.targetLength || !settings?.keywords) {
      return NextResponse.json(
        { error: 'Missing required settings' },
        { status: 400 }
      )
    }

    // Check if user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    })

    if (!user || user.credits < CREDITS_FOR_OUTLINE) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    console.log('Settings being sent:', {
      contentType: settings.contentType,
      prompt: settings.prompt,
      language: settings.language,
      tone: settings.tone,
      targetLength: settings.targetLength,
      keywords: settings.keywords
    });

    const prompt = `Create a detailed outline for a ${settings.contentType} about ${settings.prompt}.
                   The content should be in ${settings.language} language with a ${settings.tone} tone.
                   Target length is ${settings.targetLength} words.
                   Keywords to include: ${settings.keywords.join(', ')}
                   
                   Return the outline as a JSON array of sections, where each section object has exactly two fields:
                   - "title": string
                   - "points": string[]
                   
                   Example format:
                   [
                     {
                       "title": "Introduction",
                       "points": ["Point 1", "Point 2"]
                     }
                   ]
                   
                   Ensure the response is valid JSON with no trailing commas. Do not include any explanatory text or markdown.`

    const result = await aiClient.complete([
      { role: "system", content: "You are a professional content outline generator." },
      { role: "user", content: prompt }
    ])

    // Ensure the response is valid JSON
    let outline
    try {
      // Remove any markdown formatting if present
      const cleanResult = result
        .replace(/```json\n?|\n?```/g, '')  // Remove code block markers
        .replace(/^\s+|\s+$/g, '')          // Remove leading/trailing whitespace
        .replace(/\n\s*\n/g, '\n')          // Remove empty lines
        .replace(/,(\s*[}\]])/g, '$1');     // Remove trailing commas

      // Attempt to find JSON array in the response
      const jsonMatch = cleanResult.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in response');
      }

      outline = JSON.parse(jsonMatch[0]);

      // Validate outline structure
      if (!Array.isArray(outline) || !outline.every(section => 
        typeof section === 'object' && 
        section !== null &&
        typeof section.title === 'string' &&
        Array.isArray(section.points)
      )) {
        throw new Error('Invalid outline structure');
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Raw result:', result);
      return NextResponse.json(
        { error: 'Failed to generate valid outline format' }, 
        { status: 500 }
      );
    }

    // Deduct credits after successful generation
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: CREDITS_FOR_OUTLINE } }
    })

    return NextResponse.json({ 
      outline,
      creditsUsed: CREDITS_FOR_OUTLINE,
      creditsRemaining: user.credits - CREDITS_FOR_OUTLINE
    })
  } catch (error) {
    console.error('Outline generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate outline' },
      { status: 500 }
    )
  }
} 