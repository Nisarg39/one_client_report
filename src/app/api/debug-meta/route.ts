
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PlatformConnection from '@/models/PlatformConnection';
import { MetaAdsClient } from '@/lib/platforms/meta-ads/client';

export async function GET() {
    try {
        await connectDB();

        // Find the most recent active Meta Ads connection
        const connection = await PlatformConnection.findOne({
            platformId: 'meta-ads',
            status: 'active',
        }).sort({ updatedAt: -1 });

        if (!connection) {
            return NextResponse.json({ error: 'No active Meta Ads connection found' }, { status: 404 });
        }

        const accessToken = connection.getDecryptedAccessToken();
        const client = new MetaAdsClient(accessToken);
        const accounts = await client.listAdAccounts();

        if (accounts.length === 0) {
            return NextResponse.json({ error: 'No ad accounts found' });
        }

        const mainAccount = accounts[0];
        const baseParams = {
            adAccountId: mainAccount.id,
            fields: ['impressions', 'clicks', 'spend'],
            level: 'account' as const,
            datePreset: 'last_30d' as const,
        };

        // Run the exact breakdown calls
        const [demoData, geoData, deviceData, platformData] = await Promise.all([
            client.getInsights({ ...baseParams, breakdowns: ['age', 'gender'] }),
            client.getInsights({ ...baseParams, breakdowns: ['country', 'region'] }),
            client.getInsights({ ...baseParams, breakdowns: ['device_platform'] }),
            client.getInsights({ ...baseParams, breakdowns: ['publisher_platform'] }),
        ]);

        return NextResponse.json({
            account: mainAccount.name,
            demographics: demoData,
            geography: geoData,
            devices: deviceData,
            platforms: platformData
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
