/**
 * Onboarding Page
 * Route: /onboarding
 *
 * Protected route - requires authentication
 * Redirects to /chat if user has completed onboarding
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import OnboardingProgressModel from '@/models/OnboardingProgress';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Welcome to OneAssist | OneReport',
  description: 'Get started with your AI-powered marketing analytics assistant',
};

// Force dynamic rendering - this page requires authentication and user-specific data
export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  // 1. Check authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  // 2. Check if user has completed onboarding
  await connectDB();

  try {
    const onboardingProgress = await OnboardingProgressModel.findByUserId(user.id);

    if (onboardingProgress?.completed) {
      // User has completed onboarding → redirect to chat
      redirect('/chat');
    }
  } catch (error) {
    // If error checking onboarding, continue to show onboarding flow
    console.error('Error checking onboarding status:', error);
  }

  // 3. Render onboarding flow (for new users or users who haven't completed onboarding)
  return <OnboardingFlow />;
}
