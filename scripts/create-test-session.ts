/**
 * Create Test Session for Education User
 *
 * This script creates a test session token for the education user
 * so you can test education mode without going through OAuth
 */

import { connectDB } from '../src/lib/db';
import UserModel from '../src/models/User';
import ClientModel from '../src/models/Client';

async function createTestSession() {
  console.log('🔐 Creating test session for education user...\n');

  try {
    await connectDB();

    const educationUser = await UserModel.findOne({ email: 'student@test.edu' });
    if (!educationUser) {
      console.error('❌ Education user not found. Run test-hybrid-mode.ts first.');
      process.exit(1);
    }

    const mockClient = await ClientModel.findOne({
      userId: educationUser._id,
      name: 'E-commerce Case Study (Mock)',
    });

    if (!mockClient) {
      console.error('❌ Mock client not found. Run test-hybrid-mode.ts first.');
      process.exit(1);
    }

    console.log('✅ Test Users Available:\n');
    console.log('📧 Education User: student@test.edu');
    console.log(`   User ID: ${educationUser._id}`);
    console.log(`   Account Type: ${educationUser.accountType}`);
    console.log(`   Allow Real APIs: ${educationUser.restrictions?.allowRealAPIs}\n`);

    console.log('📁 Mock Client: E-commerce Case Study (Mock)');
    console.log(`   Client ID: ${mockClient._id}`);
    console.log(`   Data Source: ${mockClient.dataSource}`);
    console.log(`   Difficulty: ${mockClient.educationMetadata?.difficulty}\n`);

    console.log('📝 To test education mode:');
    console.log('1. Open your database GUI (MongoDB Compass/Studio 3T)');
    console.log('2. Find the "sessions" collection');
    console.log('3. Create a new session document with:');
    console.log('   {');
    console.log('     "sessionToken": "test-education-session",');
    console.log(`     "userId": "${educationUser._id}",`);
    console.log('     "expires": new Date("2025-12-31")');
    console.log('   }\n');
    console.log('4. In your browser console, run:');
    console.log('   document.cookie = "next-auth.session-token=test-education-session; path=/; max-age=31536000"\n');
    console.log('5. Refresh the page and select the mock client\n');

    console.log('⚠️  Alternative: Use the browser to sign in as student@test.edu');
    console.log('   (If you have OAuth configured for test users)\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createTestSession();
