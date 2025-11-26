/**
 * Check User Session Status
 * Run: npx tsx scripts/checkUserSession.ts <email>
 */

import { connectDB } from '../src/lib/db';
import UserModel from '../src/models/User';
import ClientModel from '../src/models/Client';
import OnboardingProgressModel from '../src/models/OnboardingProgress';

async function checkUserSession() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log('Usage: npx tsx scripts/checkUserSession.ts <email>');
      console.log('Example: npx tsx scripts/checkUserSession.ts your@email.com');
      process.exit(1);
    }

    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected!\n');

    console.log(`🔍 Checking user: ${email}\n`);

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log('❌ User NOT found in database');
      console.log('\n📌 Expected Flow:');
      console.log('   /chat → NOT authenticated → Redirect to /signin ✅');
      console.log('\n💡 Action: Sign in with GitHub/Google to create user account');
      process.exit(0);
    }

    console.log('✅ User found in database');
    console.log(`   User ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Provider: ${user.provider || 'N/A'}`);

    // Check onboarding
    const onboarding = await OnboardingProgressModel.findByUserId(user._id.toString());

    console.log('\n📋 Onboarding Status:');
    if (!onboarding) {
      console.log('   ❌ No OnboardingProgress record');
      console.log('   Status: NOT STARTED');
    } else {
      console.log(`   ✅ OnboardingProgress exists`);
      console.log(`   Completed: ${onboarding.completed ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   Current Step: ${onboarding.currentStep}/4`);
      if (onboarding.completedAt) {
        console.log(`   Completed At: ${onboarding.completedAt}`);
      }
    }

    // Check clients
    const clients = await ClientModel.countDocuments({
      userId: user._id,
      status: { $ne: 'archived' }
    });

    console.log(`\n👥 Clients: ${clients} active`);

    // Decision
    console.log('\n📌 Expected Flow:');

    if (!onboarding || !onboarding.completed) {
      console.log('   /chat → Authenticated ✅ → Onboarding incomplete ❌');
      console.log('   → Redirect to /onboarding ✅');
      console.log('\n💡 You SHOULD be redirected to /onboarding page');
      console.log('   (The NEXT_REDIRECT error in console is normal)');
    } else {
      console.log('   /chat → Authenticated ✅ → Onboarding complete ✅');
      console.log('   → Show chat interface ✅');
      console.log('\n💡 You SHOULD see the chat interface');
    }

    console.log('\n' + '='.repeat(60));
    console.log('IMPORTANT: The NEXT_REDIRECT console error is NORMAL!');
    console.log('It is just how Next.js logs server redirects in dev mode.');
    console.log('Check what page you ACTUALLY SEE in your browser!');
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

checkUserSession();
