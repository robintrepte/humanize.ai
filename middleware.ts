import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  
  const { pathname } = request.nextUrl
  
  // Allow access to auth-related pages and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Redirect to humanize if authenticated and trying to access landing, login, or register pages
  if (token && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/humanize', request.url))
  }

  // Redirect to landing page if not authenticated and trying to access protected routes
  if (!token && pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}