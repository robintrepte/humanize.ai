import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: number;
    username: string | null;
    role: string;
    credits: number;
    subscriptionStatus: string | null;
    currentPeriodEnd: string | null;
  }

  interface Session {
    user: User & {
      id: number;
      email: string | null;
      image?: string;
    };
  }
}
