import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9-_]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email and password are required." },
        { status: 400 }
      );
    }

    if (username.length < 2) {
      return NextResponse.json(
        { error: "Username must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        { error: "Username may only contain letters, numbers, hyphens and underscores." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const [existingByUsername] = await db
      .select({ id: user.id })
      .from(user)
      .where(sql`lower(${user.username}) = lower(${username})`)
      .limit(1);

    if (existingByUsername) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 400 }
      );
    }

    const [existingByEmail] = await db
      .select({ id: user.id })
      .from(user)
      .where(sql`lower(${user.email}) = lower(${email})`)
      .limit(1);

    if (existingByEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [created] = await db
      .insert(user)
      .values({
        username,
        email,
        password: hashedPassword,
        credits: 250,
      })
      .returning();

    if (!created) {
      return NextResponse.json(
        { error: "Interner Serverfehler" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Registration successful.",
      user: { id: created.id, username: created.username, email: created.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
