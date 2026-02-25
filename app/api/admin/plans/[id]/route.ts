import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { plan } from "@/db/schema";
import { eq } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const planId = parseInt(id, 10);
    if (Number.isNaN(planId)) {
      return NextResponse.json({ error: "Invalid plan id" }, { status: 400 });
    }

    const updateData = await request.json();
    const [updated] = await db
      .update(plan)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(plan.id, planId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Plan updated successfully",
      plan: updated,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const planId = parseInt(id, 10);
    if (Number.isNaN(planId)) {
      return NextResponse.json({ error: "Invalid plan id" }, { status: 400 });
    }

    await db.delete(plan).where(eq(plan.id, planId));

    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}
