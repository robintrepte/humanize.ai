"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
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
      console.error("Registration error");
    }
  };

  const handleUsernameChange = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9-_]*$/; // Only allows letters, numbers, hyphens and underscores
    if (!usernameRegex.test(value)) {
      setUsernameError('Username cannot contain spaces or invalid symbols.');
    } else {
      setUsernameError(null);
    }
    setUsername(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Register
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Choose your preferred registration method
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
            Sign up with Google
          </Button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
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
                <label htmlFor="username" className="sr-only">Username</label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className="text-md"
                />
                {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-md"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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
                Register
              </Button>
            </div>
          </form>
          <div className="text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
              Already have an account? Sign in here
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              By registering, you agree to our <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
