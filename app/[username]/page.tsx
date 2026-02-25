import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import UserProfileOverview from "./UserProfileOverview";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { auth } from "@/auth";
import { sql } from "drizzle-orm";

interface UserProfileProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfile({ params }: UserProfileProps) {
  const session = await auth();
  const resolvedParams = await params;

  if (!resolvedParams?.username) {
    redirect("/");
  }

  const [profileUser] = await db
    .select()
    .from(user)
    .where(sql`lower(${user.username}) = lower(${resolvedParams.username})`)
    .limit(1);

  if (!profileUser) {
    redirect("/");
  }

  if (
    !profileUser.public &&
    (!session?.user?.username ||
      profileUser.username !== session.user.username)
  ) {
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
          user={profileUser}
          currentUser={session?.user}
        />
      </main>
    </div>
  );
}
