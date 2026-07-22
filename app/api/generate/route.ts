import { NextResponse } from "next/server";
import { AIClient } from "@/lib/ai-client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LIMITS } from "@/lib/validation";
import { GENERATE_CREDITS, deductCreditsAtomic } from "@/lib/credits";
import {
  checkAiRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as "openai" | "anthropic",
  model: process.env.AI_MODEL || "gpt-5-nano",
  temperature: 0.7,
  maxTokens: 2048,
});

export async function POST(req: Request) {
  try {
    if (!checkAiRateLimit(req)) {
      return rateLimitExceededResponse();
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, contentType, tone } = await req.json();

    const promptStr = typeof prompt === "string" ? prompt : "";
    if (!promptStr.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (promptStr.length > LIMITS.GENERATE_PROMPT_MAX_CHARS) {
      return NextResponse.json(
        { error: `Prompt must be at most ${LIMITS.GENERATE_PROMPT_MAX_CHARS} characters` },
        { status: 400 }
      );
    }

    const [balance] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!balance || balance.credits < GENERATE_CREDITS) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    const contentTypeStr =
      typeof contentType === "string" ? contentType.slice(0, 100) : "content";
    const toneStr =
      typeof tone === "string" ? tone.slice(0, 50) : "professional";
    const systemPrompt = `You are a professional content writer. Generate ${contentTypeStr} content with a ${toneStr} tone. 
    The content should be well-structured, engaging, and optimized for the specific content type.
    Ensure the output is natural and human-like.`;

    const result = await aiClient.complete([
      { role: "system", content: systemPrompt },
      { role: "user", content: promptStr },
    ]);

    const remaining = await deductCreditsAtomic(
      session.user.id,
      GENERATE_CREDITS
    );
    if (remaining == null) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    return NextResponse.json({
      text: result,
      creditsUsed: GENERATE_CREDITS,
      creditsRemaining: remaining,
    });
  } catch (error) {
    console.error("Error in generate:", error);
    return NextResponse.json(
      { error: "Failed to generate text. Please try again." },
      { status: 500 }
    );
  }
}
