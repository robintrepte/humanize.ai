import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import UserList from "./UserList";
import { Sparkles } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Überprüfe ob der Benutzer Admin ist
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin") {
    redirect("/");
  }

  // Hole alle Benutzer aus der Datenbank
  const users = await prisma.user.findMany();

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