import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { Adapter } from "next-auth/adapters";
import Email from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { user, account, session, verificationToken } from "@/db/schema";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  } as never) as Adapter,
  providers: [
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST ?? "send.one.com",
        port: Number(process.env.EMAIL_SERVER_PORT ?? 465),
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: true,
      },
      from: process.env.EMAIL,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "E-Mail oder Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        const [found] = await db
          .select()
          .from(user)
          .where(
            or(
              eq(user.email, credentials.identifier as string),
              eq(user.username, credentials.identifier as string)
            )
          )
          .limit(1);
        if (!found?.password) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          found.password
        );
        if (!valid) return null;
        return {
          id: String(found.id),
          name: found.name ?? undefined,
          username: found.username,
          email: found.email,
          image: found.image,
          role: found.role,
          credits: found.credits,
          subscriptionStatus: found.subscriptionStatus,
          currentPeriodEnd: found.currentPeriodEnd?.toISOString() ?? null,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        const username =
          profile.name?.replace(/\s+/g, "").replace(/[^a-zA-Z0-9-_]/g, "") ??
          "user";
        return {
          id: profile.sub,
          name: profile.name ?? undefined,
          email: profile.email ?? undefined,
          image: profile.picture ?? undefined,
          username,
          role: "user",
          credits: 250,
          subscriptionStatus: null,
          currentPeriodEnd: null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session: s, token }) {
      if (s?.user) {
        const u = s.user as {
          id: number;
          username?: string | null;
          email?: string | null;
          image?: string;
          role?: string;
          credits?: number;
          subscriptionStatus?: string | null;
          currentPeriodEnd?: string | null;
        };
        u.id = parseInt(token.sub!, 10);
        const [currentUser] = await db
          .select()
          .from(user)
          .where(eq(user.id, u.id))
          .limit(1);
        if (currentUser) {
          u.username = currentUser.username ?? null;
          u.email = currentUser.email ?? null;
          u.image = currentUser.image ?? undefined;
          u.role = currentUser.role ?? "user";
          u.credits = currentUser.credits ?? 0;
          u.subscriptionStatus = currentUser.subscriptionStatus ?? null;
          u.currentPeriodEnd =
            currentUser.currentPeriodEnd?.toISOString() ?? null;
        }
      }
      return s;
    },
    async jwt({ token, user: u }) {
      if (u?.id != null) token.sub = String(u.id);
      return token;
    },
  },
});
