import { NextResponse } from "next/server";
import { AIClient } from "@/lib/ai-client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { user, humanization } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LIMITS, isHumanizeLevel } from "@/lib/validation";
import {
  calculateHumanizeCredits,
  deductCreditsAtomic,
} from "@/lib/credits";
import {
  checkAiRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";

const aiClient = new AIClient({
  provider: process.env.AI_PROVIDER as "openai" | "anthropic",
  model: process.env.AI_MODEL || "gpt-5-nano",
  temperature: 1,
  maxTokens: 2048,
});

const levelPrompts = {
  basic: "Write in a simple, conversational style with short sentences and common words. Use contractions and informal language. Include occasional fragments and natural speech patterns.",
  intermediate: "Balance formal and informal language. Mix short and medium-length sentences. Include some field-specific terminology when appropriate, while maintaining a natural flow.",
  advanced: "Use sophisticated language and complex sentence structures, but maintain natural flow. Include field-specific terminology and nuanced expressions, while avoiding overly rigid academic constructions.",
};

const preprocessText = (text: string) => {
  text = text
    .replace(/[*_~`#]+/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^\s*[-+*]\s/gm, "")
    .replace(/^-{3,}|_{3,}|\*{3,}$/gm, "");
  text = text.replace(/<[^>]*>/g, "");
  text = text
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  text = text.replace(/[""]/g, '"').replace(/['']/g, "'");
  return text;
};

async function generateTitleFromText(text: string, language: string) {
  const contextText = text.split(/\s+/).slice(0, 60).join(" ");
  const result = await aiClient.complete([
    {
      role: "system",
      content: `You are a title generator. Generate a short, engaging title (maximum 6 words) for the given text in ${language}. The title should be descriptive and capture the main topic. Only respond with the title, nothing else. If you find that the text already has a title, return that title.`,
    },
    { role: "user", content: contextText },
  ]);
  return result;
}

const processParagraphs = async (
  text: string,
  systemPrompt: string,
  language: string
) => {
  const processAsSingleText = process.env.SINGLE_PARAGRAPH === "true";

  if (processAsSingleText) {
    const prompt = `${text} 
                    \n-
                    \nRewrite the above in ${language} with the following adjustments:
                    \nBurstiness refers to the variation in sentence lengths and structures, creating a dynamic and engaging rhythm. High perplexity involves diverse vocabulary and intricate sentence patterns, while high burstiness blends short, impactful sentences with longer, detailed ones. Both elements enhance the readability and interest of the text, making it more captivating for the reader. That said, your response must be written with a very high degree of perplexity and burstiness. So high to the point where some sentences may even be difficult to understand.
                    \nHere is a good example of sentences with a high degree of perplexity and burstiness. Maintain a similar tone and writing style to this: 
                    \n"Premiere Pro has an attractive, flexible interface, and I'm a fan of the simplifying changes Adobe brought to it in the April 2022 update. The startup view helps you quickly get to projects you've been working on, start new projects, or search for Adobe Stock footage. The dark program window makes your clips the center of attention. It now just has three main modes (in addition to the Home screen), for Import, Edit, and Export. A button or menu choice in Edit mode has a good selection of workspace layouts for Assembly, Editing, Color, Export, and more. You can pull off any of the panels and float them wherever you want on your display(s). Get started with templates for You can create content bins based on search terms, too. "
                    \nThe text should be factual and informative and should not contain any unusual words.
                    \nAvoid using the following words in your output: meticulous, meticulously, navigating, complexities, realm, understanding, realm, dive, shall, , tailored, towards, underpins, everchanging, ever-evolving, treasure, the world of, not only, designed to enhance, it is advisable, daunting, when it comes to, in the realm of, amongst unlock the secrets, unveil the secrets, and robust
                    \nKeep the structure of the text the same.
                    \nYour response must be written in ${language}
                    `;
    const result = await aiClient.complete([
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ]);
    return result;
  }

  const paragraphs = text.split(/\n\n+/);
  const processedParagraphs = await Promise.all(
    paragraphs.map(async (paragraph) => {
      if (!paragraph.trim()) return "";
      const prompt = `${paragraph} 
                    \n-
                    \nRewrite the above in ${language} with the following adjustments:
                    \nBurstiness refers to the variation in sentence lengths and structures, creating a dynamic and engaging rhythm. High perplexity involves diverse vocabulary and intricate sentence patterns, while high burstiness blends short, impactful sentences with longer, detailed ones. Both elements enhance the readability and interest of the text, making it more captivating for the reader. That said, your response must be written with a very high degree of perplexity and burstiness. So high to the point where some sentences may even be difficult to understand.
                    \nHere is a good example of sentences with a high degree of perplexity and burstiness. Maintain a similar tone and writing style to this: 
                    \n"Premiere Pro has an attractive, flexible interface, and I'm a fan of the simplifying changes Adobe brought to it in the April 2022 update. The startup view helps you quickly get to projects you've been working on, start new projects, or search for Adobe Stock footage. The dark program window makes your clips the center of attention. It now just has three main modes (in addition to the Home screen), for Import, Edit, and Export. A button or menu choice in Edit mode has a good selection of workspace layouts for Assembly, Editing, Color, Export, and more. You can pull off any of the panels and float them wherever you want on your display(s). Get started with templates for You can create content bins based on search terms, too. "
                    \nThe text should be factual and informative and should not contain any unusual words.
                    \nAvoid using the following words in your output: meticulous, meticulously, navigating, complexities, realm, understanding, realm, dive, shall, , tailored, towards, underpins, everchanging, ever-evolving, treasure, the world of, not only, designed to enhance, it is advisable, daunting, when it comes to, in the realm of, amongst unlock the secrets, unveil the secrets, and robust
                    \nYour response must be written in ${language}
                    `;
      const result = await aiClient.complete([
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ]);
      return result;
    })
  );
  return processedParagraphs.join("\n\n");
};

export async function POST(req: Request) {
  try {
    if (!checkAiRateLimit(req)) {
      return rateLimitExceededResponse();
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      text,
      level,
      language,
      generateTitle,
      currentTitle,
      isRetry,
    } = await req.json();

    const textStr = typeof text === "string" ? text : "";
    if (!textStr.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    if (textStr.length > LIMITS.HUMANIZE_TEXT_MAX_CHARS) {
      return NextResponse.json(
        { error: `Text must be at most ${LIMITS.HUMANIZE_TEXT_MAX_CHARS} characters` },
        { status: 400 }
      );
    }
    if (!isHumanizeLevel(level)) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
    }
    const langStr = typeof language === "string" ? language.trim().slice(0, 20) : "en";

    // Cost is always computed server-side. One free retry is allowed after a paid run.
    const requiredCreditsNum = Boolean(isRetry)
      ? 0
      : calculateHumanizeCredits(textStr.length);

    // Pre-check balance before spending on AI (final charge is still atomic below).
    if (requiredCreditsNum > 0) {
      const [balance] = await db
        .select({ credits: user.credits })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);
      if (!balance || balance.credits < requiredCreditsNum) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 402 }
        );
      }
    }

    const processedText = preprocessText(textStr);

    let finalTitle = typeof currentTitle === "string" ? currentTitle.slice(0, 200) : "";
    if (Boolean(generateTitle)) {
      finalTitle = await generateTitleFromText(processedText, langStr);
    }

    const humanizedText = await processParagraphs(
      processedText,
      "",
      langStr
    );

    const remaining = await deductCreditsAtomic(
      session.user.id,
      requiredCreditsNum
    );
    if (remaining == null) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    const [created] = await db
      .insert(humanization)
      .values({
        title: finalTitle,
        inputText: processedText,
        outputText: humanizedText,
        language: langStr,
        level,
        userId: session.user.id,
      })
      .returning();

    if (!created) {
      return NextResponse.json(
        { error: "Failed to save humanization" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: humanizedText,
      generatedTitle: finalTitle,
      humanizationId: created.id,
      creditsUsed: requiredCreditsNum,
      creditsRemaining: remaining,
    });
  } catch (error) {
    console.error("Error in humanize:", error);
    return NextResponse.json(
      { error: "Failed to humanize text. Please try again." },
      { status: 500 }
    );
  }
}
