/**
 * Debug LinkedIn Campaigns Script
 * 
 * Verifies that the new getCampaigns implementation works and that 
 * campaign-level analytics can be fetched.
 * 
 * Usage: npx tsx scripts/debugLinkedInCampaigns.ts
 */

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import { LinkedInAdsClient } from '../src/lib/platforms/linkedin-ads/client';
import PlatformConnectionModel from '../src/models/PlatformConnection';

async function debugLinkedInCampaigns() {
    console.log('\n🔎 Debug LinkedIn Campaigns');
    console.log('============================\n');

    try {
        await connectDB();
        console.log('✅ Connected to MongoDB\n');
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }

    const linkedInConnection = await (PlatformConnectionModel as any).findOne({
        platformId: 'linkedin-ads',
        status: 'active',
    });

    if (!linkedInConnection) {
        console.log('❌ No active LinkedIn Ads connection found.');
        await mongoose.disconnect();
        process.exit(1);
    }

    const accessToken = linkedInConnection.getDecryptedAccessToken();
    const client = new LinkedInAdsClient(accessToken);

    try {
        console.log('📊 Fetching Ad Accounts...');
        const accounts = await client.listAdAccounts();
        console.log(`✅ Found ${accounts.length} ad account(s)\n`);

        for (const account of accounts) {
            console.log(`🔹 Checking Account: ${account.name} (ID: ${account.id})`);

            try {
                console.log('   Fetching Campaigns...');
                const campaigns = await client.getCampaigns(account.id);
                console.log(`   ✅ Found ${campaigns.length} campaign(s)`);

                if (campaigns.length > 0) {
                    campaigns.slice(0, 3).forEach((c, i) => {
                        console.log(`      ${i + 1}. ${c.name} (ID: ${c.id}, Status: ${c.status})`);
                    });

                    console.log('\n   Testing Campaign-level Analytics for the first campaign...');
                    const campaignUrn = `urn:li:sponsoredCampaign:${campaigns[0].id}`;
                    const accountUrn = `urn:li:sponsoredAccount:${account.id}`;

                    const now = new Date();
                    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

                    const dateRange = {
                        start: { year: thirtyDaysAgo.getFullYear(), month: thirtyDaysAgo.getMonth() + 1, day: thirtyDaysAgo.getDate() },
                        end: { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }
                    };

                    const analytics = await client.getAnalytics({
                        accounts: [accountUrn],
                        dateRange,
                        timeGranularity: 'ALL',
                        pivot: 'CAMPAIGN',
                        fields: ['impressions', 'clicks', 'costInLocalCurrency']
                    });

                    console.log(`   ✅ Analytics response received (${analytics.elements?.length || 0} elements)`);
                    const campaignStats = analytics.elements?.find(e => e.pivotValue === campaignUrn);

                    if (campaignStats) {
                        console.log('   📈 Metrics for first campaign:');
                        console.log(`      Impressions: ${campaignStats.impressions}`);
                        console.log(`      Clicks: ${campaignStats.clicks}`);
                        console.log(`      Spend: ${campaignStats.costInLocalCurrency}`);
                    } else {
                        console.log('   ⚠️ No analytics found for this specific campaign in the last 30 days.');
                    }
                }
            } catch (err: any) {
                console.error(`   ❌ Error checking account ${account.id}:`, err.message);
            }
            console.log('-----------------------------------\n');
        }

    } catch (error: any) {
        console.error('❌ Critical error:', error.message);
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
}

debugLinkedInCampaigns().catch(console.error);
