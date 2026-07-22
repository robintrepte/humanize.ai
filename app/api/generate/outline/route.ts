import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { AIClient } from "@/lib/ai-client";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OUTLINE_CREDITS, deductCreditsAtomic } from "@/lib/credits";
import {
  checkAiRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";
import { LIMITS } from "@/lib/validation";

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

    const { settings } = await req.json();

    if (
      !settings?.contentType ||
      !settings?.prompt ||
      !settings?.language ||
      !settings?.tone ||
      !settings?.targetLength ||
      !settings?.keywords
    ) {
      return NextResponse.json(
        { error: "Missing required settings" },
        { status: 400 }
      );
    }

    const promptStr = String(settings.prompt);
    if (promptStr.length > LIMITS.GENERATE_PROMPT_MAX_CHARS) {
      return NextResponse.json(
        {
          error: `Prompt must be at most ${LIMITS.GENERATE_PROMPT_MAX_CHARS} characters`,
        },
        { status: 400 }
      );
    }

    const [u] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!u || u.credits < OUTLINE_CREDITS) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    const contentType = String(settings.contentType).slice(0, 100);
    const language = String(settings.language).slice(0, 20);
    const tone = String(settings.tone).slice(0, 50);
    const targetLength = String(settings.targetLength).slice(0, 20);
    const keywords = Array.isArray(settings.keywords)
      ? settings.keywords
          .filter((k: unknown): k is string => typeof k === "string")
          .slice(0, 20)
          .map((k: string) => k.slice(0, 50))
      : [];

    const prompt = `Create a detailed outline for a ${contentType} about ${promptStr.slice(0, LIMITS.GENERATE_PROMPT_MAX_CHARS)}.
                   The content should be in ${language} language with a ${tone} tone.
                   Target length is ${targetLength} words.
                   Keywords to include: ${keywords.join(", ")}
                   
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
                   
                   Ensure the response is valid JSON with no trailing commas. Do not include any explanatory text or markdown.`;

    const result = await aiClient.complete([
      {
        role: "system",
        content: "You are a professional content outline generator.",
      },
      { role: "user", content: prompt },
    ]);

    let outline: unknown;
    try {
      const cleanResult = result
        .replace(/```json\n?|\n?```/g, "")
        .replace(/^\s+|\s+$/g, "")
        .replace(/\n\s*\n/g, "\n")
        .replace(/,(\s*[}\]])/g, "$1");

      const jsonMatch = cleanResult.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON array found in response");
      }

      outline = JSON.parse(jsonMatch[0]);

      if (
        !Array.isArray(outline) ||
        !outline.every(
          (section: unknown) =>
            typeof section === "object" &&
            section !== null &&
            typeof (section as { title?: string }).title === "string" &&
            Array.isArray((section as { points?: unknown[] }).points)
        )
      ) {
        throw new Error("Invalid outline structure");
      }
    } catch (error) {
      console.error("JSON parsing error:", error);
      return NextResponse.json(
        { error: "Failed to generate valid outline format" },
        { status: 500 }
      );
    }

    const remaining = await deductCreditsAtomic(
      session.user.id,
      OUTLINE_CREDITS
    );
    if (remaining == null) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    return NextResponse.json({
      outline,
      creditsUsed: OUTLINE_CREDITS,
      creditsRemaining: remaining,
    });
  } catch (error) {
    console.error("Outline generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate outline",
      },
      { status: 500 }
    );
  }
}
