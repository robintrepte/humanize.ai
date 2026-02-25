import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string | number;
    username?: string | null;
    role?: string;
    credits?: number;
    subscriptionStatus?: string | null;
    currentPeriodEnd?: string | null;
  }

  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      role?: string;
      credits?: number;
      subscriptionStatus?: string | null;
      currentPeriodEnd?: string | null;
    };
  }
}
