/**
 * NextAuth.js Authentication Implementation
 *
 * Real authentication using NextAuth.js with Google OAuth
 * Used in production environment
 */

'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { AuthUser } from './adapter';

/**
 * Get currently authenticated user from NextAuth session
 *
 * @returns AuthUser if authenticated, null otherwise
 */
export async function getNextAuthUser(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch (error) {
    console.error('Error getting NextAuth user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 *
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getNextAuthUser();
  return user !== null;
}
