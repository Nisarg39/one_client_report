const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const apiVersion = '202501';
const baseUrl = 'https://api.linkedin.com/rest';

async function getAnalytics(params) {
    const { accounts, dateRange, pivot, fields, campaigns, campaignGroups } = params;

    // dateRange per RestLi protocol (no encoding for parens/colons)
    const dateRangeStr = `(start:(year:${dateRange.start.year},month:${dateRange.start.month},day:${dateRange.start.day}),end:(year:${dateRange.end.year},month:${dateRange.end.month},day:${dateRange.end.day}))`;
    const accountsList = `List(${accounts.map(a => a.replace(/:/g, '%3A')).join(',')})`;
    const fieldsStr = fields.join(',');

    let url = `${baseUrl}/adAnalytics?q=analytics&pivot=${pivot}&timeGranularity=ALL&dateRange=${dateRangeStr}&accounts=${accountsList}&fields=${fieldsStr}`;

    if (campaigns && campaigns.length > 0) {
        url += `&campaigns=List(${campaigns.map(c => c.replace(/:/g, '%3A')).join(',')})`;
    }

    if (campaignGroups && campaignGroups.length > 0) {
        url += `&campaignGroups=List(${campaignGroups.map(g => g.replace(/:/g, '%3A')).join(',')})`;
    }

    console.log(`\n[Request] ${pivot}: ${url}`);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'LinkedIn-Version': apiVersion,
            'X-Restli-Protocol-Version': '2.0.0',
        },
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Error ${response.status}: ${err}`);
    }

    return response.json();
}

async function debugFilters() {
    if (!accessToken) {
        console.error('No LINKEDIN_ACCESS_TOKEN found');
        return;
    }

    const accountId = '517253201';
    const accountUrn = `urn:li:sponsoredAccount:${accountId}`;
    const campaignUrn = 'urn:li:sponsoredCampaign:455881483';
    const groupUrn = 'urn:li:sponsoredCampaignGroup:793778533';

    // Last 30 days approx
    const dateRange = {
        start: { year: 2024, month: 11, day: 24 },
        end: { year: 2024, month: 12, day: 24 }
    };

    const fields = ['pivotValues', 'impressions', 'clicks', 'costInLocalCurrency'];

    console.log('--- 1. Testing ACCOUNT Level (Baseline) ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'ACCOUNT', fields });
        console.log('Account Data:', JSON.stringify(res.elements, null, 2));
    } catch (e) { console.error(e.message); }

    console.log('\n--- 2. Testing CAMPAIGN Pivot (No filter) ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'CAMPAIGN', fields });
        console.log(`Found ${res.elements.length} campaign items.`);
        res.elements.forEach((e, i) => {
            console.log(`  [${i}] Pivot: ${e.pivotValues[0]}, Impr: ${e.impressions}, Clicks: ${e.clicks}`);
        });
    } catch (e) { console.error(e.message); }

    console.log('\n--- 3. Testing CAMPAIGN Pivot (Filtered by Campaign URN) ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'CAMPAIGN', fields, campaigns: [campaignUrn] });
        console.log('Filtered Campaign Data:', JSON.stringify(res.elements, null, 2));
    } catch (e) { console.error(e.message); }

    console.log('\n--- 4. Testing CAMPAIGN_GROUP Pivot (Filtered by Group URN) ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'CAMPAIGN_GROUP', fields, campaignGroups: [groupUrn] });
        console.log('Filtered Group Data:', JSON.stringify(res.elements, null, 2));
    } catch (e) { console.error(e.message); }
}

debugFilters().catch(console.error);
