import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Ungültige Benutzersitzung' }, { status: 401 });
    }

    const { username, email, password } = await req.json();

    // Validierung des Benutzernamens
    const usernameRegex = /^[a-zA-Z0-9-_]+$/; // Erlaubt nur Buchstaben, Zahlen, Bindestriche und Unterstriche
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ error: 'Benutzername darf keine Leerzeichen oder ungültige Symbole enthalten.' }, { status: 400 });
    }

    // Überprüfen Sie, ob der Benutzername bereits von einem anderen Benutzer verwendet wird
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { username: { equals: username, mode: 'insensitive' } },
          { NOT: { id: session.user.id } }
        ]
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Dieser Benutzername wird bereits verwendet' }, { status: 400 });
    }

    const updateData: any = { username, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ message: 'Profil erfolgreich aktualisiert', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
