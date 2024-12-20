import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Break very long paragraphs
  text = text.replace(/([.!?])\s+/g, '$1\n\n');
  
  // Remove any formatting artifacts
  text = text.replace(/[""]/g, '"')
             .replace(/['']/g, "'");
             
  return text;
};

// Add randomization function
const randomizeOutput = (text: string) => {
  const fillers = ['well', 'you know', 'I mean', 'actually', 'basically'];
  if (Math.random() > 0.7) {
    text = fillers[Math.floor(Math.random() * fillers.length)] + ', ' + text;
  }
  
  if (Math.random() > 0.8) {
    text = text.replace(/\. /, '. Interesting point. ');
  }
  
  return text;
};

// Add title generation function with limited context
async function generateTitleFromText(text: string) {
  // Get first 60 words for context
  const contextText = text.split(/\s+/).slice(0, 60).join(' ');
  
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a title generator. Generate a short, engaging title (maximum 6 words) for the given text. The title should be descriptive and capture the main topic. Only respond with the title, nothing else. If you find that the text already has a title, return that title."
      },
      { 
        role: "user", 
        content: contextText 
      }
    ],
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 30,
  });

  return completion.choices[0].message.content || '';
}

export async function POST(req: Request) {
  try {
    const { text, level, language, generateTitle, currentTitle } = await req.json();
    
    // Preprocess the input text
    const processedText = preprocessText(text);

    // Generate title if needed
    let finalTitle = currentTitle;
    if (generateTitle) {
      finalTitle = await generateTitleFromText(processedText);
    }

    const systemPrompt = `You are a skilled writer who excels at creating natural, human-like text. Your writing should:
- Use organic, conversational language
- Vary sentence structure and complexity
- Include natural language patterns and transitions
- Add occasional imperfections and fragments
- Use contractions and informal phrases when appropriate
- Avoid overly formal or rigid constructions
- Include personal anecdotes or examples when relevant
- Vary paragraph lengths naturally
- Use colloquial expressions occasionally
- Maintain topic coherence while varying expression

Writing style: ${levelPrompts[level as keyof typeof levelPrompts]}`;

    const prompt = `Make this text more human-like and natural. Maintain the same meaning but make it less detectable by AI detection tools. Translate the response to ${language}. Here's the text (only output the result, no other text):\n\n${processedText}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini",
      temperature: 0.85,
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
      max_tokens: 2000,
    });

    let humanizedText = completion.choices[0].message.content || '';
    
    // Apply randomization to the output
    humanizedText = randomizeOutput(humanizedText);

    return NextResponse.json({ 
      text: humanizedText,
      generatedTitle: finalTitle 
    });
  } catch (error) {
    console.error('Error in humanize:', error);
    return NextResponse.json({ error: 'Failed to humanize text' }, { status: 500 });
  }
} 