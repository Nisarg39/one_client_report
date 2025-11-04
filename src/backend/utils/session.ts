import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT (JSON Web Token) with signature
 * This token is self-validating - no database needed!
 *
 * How it works:
 * 1. Creates token with data: { adminId: 'admin', iat: timestamp }
 * 2. Signs it with SECRET_KEY (only server knows this)
 * 3. Token = data + signature
 * 4. Later, verify signature to validate token
 *
 * @returns A signed JWT token
 */
export function generateToken(): string {
  // Get secret key from environment variable
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  // Create JWT with signature
  // This token contains:
  // - adminId: "admin" (identifies this is admin)
  // - iat: timestamp (issued at time)
  // - exp: timestamp (expiry time - 24 hours)
  const token = jwt.sign(
    { adminId: 'admin' },  // Payload data
    secret,                // Secret key for signing
    { expiresIn: '24h' }   // Token expires in 24 hours
  );

  return token;
}

/**
 * Creates a session cookie (stores token in browser)
 * This adds "Set-Cookie" header to HTTP response
 * Browser will automatically store it
 *
 * @param token - The random token to store
 */
export async function createSessionCookie(token: string): Promise<void> {
  // Calculate expiry time (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Set the cookie - Next.js will add "Set-Cookie" header to response
  const cookieStore = await cookies();
  cookieStore.set('admin-session', token, {
    httpOnly: true, // JavaScript cannot access it (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    expires: expiresAt, // Cookie expires in 24 hours
    path: '/', // Available on all routes
  });
}

/**
 * Gets the session token from cookie
 * Reads the cookie that browser automatically sent with request
 *
 * @returns The token string, or null if not found
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('admin-session');
  return cookie?.value || null;
}

/**
 * Deletes the session cookie (logout)
 * Browser will remove the cookie
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}

/**
 * Validates a JWT token by verifying its signature
 * This is where the magic happens - no database needed!
 *
 * How it works:
 * 1. Server receives token from browser
 * 2. Extract signature from token
 * 3. Recreate signature using SECRET_KEY
 * 4. Compare: if signatures match → token is valid!
 * 5. Also checks if token has expired
 *
 * @param token - The JWT token to validate
 * @returns true if token is valid and not expired, false otherwise
 */
export function verifyToken(token: string): boolean {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET environment variable is not set');
      return false;
    }

    // Verify token signature and expiry
    // This will throw an error if:
    // - Signature doesn't match (token was tampered with)
    // - Token has expired
    // - Token is malformed
    jwt.verify(token, secret);

    // If no error thrown, token is valid! ✅
    return true;
  } catch (error) {
    // Token is invalid or expired
    console.error('Token verification failed:', error);
    return false;
  }
}

/**
 * Decodes a JWT token and returns its payload
 * Use this after verifying token to get the data inside
 *
 * @param token - The JWT token to decode
 * @returns The payload data, or null if invalid
 */
export function decodeToken(token: string): { adminId: string } | null {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return null;
    }

    // Verify and decode token
    const decoded = jwt.verify(token, secret) as { adminId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}
