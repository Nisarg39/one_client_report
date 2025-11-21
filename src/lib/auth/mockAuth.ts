/**
 * Mock Authentication
 *
 * Provides a fake authenticated user for development (Weeks 2-4)
 * This allows building and testing the chatbot without real authentication
 *
 * IMPORTANT: This is for DEVELOPMENT ONLY!
 * - Do NOT use in production
 * - Will be replaced with NextAuth.js in Week 5
 *
 * See: docs/features/ai-chatbot/11-AUTHENTICATION-STRATEGY.md
 */

import type { AuthUser } from './adapter';

/**
 * Mock demo user
 * Used during development to simulate an authenticated user
 *
 * IMPORTANT: This ID matches the DEMO_USER_OBJECT_ID in scripts/seedDemoClients.ts
 * This ensures the demo clients are associated with this mock user
 */
const MOCK_USER: AuthUser = {
  id: '507f1f77bcf86cd799439011', // Must match seedDemoClients.ts
  email: 'demo@example.com',
  name: 'Demo User',
};

/**
 * Get mock authenticated user
 *
 * Always returns the demo user for development
 * This allows testing all chatbot features without real auth
 *
 * @returns Mock AuthUser
 */
export async function getMockUser(): Promise<AuthUser> {
  // Only allow mock in development
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '❌ Mock authentication is not allowed in production! Use NextAuth.js instead.'
    );
    throw new Error('Mock authentication not allowed in production');
  }

  // Simulate async call (like real auth)
  await new Promise((resolve) => setTimeout(resolve, 0));

  return MOCK_USER;
}

/**
 * Get mock user ID
 * Convenience function to get just the user ID
 *
 * @returns Mock user ID
 */
export async function getMockUserId(): Promise<string> {
  const user = await getMockUser();
  return user.id;
}
