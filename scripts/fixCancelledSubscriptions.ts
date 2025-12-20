/**
 * Fix Cancelled Subscriptions - One-time migration script
 *
 * This script fixes subscriptions that were cancelled with the old logic
 * (where endDate was set to NOW instead of preserving the original endDate)
 *
 * Run with: npx tsx scripts/fixCancelledSubscriptions.ts
 */

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import SubscriptionModel from '../src/models/Subscription';

async function fixCancelledSubscriptions() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Find all subscriptions that were cancelled AND have endDate in the past
    // (These were likely cancelled with the old logic)
    const now = new Date();
    const brokenSubscriptions = await SubscriptionModel.find({
      status: 'cancelled',
      endDate: { $lt: now }, // endDate is in the past
      cancelledAt: { $exists: true }, // Has a cancelledAt timestamp
    });

    console.log(`\n📊 Found ${brokenSubscriptions.length} subscriptions with past endDate\n`);

    if (brokenSubscriptions.length === 0) {
      console.log('✅ No subscriptions need fixing!');
      process.exit(0);
    }

    // For each broken subscription, restore endDate to 1 month after cancelledAt
    for (const sub of brokenSubscriptions) {
      const oldEndDate = sub.endDate;

      // Calculate what the endDate should be: startDate + 1 month
      const correctEndDate = new Date(sub.startDate);
      correctEndDate.setMonth(correctEndDate.getMonth() + 1);

      console.log(`\n🔧 Fixing subscription ${sub._id}:`);
      console.log(`   User ID: ${sub.userId}`);
      console.log(`   Tier: ${sub.usageTier}`);
      console.log(`   Start Date: ${sub.startDate.toISOString()}`);
      console.log(`   ❌ Old End Date: ${oldEndDate.toISOString()} (already expired)`);
      console.log(`   ✅ New End Date: ${correctEndDate.toISOString()}`);
      console.log(`   Cancelled At: ${sub.cancelledAt?.toISOString()}`);

      // Update the subscription
      await SubscriptionModel.findByIdAndUpdate(sub._id, {
        endDate: correctEndDate,
      });

      console.log(`   ✅ Fixed!`);
    }

    console.log(`\n\n✅ Successfully fixed ${brokenSubscriptions.length} subscriptions!`);
    console.log('\n📝 These users will now see their cancelled subscriptions with correct grace period.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing subscriptions:', error);
    process.exit(1);
  }
}

// Run the script
fixCancelledSubscriptions();
