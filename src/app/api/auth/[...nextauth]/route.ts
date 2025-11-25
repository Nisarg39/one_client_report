/**
 * NextAuth.js API Route Handler
 *
 * Handles authentication with OAuth providers (Google & GitHub)
 * https://next-auth.js.org/configuration/initialization#route-handlers-app
 */

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import OnboardingProgressModel from '@/models/OnboardingProgress';

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
     * GitHub OAuth Provider
     * Get credentials from: https://github.com/settings/developers
     * Callback URL: http://localhost:3000/api/auth/callback/github
     */
    GithubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
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
      // OAuth sign in - Store user in database and set token.id
      if (account && profile && (account.provider === 'google' || account.provider === 'github')) {
        try {
          await connectDB();

          // Extract image URL based on provider
          const image = account.provider === 'google'
            ? (profile as any).picture
            : (profile as any).avatar_url;

          // GitHub may not have a name set, use login (username) as fallback
          const userName = profile.name || (profile as any).login || 'User';

          const dbUser = await UserModel.upsertFromOAuth({
            email: profile.email as string,
            name: userName,
            image: image as string,
            provider: account.provider,
            providerId: account.providerAccountId,
          });

          // Set MongoDB ObjectId as the token ID (not NextAuth's account ID)
          token.id = dbUser._id.toString();
        } catch (error) {
          console.error('Error upserting user:', error);
        }
      }

      // Token already has the MongoDB ID from initial sign-in, just return it
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
     * Redirect Callback - Smart redirect based on onboarding status
     * New users → /onboarding
     * Returning users → /chat
     */
    async redirect({ url, baseUrl }) {
      // If callback URL is explicitly provided and on same site, use it
      if (url.startsWith(baseUrl) && url !== `${baseUrl}/signin`) {
        return url;
      }
      if (url.startsWith('/') && url !== '/signin') {
        return new URL(url, baseUrl).toString();
      }

      // Auto-detect: new user vs returning user
      try {
        const { getServerSession } = await import('next-auth/next');
        const session = await getServerSession(authOptions);

        if (session?.user?.id) {
          await connectDB();

          // Check if user has completed onboarding
          const onboardingProgress = await OnboardingProgressModel.findByUserId(
            session.user.id
          );

          if (!onboardingProgress || !onboardingProgress.completed) {
            return `${baseUrl}/onboarding`;
          }

          return `${baseUrl}/chat`;
        }
      } catch (error) {
        console.error('Error in redirect callback:', error);
      }

      // Fallback to chat
      return `${baseUrl}/chat`;
    },
  },

  /**
   * Pages
   */
  pages: {
    signIn: '/signin', // Custom sign-in page (OAuth only)
    error: '/signin', // Redirect to sign-in on error
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
