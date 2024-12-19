import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Header } from "@/components/Header";
import prisma from '@/lib/prisma';
import UserList from "./UserList";

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
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Benutzerverwaltung</h1>
        <UserList users={users} />
      </main>
    </div>
  );
} 