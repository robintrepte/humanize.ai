import { NextResponse } from "next/server";
import { AIClient } from "@/lib/ai-client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LIMITS } from "@/lib/validation";

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as "openai" | "anthropic",
  model: process.env.AI_MODEL || "gpt-5-nano",
  temperature: 0.7,
  maxTokens: 2048,
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, contentType, tone, requiredCredits } = await req.json();

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
    const requiredCreditsNum = Number(requiredCredits);
    if (!Number.isInteger(requiredCreditsNum) || requiredCreditsNum < 1 || requiredCreditsNum > 10000) {
      return NextResponse.json({ error: "Invalid requiredCredits" }, { status: 400 });
    }

    const [u] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!u || u.credits < requiredCreditsNum) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    const contentTypeStr = typeof contentType === "string" ? contentType.slice(0, 100) : "content";
    const toneStr = typeof tone === "string" ? tone.slice(0, 50) : "professional";
    const systemPrompt = `You are a professional content writer. Generate ${contentTypeStr} content with a ${toneStr} tone. 
    The content should be well-structured, engaging, and optimized for the specific content type.
    Ensure the output is natural and human-like.`;

    const result = await aiClient.complete([
      { role: "system", content: systemPrompt },
      { role: "user", content: promptStr },
    ]);

    await db
      .update(user)
      .set({ credits: u.credits - requiredCreditsNum })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error("Error in generate:", error);
    return NextResponse.json(
      { error: "Failed to generate text. Please try again." },
      { status: 500 }
    );
  }
}
