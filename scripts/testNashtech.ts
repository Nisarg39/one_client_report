/**
 * Test nashtech.dev GA property
 */

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
import PlatformConnectionModel from '../src/models/PlatformConnection';
import { GoogleAnalyticsClient } from '../src/lib/platforms/google-analytics/client';

async function test() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const conn = await PlatformConnectionModel.findById('69264c358b13d9e846acae5c');
  if (!conn) {
    console.log('Connection not found');
    await mongoose.disconnect();
    return;
  }

  const accessToken = conn.getDecryptedAccessToken();
  const client = new GoogleAnalyticsClient(accessToken);

  // Test multiple properties to find one with data
  const propertiesToTest = [
    { id: '514269185', name: 'nashtech.dev' },
    { id: '514343587', name: 'one report' },
    { id: '514349154', name: 'One report property' },
    { id: '444859496', name: 'quickservice-b9b00' },
  ];

  for (const prop of propertiesToTest) {
    console.log(`\nTesting ${prop.name} (${prop.id})...`);

    try {
      const response = await client.runReport({
        propertyId: prop.id,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
        ],
      });

      if (response.rows && response.rows.length > 0) {
        const row = response.rows[0];
        const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);
        const users = parseInt(row.metricValues?.[1]?.value || '0', 10);
        const pageviews = parseInt(row.metricValues?.[2]?.value || '0', 10);

        console.log(`   Sessions: ${sessions}, Users: ${users}, Pageviews: ${pageviews}`);

        if (sessions > 0 || users > 0 || pageviews > 0) {
          console.log(`   ✅ HAS DATA!`);
        } else {
          console.log(`   ⚠️  No traffic`);
        }
      } else {
        console.log(`   ⚠️  No historical data`);
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  const propertyId = '514269185';
  console.log('\n--- Detailed test for nashtech.dev ---');

  try {
    const response = await client.runReport({
      propertyId,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'sessions' },
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });

    if (response.rows && response.rows.length > 0) {
      const row = response.rows[0];
      console.log('✅ SUCCESS! Data from nashtech.dev:');
      console.log('   Sessions:', row.metricValues?.[0]?.value);
      console.log('   Users:', row.metricValues?.[1]?.value);
      console.log('   Pageviews:', row.metricValues?.[2]?.value);
      console.log('   Bounce Rate:', (parseFloat(row.metricValues?.[3]?.value || '0') * 100).toFixed(1) + '%');
      console.log('   Avg Duration:', parseFloat(row.metricValues?.[4]?.value || '0').toFixed(1) + 's');
    } else {
      console.log('No data returned');
    }

    // Also fetch top sources
    console.log('\n📊 Top Traffic Sources:');
    const sourcesResponse = await client.runReport({
      propertyId,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionSource' }],
      limit: 5,
    });

    if (sourcesResponse.rows && sourcesResponse.rows.length > 0) {
      sourcesResponse.rows.forEach((r, i) => {
        console.log(`   ${i+1}. ${r.dimensionValues?.[0]?.value}: ${r.metricValues?.[0]?.value} sessions`);
      });
    } else {
      console.log('   No source data');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }

  await mongoose.disconnect();
}

test();
