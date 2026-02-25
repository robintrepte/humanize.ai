import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { AIClient } from "@/lib/ai-client";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as "openai" | "anthropic",
  model: process.env.AI_MODEL || "gpt-5-nano",
  temperature: 0.7,
  maxTokens: 2048,
});

const CREDITS_FOR_OUTLINE = 5;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
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

    const [u] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!u || u.credits < CREDITS_FOR_OUTLINE) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    const prompt = `Create a detailed outline for a ${settings.contentType} about ${settings.prompt}.
                   The content should be in ${settings.language} language with a ${settings.tone} tone.
                   Target length is ${settings.targetLength} words.
                   Keywords to include: ${settings.keywords.join(", ")}
                   
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

    await db
      .update(user)
      .set({ credits: u.credits - CREDITS_FOR_OUTLINE })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({
      outline,
      creditsUsed: CREDITS_FOR_OUTLINE,
      creditsRemaining: u.credits - CREDITS_FOR_OUTLINE,
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
