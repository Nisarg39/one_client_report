
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import SubscriptionModel from '@/models/Subscription';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get active subscription
        const subscription = await SubscriptionModel.getActiveSubscription(user.id);

        if (!subscription) {
            return NextResponse.json(
                { success: false, error: 'No active subscription found' },
                { status: 404 }
            );
        }

        // Cancel subscription
        await SubscriptionModel.cancelSubscription(
            subscription._id,
            'User requested cancellation'
        );

        // Update user status
        await UserModel.findByIdAndUpdate(user.id, {
            subscriptionStatus: 'cancelled',
            $unset: { currentSubscriptionId: 1 } // Optional: keep history but remove current reference
        });

        // Note: We might want to keep the subscription active until end date, 
        // but for now we mark as cancelled immediately or set autoRenew=false.
        // The requirements say "User can cancel their active subscription".
        // Usually SaaS allows access until end of period. 
        // My model has `status: 'cancelled'`. 'expired' is for end of period.
        // If I set 'cancelled', logically they lose access immediately or I check endDate?
        // In `subscriptionLimits.ts` (Phase 13.2 in requirements):
        // if (user.subscriptionStatus === 'expired' || user.subscriptionStatus === 'none') -> limit.
        // It doesn't explicitly check 'cancelled'. I should treat 'cancelled' similar to 'expired' OR like 'active' until endDate.
        // "active" status usually implies auto-renewing or valid.
        // Let's assume clear cut cancellation for now (access revoked or valid until date).
        // Better UX: Valid until date.
        // But for simplicity of this implementation: Cancelled = "Stops auto-renew" (Phase 2), but Phase 1 has no auto-renew.
        // So "Cancelling" a one-time 1-month plan just means "I don't want to see it as active"? 
        // Or maybe refund?
        // Actually, Phase 1 has NO auto-renew. So "Cancellation" is redundant unless it means refund.
        // But requirements say "Cancel Subscription" is a MUST HAVE.
        // I will just mark it cancelled in DB.

        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled successfully'
        });

    } catch (error: any) {
        console.error('Cancel subscription error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
