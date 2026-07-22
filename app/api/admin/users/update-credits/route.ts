import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toPublicUser } from "@/lib/safe-user";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = Number(body.userId);
    const credits = Number(body.credits);

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
    if (!Number.isInteger(credits) || credits < 0 || credits > 10_000_000) {
      return NextResponse.json({ error: "Invalid credits" }, { status: 400 });
    }

    const [updated] = await db
      .update(user)
      .set({ credits })
      .where(eq(user.id, userId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Credits updated successfully",
      user: toPublicUser(updated),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating credits" },
      { status: 500 }
    );
  }
}
