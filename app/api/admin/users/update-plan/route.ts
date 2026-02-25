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

    const { userId, planId } = await req.json();

    const [updated] = await db
      .update(user)
      .set({
        planId: planId ?? null,
        subscriptionStatus: planId ? "active" : null,
        currentPeriodEnd: planId
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null,
      })
      .where(eq(user.id, userId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Plan updated successfully",
      user: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating plan" },
      { status: 500 }
    );
  }
}
