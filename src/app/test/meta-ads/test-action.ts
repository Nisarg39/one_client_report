'use server';

import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { fetchMetaAdsData } from '@/lib/platforms/meta-ads/fetchData';
import { requireAuth } from '@/lib/auth/adapter';

export async function getMetaAdsTestData(clientId: string, campaignId?: string) {
    try {
        const user = await requireAuth();
        await connectDB();

        // Find Meta Ads connection
        const connection = await (PlatformConnectionModel as any).findOne({
            clientId,
            userId: user.id,
            platformId: 'meta-ads',
            status: { $in: ['active', 'connected'] }
        });

        if (!connection) {
            return { success: false, error: 'Meta Ads connection not found' };
        }

        // Call the same fetcher used by the chat
        const data = await fetchMetaAdsData(connection, undefined, undefined, campaignId);

        return {
            success: true,
            data,
            selectedId: campaignId
        };
    } catch (error: any) {
        console.error('Meta Ads Test Action Error:', error);
        return { success: false, error: error.message };
    }
}
