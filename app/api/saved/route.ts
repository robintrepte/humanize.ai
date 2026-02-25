import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { humanization } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const humanizations = await db
      .select()
      .from(humanization)
      .where(eq(humanization.userId, session.user.id))
      .orderBy(desc(humanization.createdAt));

    return NextResponse.json({ humanizations });
  } catch (error) {
    console.error("Error fetching humanizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch humanizations" },
      { status: 500 }
    );
  }
}
