/**
 * Test Google Ads SDK Integration
 * 
 * Verifies that the official google-ads-api library is correctly
 * fetching data using the stored refresh token.
 */

import { GoogleAdsClient } from '../src/lib/platforms/google-ads/client';
import connectDB from '../src/backend/config/database';
import PlatformConnectionModel from '../src/models/PlatformConnection';
import path from 'path';

async function testAdsSDK() {
    console.log('🚀 Starting Google Ads SDK Test...\n');

    try {
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Find a Google Ads connection
        const connection = await PlatformConnectionModel.findOne({
            platformId: 'google-ads',
            status: 'active'
        });

        if (!connection) {
            console.error('❌ No active Google Ads connection found in database.');
            console.log('Please connect Google Ads via the UI first.');
            process.exit(1);
        }

        const refreshToken = connection.getDecryptedRefreshToken();
        if (!refreshToken) {
            console.error('❌ No refresh token found for this connection.');
            process.exit(1);
        }

        console.log(`✅ Found connection for user: ${connection.userId}`);
        console.log(`🔗 Refresh Token: ${refreshToken.substring(0, 10)}... (truncated)`);

        const client = new GoogleAdsClient(refreshToken);

        // 1. List accessible customers
        console.log('\n🔄 Testing listAccessibleCustomers()...');
        const customers = await client.listAccessibleCustomers();
        console.log(`✅ Found ${customers.length} accessible customer resource names:`);
        customers.forEach(name => console.log(`   - ${name}`));

        if (customers.length > 0) {
            const customerIds = customers.map(name => name.split('/')[1]);
            let successfulCustomer: any = null;
            let targetCustomerId = '';

            console.log('\n🔎 Searching for a functional customer account...');

            for (const id of customerIds) {
                process.stdout.write(`   Testing ${id}... `);

                // Strategy 1: Try direct access (no login header)
                try {
                    const details = await client.getCustomer(id, null);
                    if (details.manager) {
                        console.log('Skipped (Manager Account)');
                        continue;
                    }
                    console.log('✅ Success (Direct Access)!');
                    successfulCustomer = details;
                    targetCustomerId = id;
                    (successfulCustomer as any).usedLoginId = null;
                    break;
                } catch (err) {
                    // console.log(`(Direct failed)`);
                }

                // Strategy 2: Try with the env login ID
                try {
                    const details = await client.getCustomer(id);
                    if (details.manager) {
                        console.log('Skipped (Manager Account)');
                        continue;
                    }
                    console.log('✅ Success (via Manager)!');
                    successfulCustomer = details;
                    targetCustomerId = id;
                    (successfulCustomer as any).usedLoginId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
                    break;
                } catch (err) {
                    // console.log(`(Manager access failed)`);
                }

                console.log('❌ Skipped (No strategy worked)');
            }


            if (!successfulCustomer) {
                console.error('\n❌ No functional customer accounts found among the accessible list.');
                process.exit(1);
            }

            console.log(`\n🎯 Targeting Customer ID: ${targetCustomerId}`);
            console.log(`✅ Customer Details:`, JSON.stringify(successfulCustomer, null, 2));

            // 3. Get Campaigns
            console.log('\n🔄 Testing getCampaigns()...');
            const campaigns = await client.getCampaigns(targetCustomerId, (successfulCustomer as any).usedLoginId);
            console.log(`✅ Found ${campaigns.length} campaigns:`);
            campaigns.slice(0, 3).forEach(c => console.log(`   - ${c.name} (${c.status})`));

            // 4. Get Metrics
            console.log('\n🔄 Testing getMetrics()...');
            const metrics = await client.getMetrics(
                targetCustomerId,
                ['metrics.impressions', 'metrics.clicks', 'metrics.cost_micros'],
                '2024-01-01',
                new Date().toISOString().split('T')[0],
                (successfulCustomer as any).usedLoginId
            );
            console.log(`✅ Fetched ${metrics.results.length} result rows`);

            if (metrics.results.length > 0) {
                let totalImpressions = 0;
                metrics.results.forEach(r => {
                    if (r.metrics) {
                        totalImpressions += parseInt(r.metrics.impressions || '0');
                    }
                });
                console.log(`📊 Total Impressions in range: ${totalImpressions}`);
            }
        }

        console.log('\n✨ SDK Test Complete!');
        process.exit(0);
    } catch (error: any) {
        console.error('\n❌ SDK Test Failed:');
        console.error(error.message);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    }
}

testAdsSDK();
