/**
 * Debug Google Analytics Connection
 *
 * Run with: npx tsx scripts/debugGAConnection.ts
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

async function debugGAConnection() {
  try {
    console.log('🔍 Debugging Google Analytics Connection...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Find all GA connections
    const gaConnections = await PlatformConnectionModel.find({
      platformId: 'google-analytics',
    });

    console.log(`Found ${gaConnections.length} Google Analytics connection(s)\n`);

    for (const conn of gaConnections) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Connection ID: ${conn._id}`);
      console.log(`Client ID: ${conn.clientId}`);
      console.log(`Status: ${conn.status}`);
      console.log(`Expires At: ${conn.expiresAt}`);
      console.log(`Is Expired: ${conn.isExpired()}`);
      console.log(`Metadata:`, conn.metadata);
      console.log('');

      // Check if token is expired
      if (conn.isExpired()) {
        console.log('⚠️  ACCESS TOKEN IS EXPIRED - Needs refresh');
        console.log('');

        // Check if we have a refresh token
        const refreshToken = conn.getDecryptedRefreshToken();
        if (refreshToken) {
          console.log('✅ Refresh token is available');
          console.log('   Attempting to refresh...');

          // Try to refresh
          try {
            const { GoogleAnalyticsService } = await import('../src/lib/platforms/google-analytics');
            const service = new GoogleAnalyticsService();
            const newCredentials = await service.refreshAccessToken(refreshToken);

            console.log('✅ Token refreshed successfully!');
            console.log(`   New expiry: ${newCredentials.expiresAt}`);

            // Update the connection
            await (PlatformConnectionModel as any).updateTokens(
              (conn._id as any).toString(),
              newCredentials.accessToken,
              newCredentials.refreshToken,
              new Date(newCredentials.expiresAt)
            );
            console.log('✅ Connection updated with new tokens');

            // Re-fetch to test
            const accessToken = newCredentials.accessToken;
            const client = new GoogleAnalyticsClient(accessToken);

            console.log('\n📊 Testing API access...');
            const properties = await client.listProperties();
            console.log(`✅ Found ${properties.length} GA properties:`);
            properties.forEach(p => {
              console.log(`   - ${p.displayName} (${p.propertyId})`);
            });
          } catch (refreshError) {
            console.error('❌ Failed to refresh token:', refreshError);
          }
        } else {
          console.log('❌ No refresh token available - User needs to reconnect');
        }
      } else {
        // Token not expired, test the connection
        console.log('✅ Access token is valid');
        console.log('');

        try {
          const accessToken = conn.getDecryptedAccessToken();
          const client = new GoogleAnalyticsClient(accessToken);

          console.log('📊 Testing API access...');
          const properties = await client.listProperties();
          console.log(`✅ Found ${properties.length} GA properties:`);
          properties.forEach(p => {
            console.log(`   - ${p.displayName} (${p.propertyId})`);
          });

          // If we have a property, test fetching data
          const propertyId = conn.metadata?.propertyId || properties[0]?.propertyId;
          if (propertyId) {
            console.log(`\n📈 Testing data fetch for property: ${propertyId}`);

            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            const formatDate = (d: Date) => d.toISOString().split('T')[0];

            const response = await client.runReport({
              propertyId,
              dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
              metrics: [
                { name: 'sessions' },
                { name: 'activeUsers' },
              ],
            });

            console.log('✅ Data fetched successfully!');
            console.log('   Response:', JSON.stringify(response, null, 2));
          }
        } catch (apiError) {
          console.error('❌ API Error:', apiError);
        }
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugGAConnection();
