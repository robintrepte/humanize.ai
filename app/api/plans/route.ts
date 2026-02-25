import { NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { plan } from "@/db/schema";

export async function GET() {
  try {
    const plans = await db
      .select()
      .from(plan)
      .where(eq(plan.isActive, true))
      .orderBy(asc(plan.price));

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
