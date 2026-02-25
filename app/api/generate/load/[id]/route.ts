import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generation } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [gen] = await db
      .select()
      .from(generation)
      .where(
        and(eq(generation.id, id), eq(generation.userId, session.user.id))
      )
      .limit(1);

    if (!gen) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(gen);
  } catch (error) {
    console.error("Error loading generation:", error);
    return NextResponse.json(
      { error: "Failed to load generation" },
      { status: 500 }
    );
  }
}
