/**
 * NextAuth Session Provider Wrapper
 *
 * Wraps the app with NextAuth SessionProvider for client-side session access
 */

'use client';

import { SessionProvider } from 'next-auth/react';

export function NextAuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
