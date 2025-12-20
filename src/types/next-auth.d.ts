/**
 * NextAuth Type Extensions
 *
 * Extend default NextAuth types to include custom user properties
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extend Session interface
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      accountType?: 'business' | 'education' | 'instructor';
      usageTier?: 'free' | 'student' | 'pro' | 'agency' | 'enterprise';
      subscriptionStatus?: 'none' | 'trial' | 'active' | 'expired' | 'cancelled';
      subscriptionEndDate?: string | null;
      trialStartDate?: string | null;
      trialEndDate?: string | null;
      restrictions?: any;
      phone?: string;
      createdAt?: string;
    };
  }

  /**
   * Extend User interface
   */
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    accountType?: 'business' | 'education' | 'instructor';
    usageTier?: 'free' | 'student' | 'pro' | 'agency' | 'enterprise';
    subscriptionStatus?: 'none' | 'trial' | 'active' | 'expired' | 'cancelled';
    subscriptionEndDate?: Date | string | null;
    trialStartDate?: Date | string | null;
    trialEndDate?: Date | string | null;
    restrictions?: any;
    phone?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend JWT interface
   */
  interface JWT {
    id: string;
    createdAt?: string;
    accountType?: 'business' | 'education' | 'instructor';
    usageTier?: 'free' | 'student' | 'pro' | 'agency' | 'enterprise';
    subscriptionStatus?: 'none' | 'trial' | 'active' | 'expired' | 'cancelled';
    subscriptionEndDate?: string | null;
    trialStartDate?: string | null;
    trialEndDate?: string | null;
    restrictions?: any;
    phone?: string;
  }
}
