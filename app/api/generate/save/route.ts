import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generation } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { settings, step } = await req.json();

    const [gen] = await db
      .insert(generation)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        settings,
        currentStep: step ?? "settings",
        status: "in_progress",
      })
      .returning();

    if (!gen) {
      return NextResponse.json(
        { error: "Failed to save generation" },
        { status: 500 }
      );
    }
    return NextResponse.json({ generationId: gen.id });
  } catch (error) {
    console.error("Error saving generation:", error);
    return NextResponse.json(
      { error: "Failed to save generation" },
      { status: 500 }
    );
  }
}
