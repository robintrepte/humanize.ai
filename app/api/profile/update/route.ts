import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { LIMITS } from "@/lib/validation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9-_]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Ungültige Benutzersitzung" },
        { status: 401 }
      );
    }

    const { username, email, password } = await req.json();

    const usernameStr = typeof username === "string" ? username.trim() : "";
    const emailStr = typeof email === "string" ? email.trim().toLowerCase().slice(0, LIMITS.PROFILE_EMAIL_MAX_LENGTH) : "";
    if (usernameStr.length < 2 || usernameStr.length > LIMITS.USERNAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Benutzername muss zwischen 2 und ${LIMITS.USERNAME_MAX_LENGTH} Zeichen haben.` },
        { status: 400 }
      );
    }
    if (!USERNAME_REGEX.test(usernameStr)) {
      return NextResponse.json(
        {
          error:
            "Benutzername darf keine Leerzeichen oder ungültige Symbole enthalten.",
        },
        { status: 400 }
      );
    }
    if (!emailStr || !EMAIL_REGEX.test(emailStr)) {
      return NextResponse.json(
        { error: "Bitte eine gültige E-Mail-Adresse angeben." },
        { status: 400 }
      );
    }
    if (typeof password === "string" && password.length > 0 && password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen haben.` },
        { status: 400 }
      );
    }

    const [existingUser] = await db
      .select()
      .from(user)
      .where(
        and(
          sql`lower(${user.username}) = lower(${usernameStr})`,
          ne(user.id, session.user.id)
        )
      )
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "Dieser Benutzername wird bereits verwendet" },
        { status: 400 }
      );
    }

    const updateData: {
      username: string;
      email: string;
      password?: string;
    } = { username: usernameStr, email: emailStr };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updated] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, session.user.id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Profil nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profil erfolgreich aktualisiert",
      user: {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        email: updated.email,
        image: updated.image,
        role: updated.role,
        public: updated.public,
        credits: updated.credits,
        subscriptionStatus: updated.subscriptionStatus,
        currentPeriodEnd: updated.currentPeriodEnd,
        planId: updated.planId,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
