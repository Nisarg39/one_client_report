/**
 * Check OAuth Users in Database
 *
 * Quick script to verify that users are being saved after OAuth
 */

import { connectDB } from '../src/lib/db';
import UserModel from '../src/models/User';

async function checkOAuthUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected!\n');

    // Find all OAuth users
    const oauthUsers = await UserModel.find({
      provider: { $in: ['google', 'github'] },
    }).sort({ createdAt: -1 });

    console.log(`📊 Found ${oauthUsers.length} OAuth user(s):\n`);

    if (oauthUsers.length === 0) {
      console.log('⚠️  No OAuth users found yet.');
      console.log('💡 Sign in with Google OAuth to create your first user!\n');
      return;
    }

    oauthUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  📧 Email: ${user.email}`);
      console.log(`  👤 Name: ${user.name}`);
      console.log(`  🔐 Provider: ${user.provider}`);
      console.log(`  🆔 Provider ID: ${user.providerId}`);
      console.log(`  🖼️  Image: ${user.image || 'None'}`);
      console.log(`  📅 Created: ${user.createdAt}`);
      console.log(`  📝 Status: ${user.status}`);
      console.log(`  🎭 Role: ${user.role}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkOAuthUsers();
