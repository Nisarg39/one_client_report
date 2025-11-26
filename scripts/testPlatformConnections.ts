/**
 * Test Platform Connections Script
 *
 * Verifies that OAuth connections can actually fetch real data from platforms
 *
 * Run with: npx tsx --env-file=.env.local scripts/testPlatformConnections.ts
 */

import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { GoogleAnalyticsService } from '@/lib/platforms/google-analytics';
import { GoogleAdsService } from '@/lib/platforms/google-ads';
import { LinkedInAdsService } from '@/lib/platforms/linkedin-ads';
import { MetaAdsService } from '@/lib/platforms/meta-ads';
import mongoose from 'mongoose';

async function testPlatformConnections() {
  console.log('🔍 Testing Platform Connections...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Get all platform connections
    const connections = await PlatformConnectionModel.find({
      status: 'active',
    }).sort({ createdAt: -1 });

    if (connections.length === 0) {
      console.log('❌ No platform connections found');
      process.exit(0);
    }

    console.log(`Found ${connections.length} platform connection(s)\n`);

    // Test each connection
    for (const connection of connections) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing: ${connection.platformName}`);
      console.log(`Platform ID: ${connection.platformId}`);
      console.log(`Client ID: ${connection.clientId}`);
      console.log(`Created: ${connection.createdAt.toLocaleString()}`);
      console.log(`Expires: ${connection.expiresAt.toLocaleString()}`);
      console.log(`${'='.repeat(60)}\n`);

      // Check if token is expired
      if (connection.isExpired()) {
        console.log('⚠️  Token is expired. Skipping...\n');
        continue;
      }

      const credentials = connection.toPlatformCredentials();

      // Test based on platform type
      switch (connection.platformId) {
        case 'google-analytics':
          await testGoogleAnalytics(credentials);
          break;

        case 'google-ads':
          await testGoogleAds(credentials);
          break;

        case 'linkedin-ads':
          await testLinkedInAds(credentials);
          break;

        case 'meta-ads':
          await testMetaAds(credentials);
          break;

        default:
          console.log(`❌ Unknown platform: ${connection.platformId}\n`);
      }
    }

    console.log('\n✅ All tests completed!\n');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

/**
 * Test Google Analytics Connection
 */
async function testGoogleAnalytics(credentials: any) {
  try {
    const service = new GoogleAnalyticsService();

    console.log('🔄 Testing connection...');
    const isConnected = await service.testConnection(credentials);

    if (!isConnected) {
      console.log('❌ Connection test failed\n');
      return;
    }

    console.log('✅ Connection test passed!\n');

    console.log('🔄 Fetching Google Analytics properties...');
    const properties = await service.listProperties(credentials);

    if (properties.length === 0) {
      console.log('⚠️  No properties found. You may not have any GA4 properties set up.\n');
      return;
    }

    console.log(`✅ Found ${properties.length} property/properties:\n`);
    properties.forEach((prop, index) => {
      console.log(`   ${index + 1}. ${prop.name}`);
      console.log(`      Property ID: ${prop.id}\n`);
    });

    console.log('🎉 Google Analytics integration is working!\n');
  } catch (error: any) {
    console.error('❌ Google Analytics test failed:', error.message);
    console.error(error);
  }
}

/**
 * Test Google Ads Connection
 */
async function testGoogleAds(credentials: any) {
  try {
    const service = new GoogleAdsService();

    console.log('🔄 Testing connection...');
    const isConnected = await service.testConnection(credentials);

    if (!isConnected) {
      console.log('❌ Connection test failed\n');
      return;
    }

    console.log('✅ Connection test passed!\n');

    console.log('🔄 Fetching Google Ads customer accounts...');
    const customers = await service.listCustomers(credentials);

    if (customers.length === 0) {
      console.log('⚠️  No customer accounts found. You may not have any Google Ads accounts.\n');
      return;
    }

    console.log(`✅ Found ${customers.length} customer account(s):\n`);
    customers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.name}`);
      console.log(`      Customer ID: ${customer.id}\n`);
    });

    console.log('🎉 Google Ads integration is working!\n');
  } catch (error: any) {
    console.error('❌ Google Ads test failed:', error.message);
    console.error(error);
  }
}

/**
 * Test LinkedIn Ads Connection
 */
async function testLinkedInAds(credentials: any) {
  try {
    const service = new LinkedInAdsService();

    console.log('🔄 Testing connection...');

    // Try to list ad accounts
    try {
      const accounts = await service.listAdAccounts(credentials);

      if (accounts.length === 0) {
        console.log('⚠️  No ad accounts found or accessible.\n');
        console.log('📋 Trying to create a FREE TEST account...\n');

        // Try to create a test account
        try {
          const testAccount = await service.createTestAdAccount(
            credentials,
            'OneReport Test Account'
          );

          console.log('✅ Test account created successfully!\n');
          console.log('   Account Name:', testAccount.name);
          console.log('   Account ID:', testAccount.id);
          console.log('   Status:', testAccount.status);
          console.log('\n💡 This is a TEST account:');
          console.log('   • No billing required');
          console.log('   • Ads never go live');
          console.log('   • Perfect for API testing');
          console.log('   • All creatives auto-rejected (by design)\n');
          console.log('🎉 LinkedIn Ads integration is working with test account!\n');
        } catch (testError: any) {
          console.log('❌ Could not create test account\n');

          // Check if already has a test account (one per app limit)
          if (testError.message?.includes('409') || testError.message?.includes('Conflict')) {
            console.log('📋 You may already have a test account for this app.');
            console.log('   LinkedIn allows only one test account per application.\n');
          } else {
            console.log('Error creating test account:', testError.message);
          }
        }
        return;
      }

      console.log('✅ Connection test passed!\n');
      console.log(`✅ Found ${accounts.length} ad account(s):\n`);

      accounts.forEach((account, index) => {
        console.log(`   ${index + 1}. ${account.name || 'Unnamed Account'}`);
        console.log(`      Account ID: ${account.id}\n`);
      });

      console.log('🎉 LinkedIn Ads integration is working!\n');

    } catch (apiError: any) {
      console.log('❌ Connection test failed\n');

      // Check if it's a 403 error
      if (apiError.message?.includes('403')) {
        console.log('📋 Error: 403 Forbidden - Trying TEST account approach...\n');

        // Try to create a test account instead
        try {
          const testAccount = await service.createTestAdAccount(
            credentials,
            'OneReport Test Account'
          );

          console.log('✅ Test account created successfully!\n');
          console.log('   Account Name:', testAccount.name);
          console.log('   Account ID:', testAccount.id);
          console.log('   Status:', testAccount.status);
          console.log('\n💡 This is a TEST account:');
          console.log('   • No billing required');
          console.log('   • Ads never go live');
          console.log('   • Perfect for API testing\n');
          console.log('🎉 LinkedIn Ads integration is working with test account!\n');
        } catch (testError: any) {
          console.log('❌ Could not create test account either\n');

          if (testError.message?.includes('409')) {
            console.log('📋 You may already have a test account.');
            console.log('   Try listing accounts again after reconnecting.\n');
          } else {
            console.log('Original error:', apiError.message);
            console.log('Test account error:', testError.message);
          }
        }
      } else {
        console.log('Error details:', apiError.message);
        console.log('\nFull error:');
        console.log(apiError);
      }
    }
  } catch (error: any) {
    console.error('❌ LinkedIn Ads test failed:', error.message);
    console.error(error);
  }
}

/**
 * Test Meta Ads Connection
 */
async function testMetaAds(credentials: any) {
  try {
    const service = new MetaAdsService();

    console.log('🔄 Testing connection...');
    const isConnected = await service.testConnection(credentials);

    if (!isConnected) {
      console.log('❌ Connection test failed\n');
      return;
    }

    console.log('✅ Connection test passed!\n');

    console.log('🔄 Fetching Meta Ads account information...');

    try {
      const accounts = await service.listAdAccounts(credentials);

      if (accounts.length === 0) {
        console.log('⚠️  No ad accounts found or accessible.\n');
        console.log('📋 Possible reasons:');
        console.log('   1. No Meta/Facebook ad accounts exist');
        console.log('   2. Missing permissions for ads_management scope');
        console.log('   3. App not approved for Marketing API\n');
        console.log('💡 Solution:');
        console.log('   - Ensure your Facebook App has Marketing API product added');
        console.log('   - Check that you have an active Meta Business account');
        console.log('   - Verify ads_management permission is granted\n');
        return;
      }

      console.log(`✅ Found ${accounts.length} ad account(s):\n`);

      accounts.forEach((account, index) => {
        console.log(`   ${index + 1}. ${account.name}`);
        console.log(`      Account ID: ${account.id}\n`);
      });

      console.log('🎉 Meta Ads integration is working!\n');

    } catch (error: any) {
      console.log('❌ Failed to fetch ad accounts\n');
      console.log('Error details:', error.message);

      if (error.message?.includes('190')) {
        console.log('\n📋 Error 190: Invalid OAuth Token');
        console.log('   The token may be expired or invalid.');
        console.log('   Try disconnecting and reconnecting Meta Ads.\n');
      } else if (error.message?.includes('200')) {
        console.log('\n📋 Error 200: Permissions Error');
        console.log('   Your app needs permission to access this data.');
        console.log('   Ensure ads_management scope is approved.\n');
      }
    }
  } catch (error: any) {
    console.error('❌ Meta Ads test failed:', error.message);
    console.error(error);
  }
}

// Run the script
testPlatformConnections();
