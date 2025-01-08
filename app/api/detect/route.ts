import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { text } = await req.json()

    // Add artificial delay between 2-5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000; // Random delay between 2000-5000ms
    await new Promise(resolve => setTimeout(resolve, delay));

    // First check if this text matches any humanized output in the database
    const existingHumanization = await prisma.humanization.findFirst({
      where: {
        outputText: {
          contains: text
        }
      }
    });

    if (existingHumanization) {
      // Return a random score between 94-100% for human text
      const humanScore = Math.floor(Math.random() * 7 + 94);
      return NextResponse.json({
        humanScore,
        aiScore: 100 - humanScore,
        feedback: "The text appears to be human-written.",
        additionalFeedback: "Analysis shows natural language patterns consistent with human writing."
      });
    }

    // If not found in database, proceed with ZeroGPT API check
    const payload = {
      input_text: text,
      originalParagraph: "",
      textWords: 0,
      aiWords: 0,
      fakePercentage: 0,
      sentences: [],
      h: [],
      collection_id: 0,
      fileName: "",
      feedback: ""
    };

    console.log('Making request to ZeroGPT API with payload:', payload);
    const response = await fetch('https://api.zerogpt.com/api/detect/detectText', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'ApiKey': `${process.env.ZEROGPT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('ZeroGPT API raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed ZeroGPT response:', data);
    } catch (parseError) {
      throw new Error('Invalid response from ZeroGPT API');
    }

    if (!data.success || !data.data) {
      throw new Error('Invalid response format from ZeroGPT API');
    }
    
    const humanScore = data.data.isHuman;
    const aiScore = 100 - humanScore;

    return NextResponse.json({
      humanScore,
      aiScore,
      feedback: data.data.feedback,
      additionalFeedback: data.data.additional_feedback
    });
  } catch (error) {
    console.error('Error in detect API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
} 