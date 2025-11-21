/**
 * Test Client Fetch
 * Verifies that demo clients can be fetched with the mock user ID
 *
 * Run with: npx tsx scripts/testClientFetch.ts
 */

import mongoose from 'mongoose';
import ClientModel from '../src/models/Client';
import connectDB from '../src/backend/config/database';

// Mock user ID - should match mockAuth.ts
const MOCK_USER_ID = '507f1f77bcf86cd799439011';

async function testClientFetch() {
  try {
    console.log('🧪 Testing client fetch with mock user ID...\n');

    // Connect to database
    await connectDB();

    // Convert to ObjectId
    const userId = new mongoose.Types.ObjectId(MOCK_USER_ID);

    // Find clients by user ID (using the static method)
    const clients = await ClientModel.find({ userId }).exec();

    console.log(`✅ Found ${clients.length} clients for user ${MOCK_USER_ID}\n`);

    if (clients.length > 0) {
      clients.forEach((client, index) => {
        console.log(`\n📋 Client ${index + 1}:`);
        console.log(`   Name: ${client.name}`);
        console.log(`   Email: ${client.email || 'N/A'}`);
        console.log(`   Status: ${client.status}`);
        console.log(`   Connected Platforms: ${client.getConnectedPlatforms().join(', ') || 'None'}`);
      });
    } else {
      console.log('⚠️  No clients found. Run scripts/seedDemoClients.ts first.');
    }

    console.log('\n✨ Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing client fetch:', error);
    process.exit(1);
  }
}

// Run the test
testClientFetch();
