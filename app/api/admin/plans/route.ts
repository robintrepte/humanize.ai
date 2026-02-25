import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { plan } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await db.select().from(plan).orderBy(asc(plan.price));

    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const [created] = await db
      .insert(plan)
      .values({
        name: data.name,
        price: data.price,
        credits: data.credits,
        description: data.description,
        features: data.features ?? [],
        isPopular: data.isPopular ?? false,
        isActive: data.isActive ?? true,
        updatedAt: new Date(),
      })
      .returning();

    if (!created) {
      return NextResponse.json(
        { error: "Failed to create plan" },
        { status: 500 }
      );
    }
    return NextResponse.json({ plan: created });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}
