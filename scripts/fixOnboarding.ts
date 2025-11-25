/**
 * Fix Onboarding Script
 * Creates OnboardingProgress record for existing user
 * Run: npx tsx scripts/fixOnboarding.ts
 */

import OnboardingProgressModel from '../src/models/OnboardingProgress';
import UserModel from '../src/models/User';
import { connectDB } from '../src/lib/db';

async function fixOnboarding() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected!\n');

    // Get the user
    const user = await UserModel.findOne({ email: 'shah.nisarg39@gmail.com' });

    if (!user) {
      console.error('❌ User not found!');
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.email} (ID: ${user._id})\n`);

    // Check if onboarding progress already exists
    const existing = await OnboardingProgressModel.findOne({ userId: user._id });

    if (existing) {
      console.log('ℹ️  OnboardingProgress already exists:');
      console.log(`   Completed: ${existing.completed}`);
      console.log(`   Current Step: ${existing.currentStep}`);
      console.log('\n');

      if (!existing.completed) {
        console.log('🔧 Marking onboarding as completed...');
        existing.completed = true;
        existing.currentStep = 4;
        existing.completedAt = new Date();
        await existing.save();
        console.log('✅ Onboarding marked as completed!\n');
      }
    } else {
      console.log('🔧 Creating OnboardingProgress record...');
      await OnboardingProgressModel.create({
        userId: user._id,
        completed: true,
        currentStep: 4,
        completedAt: new Date(),
      });
      console.log('✅ OnboardingProgress created!\n');
    }

    console.log('🎉 Success! You can now sign in and go directly to /chat');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixOnboarding();
