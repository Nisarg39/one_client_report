/**
 * Hybrid Mode Testing Script
 *
 * This script helps test the hybrid mode implementation by:
 * 1. Checking existing user account types
 * 2. Creating an education test user
 * 3. Creating a mock client for the education user
 * 4. Verifying the setup
 */

import { connectDB } from '../src/lib/db';
import UserModel from '../src/models/User';
import ClientModel from '../src/models/Client';
import mongoose from 'mongoose';

async function testHybridMode() {
  console.log('🧪 Hybrid Mode Testing Script\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // ===== PART 1: Check existing users =====
    console.log('📊 Part 1: Checking existing users...');
    const allUsers = await UserModel.find({});
    console.log(`Total users: ${allUsers.length}\n`);

    allUsers.forEach((user) => {
      console.log(`User: ${user.email}`);
      console.log(`  - Account Type: ${user.accountType}`);
      console.log(`  - Usage Tier: ${user.usageTier}`);
      console.log(`  - Allow Real APIs: ${user.restrictions?.allowRealAPIs}`);
      console.log('');
    });

    // ===== PART 2: Check existing clients =====
    console.log('📊 Part 2: Checking existing clients...');
    const allClients = await ClientModel.find({});
    console.log(`Total clients: ${allClients.length}\n`);

    allClients.forEach((client: any) => {
      console.log(`Client: ${client.name}`);
      console.log(`  - Data Source: ${client.dataSource}`);
      console.log(`  - User ID: ${client.userId}`);
      console.log('');
    });

    // ===== PART 3: Create education test user (if doesn't exist) =====
    console.log('🎓 Part 3: Creating education test user...');

    const testEmail = 'student@test.edu';
    let educationUser = await UserModel.findOne({ email: testEmail });

    if (educationUser) {
      console.log(`⚠️  Education user already exists: ${testEmail}`);
      console.log(`  - Account Type: ${educationUser.accountType}`);
      console.log(`  - User ID: ${educationUser._id}\n`);
    } else {
      educationUser = await UserModel.create({
        email: testEmail,
        name: 'Test Student',
        provider: 'google',
        providerId: 'test-student-123',
        accountType: 'education',
        usageTier: 'student',
        restrictions: {
          maxClients: 5,
          maxMessagesPerDay: 50,
          maxConversations: 10,
          allowRealAPIs: false,
          allowedAgents: [],
          aiModel: 'gpt-3.5-turbo',
        },
        educationMetadata: {
          institution: 'Test University',
          studentId: 'STU-001',
        },
      });

      console.log(`✅ Created education user: ${testEmail}`);
      console.log(`  - User ID: ${educationUser._id}`);
      console.log(`  - Account Type: ${educationUser.accountType}`);
      console.log(`  - Allow Real APIs: ${educationUser.restrictions?.allowRealAPIs}\n`);
    }

    // ===== PART 4: Create mock client for education user =====
    console.log('🎓 Part 4: Creating mock client for education user...');

    const mockClientName = 'E-commerce Case Study (Mock)';
    let mockClient = await ClientModel.findOne({
      userId: educationUser._id,
      name: mockClientName,
    });

    if (mockClient) {
      console.log(`⚠️  Mock client already exists: ${mockClientName}`);
      console.log(`  - Client ID: ${mockClient._id}`);
      console.log(`  - Data Source: ${mockClient.dataSource}\n`);
    } else {
      mockClient = await ClientModel.create({
        userId: educationUser._id,
        name: mockClientName,
        email: 'case-study@ecommerce.test',
        dataSource: 'mock',
        status: 'active',
        platforms: {
          googleAnalytics: {
            connected: true,
            status: 'active',
          },
        },
        educationMetadata: {
          caseStudyName: 'E-commerce Basics: High Bounce Rate Mystery',
          difficulty: 'beginner',
          learningObjectives: [
            'Identify high bounce rate patterns',
            'Analyze traffic by device type',
            'Understand mobile optimization impact',
          ],
        },
      });

      console.log(`✅ Created mock client: ${mockClientName}`);
      console.log(`  - Client ID: ${mockClient._id}`);
      console.log(`  - Data Source: ${mockClient.dataSource}`);
      console.log(`  - Difficulty: ${mockClient.educationMetadata?.difficulty}\n`);
    }

    // ===== PART 5: Create instructor test user (if doesn't exist) =====
    console.log('👨‍🏫 Part 5: Creating instructor test user...');

    const instructorEmail = 'instructor@test.edu';
    let instructorUser = await UserModel.findOne({ email: instructorEmail });

    if (instructorUser) {
      console.log(`⚠️  Instructor user already exists: ${instructorEmail}`);
      console.log(`  - Account Type: ${instructorUser.accountType}`);
      console.log(`  - User ID: ${instructorUser._id}\n`);
    } else {
      instructorUser = await UserModel.create({
        email: instructorEmail,
        name: 'Test Instructor',
        provider: 'google',
        providerId: 'test-instructor-123',
        accountType: 'instructor',
        usageTier: 'pro',
        restrictions: {
          maxClients: 999,
          maxMessagesPerDay: 1000,
          maxConversations: 999,
          allowRealAPIs: false,
          allowedAgents: [],
          aiModel: 'gpt-4-turbo',
        },
        educationMetadata: {
          institution: 'Test University',
        },
      });

      console.log(`✅ Created instructor user: ${instructorEmail}`);
      console.log(`  - User ID: ${instructorUser._id}`);
      console.log(`  - Account Type: ${instructorUser.accountType}`);
      console.log(`  - Allow Real APIs: ${instructorUser.restrictions?.allowRealAPIs}\n`);
    }

    // ===== PART 6: Summary =====
    console.log('📋 Summary:');
    console.log('─────────────────────────────────────────────');
    console.log(`Total Users: ${allUsers.length + (educationUser && !allUsers.find(u => u.email === testEmail) ? 1 : 0) + (instructorUser && !allUsers.find(u => u.email === instructorEmail) ? 1 : 0)}`);
    console.log(`  - Business: ${allUsers.filter(u => u.accountType === 'business').length}`);
    console.log(`  - Education: ${allUsers.filter(u => u.accountType === 'education').length + (educationUser && !allUsers.find(u => u.email === testEmail) ? 1 : 0)}`);
    console.log(`  - Instructor: ${allUsers.filter(u => u.accountType === 'instructor').length + (instructorUser && !allUsers.find(u => u.email === instructorEmail) ? 1 : 0)}`);
    console.log('');
    console.log(`Total Clients: ${allClients.length + (mockClient && !allClients.find((c: any) => c.name === mockClientName) ? 1 : 0)}`);
    console.log(`  - Real Data: ${allClients.filter((c: any) => c.dataSource === 'real').length}`);
    console.log(`  - Mock Data: ${allClients.filter((c: any) => c.dataSource === 'mock').length + (mockClient && !allClients.find((c: any) => c.name === mockClientName) ? 1 : 0)}`);
    console.log('');

    console.log('🎉 Test setup complete!');
    console.log('─────────────────────────────────────────────\n');

    console.log('📝 Next steps for manual testing:');
    console.log('1. Log in as your existing business user');
    console.log('   → Should see real API data');
    console.log('   → Should get Growth Strategist persona');
    console.log('');
    console.log('2. Log in as student@test.edu (education user)');
    console.log('   → Select "E-commerce Case Study (Mock)" client');
    console.log('   → Should see mock scenario data');
    console.log('   → Should get Data Mentor persona');
    console.log('');
    console.log('3. Test agent routing by asking:');
    console.log('   → "How is my traffic doing?" (Traffic Intelligence)');
    console.log('   → "Analyze my ad performance" (Ad Performance)');
    console.log('   → "How should I optimize my budget?" (Budget Optimization)');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
}

// Run the test
testHybridMode();
