/**
 * Complete Onboarding API Route
 * Marks user onboarding as completed
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import OnboardingProgressModel from '@/models/OnboardingProgress';

export async function POST() {
  try {
    // Get authenticated user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Mark onboarding as completed
    await OnboardingProgressModel.markCompleted(user.id);

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
    });
  } catch (error) {
    console.error('[Complete Onboarding] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
