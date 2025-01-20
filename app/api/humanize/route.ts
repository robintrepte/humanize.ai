import { NextResponse } from 'next/server';
import { AIClient } from '@/lib/ai-client';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options"
import { PrismaClient } from '@prisma/client'

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as 'openai' | 'anthropic',
  model: process.env.AI_MODEL || 'gpt-4o-mini',
  temperature: 1,
  maxTokens: 2048,
});

const prisma = new PrismaClient()

// Add level-specific prompts
const levelPrompts = {
  basic: "Write in a simple, conversational style with short sentences and common words. Use contractions and informal language. Include occasional fragments and natural speech patterns.",
  intermediate: "Balance formal and informal language. Mix short and medium-length sentences. Include some field-specific terminology when appropriate, while maintaining a natural flow.",
  advanced: "Use sophisticated language and complex sentence structures, but maintain natural flow. Include field-specific terminology and nuanced expressions, while avoiding overly rigid academic constructions."
};

// Add text preprocessing
const preprocessText = (text: string) => {
  // Remove markdown formatting
  text = text.replace(/[*_~`#]+/g, '') // Remove markdown symbols
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Convert links to text
            .replace(/^\s*[-+*]\s/gm, '') // Remove list markers
            .replace(/^-{3,}|_{3,}|\*{3,}$/gm, '') // Remove horizontal rules
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Remove excessive whitespace while preserving paragraph breaks
  text = text.replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
            .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with double newline
            .trim();
  
  // Remove any formatting artifacts
  text = text.replace(/[""]/g, '"')
             .replace(/['']/g, "'");
             
  return text;
};

// Add title generation function with limited context
async function generateTitleFromText(text: string, language: string) {
  const contextText = text.split(/\s+/).slice(0, 60).join(' ');
  
  const result = await aiClient.complete([
    {
      role: "system",
      content: `You are a title generator. Generate a short, engaging title (maximum 6 words) for the given text in ${language}. The title should be descriptive and capture the main topic. Only respond with the title, nothing else. If you find that the text already has a title, return that title.`
    },
    { 
      role: "user", 
      content: contextText 
    }
  ]);

  return result;
}

// Add paragraph processing function
const processParagraphs = async (text: string, systemPrompt: string, language: string) => {
  // Check if we should process as single text or paragraph by paragraph
  const processAsSingleText = process.env.SINGLE_PARAGRAPH === 'true';
  
  if (processAsSingleText) {
    // Process entire text at once
    const prompt = `${text} 
                    \n-
                    \nRewrite the above in ${language} with the following adjustments:
                    \nBurstiness refers to the variation in sentence lengths and structures, creating a dynamic and engaging rhythm. High perplexity involves diverse vocabulary and intricate sentence patterns, while high burstiness blends short, impactful sentences with longer, detailed ones. Both elements enhance the readability and interest of the text, making it more captivating for the reader. That said, your response must be written with a very high degree of perplexity and burstiness. So high to the point where some sentences may even be difficult to understand.
                    \nHere is a good example of sentences with a high degree of perplexity and burstiness. Maintain a similar tone and writing style to this: 
                    \n"Premiere Pro has an attractive, flexible interface, and I'm a fan of the simplifying changes Adobe brought to it in the April 2022 update. The startup view helps you quickly get to projects you've been working on, start new projects, or search for Adobe Stock footage. The dark program window makes your clips the center of attention. It now just has three main modes (in addition to the Home screen), for Import, Edit, and Export. A button or menu choice in Edit mode has a good selection of workspace layouts for Assembly, Editing, Color, Export, and more. You can pull off any of the panels and float them wherever you want on your display(s). Get started with templates for You can create content bins based on search terms, too. "
                    \nAvoid using the following words in your output: meticulous, meticulously, navigating, complexities, realm, understanding, realm, dive, shall, , tailored, towards, underpins, everchanging, ever-evolving, treasure, the world of, not only, designed to enhance, it is advisable, daunting, when it comes to, in the realm of, amongst unlock the secrets, unveil the secrets, and robust
                    \nKeep the structure of the text the same.
                    \nYour response must be written in ${language}
                    `;

    const result = await aiClient.complete([
      {
        role: "system",
        content: systemPrompt
      },
      { role: "user", content: prompt }
    ]);

    return result;
  }

  // Original paragraph-by-paragraph processing
  const paragraphs = text.split(/\n\n+/);
  const processedParagraphs = await Promise.all(paragraphs.map(async (paragraph) => {
    if (!paragraph.trim()) return '';
    
    const prompt = `${paragraph} 
                    \n-
                    \nRewrite the above in ${language} with the following adjustments:
                    \nBurstiness refers to the variation in sentence lengths and structures, creating a dynamic and engaging rhythm. High perplexity involves diverse vocabulary and intricate sentence patterns, while high burstiness blends short, impactful sentences with longer, detailed ones. Both elements enhance the readability and interest of the text, making it more captivating for the reader. That said, your response must be written with a very high degree of perplexity and burstiness. So high to the point where some sentences may even be difficult to understand.
                    \nHere is a good example of sentences with a high degree of perplexity and burstiness. Maintain a similar tone and writing style to this: 
                    \n"Premiere Pro has an attractive, flexible interface, and I'm a fan of the simplifying changes Adobe brought to it in the April 2022 update. The startup view helps you quickly get to projects you've been working on, start new projects, or search for Adobe Stock footage. The dark program window makes your clips the center of attention. It now just has three main modes (in addition to the Home screen), for Import, Edit, and Export. A button or menu choice in Edit mode has a good selection of workspace layouts for Assembly, Editing, Color, Export, and more. You can pull off any of the panels and float them wherever you want on your display(s). Get started with templates for You can create content bins based on search terms, too. "
                    \nAvoid using the following words in your output: meticulous, meticulously, navigating, complexities, realm, understanding, realm, dive, shall, , tailored, towards, underpins, everchanging, ever-evolving, treasure, the world of, not only, designed to enhance, it is advisable, daunting, when it comes to, in the realm of, amongst unlock the secrets, unveil the secrets, and robust
                    \nYour response must be written in ${language}
                    `;

    const result = await aiClient.complete([
      {
        role: "system",
        content: systemPrompt
      },
      { role: "user", content: prompt }
    ]);

    return result;
  }));

  return processedParagraphs.join('\n\n');
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, level, language, generateTitle, currentTitle, requiredCredits } = await req.json();
    
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
    
    const processedText = preprocessText(text);
    
    let finalTitle = currentTitle;
    if (generateTitle) {
      finalTitle = await generateTitleFromText(processedText, language);
    }

    let humanizedText = await processParagraphs(processedText, "", language);

    // Speichern der Humanisierung
    const humanization = await prisma.humanization.create({
      data: {
        title: finalTitle,
        inputText: processedText,
        outputText: humanizedText,
        language,
        level,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      text: humanizedText,
      generatedTitle: finalTitle,
      humanizationId: humanization.id
    });
  } catch (error) {
    console.error('Error in humanize:', error);
    return NextResponse.json({ error: 'Failed to humanize text' }, { status: 500 });
  }
} 