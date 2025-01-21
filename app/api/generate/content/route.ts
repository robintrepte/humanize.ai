import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'
import { AIClient } from '@/lib/ai-client'
import { PrismaClient } from '@prisma/client'

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as 'openai' | 'anthropic',
  model: process.env.AI_MODEL || 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1000,
})

const prisma = new PrismaClient()

const CREDITS_PER_SECTION = 10 // Adjust this value as needed

export async function POST(req: Request) {
  try {
    const { title, parentTitle, depth, previousContent, outline } = await req.json();
    
    // Create a context-aware prompt based on the section's position
    const contextPrompt = `Generate content for a section titled "${title}"${
      parentTitle ? ` under the parent section "${parentTitle}"` : ''
    } at depth level ${depth}.

    Consider the following context:
    - This is a ${depth === 1 ? 'main section' : 'subsection'}
    - ${parentTitle ? `It should relate to and expand upon "${parentTitle}"` : 'This is a top-level section'}
    - The content should be unique and specific to this section
    - Previous sections contain: ${previousContent}

    Generate detailed, unique content that:
    1. Is specific to this section's topic
    2. Maintains appropriate depth and detail for a ${depth === 1 ? 'main section' : 'subsection'}
    3. Flows naturally with the previous content
    4. Does not repeat information from other sections`;

    // Generate the content with the enhanced prompt
    const content = await aiClient.complete([
      { role: 'system', content: 'You are a professional content writer.' },
      { role: 'user', content: contextPrompt }
    ]);
    
    // Validate the response before returning
    if (!content || typeof content !== 'string') {
      console.error('Invalid AI response:', content);
      throw new Error('Invalid response from AI provider');
    }

    try {
      // If the content needs to be parsed as JSON, wrap it in try-catch
      return NextResponse.json({ content });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to process AI response' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in content generation:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
} 