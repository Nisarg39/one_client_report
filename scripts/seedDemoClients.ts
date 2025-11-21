/**
 * Seed Demo Clients Script
 * Creates demo clients with platform data for testing the multi-client chatbot
 *
 * Run with: npx tsx scripts/seedDemoClients.ts
 */

import mongoose from 'mongoose';
import ClientModel from '../src/models/Client';
import connectDB from '../src/backend/config/database';

// Use a consistent ObjectId for demo user (24 hex characters)
const DEMO_USER_OBJECT_ID = '507f1f77bcf86cd799439011';

async function seedDemoClients() {
  try {
    console.log('🌱 Seeding demo clients...\n');

    // Connect to database
    await connectDB();

    // Create ObjectId from hex string
    const demoUserId = new mongoose.Types.ObjectId(DEMO_USER_OBJECT_ID);

    // Delete existing demo clients to avoid duplicates
    const deleted = await ClientModel.deleteMany({ userId: demoUserId });
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing demo clients\n`);

    // Demo Client 1: Acme Corp (Google Analytics + Google Ads)
    const client1 = await ClientModel.create({
      userId: demoUserId,
      name: 'Acme Corp',
      email: 'contact@acmecorp.com',
      platforms: {
        googleAnalytics: {
          connected: true,
          accountId: 'UA-12345678-1',
          propertyId: '123456789',
          status: 'active',
          lastSync: new Date(),
          metrics: {
            sessions: 15234,
            users: 12450,
            pageviews: 45678,
            bounceRate: 0.42,
            avgSessionDuration: 185,
          },
          dimensions: {
            topSources: [
              { source: 'google / organic', sessions: 8500 },
              { source: 'direct', sessions: 3200 },
              { source: 'facebook / social', sessions: 2100 },
            ],
            devices: [
              { device: 'desktop', percentage: 65 },
              { device: 'mobile', percentage: 30 },
              { device: 'tablet', percentage: 5 },
            ],
            topPages: [
              { page: '/products', views: 12000 },
              { page: '/', views: 9500 },
              { page: '/about', views: 4200 },
            ],
          },
        },
        googleAds: {
          connected: true,
          customerId: '123-456-7890',
          status: 'active',
          lastSync: new Date(),
          campaigns: [
            {
              name: 'Brand Search Campaign',
              spend: 2450,
              clicks: 1830,
              impressions: 45600,
              ctr: 0.04,
              conversions: 156,
            },
            {
              name: 'Product Campaign - Q1',
              spend: 3200,
              clicks: 2100,
              impressions: 67800,
              ctr: 0.031,
              conversions: 89,
            },
          ],
        },
      },
      status: 'active',
    });

    console.log(`✅ Created: ${client1.name}`);
    console.log(`   - Connected platforms: Google Analytics, Google Ads`);

    // Demo Client 2: TechStart Inc (Meta Ads + LinkedIn Ads)
    const client2 = await ClientModel.create({
      userId: demoUserId,
      name: 'TechStart Inc',
      email: 'hello@techstart.io',
      platforms: {
        metaAds: {
          connected: true,
          adAccountId: 'act_987654321',
          status: 'active',
          lastSync: new Date(),
          campaigns: [
            {
              name: 'Product Launch - Meta',
              spend: 1850,
              impressions: 234000,
              clicks: 4680,
              cpm: 7.91,
              roas: 4.2,
            },
            {
              name: 'Retargeting Campaign',
              spend: 920,
              impressions: 156000,
              clicks: 2340,
              cpm: 5.90,
              roas: 5.8,
            },
          ],
        },
        linkedInAds: {
          connected: true,
          accountId: '987654321',
          status: 'active',
          lastSync: new Date(),
          campaigns: [
            {
              name: 'B2B Lead Gen',
              spend: 3400,
              impressions: 89000,
              clicks: 1780,
              leads: 142,
            },
            {
              name: 'Thought Leadership',
              spend: 1200,
              impressions: 45000,
              clicks: 890,
              leads: 67,
            },
          ],
        },
      },
      status: 'active',
    });

    console.log(`✅ Created: ${client2.name}`);
    console.log(`   - Connected platforms: Meta Ads, LinkedIn Ads`);

    // Demo Client 3: Local Bakery (Google Analytics only)
    const client3 = await ClientModel.create({
      userId: demoUserId,
      name: 'Sweet Treats Bakery',
      email: 'info@sweettreats.com',
      platforms: {
        googleAnalytics: {
          connected: true,
          accountId: 'UA-98765432-1',
          propertyId: '987654321',
          status: 'active',
          lastSync: new Date(),
          metrics: {
            sessions: 3420,
            users: 2890,
            pageviews: 8950,
            bounceRate: 0.38,
            avgSessionDuration: 142,
          },
          dimensions: {
            topSources: [
              { source: 'google / organic', sessions: 1800 },
              { source: 'instagram / social', sessions: 980 },
              { source: 'direct', sessions: 640 },
            ],
            devices: [
              { device: 'mobile', percentage: 70 },
              { device: 'desktop', percentage: 25 },
              { device: 'tablet', percentage: 5 },
            ],
            topPages: [
              { page: '/menu', views: 3200 },
              { page: '/', views: 2800 },
              { page: '/order-online', views: 1950 },
            ],
          },
        },
      },
      status: 'active',
    });

    console.log(`✅ Created: ${client3.name}`);
    console.log(`   - Connected platforms: Google Analytics`);

    console.log('\n✨ Demo clients seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total clients created: 3`);
    console.log(`   - User ObjectId: ${DEMO_USER_OBJECT_ID}`);
    console.log('\n💡 Test the chatbot by:');
    console.log('   1. Logging in with demo user credentials');
    console.log('   2. Going to /chat');
    console.log('   3. Switching between clients in the dropdown');
    console.log('   4. Asking questions like:');
    console.log('      - "How many visitors did I get?"');
    console.log('      - "What is my Google Ads spend?"');
    console.log('      - "Show me my top traffic sources"');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo clients:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDemoClients();
