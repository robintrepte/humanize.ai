"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function EditProfile() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUsername((session.user as { username?: string }).username || "");
      setEmail(session.user.email || "");
    }
  }, [session, status]);

  const togglePasswordField = () => {
    setShowPasswordField(!showPasswordField);
    if (!showPasswordField) {
      setPassword("");
    }
  };

  const handleUsernameChange = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9-_]*$/; // Erlaubt nur Buchstaben, Zahlen, Bindestriche und Unterstriche
    if (!usernameRegex.test(value)) {
      setUsernameError('Benutzername darf keine Leerzeichen oder ungültige Symbole enthalten.');
    } else {
      setUsernameError(null);
    }
    setUsername(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validierung des Benutzernamens
    const usernameRegex = /^[a-zA-Z0-9-_]+$/; // Erlaubt nur Buchstaben, Zahlen, Bindestriche und Unterstriche
    if (!usernameRegex.test(username)) {
      setUsernameError('Username may only contain letters, numbers, hyphens and underscores.');
      return;
    }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password: password || undefined }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Profils');
      }

      const result = await response.json();

      // Update local state
      setUsername(result.user.username);
      setEmail(result.user.email);
      setPassword("");
      setShowPasswordField(false);

      // Aktualisieren Sie die Sitzung
      if (update) {
        await update({
          ...session,
          user: {
            ...session?.user,
            username: result.user.username,
            email: result.user.email,
          },
        });
      }

      // Navigieren Sie zur Profilseite
      router.push('/profile');
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Profil bearbeiten</h1>
            <p className="text-muted-foreground">Aktualisieren Sie Ihre persönlichen Informationen.</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input id="username" type="text" value={username} onChange={(e) => handleUsernameChange(e.target.value)} />
              {usernameError && <p className="text-sm text-red-500">{usernameError}</p>} {/* Fehleranzeige */}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Button type="button" variant="outline" onClick={togglePasswordField}>
                {showPasswordField ? "Passwortänderung abbrechen" : "Passwort ändern"}
              </Button>
              {showPasswordField && (
                <div className="grid gap-2">
                  <Label htmlFor="password">Neues Passwort</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </div>
            {/* <div className="flex justify-center space-x-4">
              <Button
                onClick={handleDiscordSignIn}
                className="w-1/2 flex items-center justify-center bg-[#7289da] text-white"
              >
                <FaDiscord className="mr-2" /> Discord verbinden
              </Button>
              <Button
                onClick={handleGoogleSignIn}
                className="w-1/2 flex items-center justify-center bg-[#DB4437] text-white"
              >
                <FaGoogle className="mr-2" /> Google verbinden
              </Button>
            </div> */}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/profile")}>
                Abbrechen
              </Button>
              <Button size="sm" type="submit">
                Änderungen speichern
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
