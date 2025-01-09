import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import PlanList from "./PlanList";
import { Sparkles } from "lucide-react";

export default async function AdminPlansPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin") {
    redirect("/");
  }

  const plans = await prisma.plan.findMany({
    orderBy: { price: 'asc' }
  });

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