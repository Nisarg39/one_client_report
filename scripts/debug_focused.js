
const fs = require('fs');

async function debugFocusedFetch() {
    const token = fs.readFileSync('/tmp/linkedin_token.txt', 'utf8').trim();
    const version = '202511';
    const accountId = '517215686';
    const accountUrn = `urn:li:sponsoredAccount:${accountId}`;

    // Target Group we know exists
    const groupUrn = 'urn:li:sponsoredCampaignGroup:793151423'; // "Accelerate Campaign Group"

    const dateRange = `(start:(year:2024,month:6,day:1),end:(year:2025,month:12,day:31))`;
    const fields = 'pivotValues,costInLocalCurrency,impressions,clicks';

    // 1. Fetch Account (Baseline)
    console.log("--- Fetching Account Total ---");
    const encodedAccount = accountUrn.replace(/:/g, '%3A');
    const urlAccount = `https://api.linkedin.com/rest/adAnalytics?q=analytics&pivot=ACCOUNT&dateRange=${dateRange}&timeGranularity=ALL&accounts=List(${encodedAccount})&fields=${fields}`;
    const resAccount = await fetch(urlAccount, { headers: { 'Authorization': `Bearer ${token}`, 'LinkedIn-Version': version, 'X-Restli-Protocol-Version': '2.0.0' } });
    const jsonAccount = await resAccount.json();
    console.log(JSON.stringify(jsonAccount, null, 2));

    // 2. Fetch Focused Group (No accounts param)
    console.log("\n--- Fetching Focused Group (Strict) ---");
    // const urlFocused = `https://api.linkedin.com/rest/adAnalytics?q=analytics&pivot=CAMPAIGN_GROUP&dateRange=${dateRange}&timeGranularity=ALL&campaignGroups=List(${groupUrn.replace(/:/g, '%3A')})&fields=${fields}`;
    // NOTE: client.ts removes accounts param. 

    // Let's verify if 'accounts' param is truly optional when 'campaignGroups' is present.
    // If I omit 'accounts', does it search cross-account? Yes, if the token implies it.
    // But does it fix the "Same Metrics" issue?

    const encodedGroup = groupUrn.replace(/:/g, '%3A');
    const urlFocused = `https://api.linkedin.com/rest/adAnalytics?q=analytics&pivot=CAMPAIGN_GROUP&dateRange=${dateRange}&timeGranularity=ALL&campaignGroups=List(${encodedGroup})&fields=${fields}`;

    console.log(`URL: ${urlFocused}`);
    const resFocused = await fetch(urlFocused, { headers: { 'Authorization': `Bearer ${token}`, 'LinkedIn-Version': version, 'X-Restli-Protocol-Version': '2.0.0' } });
    const jsonFocused = await resFocused.json();
    console.log(JSON.stringify(jsonFocused, null, 2));

}

debugFocusedFetch().catch(console.error);
