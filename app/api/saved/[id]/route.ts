import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { humanization } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const humanizationId = parseInt(id, 10);
    if (Number.isNaN(humanizationId)) {
      return NextResponse.json(
        { error: "Invalid humanization id" },
        { status: 400 }
      );
    }

    const [h] = await db
      .select()
      .from(humanization)
      .where(
        and(
          eq(humanization.id, humanizationId),
          eq(humanization.userId, session.user.id)
        )
      )
      .limit(1);

    if (!h) {
      return NextResponse.json(
        { error: "Humanization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ humanization: h });
  } catch (error) {
    console.error("Error fetching humanization:", error);
    return NextResponse.json(
      { error: "Failed to fetch humanization" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const humanizationId = parseInt(id, 10);
    if (Number.isNaN(humanizationId)) {
      return NextResponse.json(
        { error: "Invalid humanization id" },
        { status: 400 }
      );
    }

    const [h] = await db
      .select()
      .from(humanization)
      .where(
        and(
          eq(humanization.id, humanizationId),
          eq(humanization.userId, session.user.id)
        )
      )
      .limit(1);

    if (!h) {
      return NextResponse.json(
        { error: "Humanization not found" },
        { status: 404 }
      );
    }

    await db
      .delete(humanization)
      .where(eq(humanization.id, humanizationId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting humanization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
