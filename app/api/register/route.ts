import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    // Überprüfen Sie, ob der Benutzername bereits existiert (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Benutzername wird bereits verwendet' }, { status: 400 });
    }

    // Validierung des Benutzernamens
    const usernameRegex = /^[a-zA-Z0-9-_]+$/; // Erlaubt nur Buchstaben, Zahlen, Bindestriche und Unterstriche
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ error: 'Benutzername darf keine Leerzeichen oder ungültige Symbole enthalten.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        credits: 250,
      },
    });

    return NextResponse.json({ message: 'Benutzer erfolgreich registriert', user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Fehler bei der Benutzerregistrierung:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
