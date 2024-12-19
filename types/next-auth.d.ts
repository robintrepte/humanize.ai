import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string | null;
      username: string | null;
      image?: string | null;
      role: string;
    }
  }

  interface User {
    id: number;
    email: string | null;
    username: string | null;
    image?: string | null;
    role: string;
  }
}
