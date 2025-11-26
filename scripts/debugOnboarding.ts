/**
 * Debug script to check platform connections in the database
 * Run with: npx tsx --env-file=.env.local scripts/debugOnboarding.ts
 */

import { connectDB } from '../src/lib/db';
import PlatformConnectionModel from '../src/models/PlatformConnection';
import ClientModel from '../src/models/Client';

async function debug() {
  console.log('🔍 Debugging Platform Connections...\n');

  await connectDB();

  // Get all clients
  const clients = await ClientModel.find({}).lean();
  console.log(`📋 Found ${clients.length} client(s):\n`);

  clients.forEach((client: any, index: number) => {
    console.log(`  ${index + 1}. Client Name: ${client.name}`);
    console.log(`     Client ID: ${client._id}`);
    console.log(`     User ID: ${client.userId}`);
    console.log(`     Status: ${client.status}\n`);
  });

  // Get all platform connections
  const connections = await PlatformConnectionModel.find({}).lean();
  console.log(`\n🔌 Found ${connections.length} platform connection(s):\n`);

  connections.forEach((conn: any, index: number) => {
    console.log(`  ${index + 1}. Platform: ${conn.platformName} (${conn.platformId})`);
    console.log(`     Connection ID: ${conn._id}`);
    console.log(`     Client ID: ${conn.clientId}`);
    console.log(`     User ID: ${conn.userId}`);
    console.log(`     Status: ${conn.status}`);
    console.log(`     Created: ${conn.createdAt}\n`);
  });

  // Check if client IDs match
  console.log('\n🔗 Checking Client-Connection Mapping:\n');

  for (const conn of connections) {
    const matchingClient = clients.find(
      (c: any) => c._id.toString() === conn.clientId
    );

    if (matchingClient) {
      console.log(`  ✅ Connection ${conn.platformId} -> Client "${(matchingClient as any).name}"`);
    } else {
      console.log(`  ❌ Connection ${conn.platformId} has clientId "${conn.clientId}" but NO MATCHING CLIENT found!`);
      console.log(`     Available client IDs: ${clients.map((c: any) => c._id.toString()).join(', ')}`);
    }
  }

  console.log('\n✅ Debug complete!\n');
  process.exit(0);
}

debug().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
