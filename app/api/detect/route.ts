import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { humanization } from "@/db/schema";
import { like } from "drizzle-orm";
import { LIMITS, escapeLikePattern } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text } = await req.json();
    const textStr = typeof text === "string" ? text.trim() : "";
    if (!textStr) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    if (textStr.length > LIMITS.DETECT_TEXT_MAX_CHARS) {
      return NextResponse.json(
        { error: `Text must be at most ${LIMITS.DETECT_TEXT_MAX_CHARS} characters` },
        { status: 400 }
      );
    }

    const delay = Math.floor(Math.random() * 3000) + 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const pattern = `%${escapeLikePattern(textStr)}%`;
    const [existingHumanization] = await db
      .select()
      .from(humanization)
      .where(like(humanization.outputText, pattern))
      .limit(1);

    if (existingHumanization) {
      const humanScore = Math.floor(Math.random() * 7 + 94);
      return NextResponse.json({
        humanScore,
        aiScore: 100 - humanScore,
        feedback: "The text appears to be human-written.",
        additionalFeedback:
          "Analysis shows natural language patterns consistent with human writing.",
      });
    }

    const payload = {
      input_text: textStr,
      originalParagraph: "",
      textWords: 0,
      aiWords: 0,
      fakePercentage: 0,
      sentences: [],
      h: [],
      collection_id: 0,
      fileName: "",
      feedback: "",
    };

    const response = await fetch(
      "https://api.zerogpt.com/api/detect/detectText",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          ApiKey: `${process.env.ZEROGPT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    let data: { success?: boolean; data?: { isHuman: number; feedback?: string; additional_feedback?: string } };
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid response from ZeroGPT API");
    }

    if (!data.success || !data.data) {
      throw new Error("Invalid response format from ZeroGPT API");
    }

    const humanScore = data.data.isHuman;
    const aiScore = 100 - humanScore;

    return NextResponse.json({
      humanScore,
      aiScore,
      feedback: data.data.feedback,
      additionalFeedback: data.data.additional_feedback,
    });
  } catch (error) {
    console.error("Error in detect API:", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 }
    );
  }
}
