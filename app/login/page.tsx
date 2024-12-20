"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { FaDiscord, FaGoogle } from "react-icons/fa"; // Icons importieren
import { Eye, EyeOff } from "lucide-react"; // Fügen Sie diesen Import am Anfang der Datei hinzu

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordLogin, setIsPasswordLogin] = useState(true); // Standardmäßig auf true setzen
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (isPasswordLogin) {
      result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/");
      } else {
        switch (result?.error) {
          case "No user found":
            router.push(`/register?email=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}&error=${encodeURIComponent("Kein Benutzer gefunden. Bitte registriere dich:")}`);
            break;
          case "CredentialsSignin":
            setError("Benutzername/E-Mail oder Passwort ist falsch");
            break;
          default:
            setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Wähle deine bevorzugte Anmeldemethode
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
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="identifier" className="sr-only">Benutzername oder E-Mail</label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Benutzername oder E-Mail"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="text-md"
                />
              </div>
              {isPasswordLogin && (
                <div>
                  <label htmlFor="password" className="sr-only">Passwort</label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
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
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Button
                type="submit"
                className="w-full"
              >
                {isPasswordLogin ? "Anmelden" : "Magic Link senden"}
              </Button>
            </div>
          </form>
          {/* <div className="text-center">
            <button
              onClick={() => setIsPasswordLogin(!isPasswordLogin)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isPasswordLogin ? "Mit Magic Link anmelden" : "Mit Passwort anmelden"}
            </button>
          </div> */}
          <div className="text-center">
            <Link href="/register" className="text-sm text-blue-600 hover:text-blue-800">
              Noch kein Konto? Hier registrieren
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Mit der Anmeldung stimmst du unseren <Link href="/datenschutz" className="text-blue-600 hover:text-blue-800">Datenschutzrichtlinien</Link> zu.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
