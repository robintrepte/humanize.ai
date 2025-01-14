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
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          }
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

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
          credits: user.credits,
          subscriptionStatus: user.subscriptionStatus,
          currentPeriodEnd: user.currentPeriodEnd?.toISOString() || null
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        const username = profile.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9-_]/g, '');
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username,
          role: "user",
          credits: 250,
          subscriptionStatus: null,
          currentPeriodEnd: null
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
          session.user.subscriptionStatus = currentUser.subscriptionStatus || null;
          session.user.currentPeriodEnd = currentUser.currentPeriodEnd?.toISOString() || null;
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
