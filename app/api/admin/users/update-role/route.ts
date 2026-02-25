import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = await req.json();

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
      user: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating role" },
      { status: 500 }
    );
  }
}
