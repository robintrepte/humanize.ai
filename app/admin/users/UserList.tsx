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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, User, Code } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  public: boolean;
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

      // Aktualisiere die lokale Benutzerliste
      const updatedUsers = filteredUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Suche nach Benutzername oder E-Mail..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Benutzername</TableHead>
            <TableHead>E-Mail</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aktionen</TableHead>
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
                <Badge 
                  style={{
                    backgroundColor: user.role === "admin" ? '#dc3545' :
                                    user.role === "dev" ? '#007bff' :
                                    user.role === "player" ? '#28a745' :
                                    undefined,
                    color: 'white'
                  }}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.public ? "secondary" : "destructive"}>
                  {user.public ? "Öffentlich" : "Privat"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role === "player" && (
                      <>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Zum Admin machen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "dev")}>
                          <Code className="mr-2 h-4 w-4" />
                          Zum Dev machen
                        </DropdownMenuItem>
                      </>
                    )}
                    {user.role === "dev" && (
                      <>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Zum Admin machen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "player")}>
                          <User className="mr-2 h-4 w-4" />
                          Zum Player machen
                        </DropdownMenuItem>
                      </>
                    )}
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "dev")}>
                          <Code className="mr-2 h-4 w-4" />
                          Zum Dev machen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "player")}>
                          <User className="mr-2 h-4 w-4" />
                          Zum Player machen
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 