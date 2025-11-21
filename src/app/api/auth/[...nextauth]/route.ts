/**
 * NextAuth.js API Route Handler
 *
 * Handles authentication with Google OAuth and credentials
 * https://next-auth.js.org/configuration/initialization#route-handlers-app
 */

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';

/**
 * NextAuth Configuration
 */
export const authOptions: NextAuthOptions = {
  providers: [
    /**
     * Google OAuth Provider
     * Get credentials from: https://console.cloud.google.com/apis/credentials
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    /**
     * Credentials Provider (Email/Password)
     * For future implementation - currently disabled
     */
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // TODO: Implement password-based authentication
        // For now, return null (disabled)
        return null;
      },
    }),
  ],

  /**
   * Callbacks
   */
  callbacks: {
    /**
     * JWT Callback - Called whenever a JWT is created/updated
     */
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
      }

      // OAuth sign in - Store user in database
      if (account && profile && account.provider === 'google') {
        try {
          await connectDB();

          const dbUser = await UserModel.upsertFromOAuth({
            email: profile.email as string,
            name: profile.name as string,
            image: (profile as any).picture as string,
            provider: account.provider,
            providerId: account.providerAccountId,
          });

          token.id = dbUser._id.toString();
        } catch (error) {
          console.error('Error upserting user:', error);
        }
      }

      return token;
    },

    /**
     * Session Callback - Called whenever session is checked
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    /**
     * Redirect Callback - Control where user is redirected after auth
     */
    async redirect({ url, baseUrl }) {
      // Redirect to /chat page after successful authentication
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If callback URL is on same site, allow it
      else if (url.startsWith('/')) {
        return new URL(url, baseUrl).toString();
      }
      // Default to chat page
      return `${baseUrl}/chat`;
    },
  },

  /**
   * Pages
   */
  pages: {
    signIn: '/login', // Custom login page
    error: '/login', // Redirect to login on error
    // signOut: '/logout', // Custom sign out page (optional)
    // verifyRequest: '/verify', // Email verification page (optional)
  },

  /**
   * Session Strategy
   */
  session: {
    strategy: 'jwt', // Use JWT instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  /**
   * JWT Configuration
   */
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  /**
   * Security
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * Debug (disable in production)
   */
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Export handlers for App Router
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
