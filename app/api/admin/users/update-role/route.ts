import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toPublicUser } from "@/lib/safe-user";

const ALLOWED_ROLES = new Set(["user", "admin"]);

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = Number(body.userId);
    const role = typeof body.role === "string" ? body.role : "";

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
    if (!ALLOWED_ROLES.has(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const [updated] = await db
      .update(user)
      .set({ role })
      .where(eq(user.id, userId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Role updated successfully",
      user: toPublicUser(updated),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating role" },
      { status: 500 }
    );
  }
}
