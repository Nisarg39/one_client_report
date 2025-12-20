/**
 * Debug script to check subscription and user data
 */

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import SubscriptionModel from '../src/models/Subscription';
import UserModel from '../src/models/User';

async function debugSubscriptions() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Find all subscriptions
    const allSubscriptions = await SubscriptionModel.find({}).sort({ createdAt: -1 });
    console.log(`\n📊 Total subscriptions in database: ${allSubscriptions.length}\n`);

    if (allSubscriptions.length === 0) {
      console.log('❌ No subscriptions found in database');
      process.exit(0);
    }

    // Show each subscription
    for (const sub of allSubscriptions) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Subscription ID: ${sub._id}`);
      console.log(`User ID: ${sub.userId}`);
      console.log(`Status: ${sub.status}`);
      console.log(`Tier: ${sub.usageTier}`);
      console.log(`PayU Order ID: ${sub.payuOrderId}`);
      console.log(`Start Date: ${sub.startDate.toISOString()}`);
      console.log(`End Date: ${sub.endDate.toISOString()}`);
      console.log(`Cancelled At: ${sub.cancelledAt ? sub.cancelledAt.toISOString() : 'Not cancelled'}`);
      console.log(`Created At: ${sub.createdAt.toISOString()}`);

      // Check if endDate is in past
      const now = new Date();
      const isPastEndDate = sub.endDate < now;
      console.log(`\n🔍 Analysis:`);
      console.log(`   End date is in past: ${isPastEndDate ? '❌ YES' : '✅ NO'}`);
      if (isPastEndDate) {
        const daysAgo = Math.floor((now.getTime() - sub.endDate.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`   Expired ${daysAgo} days ago`);
      } else {
        const daysLeft = Math.floor((sub.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`   ${daysLeft} days remaining`);
      }

      // Find corresponding user
      const user = await UserModel.findById(sub.userId);
      if (user) {
        console.log(`\n👤 User Info:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Subscription Status: ${user.subscriptionStatus}`);
        console.log(`   Usage Tier: ${user.usageTier}`);
        console.log(`   Subscription End Date: ${user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toISOString() : 'Not set'}`);
      }
    }

    console.log(`\n${'='.repeat(80)}\n`);

    // Test getActiveSubscription for each user
    console.log('\n🔍 Testing getActiveSubscription() for each user:\n');
    const uniqueUserIds = [...new Set(allSubscriptions.map(sub => sub.userId.toString()))];

    for (const userId of uniqueUserIds) {
      const user = await UserModel.findById(userId);
      const activeSub = await SubscriptionModel.getActiveSubscription(userId);

      console.log(`User: ${user?.email || userId}`);
      console.log(`  getActiveSubscription() result: ${activeSub ? `Found (${activeSub.status})` : 'NULL - No active subscription found'}`);
      if (activeSub) {
        console.log(`    Status: ${activeSub.status}`);
        console.log(`    End Date: ${activeSub.endDate.toISOString()}`);
      }
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugSubscriptions();
