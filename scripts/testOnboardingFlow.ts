/**
 * Test Onboarding Flow
 * Run: npx tsx scripts/testOnboardingFlow.ts
 */

import { connectDB } from '../src/lib/db';
import UserModel from '../src/models/User';
import ClientModel from '../src/models/Client';
import OnboardingProgressModel from '../src/models/OnboardingProgress';

async function testOnboardingFlow() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected!\n');

    // Test with your GitHub account
    const testEmail = 'shah.nisarg39@gmail.com'; // Change this to your GitHub email

    console.log(`👤 Testing onboarding flow for: ${testEmail}\n`);

    // 1. Find user
    const user = await UserModel.findOne({ email: testEmail });

    if (!user) {
      console.log('❌ User not found in database');
      console.log('💡 Please sign in with GitHub first, then run this test again');
      process.exit(1);
    }

    console.log(`✅ User found: ${user.email}`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Name: ${user.name}\n`);

    // 2. Check onboarding status
    const onboardingProgress = await OnboardingProgressModel.findByUserId(user._id.toString());

    console.log('📋 Onboarding Status:');
    if (!onboardingProgress) {
      console.log('   ⚠️  No OnboardingProgress record found');
      console.log('   ✅ User WILL be redirected to /onboarding');
    } else {
      console.log(`   Completed: ${onboardingProgress.completed}`);
      console.log(`   Current Step: ${onboardingProgress.currentStep}`);
      console.log(`   Completed At: ${onboardingProgress.completedAt || 'Not completed'}`);

      if (!onboardingProgress.completed) {
        console.log('   ✅ User WILL be redirected to /onboarding');
      } else {
        console.log('   ✅ User will access /chat directly');
      }
    }

    // 3. Check clients
    const clients = await ClientModel.find({ userId: user._id, status: 'active' });

    console.log(`\n📊 Clients (${clients.length} total):`);
    if (clients.length === 0) {
      console.log('   ⚠️  No clients found');
      console.log('   ✅ User needs to complete onboarding');
    } else {
      clients.forEach((client, index) => {
        console.log(`   ${index + 1}. ${client.name}`);
        console.log(`      Email: ${client.email || 'None'}`);
        console.log(`      Created: ${(client as any).createdAt || 'N/A'}`);
      });
    }

    // 4. Decision summary
    console.log('\n🎯 Expected Behavior:');
    if (!onboardingProgress || !onboardingProgress.completed || clients.length === 0) {
      console.log('   When accessing /chat → Redirect to /onboarding ✅');
    } else {
      console.log('   When accessing /chat → Show chat interface ✅');
    }

    console.log('\n✅ Test complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error occurred:', error);
    process.exit(1);
  }
}

testOnboardingFlow();
