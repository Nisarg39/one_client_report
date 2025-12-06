/**
 * Migration Script: Add Account Types and Hybrid Mode Support
 *
 * This migration adds account type, usage tier, and restrictions to existing users
 * and adds dataSource to existing clients.
 *
 * Run: npx tsx scripts/migrations/add-account-types.ts
 */

import { connectDB } from '../../src/lib/db';
import UserModel from '../../src/models/User';
import ClientModel from '../../src/models/Client';

async function migrate() {
  console.log('🚀 Starting migration: add-account-types...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // ===== PART 1: Update User Model =====
    console.log('📝 Updating User model...');

    // Count users without new fields
    const usersWithoutAccountType = await UserModel.countDocuments({
      accountType: { $exists: false }
    });

    console.log(`Found ${usersWithoutAccountType} users to migrate`);

    if (usersWithoutAccountType > 0) {
      // Update all existing users to business mode with unlimited access
      const userResult = await UserModel.updateMany(
        { accountType: { $exists: false } },
        {
          $set: {
            accountType: 'business',
            usageTier: 'pro',
            restrictions: {
              maxClients: 999999,
              maxMessagesPerDay: 10000,
              maxConversations: 999999,
              allowRealAPIs: true,
              allowedAgents: [],
              aiModel: 'gpt-4-turbo'
            }
          }
        }
      );

      console.log(`✅ Updated ${userResult.modifiedCount} users to business mode\n`);
    } else {
      console.log('✅ All users already have account types\n');
    }

    // ===== PART 2: Update Client Model =====
    console.log('📝 Updating Client model...');

    // Count clients without dataSource
    const clientsWithoutDataSource = await ClientModel.countDocuments({
      dataSource: { $exists: false }
    });

    console.log(`Found ${clientsWithoutDataSource} clients to migrate`);

    if (clientsWithoutDataSource > 0) {
      // Update all existing clients to use real data
      const clientResult = await ClientModel.updateMany(
        { dataSource: { $exists: false } },
        {
          $set: {
            dataSource: 'real'
          }
        }
      );

      console.log(`✅ Updated ${clientResult.modifiedCount} clients to use real data\n`);
    } else {
      console.log('✅ All clients already have dataSource\n');
    }

    // ===== PART 3: Verification =====
    console.log('🔍 Verifying migration...');

    const totalUsers = await UserModel.countDocuments();
    const usersWithAccountType = await UserModel.countDocuments({
      accountType: { $exists: true }
    });

    const totalClients = await ClientModel.countDocuments();
    const clientsWithDataSource = await ClientModel.countDocuments({
      dataSource: { $exists: true }
    });

    console.log(`\nUsers: ${usersWithAccountType}/${totalUsers} have account types`);
    console.log(`Clients: ${clientsWithDataSource}/${totalClients} have dataSource\n`);

    if (usersWithAccountType === totalUsers && clientsWithDataSource === totalClients) {
      console.log('✅ Migration completed successfully!');
      console.log('\n📊 Summary:');
      console.log('- All existing users set to "business" account type');
      console.log('- All existing users set to "pro" usage tier');
      console.log('- All existing users have unlimited restrictions');
      console.log('- All existing clients set to "real" data source');
      console.log('\n🎉 Ready for hybrid mode implementation!');
    } else {
      console.error('❌ Migration incomplete. Some documents were not updated.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run migration
migrate();
