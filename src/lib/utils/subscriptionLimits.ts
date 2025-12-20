import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';

export interface SubscriptionLimitCheck {
    allowed: boolean;
    reason?: 'subscription_expired' | 'no_subscription';
    message: string;
}

/**
 * Check if the user has a valid active subscription.
 * This is used for POST-TRIAL users who are expected to have paid.
 *
 * @param userId - User ID to check
 * @returns SubscriptionLimitCheck result
 */
export async function checkSubscriptionLimits(userId: string): Promise<SubscriptionLimitCheck> {
    // Skip subscription validation in development mode
    if (process.env.NODE_ENV === 'development') {
        return {
            allowed: true,
            message: 'Subscription validation disabled in development mode'
        };
    }

    await connectDB();
    const user = await UserModel.findById(userId);

    if (!user) {
        return { allowed: false, message: 'User not found' };
    }

    // 1. If status says active OR cancelled, verify dates
    // Cancelled subscriptions retain access until endDate (per refund policy)
    if (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'cancelled') {
        if (user.subscriptionEndDate && new Date() > new Date(user.subscriptionEndDate)) {
            return {
                allowed: false,
                reason: 'subscription_expired',
                message: 'Your subscription has expired. Please renew to continue.'
            };
        }
        // Both active and cancelled subs work until endDate
        return {
            allowed: true,
            message: user.subscriptionStatus === 'cancelled'
                ? 'Cancelled subscription - active until end date'
                : 'Subscription active'
        };
    }

    // 2. If valid student/free tier (handled elsewhere usually, but safe to allow if logic overlaps)
    if (user.usageTier === 'student') {
        return { allowed: true, message: 'Student plan active' };
    }

    // 3. Check if user is in trial period
    const now = new Date();
    const accountCreatedAt = user.createdAt;
    const TRIAL_PERIOD_DAYS = 7;

    const daysSinceCreation = Math.floor(
        (now.getTime() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreation < TRIAL_PERIOD_DAYS) {
        return { allowed: true, message: 'Trial active' };
    }

    // 4. Trial expired and no active subscription
    return {
        allowed: false,
        reason: 'no_subscription',
        message: 'Your free trial has ended. Please subscribe to continue.'
    };
}
