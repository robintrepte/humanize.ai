import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, plan } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import PlanList from "./PlanList";
import { Sparkles } from "lucide-react";

export default async function AdminPlansPage() {
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

  const plans = await db.select().from(plan).orderBy(asc(plan.price));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="shrink-0 py-6 border-b">
        <div className="w-full mx-auto px-8">
          <h1 className="text-2xl flex items-center gap-4">
            <Sparkles size={24} />
            Subscription Plans Management
          </h1>
        </div>
      </header>
      <div className="flex-1 p-8">
        <PlanList plans={plans} />
      </div>
    </div>
  );
}
