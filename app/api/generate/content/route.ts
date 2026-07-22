import { NextResponse } from "next/server";
import { AIClient } from "@/lib/ai-client";
import { marked } from "marked";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { LIMITS } from "@/lib/validation";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  CONTENT_SECTION_CREDITS,
  deductCreditsAtomic,
} from "@/lib/credits";
import {
  checkAiRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as "openai" | "anthropic",
  model: process.env.AI_MODEL || "gpt-5-nano",
  temperature: 0.7,
  maxTokens: 1000,
});

marked.setOptions({
  breaks: true,
  gfm: true,
});

type OutlineNode = {
  id?: string;
  title?: string;
  depth?: number;
  subItems?: OutlineNode[];
};

type ContentSettings = {
  contentType?: string;
  tone?: string;
  writingLevel?: string;
  targetLength?: number | string;
  keywords?: unknown;
};

function findSection(
  items: OutlineNode[],
  sectionId: string
): [OutlineNode | null, OutlineNode | null] {
  for (const item of items) {
    if (item.id === sectionId) {
      return [item, null];
    }
    if (item.subItems) {
      const [found, parent] = findSection(item.subItems, sectionId);
      if (found) {
        return [found, parent || item];
      }
    }
  }
  return [null, null];
}

export async function POST(req: Request) {
  try {
    if (!checkAiRateLimit(req)) {
      return rateLimitExceededResponse();
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const settings = (body?.settings ?? {}) as ContentSettings;
    const outline = body?.outline;
    const sectionId = body?.sectionId;

    if (!Array.isArray(outline) || typeof sectionId !== "string" || !sectionId) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const [currentSection, parentSection] = findSection(outline as OutlineNode[], sectionId);
    if (!currentSection?.title) {
      return NextResponse.json({ error: "Section not found" }, { status: 400 });
    }

    const [balance] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    if (!balance || balance.credits < CONTENT_SECTION_CREDITS) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    const contentType =
      typeof settings.contentType === "string"
        ? settings.contentType.slice(0, 100)
        : "content";
    const tone =
      typeof settings.tone === "string" ? settings.tone.slice(0, 50) : "professional";
    const writingLevel =
      typeof settings.writingLevel === "string"
        ? settings.writingLevel.slice(0, 50)
        : "intermediate";
    const targetLength = String(settings.targetLength ?? 500).slice(0, 20);
    const keywords = Array.isArray(settings.keywords)
      ? settings.keywords
          .filter((k): k is string => typeof k === "string")
          .slice(0, 20)
          .map((k) => k.slice(0, 50))
      : [];

    const title = String(currentSection.title).slice(0, 200);
    const parentTitle = parentSection?.title
      ? String(parentSection.title).slice(0, 200)
      : null;
    const depth = Number(currentSection.depth) || 1;

    const contextPrompt = `Generate ${contentType} content for a section titled "${title}"${
      parentTitle ? ` under the parent section "${parentTitle}"` : ""
    } at depth level ${depth}.

    Consider the following context:
    - This is a ${depth === 1 ? "main section" : "subsection"}
    - ${parentTitle ? `It should relate to and expand upon "${parentTitle}"` : "This is a top-level section"}
    - The content should be unique and specific to this section
    - Write in a ${tone} tone
    - Use ${writingLevel} level language
    - Target length: ${targetLength} words
    - Include these keywords naturally: ${keywords.join(", ") || "none"}

    Generate detailed, unique content that:
    1. Is specific to this section's topic
    2. Maintains appropriate depth and detail
    3. Flows naturally with the previous content
    4. Does not repeat information from other sections`;

    const content = await aiClient.complete([
      {
        role: "system",
        content:
          "You are a professional content writer. Write your response in markdown format.",
      },
      { role: "user", content: contextPrompt },
    ]);

    if (!content || typeof content !== "string") {
      console.error("Invalid AI response:", content);
      throw new Error("Invalid response from AI provider");
    }

    if (content.length > LIMITS.HUMANIZE_TEXT_MAX_CHARS) {
      return NextResponse.json(
        { error: "Generated content exceeded size limit" },
        { status: 500 }
      );
    }

    const remaining = await deductCreditsAtomic(
      session.user.id,
      CONTENT_SECTION_CREDITS
    );
    if (remaining == null) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    const htmlContent = sanitizeHtml(await marked.parse(content));

    return NextResponse.json({
      content: htmlContent,
      creditsUsed: CONTENT_SECTION_CREDITS,
      creditsRemaining: remaining,
    });
  } catch (error) {
    console.error("Error in content generation:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
