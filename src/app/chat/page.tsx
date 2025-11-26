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
import { connectDB } from '@/lib/db';
import OnboardingProgressModel from '@/models/OnboardingProgress';

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

  // Check if user has completed onboarding
  try {
    await connectDB();
    const onboardingProgress = await OnboardingProgressModel.findByUserId(user.id);

    if (!onboardingProgress || !onboardingProgress.completed) {
      redirect('/onboarding');
    }
  } catch (error) {
    // Re-throw NEXT_REDIRECT errors (they're not real errors, just Next.js redirect mechanism)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error checking onboarding status:', error);
    // If there's an error, allow access to chat (fail open)
  }

  return <ChatPageClient />;
}
