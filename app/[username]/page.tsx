import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import UserProfileOverview from "./UserProfileOverview";
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface UserProfileProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfile({ params }: UserProfileProps) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;

  if (!resolvedParams || !resolvedParams.username) {
    redirect("/");
  }

  const user = await prisma.user.findFirst({
    where: { username: { equals: resolvedParams.username, mode: 'insensitive' } },
  });

  if (!user) {
    redirect("/");
  }

  if (!user.public && (!session?.user?.username || user.username !== session.user.username)) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex justify-center p-6">
          <h1>Dieses Profil ist privat.</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-6">
        <UserProfileOverview 
          user={user} 
          currentUser={session?.user} 
        />
      </main>
    </div>
  );
}
