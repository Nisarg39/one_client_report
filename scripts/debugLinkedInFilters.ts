import { LinkedInAdsClient } from '../src/lib/platforms/linkedin-ads/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debugFilters() {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    if (!accessToken) {
        console.error('No LINKEDIN_ACCESS_TOKEN found');
        return;
    }

    const client = new LinkedInAdsClient(accessToken);
    const accountId = '517253201'; // From logs
    const accountUrn = `urn:li:sponsoredAccount:${accountId}`;

    // Identified from logs in previous turn
    const campaignUrn = 'urn:li:sponsoredCampaign:455881483';
    const groupUrn = 'urn:li:sponsoredCampaignGroup:793778533';

    const dateRange = {
        start: { year: 2024, month: 12, day: 1 },
        end: { year: 2025, month: 1, day: 1 }
    };

    const fields = ['pivotValues', 'impressions', 'clicks', 'costInLocalCurrency'];

    console.log('--- Testing Account Level ---');
    const accountAnalytics = await client.getAnalytics({
        accounts: [accountUrn],
        dateRange,
        timeGranularity: 'ALL',
        pivot: 'ACCOUNT',
        fields,
    });
    console.log('Account Elements:', JSON.stringify(accountAnalytics.elements, null, 2));

    console.log('\n--- Testing Campaign Group Filter ---');
    // Using plural 'campaignGroups' as suggested by docs
    const groupAnalytics = await client.getAnalytics({
        accounts: [accountUrn],
        dateRange,
        timeGranularity: 'ALL',
        pivot: 'CAMPAIGN_GROUP',
        fields,
        // @ts-ignore - added to interface in previous turn
        campaignGroups: [groupUrn]
    });
    console.log('Group Elements:', JSON.stringify(groupAnalytics.elements, null, 2));

    console.log('\n--- Testing Individual Campaign Filter ---');
    // Using plural 'campaigns' as suggested by docs
    const campaignAnalytics = await client.getAnalytics({
        accounts: [accountUrn],
        dateRange,
        timeGranularity: 'ALL',
        pivot: 'CAMPAIGN',
        fields,
        // @ts-ignore - added to interface in previous turn
        campaigns: [campaignUrn]
    });
    console.log('Campaign Elements:', JSON.stringify(campaignAnalytics.elements, null, 2));

    console.log('\n--- Testing Campaign Pivot WITHOUT Filter ---');
    const allCampaignAnalytics = await client.getAnalytics({
        accounts: [accountUrn],
        dateRange,
        timeGranularity: 'ALL',
        pivot: 'CAMPAIGN',
        fields,
    });
    console.log(`Found ${allCampaignAnalytics.elements?.length || 0} elements when pivoting by CAMPAIGN without filters.`);
    allCampaignAnalytics.elements?.forEach((e, i) => {
        console.log(`Element ${i} pivotValues:`, e.pivotValues);
    });
}

debugFilters().catch(console.error);
