import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from './backend/utils/session';

/**
 * Middleware to protect admin routes with server-side authentication
 * Runs before every request to /admin/* routes
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow access to the login page (/admin) without authentication
  // This is where unauthenticated users should land
  if (path === '/admin' || path === '/admin/') {
    return NextResponse.next();
  }

  // For all other /admin/* routes, verify authentication
  if (path.startsWith('/admin')) {
    try {
      // Get the session cookie
      const cookieStore = await cookies();
      const token = cookieStore.get('admin-session')?.value;

      // If no token exists, redirect to login
      if (!token) {
        console.log('[Middleware] No token found, redirecting to login');
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      // Verify the token is valid
      const isValid = verifyToken(token);

      if (!isValid) {
        console.log('[Middleware] Invalid or expired token, redirecting to login');
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      // Token is valid, allow access
      console.log('[Middleware] Valid token, allowing access to:', path);
      return NextResponse.next();

    } catch (error) {
      console.error('[Middleware] Error verifying token:', error);
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // For all non-admin routes, allow access
  return NextResponse.next();
}

/**
 * Configure which routes this middleware should run on
 * Matches all /admin/* routes
 */
export const config = {
  matcher: '/admin/:path*',
};
