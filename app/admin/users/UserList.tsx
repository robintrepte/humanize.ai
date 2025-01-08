"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  public: boolean;
  credits: number;
}

export default function UserList({ users }: { users: User[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der Rolle');
      }

      const updatedUsers = filteredUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleCreditsChange = async (userId: number, newCredits: number) => {
    try {
      const response = await fetch('/api/admin/users/update-credits', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, credits: newCredits }),
      });

      if (!response.ok) {
        throw new Error('Error updating credits');
      }

      const updatedUsers = filteredUsers.map(user =>
        user.id === userId ? { ...user, credits: newCredits } : user
      );
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Suche nach Benutzername oder E-Mail..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Benutzername</TableHead>
            <TableHead>E-Mail</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Credits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <a target="_blank" href={`/${user.username}`} className="text-blue-500 hover:underline">
                  {user.username}
                </a>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                >
                  <SelectTrigger className="bg-transparent border-none">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={user.credits}
                  onChange={(e) => handleCreditsChange(user.id, parseInt(e.target.value))}
                  className="bg-transparent border-none w-full"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 