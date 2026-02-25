import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, plan } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import UserList from "./UserList";
import { Sparkles } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [u] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (u?.role !== "admin") {
    redirect("/");
  }

  const usersWithPlans = await db
    .select({
      user: user,
      plan: plan,
    })
    .from(user)
    .leftJoin(plan, eq(user.planId, plan.id))
    .orderBy(asc(user.id));

  const users = usersWithPlans.map((row) => ({
    ...row.user,
    plan: row.plan,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="shrink-0 py-6 border-b">
        <div className="w-full mx-auto px-8">
          <h1 className="text-2xl flex items-center gap-4 justify-center md:justify-start">
            <Sparkles size={24} />
            Benutzerverwaltung
          </h1>
        </div>
      </header>
      <div className="flex-1 flex">
        <main className="flex-1 p-8">
          <UserList users={users} />
        </main>
      </div>
    </div>
  );
}
