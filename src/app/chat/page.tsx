/**
 * Chat Page
 *
 * Full-page chat interface (alternative to floating widget)
 * Route: /chat
 *
 * Protected route - requires authentication
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/adapter';
import { ChatPageClient } from './ChatPageClient';

export const metadata: Metadata = {
  title: 'OneAssist - AI Chat | OneReport',
  description: 'Ask OneAssist about your marketing analytics data. Get instant insights from Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads.',
};

export default async function ChatPage() {
  // Check authentication - redirect to sign-in if not authenticated
  const user = await getCurrentUser();

  if (!user) {
    redirect('/signin');
  }

  return <ChatPageClient />;
}
