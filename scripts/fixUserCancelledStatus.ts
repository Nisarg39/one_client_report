/**
 * Fix User documents for cancelled subscriptions
 *
 * Updates User.subscriptionStatus to 'cancelled' for users who have
 * cancelled subscriptions but their User document still shows 'active'
 */

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import SubscriptionModel from '../src/models/Subscription';
import UserModel from '../src/models/User';

async function fixUserCancelledStatus() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Find all cancelled subscriptions that haven't expired yet
    const now = new Date();
    const cancelledSubs = await SubscriptionModel.find({
      status: 'cancelled',
      endDate: { $gte: now }, // Still in grace period
    });

    console.log(`\n📊 Found ${cancelledSubs.length} cancelled subscriptions in grace period\n`);

    if (cancelledSubs.length === 0) {
      console.log('✅ No cancelled subscriptions need fixing!');
      process.exit(0);
    }

    // For each cancelled subscription, update the User document
    for (const sub of cancelledSubs) {
      const user = await UserModel.findById(sub.userId);

      if (!user) {
        console.log(`⚠️  User not found for subscription ${sub._id}`);
        continue;
      }

      console.log(`\n🔧 Fixing user ${user.email}:`);
      console.log(`   Current User.subscriptionStatus: ${user.subscriptionStatus}`);
      console.log(`   Subscription.status: ${sub.status}`);

      if (user.subscriptionStatus !== 'cancelled') {
        await UserModel.findByIdAndUpdate(user._id, {
          subscriptionStatus: 'cancelled',
          // Keep usageTier unchanged - user maintains access during grace period
        });

        console.log(`   ✅ Updated User.subscriptionStatus to 'cancelled'`);
        console.log(`   ✅ Kept usageTier as '${user.usageTier}' (maintains access)`);
      } else {
        console.log(`   ℹ️  Already set to 'cancelled' - no update needed`);
      }
    }

    console.log(`\n\n✅ Successfully fixed user status for cancelled subscriptions!`);
    console.log('📝 Users will now see yellow "Cancelled - Active until {date}" status in UI.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUserCancelledStatus();
