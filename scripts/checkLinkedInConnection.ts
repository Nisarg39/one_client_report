/**
 * Quick LinkedIn Connection Checker
 * Run: npx tsx scripts/checkLinkedInConnection.ts
 */

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import PlatformConnectionModel from '../src/models/PlatformConnection';

async function checkConnection() {
  console.log('\n🔍 Checking LinkedIn Ads Connection...\n');

  try {
    await connectDB();

    const connection = await PlatformConnectionModel.findOne({
      platformId: 'linkedin-ads',
      status: 'active',
    }).sort({ createdAt: -1 });

    if (!connection) {
      console.log('❌ No active LinkedIn Ads connection found');
      console.log('\n📝 Action: Connect LinkedIn Ads in your app settings\n');
      await mongoose.disconnect();
      return;
    }

    console.log('✅ Connection found:');
    console.log('   ID:', connection._id);
    console.log('   Status:', connection.status);
    console.log('   Platform:', connection.platformId);
    console.log('   Created:', connection.createdAt);
    console.log('   Expires:', connection.expiresAt);
    console.log('   Is Expired:', connection.isExpired());
    console.log('   Scopes:', connection.scopes);
    console.log('   Metadata:', connection.metadata);

    const now = new Date();
    const expiryDate = new Date(connection.expiresAt);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    console.log('\n⏰ Token Status:');
    if (connection.isExpired()) {
      console.log('   ❌ EXPIRED - needs reconnection');
    } else {
      console.log(`   ✅ Valid for ${daysUntilExpiry} more days`);
    }

    console.log('\n🔐 Required Scopes Check:');
    const requiredScopes = ['r_ads', 'r_ads_reporting'];
    const hasAllScopes = requiredScopes.every(scope => connection.scopes?.includes(scope));

    if (hasAllScopes) {
      console.log('   ✅ All required scopes present');
    } else {
      console.log('   ❌ Missing required scopes');
      const missing = requiredScopes.filter(s => !connection.scopes?.includes(s));
      console.log('   Missing:', missing.join(', '));
    }

    // Check if token was created before or after the fix
    const fixDate = new Date('2024-12-04'); // Today when we applied the fix
    const tokenCreatedBeforeFix = new Date(connection.createdAt) < fixDate;

    console.log('\n🔧 API Version Compatibility:');
    if (tokenCreatedBeforeFix) {
      console.log('   ⚠️  WARNING: This token was created BEFORE the API version fix');
      console.log('   ⚠️  The token may have been issued with invalid API version "202511"');
      console.log('   ⚠️  RECOMMENDED: Disconnect and reconnect LinkedIn Ads to get a fresh token');
    } else {
      console.log('   ✅ Token created after API version fix');
    }

    console.log('\n📋 Summary:');
    if (connection.isExpired()) {
      console.log('   🔴 Action Required: Reconnect LinkedIn Ads (token expired)');
    } else if (!hasAllScopes) {
      console.log('   🔴 Action Required: Reconnect LinkedIn Ads (missing scopes)');
    } else if (tokenCreatedBeforeFix) {
      console.log('   🟡 Recommended: Reconnect LinkedIn Ads (token may be from old API version)');
      console.log('      This will ensure the token works with the fixed API version "202411"');
    } else {
      console.log('   🟢 Connection looks good - if still no data, check ad account permissions');
    }

    console.log('\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkConnection().catch(console.error);
