/**
 * Debug Script - Check Database Contents
 * Run: npx tsx scripts/debugDatabase.ts
 */

import mongoose from 'mongoose';
import UserModel from '../src/models/User';
import ClientModel from '../src/models/Client';
import OnboardingProgressModel from '../src/models/OnboardingProgress';
import { connectDB } from '../src/lib/db';

async function debugDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected!\n');

    // Check Users
    console.log('👤 USERS:');
    console.log('━'.repeat(60));
    const users = await UserModel.find({}).lean();
    console.log(`Found ${users.length} user(s)\n`);

    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Provider: ${user.provider}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log('');
    });

    // Check Clients
    console.log('🏢 CLIENTS:');
    console.log('━'.repeat(60));
    const clients = await ClientModel.find({}).lean();
    console.log(`Found ${clients.length} client(s)\n`);

    clients.forEach((client, index) => {
      console.log(`Client ${index + 1}:`);
      console.log(`  ID: ${client._id}`);
      console.log(`  Name: ${client.name}`);
      console.log(`  User ID: ${client.userId}`);
      console.log(`  Status: ${client.status}`);
      console.log('');
    });

    // Check Onboarding Progress
    console.log('📋 ONBOARDING PROGRESS:');
    console.log('━'.repeat(60));
    const progress = await OnboardingProgressModel.find({}).lean();
    console.log(`Found ${progress.length} onboarding record(s)\n`);

    progress.forEach((prog, index) => {
      console.log(`Progress ${index + 1}:`);
      console.log(`  User ID: ${prog.userId}`);
      console.log(`  Completed: ${prog.completed}`);
      console.log(`  Current Step: ${prog.currentStep}`);
      console.log('');
    });

    // Test findByUserId for each user
    if (users.length > 0) {
      console.log('🔍 TESTING ClientModel.findByUserId():');
      console.log('━'.repeat(60));

      for (const user of users) {
        console.log(`\nTesting with userId: ${user._id} (${user.email})`);
        try {
          const userClients = await ClientModel.findByUserId(user._id.toString());
          console.log(`  ✅ Found ${userClients.length} client(s)`);
          userClients.forEach((c: any) => {
            console.log(`     - ${c.name} (${c._id})`);
          });
        } catch (error) {
          console.error(`  ❌ Error:`, error);
        }
      }
    }

    console.log('\n✅ Debug complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugDatabase();
