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
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend JWT interface
   */
  interface JWT {
    id: string;
  }
}
