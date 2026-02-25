import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generation } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { outline, content, step } = await req.json();

    const updateData: {
      updatedAt: Date;
      outline?: unknown;
      content?: string | null;
      currentStep?: string;
    } = { updatedAt: new Date() };
    if (outline != null) updateData.outline = outline;
    if (content != null) updateData.content = content;
    if (step != null) updateData.currentStep = step;

    const [updated] = await db
      .update(generation)
      .set(updateData)
      .where(and(eq(generation.id, id), eq(generation.userId, session.user.id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating generation:", error);
    return NextResponse.json(
      { error: "Failed to update generation" },
      { status: 500 }
    );
  }
}
