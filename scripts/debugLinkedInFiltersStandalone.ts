import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const apiVersion = '202501'; // Use current stable version
const baseUrl = 'https://api.linkedin.com/rest';

async function getAnalytics(params: any) {
    const { accounts, dateRange, pivot, fields, campaigns, campaignGroups } = params;

    const dateRangeStr = `(start:(year:${dateRange.start.year},month:${dateRange.start.month},day:${dateRange.start.day}),end:(year:${dateRange.end.year},month:${dateRange.end.month},day:${dateRange.end.day}))`;
    const accountsList = `List(${accounts.map((a: string) => a.replace(/:/g, '%3A')).join(',')})`;
    const fieldsStr = fields.join(',');

    let url = `${baseUrl}/adAnalytics?q=analytics&pivot=${pivot}&timeGranularity=ALL&dateRange=${dateRangeStr}&accounts=${accountsList}&fields=${fieldsStr}`;

    if (campaigns && campaigns.length > 0) {
        url += `&campaigns=List(${campaigns.map((c: string) => c.replace(/:/g, '%3A')).join(',')})`;
    }

    if (campaignGroups && campaignGroups.length > 0) {
        url += `&campaignGroups=List(${campaignGroups.map((g: string) => g.replace(/:/g, '%3A')).join(',')})`;
    }

    console.log(`[Request] ${url}`);

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

    const dateRange = {
        start: { year: 2024, month: 11, day: 23 },
        end: { year: 2024, month: 12, day: 23 }
    };

    const fields = ['pivotValues', 'impressions', 'clicks', 'costInLocalCurrency'];

    console.log('\n--- 1. Testing ACCOUNT Pivot ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'ACCOUNT', fields });
        console.log('Result:', JSON.stringify(res, null, 2));
    } catch (e) { console.error(e); }

    console.log('\n--- 2. Testing CAMPAIGN Pivot (No filter) ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'CAMPAIGN', fields });
        console.log('Result:', JSON.stringify(res, null, 2));
    } catch (e) { console.error(e); }

    console.log('\n--- 3. Testing CAMPAIGN Pivot (Filtered by Campaign) ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'CAMPAIGN', fields, campaigns: [campaignUrn] });
        console.log('Result:', JSON.stringify(res, null, 2));
    } catch (e) { console.error(e); }

    console.log('\n--- 4. Testing CAMPAIGN_GROUP Pivot (Filtered by Group) ---');
    try {
        const res = await getAnalytics({ accounts: [accountUrn], dateRange, pivot: 'CAMPAIGN_GROUP', fields, campaignGroups: [groupUrn] });
        console.log('Result:', JSON.stringify(res, null, 2));
    } catch (e) { console.error(e); }
}

debugFilters().catch(console.error);
