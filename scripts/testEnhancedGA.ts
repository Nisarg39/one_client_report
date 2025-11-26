/**
 * Test Enhanced Google Analytics Integration
 *
 * Tests the new comprehensive data fetching including:
 * - Real-time active users
 * - Enhanced metrics (engagement, new users, events)
 * - Device breakdown
 * - Top pages
 * - Geographic data
 * - Daily trends
 */

import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
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
import PlatformConnectionModel from '../src/models/PlatformConnection';
import { fetchAllGoogleAnalyticsProperties } from '../src/lib/platforms/googleAnalytics/fetchData';

async function testEnhancedGA() {
  console.log('🔍 Testing Enhanced Google Analytics Integration\n');
  console.log('='.repeat(60));

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    // Find an active GA connection
    const connection = await PlatformConnectionModel.findOne({
      platformId: 'google-analytics',
      status: 'active',
    });

    if (!connection) {
      console.log('❌ No active Google Analytics connection found');
      await mongoose.disconnect();
      return;
    }

    console.log(`📊 Found GA connection for client: ${connection.clientId}`);
    console.log(`   Property in metadata: ${connection.metadata?.propertyName || 'Auto-select'}\n`);

    // Test the enhanced fetch function
    console.log('🚀 Fetching comprehensive GA data...\n');
    const startTime = Date.now();

    const data = await fetchAllGoogleAnalyticsProperties(connection);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Fetch completed in ${duration}s\n`);

    if (!data) {
      console.log('❌ No data returned');
      await mongoose.disconnect();
      return;
    }

    console.log('='.repeat(60));
    console.log(`📅 Date Range: ${data.dateRange}`);
    console.log(`📁 Properties Found: ${data.properties.length}`);
    console.log('='.repeat(60));

    // Display data for each property
    for (const prop of data.properties) {
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`🏠 ${prop.propertyName} (ID: ${prop.propertyId})`);
      console.log(`${'─'.repeat(60)}`);

      // Real-time data
      if (prop.realtime) {
        console.log(`\n🟢 REAL-TIME:`);
        console.log(`   Active Users NOW: ${prop.realtime.activeUsers}`);
        if (prop.realtime.byDevice && prop.realtime.byDevice.length > 0) {
          console.log('   By Device:');
          prop.realtime.byDevice.forEach(d => {
            console.log(`     - ${d.device}: ${d.users} users`);
          });
        }
      } else {
        console.log(`\n⚪ Real-time: Not available for this property`);
      }

      // Core metrics
      console.log(`\n📊 CORE METRICS (Last 30 Days):`);
      console.log(`   Sessions: ${prop.metrics.sessions.toLocaleString()}`);
      console.log(`   Users: ${prop.metrics.users.toLocaleString()} (${prop.metrics.newUsers.toLocaleString()} new)`);
      console.log(`   Pageviews: ${prop.metrics.pageviews.toLocaleString()}`);
      console.log(`   Events: ${prop.metrics.eventCount.toLocaleString()}`);

      // Engagement metrics
      console.log(`\n📈 ENGAGEMENT:`);
      console.log(`   Engagement Rate: ${(prop.metrics.engagementRate * 100).toFixed(1)}%`);
      console.log(`   Bounce Rate: ${(prop.metrics.bounceRate * 100).toFixed(1)}%`);
      console.log(`   Avg Session Duration: ${Math.round(prop.metrics.avgSessionDuration)}s`);
      console.log(`   Sessions per User: ${prop.metrics.sessionsPerUser.toFixed(2)}`);

      // Traffic sources
      if (prop.dimensions.topSources.length > 0) {
        console.log(`\n🔗 TOP TRAFFIC SOURCES:`);
        prop.dimensions.topSources.forEach((s, i) => {
          console.log(`   ${i + 1}. ${s.source}: ${s.sessions.toLocaleString()} sessions, ${s.users.toLocaleString()} users`);
        });
      }

      // Device breakdown
      if (prop.dimensions.devices.length > 0) {
        console.log(`\n📱 DEVICE BREAKDOWN:`);
        prop.dimensions.devices.forEach(d => {
          console.log(`   ${d.device}: ${d.percentage}% (${d.sessions.toLocaleString()} sessions)`);
        });
      }

      // Top pages
      if (prop.dimensions.topPages.length > 0) {
        console.log(`\n📄 TOP PAGES:`);
        prop.dimensions.topPages.forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.page}: ${p.views.toLocaleString()} views`);
        });
      }

      // Geographic data
      if (prop.dimensions.countries.length > 0) {
        console.log(`\n🌍 TOP COUNTRIES:`);
        prop.dimensions.countries.forEach((c, i) => {
          console.log(`   ${i + 1}. ${c.country}: ${c.users.toLocaleString()} users`);
        });
      }

      // Daily trends
      if (prop.dimensions.daily.length > 0) {
        console.log(`\n📅 LAST 7 DAYS TREND:`);
        prop.dimensions.daily.forEach(d => {
          const dateFormatted = `${d.date.substring(4, 6)}/${d.date.substring(6, 8)}`;
          console.log(`   ${dateFormatted}: ${d.sessions} sessions, ${d.users} users, ${d.pageviews} pageviews`);
        });
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Enhanced GA Integration Test Complete!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📤 Disconnected from MongoDB');
  }
}

testEnhancedGA();
