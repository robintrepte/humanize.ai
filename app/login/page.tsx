"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
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
            router.push(`/register?email=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}&error=${encodeURIComponent("No user found. Please register:")}`);
            break;
          case "CredentialsSignin":
            setError("Username/Email or password is incorrect");
            break;
          default:
            setError("An error occurred. Please try again later.");
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
              Choose your preferred login method
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full py-6 text-md flex items-center justify-center gap-4"
            onClick={() => signIn('google')}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12"
              height="24" 
              viewBox="0 0 24 24" 
              width="24"
              style={{ minWidth: '24px', minHeight: '24px' }}
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Sign in with Google
          </Button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
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
                <label htmlFor="identifier" className="sr-only">Username or Email</label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Username or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="text-md"
                />
              </div>
              {isPasswordLogin && (
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Password"
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
                {isPasswordLogin ? "Sign In" : "Send Magic Link"}
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
              Don&apos;t have an account? Register here
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
