'use server';

import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { fetchAllGoogleAnalyticsProperties } from '@/lib/platforms/googleAnalytics/fetchData';
import { requireAuth } from '@/lib/auth/adapter';

export async function getGoogleAnalyticsTestData(clientId: string, propertyId?: string) {
    try {
        const user = await requireAuth();
        await connectDB();

        // Find GA connection
        const connection = await (PlatformConnectionModel as any).findOne({
            clientId,
            userId: user.id,
            platformId: 'google-analytics',
            status: { $in: ['active', 'connected'] }
        });

        if (!connection) {
            return { success: false, error: 'Google Analytics connection not found' };
        }

        // Call the same fetcher used by the chat
        const data = await fetchAllGoogleAnalyticsProperties(connection, undefined, undefined, propertyId);

        return {
            success: true,
            data,
            selectedId: propertyId
        };
    } catch (error: any) {
        console.error('Google Analytics Test Action Error:', error);
        return { success: false, error: error.message };
    }
}
