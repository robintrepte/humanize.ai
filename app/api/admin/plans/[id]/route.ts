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

    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (typeof body.name === "string" && body.name.trim()) {
      updateData.name = body.name.trim().slice(0, 100);
    }
    if (typeof body.description === "string") {
      updateData.description = body.description.slice(0, 1000);
    }
    if (typeof body.price === "number" && Number.isFinite(body.price) && body.price >= 0) {
      updateData.price = body.price;
    }
    if (typeof body.credits === "number" && Number.isInteger(body.credits) && body.credits >= 0) {
      updateData.credits = body.credits;
    }
    if (Array.isArray(body.features)) {
      updateData.features = body.features
        .filter((f: unknown): f is string => typeof f === "string")
        .slice(0, 50)
        .map((f: string) => f.slice(0, 200));
    }
    if (typeof body.isPopular === "boolean") {
      updateData.isPopular = body.isPopular;
    }
    if (typeof body.isActive === "boolean") {
      updateData.isActive = body.isActive;
    }

    const [updated] = await db
      .update(plan)
      .set(updateData)
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
