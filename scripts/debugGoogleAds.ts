import { GoogleAdsClient } from '../src/lib/platforms/google-ads/client';
import connectDB from '../src/backend/config/database';
import PlatformConnectionModel from '../src/models/PlatformConnection';
import path from 'path';

async function debugGoogleAds() {
    await connectDB();

    let refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const customerId = '2987039148'; // Nashtech

    if (!refreshToken) {
        // Try to pull from DB if not in env
        const connection = await PlatformConnectionModel.findOne({
            platformId: 'google-ads',
            status: 'active'
        });
        if (connection) {
            refreshToken = connection.getDecryptedRefreshToken() || undefined;
            console.log('✅ Pulled Refresh Token from Database');
        }
    }

    if (!refreshToken) {
        console.error('❌ Refresh token not found in .env.local or Database.');
        return;
    }

    try {
        const client = new GoogleAdsClient(refreshToken);

        console.log('\n🔄 Testing account access...');

        let details = null;
        let usedLcid: string | null = null;

        // Try Strategy 1: Direct
        try {
            console.log('   Trying Direct Access...');
            details = await client.getCustomer(customerId, null);
            usedLcid = null;
            console.log('   ✅ Direct Access worked!');
        } catch (e) {
            console.log('   ❌ Direct Access failed.');

            // Try Strategy 2: Manager
            if (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) {
                console.log('   Trying Manager Access...');
                details = await client.getCustomer(customerId);
                usedLcid = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
                console.log('   ✅ Manager Access worked!');
            }
        }

        if (!details) {
            console.error('❌ Could not access account with any strategy.');
            return;
        }

        console.log(`✅ Customer: ${details.descriptiveName} (${details.currencyCode})`);

        console.log('\n🔄 Testing getCampaigns...');
        try {
            const campaigns = await client.getCampaigns(customerId, usedLcid);
            console.log(`✅ Found ${campaigns.length} campaigns`);
            campaigns.forEach(c => console.log(`   - ${c.name} [ID: ${c.id}]`));
        } catch (err: any) {
            console.error('❌ getCampaigns failed:', err.message);
        }

        console.log('\n🔄 Testing getMetrics...');
        try {
            const metricsResponse = await client.getMetrics(
                customerId,
                [
                    'metrics.impressions',
                    'metrics.clicks',
                    'metrics.cost_micros',
                    'metrics.conversions',
                    'metrics.conversions_value',
                    'metrics.conversions_from_interactions_rate',
                    'metrics.view_through_conversions',
                    'metrics.interactions',
                    'metrics.interaction_rate',
                    'metrics.search_impression_share',
                    'metrics.search_absolute_top_impression_share',
                    'metrics.search_budget_lost_impression_share',
                    'metrics.search_rank_lost_impression_share',
                ],
                '2024-11-20',
                '2024-12-24',
                usedLcid // Nashtech 2987039148 connection confirmed worked with direct access in fetchData
            );
            console.log(`✅ Found ${metricsResponse.results.length} metric results`);
        } catch (err: any) {
            console.error('❌ getMetrics failed:', err.message);
        }

    } catch (error: any) {
        console.error('❌ Debug failed:', error.message);
    }
}

debugGoogleAds();
