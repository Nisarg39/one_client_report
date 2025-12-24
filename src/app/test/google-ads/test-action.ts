'use server';

import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { fetchGoogleAdsData } from '@/lib/platforms/google-ads/fetchData';
import { requireAuth } from '@/lib/auth/adapter';

export async function getGoogleAdsTestData(clientId: string, campaignId?: string) {
    try {
        const user = await requireAuth();
        await connectDB();

        // Find Google Ads connection
        const connection = await (PlatformConnectionModel as any).findOne({
            clientId,
            userId: user.id,
            platformId: 'google-ads',
            status: { $in: ['active', 'connected'] }
        });

        if (!connection) {
            return { success: false, error: 'Google Ads connection not found' };
        }

        // Call the same fetcher used by the chat
        const data = await fetchGoogleAdsData(connection, undefined, undefined, campaignId);

        return {
            success: true,
            data,
            selectedId: campaignId
        };
    } catch (error: any) {
        console.error('Google Ads Test Action Error:', error);
        return { success: false, error: error.message };
    }
}
