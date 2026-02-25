import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { checkAuthRateLimit } from "@/lib/rate-limit";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (
    (pathname === "/api/register" || pathname === "/api/auth/callback/credentials") &&
    req.method === "POST"
  ) {
    if (!checkAuthRateLimit(req)) {
      return Response.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname === "/imprint" ||
    pathname === "/privacy"
  ) {
    return;
  }

  if (isLoggedIn && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  if (!isLoggedIn && pathname !== "/" && pathname !== "/login" && pathname !== "/register") {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/api/register",
    "/api/auth/callback/credentials",
  ],
};
