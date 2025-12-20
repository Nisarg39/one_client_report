'use server';

import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import SubscriptionModel from '@/models/Subscription';
import UserModel from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function cancelSubscription() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();

        // 1. Get active subscription
        const subscription = await SubscriptionModel.findOne({
            userId: user.id,
            status: 'active',
        });

        if (!subscription) {
            return { success: false, error: 'No active subscription found' };
        }

        // 2. Mark subscription as cancelled (tracking only)
        // Note: No recurring billing - all subscriptions are one-time payments
        subscription.status = 'cancelled';
        subscription.cancelledAt = new Date();
        // DO NOT modify endDate - preserve original paid-until date
        await subscription.save();

        // 3. Update user status to 'cancelled' but keep their tier
        // This allows UI to show cancelled status while maintaining access
        // User retains their tier (professional/agency) until subscription.endDate passes
        // The expiry cron job will downgrade to 'free' when endDate is reached
        await UserModel.findByIdAndUpdate(user.id, {
            subscriptionStatus: 'cancelled',
            // DO NOT change usageTier - user keeps their tier during grace period
        });

        revalidatePath('/dashboard/subscription');

        return {
            success: true,
            endDate: subscription.endDate.toISOString()
        };
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return { success: false, error: 'Failed to process cancellation' };
    }
}
