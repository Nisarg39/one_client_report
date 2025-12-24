'use server';

import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { fetchLinkedInAdsData } from '@/lib/platforms/linkedin-ads/fetchData';
import { requireAuth } from '@/lib/auth/adapter';

export async function getLinkedInTestData(clientId: string, campaignId?: string) {
    try {
        const user = await requireAuth();
        await connectDB();

        // Find LinkedIn connection
        const connection = await (PlatformConnectionModel as any).findOne({
            clientId,
            userId: user.id,
            platformId: 'linkedin-ads',
            status: { $in: ['active', 'connected'] }
        });

        if (!connection) {
            return { success: false, error: 'LinkedIn connection not found' };
        }

        // Call the same fetcher used by the chat
        const data = await fetchLinkedInAdsData(connection, undefined, undefined, campaignId);

        if (data) {
            console.log(`[LinkedIn Test] Fetched ${data.campaigns.length} campaigns. Aggregate Spend: ${data.metrics.spend}`);
            if (campaignId) {
                const found = data.campaigns.find(c => String(c.id) === String(campaignId));
                console.log(`[LinkedIn Test] Search for Campaign ${campaignId}: ${found ? 'FOUND' : 'NOT FOUND'}`);
            }
        }

        return {
            success: true,
            data,
            selectedId: campaignId
        };
    } catch (error: any) {
        console.error('LinkedIn Test Action Error:', error);
        return { success: false, error: error.message };
    }
}
