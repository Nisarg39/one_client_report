/**
 * Test getClients Server Action
 * Run: npx tsx scripts/testGetClients.ts
 */

import UserModel from '../src/models/User';
import ClientModel from '../src/models/Client';
import { connectDB } from '../src/lib/db';

async function testGetClients() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected!\n');

    // Get the user
    const user = await UserModel.findOne({ email: 'shah.nisarg39@gmail.com' });

    if (!user) {
      console.error('❌ User not found!');
      process.exit(1);
    }

    console.log(`👤 Testing with user: ${user.email}`);
    console.log(`   User ID: ${user._id}\n`);

    // Test the same logic as getClients Server Action
    console.log('🔍 Running ClientModel.findByUserId()...');
    const clients = await ClientModel.findByUserId(user._id.toString());
    console.log(`✅ Found ${clients.length} client(s)\n`);

    // Test mapping logic
    console.log('🔄 Testing mapping logic...');
    const mappedClients = clients.map((client) => {
      console.log(`\n  Processing client: ${client.name}`);

      // Convert Mongoose document to plain object
      const plainClient = client.toObject();
      console.log(`    ✓ Converted to plain object`);

      // Serialize platforms
      const serializedPlatforms = plainClient.platforms
        ? JSON.parse(JSON.stringify(plainClient.platforms))
        : {};
      console.log(`    ✓ Serialized platforms:`, Object.keys(serializedPlatforms));

      // Get connected platforms
      const connectedPlatforms = client.getConnectedPlatforms();
      console.log(`    ✓ Connected platforms:`, connectedPlatforms);

      return {
        id: String(client._id),
        userId: client.userId.toString(),
        name: client.name,
        email: client.email,
        logo: client.logo,
        status: client.status,
        platforms: serializedPlatforms,
        connectedPlatforms: connectedPlatforms,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
      };
    });

    console.log(`\n✅ Successfully mapped ${mappedClients.length} client(s)`);
    console.log('\nMapped data:');
    console.log(JSON.stringify(mappedClients, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error occurred:', error);
    console.error('\nStack trace:', (error as Error).stack);
    process.exit(1);
  }
}

testGetClients();
