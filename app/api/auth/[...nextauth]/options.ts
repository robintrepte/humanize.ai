import { SessionStrategy, Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth"
import prisma from '@/lib/prisma';

interface ExtendedUser {
  id: number;
  email: string | null;
  username: string | null;
  image: string | null;
  role: string;
  credits: number;
}

interface UserWithPassword extends ExtendedUser {
  password: string | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: "send.one.com",
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: true,
      },
      from: process.env.EMAIL,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "E-Mail oder Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" }
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        // Suche nach dem Benutzer mit E-Mail oder Benutzername
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          }
        });

        // Wenn kein Benutzer gefunden wurde oder kein Passwort gesetzt ist
        if (!user || !user.password) {
          throw new Error("No user found");
        }

        // Überprüfe das Passwort
        const passwordValid = await bcrypt.compare(credentials.password, user.password);

        if (!passwordValid) {
          throw new Error("CredentialsSignin");
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image,
          role: user.role,
          credits: user.credits
        };
      }
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      async profile(profile) {
        // Generiere einen gültigen Benutzernamen
        const username = profile.username.replace(/\s+/g, '').replace(/[^a-zA-Z0-9-_]/g, ''); // Entferne Leerzeichen und ungültige Zeichen
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          username, // Füge den bereinigten Benutzernamen hinzu
          role: "user",
          credits: 250 // Add default credits
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Generiere einen gültigen Benutzernamen
        const username = profile.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9-_]/g, ''); // Entferne Leerzeichen und ungültige Zeichen
        return {
          id: profile.sub, // Verwende 'sub' als ID
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username, // Füge den bereinigten Benutzernamen hinzu
          role: "user",
          credits: 250 // Add default credits
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = parseInt(token.sub as string);
        const currentUser = await prisma.user.findUnique({
          where: { id: session.user.id },
        });
        if (currentUser) {
          session.user.username = currentUser.username || null;
          session.user.email = currentUser.email || null;
          session.user.image = currentUser.image || undefined;
          session.user.role = currentUser.role || "user";
          session.user.credits = currentUser.credits || 0;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id.toString(); // Konvertiere user.id zu string
      }
      return token;
    },
  },
};
