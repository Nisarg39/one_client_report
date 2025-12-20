/**
 * Test what the subscription page query returns
 */

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import SubscriptionModel from '../src/models/Subscription';
import UserModel from '../src/models/User';

async function testPageQuery() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Find the test user
    const user = await UserModel.findOne({ email: 'shah.nisarg39@gmail.com' });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log(`\n👤 Testing for user: ${user.email}`);
    console.log(`   User ID: ${user._id}\n`);

    // This is the exact query used by the subscription page
    console.log('📊 Calling SubscriptionModel.getActiveSubscription()...\n');
    const activeSubscription = await SubscriptionModel.getActiveSubscription(user._id);

    if (activeSubscription) {
      console.log('✅ Query returned subscription:');
      console.log(`   ID: ${activeSubscription._id}`);
      console.log(`   Status: ${activeSubscription.status}`);
      console.log(`   Tier: ${activeSubscription.usageTier}`);
      console.log(`   Start Date: ${activeSubscription.startDate.toISOString()}`);
      console.log(`   End Date: ${activeSubscription.endDate.toISOString()}`);
      console.log(`   Cancelled At: ${activeSubscription.cancelledAt?.toISOString() || 'N/A'}`);

      const now = new Date();
      const isExpired = activeSubscription.endDate < now;
      console.log(`\n   Is Expired: ${isExpired ? '❌ YES' : '✅ NO'}`);

      // Check what the page would show
      console.log(`\n🖥️  What the page SHOULD show:`);
      if (activeSubscription.status === 'cancelled') {
        console.log(`   ✅ Yellow Badge: "Cancelled - Active until ${activeSubscription.endDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}"`);
        console.log(`   ✅ Yellow Warning Box: "Your subscription has been cancelled but remains active until..."`);
        console.log(`   ✅ Plan: "${activeSubscription.usageTier}" (professional)`);
        console.log(`   ✅ Price: "₹${activeSubscription.amount}/month"`);
      } else {
        console.log(`   Green Badge: "active"`);
      }
    } else {
      console.log('❌ Query returned NULL - No active subscription found');
      console.log('\n🖥️  What the page WILL show:');
      console.log('   ⚠️  "No Active Subscription" message');
      console.log('   ⚠️  Orange warning icon');
      console.log('   ⚠️  "View Plans" button');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testPageQuery();
