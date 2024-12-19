"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { FaDiscord, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const passwordParam = params.get('password');
    const errorParam = params.get('error');

    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (passwordParam) setPassword(decodeURIComponent(passwordParam));
    if (errorParam) setError(decodeURIComponent(errorParam));

    if (window.history.replaceState) {
      const newUrl = window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      router.push("/login");
    } else {
      console.error("Registrierungsfehler");
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Registrieren
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Wähle deine bevorzugte Registrierungsmethode
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => signIn("discord")} className="w-1/2 flex items-center justify-center bg-[#7289da] text-white">
              <FaDiscord className="mr-2" /> Discord
            </Button>
            <Button onClick={() => signIn("google")} className="w-1/2 flex items-center justify-center bg-[#DB4437] text-white">
              <FaGoogle className="mr-2" /> Google
            </Button>
          </div>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">ODER</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">Benutzername</label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Benutzername"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className="text-md"
                />
                {usernameError && <p className="text-sm text-red-500">{usernameError}</p>} {/* Fehleranzeige */}
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">E-Mail-Adresse</label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="E-Mail-Adresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-md"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Passwort</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full"
              >
                Registrieren
              </Button>
            </div>
          </form>
          <div className="text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
              Bereits ein Konto? Hier anmelden
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Mit der Registrierung stimmst du unseren <Link href="/datenschutz" className="text-blue-600 hover:text-blue-800">Datenschutzrichtlinien</Link> zu.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
