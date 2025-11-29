/**
 * GA4 API Debugging Script
 *
 * Run this to diagnose Phase 1 implementation issues
 * Usage: npx tsx scripts/debugGA4.ts
 */

// Load env vars
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import PlatformConnectionModel from '../src/models/PlatformConnection';
import { GoogleAnalyticsClient } from '../src/lib/platforms/google-analytics/client';

async function debugGA4() {
  console.log('🔍 GA4 API Debugging Script\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Find a Google Analytics connection
    const connection = await PlatformConnectionModel.findOne({
      platformId: 'google-analytics',
    }).sort({ updatedAt: -1 });

    if (!connection) {
      console.error('❌ No active Google Analytics connection found');
      console.log('\nPlease connect a Google Analytics account at /settings/platforms');
      process.exit(1);
    }

    console.log(`✅ Found connection for user: ${connection.userId}`);

    // Decrypt access token
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error('❌ Failed to decrypt access token');
      process.exit(1);
    }

    console.log('✅ Access token decrypted successfully');

    // Create client
    const client = new GoogleAnalyticsClient(accessToken);
    console.log(`✅ Client created with API version: v1beta`);

    // Test 1: List Properties
    console.log('\n📋 Test 1: Listing properties...');
    try {
      const properties = await client.listProperties();
      console.log(`✅ Found ${properties.length} properties:`);
      properties.forEach((prop, i) => {
        console.log(`   ${i + 1}. ${prop.displayName} (${prop.propertyId})`);
      });

      if (properties.length === 0) {
        console.log('\n❌ No properties found. This is why data is not showing!');
        console.log('   Solution: Ensure your Google Analytics account has properties set up.');
        process.exit(0);
      }

      // Use nashtech.dev property for testing (property #3)
      const testProperty = properties.find(p => p.propertyId === '514269185') || properties[0];
      console.log(`\n🎯 Using property: ${testProperty.displayName} (${testProperty.propertyId})`);

      // Test 2: Single Report (Old Method)
      console.log('\n📊 Test 2: Fetching single report (old method)...');
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Match app's 30-day default

      const formatDate = (d: Date) => d.toISOString().split('T')[0];
      const dateRanges = [
        { startDate: formatDate(startDate), endDate: formatDate(endDate) },
      ];

      try {
        const singleReport = await client.runReport({
          propertyId: testProperty.propertyId,
          dateRanges,
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
          ],
        });

        console.log('✅ Single report successful:');
        console.log(`   Rows returned: ${singleReport.rows?.length || 0}`);
        if (singleReport.rows?.[0]) {
          console.log(`   Sessions: ${singleReport.rows[0].metricValues?.[0]?.value || 0}`);
          console.log(`   Active Users: ${singleReport.rows[0].metricValues?.[1]?.value || 0}`);
        }
      } catch (error: any) {
        console.error('❌ Single report failed:', error.message);
        console.log('\nThis suggests the v1 API upgrade might have issues.');
      }

      // Test 3: Batch Report (New Method - respecting 5 request limit)
      console.log('\n📦 Test 3: Fetching batch reports (new method)...');
      try {
        // Note: GA4 API limits batch requests to 5 per call
        const batchReports = await client.batchRunReports(testProperty.propertyId, [
          // Report 0: Basic metrics
          {
            dateRanges,
            metrics: [
              { name: 'sessions' },
              { name: 'totalUsers' },
              { name: 'newUsers' },
            ],
          },
          // Report 1: Sources
          {
            dateRanges,
            metrics: [{ name: 'sessions' }],
            dimensions: [{ name: 'sessionSource' }],
            limit: 5,
          },
          // Report 2: Devices & Browsers
          {
            dateRanges,
            metrics: [{ name: 'sessions' }],
            dimensions: [{ name: 'deviceCategory' }, { name: 'browser' }],
          },
        ]);

        console.log(`✅ Batch report successful: ${batchReports.length} reports returned`);

        // Validate Report 0
        if (batchReports[0]) {
          console.log('\n   Report 0 (Metrics):');
          console.log(`   - Rows: ${batchReports[0].rows?.length || 0}`);
          if (batchReports[0].rows?.[0]) {
            const row = batchReports[0].rows[0];
            const sessions = row.metricValues?.[0]?.value || '0';
            const totalUsers = parseInt(row.metricValues?.[1]?.value || '0', 10);
            const newUsers = parseInt(row.metricValues?.[2]?.value || '0', 10);
            const returningUsers = Math.max(0, totalUsers - newUsers);

            console.log(`   - Sessions: ${sessions}`);
            console.log(`   - Total Users: ${totalUsers}`);
            console.log(`   - New Users: ${newUsers}`);
            console.log(`   - Returning Users (calculated): ${returningUsers}`);
          } else {
            console.log('   ⚠️  No data rows returned - property might have no traffic');
          }
        }

        // Validate Report 1
        if (batchReports[1]) {
          console.log('\n   Report 1 (Sources):');
          console.log(`   - Rows: ${batchReports[1].rows?.length || 0}`);
          if (batchReports[1].rows && batchReports[1].rows.length > 0) {
            console.log(`   - Top source: ${batchReports[1].rows[0].dimensionValues?.[0]?.value || 'N/A'}`);
          }
        }

        // Validate Report 2
        if (batchReports[2]) {
          console.log('\n   Report 2 (Devices & Browsers):');
          console.log(`   - Rows: ${batchReports[2].rows?.length || 0}`);
          if (batchReports[2].rows && batchReports[2].rows.length > 0) {
            const firstRow = batchReports[2].rows[0];
            console.log(`   - Device: ${firstRow.dimensionValues?.[0]?.value || 'N/A'}`);
            console.log(`   - Browser: ${firstRow.dimensionValues?.[1]?.value || 'N/A'}`);
            console.log(`   - Sessions: ${firstRow.metricValues?.[0]?.value || 'N/A'}`);
          }
        }

      } catch (error: any) {
        console.error('❌ Batch report failed:', error.message);
        console.log('\n🔍 Full error details:');
        console.error(error);

        if (error.message.includes('400')) {
          console.log('\n💡 Suggestion: The batch API request format might be incorrect.');
          console.log('   Check if the v1 API expects different parameters.');
        } else if (error.message.includes('403')) {
          console.log('\n💡 Suggestion: Permission issue. Try reconnecting Google Analytics.');
        } else if (error.message.includes('404')) {
          console.log('\n💡 Suggestion: Property not found. Verify property ID.');
        }
      }

      // Test 4: Real-time Report
      console.log('\n⚡ Test 4: Fetching real-time report...');
      try {
        const realtimeData = await client.runRealtimeReport(testProperty.propertyId);
        console.log('✅ Real-time report successful:');
        console.log(`   Active Users: ${realtimeData.activeUsers}`);
        if (realtimeData.activeUsersByDevice) {
          console.log(`   By Device: ${JSON.stringify(realtimeData.activeUsersByDevice)}`);
        }
      } catch (error: any) {
        console.error('❌ Real-time report failed:', error.message);
      }

      console.log('\n✅ Debugging complete!');

    } catch (error: any) {
      console.error('❌ Error during testing:', error.message);
      console.error(error);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    process.exit(0);
  }
}

debugGA4();
