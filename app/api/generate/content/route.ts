import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'
import { AIClient } from '@/lib/ai-client'
import { PrismaClient } from '@prisma/client'
import { marked } from 'marked'

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as 'openai' | 'anthropic',
  model: process.env.AI_MODEL || 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1000,
})

const prisma = new PrismaClient()

const CREDITS_PER_SECTION = 10 // Adjust this value as needed

// Configure marked options
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true    // Enable GitHub Flavored Markdown
})

export async function POST(req: Request) {
  try {
    const { settings, outline, sectionId } = await req.json();
    
    // Find the current section and its parent from the outline
    const findSection = (items: any[]): [any, any] => {
      for (const item of items) {
        if (item.id === sectionId) {
          return [item, null];
        }
        if (item.subItems) {
          const [found, parent] = findSection(item.subItems);
          if (found) {
            return [found, parent || item];
          }
        }
      }
      return [null, null];
    };

    const [currentSection, parentSection] = findSection(outline);
    
    if (!currentSection) {
      throw new Error('Section not found');
    }

    // Create a context-aware prompt based on the section's position
    const contextPrompt = `Generate ${settings.contentType} content for a section titled "${currentSection.title}"${
      parentSection ? ` under the parent section "${parentSection.title}"` : ''
    } at depth level ${currentSection.depth || 1}.

    Consider the following context:
    - This is a ${currentSection.depth === 1 ? 'main section' : 'subsection'}
    - ${parentSection ? `It should relate to and expand upon "${parentSection.title}"` : 'This is a top-level section'}
    - The content should be unique and specific to this section
    - Write in a ${settings.tone} tone
    - Use ${settings.writingLevel} level language
    - Target length: ${settings.targetLength} words
    - Include these keywords naturally: ${settings.keywords.join(', ')}

    Generate detailed, unique content that:
    1. Is specific to this section's topic
    2. Maintains appropriate depth and detail
    3. Flows naturally with the previous content
    4. Does not repeat information from other sections`;

    // Generate the content with the enhanced prompt
    const content = await aiClient.complete([
      { role: 'system', content: 'You are a professional content writer. Write your response in markdown format.' },
      { role: 'user', content: contextPrompt }
    ]);
    
    // Validate the response before returning
    if (!content || typeof content !== 'string') {
      console.error('Invalid AI response:', content);
      throw new Error('Invalid response from AI provider');
    }

    // Convert markdown to HTML
    const htmlContent = marked(content);

    return NextResponse.json({ content: htmlContent });
  } catch (error) {
    console.error('Error in content generation:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
} 