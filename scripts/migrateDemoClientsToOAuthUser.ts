/**
 * Migrate Demo Clients to OAuth User
 *
 * This script transfers demo clients from the mock user ID
 * to your real OAuth user ID after signing in
 */

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import ClientModel from '../src/models/Client';
import ConversationModel from '../src/models/Conversation';
import UserModel from '../src/models/User';

const MOCK_USER_ID = '507f1f77bcf86cd799439011';

async function migrateDemoClients() {
  try {
    console.log('🔄 Migrating demo clients to OAuth user...\n');

    await connectDB();

    // Step 1: Find your OAuth user (most recent one)
    console.log('1️⃣  Finding OAuth user...');
    const oauthUser = await UserModel.findOne({
      provider: { $in: ['google', 'github'] },
    }).sort({ createdAt: -1 });

    if (!oauthUser) {
      console.error('❌ No OAuth user found!');
      console.log('💡 Please sign in with Google OAuth first, then run this script.');
      process.exit(1);
    }

    console.log(`✅ Found OAuth user: ${oauthUser.email}`);
    console.log(`   User ID: ${oauthUser._id}\n`);

    // Step 2: Find demo clients
    console.log('2️⃣  Finding demo clients...');
    const demoClients = await ClientModel.find({
      userId: new mongoose.Types.ObjectId(MOCK_USER_ID),
    });

    if (demoClients.length === 0) {
      console.log('⚠️  No demo clients found to migrate.');
      console.log('💡 Run: npx tsx scripts/seedDemoClients.ts first');
      process.exit(0);
    }

    console.log(`✅ Found ${demoClients.length} demo client(s)\n`);

    // Step 3: Update client ownership
    console.log('3️⃣  Updating client ownership...');
    const clientResult = await ClientModel.updateMany(
      { userId: new mongoose.Types.ObjectId(MOCK_USER_ID) },
      { $set: { userId: oauthUser._id } }
    );

    console.log(`✅ Updated ${clientResult.modifiedCount} client(s)\n`);

    // Step 4: Update conversation ownership
    console.log('4️⃣  Updating conversation ownership...');
    const conversationResult = await ConversationModel.updateMany(
      { userId: MOCK_USER_ID },
      { $set: { userId: oauthUser._id.toString() } }
    );

    console.log(`✅ Updated ${conversationResult.modifiedCount} conversation(s)\n`);

    // Step 5: Summary
    console.log('🎉 Migration complete!\n');
    console.log('📊 Summary:');
    console.log(`   • Clients migrated: ${clientResult.modifiedCount}`);
    console.log(`   • Conversations migrated: ${conversationResult.modifiedCount}`);
    console.log(`   • New owner: ${oauthUser.email} (${oauthUser._id})`);
    console.log('\n💡 Now visit /chat to see your migrated clients!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateDemoClients();
