/**
 * Authentication Adapter
 *
 * This module provides a unified authentication interface that works with
 * both mock authentication (development) and NextAuth.js (production).
 *
 * Strategy:
 * - Weeks 2-4: Use mock authentication for faster development
 * - Week 5+: Switch to NextAuth.js (one line change!)
 *
 * See: docs/features/ai-chatbot/11-AUTHENTICATION-STRATEGY.md
 */

/**
 * Authenticated user returned by getCurrentUser()
 * Same interface for both mock and real authentication
 */
export interface AuthUser {
  id: string;         // User ID (MongoDB ObjectId as string)
  email: string;      // User email address
  name?: string;      // User display name (optional)
  phone?: string;     // User phone number
  accountType?: 'business' | 'education' | 'instructor'; // Account type
  usageTier?: 'free' | 'pro' | 'enterprise' | 'student'; // Usage tier
  restrictions?: {
    maxClients?: number;
    maxMessagesPerDay?: number;
    maxConversations?: number;
    allowRealAPIs?: boolean;
    allowedAgents?: string[];
    aiModel?: string;
  };
}

/**
 * Get the currently authenticated user
 *
 * Implementation switches based on environment variable:
 * - USE_MOCK_AUTH=true (default): Returns mock user for development
 * - USE_MOCK_AUTH=false: Returns NextAuth.js session user (production)
 *
 * Usage in chatbot components:
 * ```typescript
 * const user = await getCurrentUser();
 * if (!user) {
 *   return <LoginPrompt />;
 * }
 * // Use user.id for conversations, etc.
 * ```
 *
 * @returns AuthUser if authenticated, null if not
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Always use NextAuth (environment variable issue resolved by removing it)
  const { getNextAuthUser } = await import('./nextAuth');
  return await getNextAuthUser();
}

/**
 * Check if user is authenticated
 *
 * Convenience function to check authentication status
 *
 * @returns true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Require authentication
 *
 * Throws error if user is not authenticated
 * Use this in Server Actions to enforce auth
 *
 * Usage:
 * ```typescript
 * export async function sendMessage(message: string) {
 *   'use server';
 *   const user = await requireAuth(); // Throws if not authenticated
 *   // ... proceed with authenticated user
 * }
 * ```
 *
 * @returns AuthUser if authenticated
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }

  return user;
}
