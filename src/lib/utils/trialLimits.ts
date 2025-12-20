/**
 * Trial Period and Message Limit Validation
 *
 * Checks if user is within trial period and daily message limits
 * Used for enforcing 7-day trial with 50 messages/day limit
 */

import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import ConversationModel from '@/models/Conversation';
import mongoose from 'mongoose';

/**
 * Trial Period Configuration
 * These constants define the trial limits for all users
 */
export const TRIAL_CONFIG = {
  /** Trial period duration in days */
  TRIAL_PERIOD_DAYS: 7,
  /** Daily message limit during trial period */
  DAILY_MESSAGE_LIMIT: 50,
} as const;

export interface TrialLimitCheck {
  allowed: boolean;
  reason?: 'trial_expired' | 'daily_limit_reached';
  message: string;
  daysRemaining?: number;
  messagesUsed?: number;
  messagesLimit?: number;
}

/**
 * Check if user is within trial period (7 days from account creation)
 * and hasn't exceeded daily message limit (50 messages/day)
 *
 * Note: Trial validation is disabled in development mode for easier testing
 *
 * @param userId - User ID to check
 * @returns TrialLimitCheck object with validation result
 */
export async function checkTrialLimits(userId: string): Promise<TrialLimitCheck> {
  // Skip trial validation in development mode
  if (process.env.NODE_ENV === 'development') {
    return {
      allowed: true,
      message: 'Trial validation disabled in development mode',
      daysRemaining: TRIAL_CONFIG.TRIAL_PERIOD_DAYS,
      messagesUsed: 0,
      messagesLimit: TRIAL_CONFIG.DAILY_MESSAGE_LIMIT,
    };
  }

  try {
    await connectDB();

    // Fetch user document
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        allowed: false,
        reason: 'trial_expired',
        message: 'User not found',
      };
    }

    const now = new Date();
    const accountCreatedAt = user.createdAt;
    const trialPeriodDays = TRIAL_CONFIG.TRIAL_PERIOD_DAYS;

    // Calculate days since account creation
    const daysSinceCreation = Math.floor(
      (now.getTime() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine if user is in trial period and what message limit to apply
    let daysRemaining: number;
    let isInTrialPeriod = false;
    let dailyMessageLimit: number;

    if (user.usageTier === 'student' || user.usageTier === 'free') {
      // Student tier: never expires, always has 50 msg/day limit
      daysRemaining = 999;
      isInTrialPeriod = false;
      dailyMessageLimit = TRIAL_CONFIG.DAILY_MESSAGE_LIMIT; // 50 messages/day forever
    } else if (user.subscriptionStatus === 'active') {
      // ✅ ACTIVE SUBSCRIPTION: 
      // Users with active subscriptions get full access based on their tier limits
      // We check if the subscription has expired by date
      if (user.subscriptionEndDate && new Date() > new Date(user.subscriptionEndDate)) {
        // Subscription expired (date passed)
        return {
          allowed: false,
          reason: 'trial_expired', // Using same reason code for frontend consistency
          message: 'Your subscription has expired. Please renew to continue.',
          daysRemaining: 0
        };
      }

      // Active and valid date
      daysRemaining = 30; // Just a placeholder, actual date check handles it
      isInTrialPeriod = false;

      // Set limits based on active tier
      if (user.usageTier === 'agency') {
        dailyMessageLimit = 300;
      } else if (user.usageTier === 'enterprise') {
        dailyMessageLimit = 999999;
      } else {
        // Professional default
        dailyMessageLimit = 150;
      }

    } else if (user.usageTier === 'pro' || user.usageTier === 'enterprise' || user.usageTier === 'agency') {
      // ⚠️ NO ACTIVE SUBSCRIPTION (Trial Mode or Expired Trial)

      // Check if trial period has expired
      if (daysSinceCreation >= trialPeriodDays) {
        // Trial expired - require payment/upgrade
        return {
          allowed: false,
          reason: 'trial_expired',
          message: `Your ${trialPeriodDays}-day free trial has ended. Upgrade to continue using OneAssist.`,
          daysRemaining: 0,
        };
      }

      // Still in trial period
      daysRemaining = trialPeriodDays - daysSinceCreation;
      isInTrialPeriod = true;
      dailyMessageLimit = TRIAL_CONFIG.DAILY_MESSAGE_LIMIT; // 50 messages/day during trial
    } else {
      // Fallback
      daysRemaining = 0;
      isInTrialPeriod = false;
      dailyMessageLimit = 50;
    }

    // Check daily message limit
    // Get start of today in UTC for consistent timezone handling
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    todayStart.setUTCMinutes(0);
    todayStart.setUTCSeconds(0);
    todayStart.setUTCMilliseconds(0);

    // Count messages sent today using MongoDB aggregation for better performance
    // This is more efficient than fetching all conversations and filtering in JavaScript
    const aggregationResult = await ConversationModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: { $ne: 'deleted' },
          'messages.timestamp': { $gte: todayStart },
        },
      },
      {
        $unwind: '$messages',
      },
      {
        $match: {
          'messages.role': 'user',
          'messages.timestamp': { $gte: todayStart },
        },
      },
      {
        $count: 'total',
      },
    ]);

    const messagesToday = aggregationResult[0]?.total || 0;

    // Check if daily limit reached (only during trial for Pro/Agency, always for Student)
    if (messagesToday >= dailyMessageLimit) {
      // Different message based on account type
      let upgradeMessage: string;
      if (user.usageTier === 'student' || user.usageTier === 'free') {
        upgradeMessage = 'You have reached your daily limit of 50 messages. This limit resets at midnight UTC.';
      } else if (isInTrialPeriod) {
        upgradeMessage = `You've reached your trial limit of ${dailyMessageLimit} messages today. Subscribe to get unlimited messages.`;
      } else {
        upgradeMessage = `You've reached your daily limit of ${dailyMessageLimit} messages. Please upgrade your plan.`;
      }

      return {
        allowed: false,
        reason: 'daily_limit_reached',
        message: upgradeMessage,
        daysRemaining,
        messagesUsed: messagesToday,
        messagesLimit: dailyMessageLimit,
      };
    }

    // All checks passed
    return {
      allowed: true,
      message: 'Within trial period and message limits',
      daysRemaining,
      messagesUsed: messagesToday,
      messagesLimit: dailyMessageLimit,
    };
  } catch (error) {
    console.error('Error checking trial limits:', error);
    // On error, allow the request (fail open) but log the error
    return {
      allowed: true,
      message: 'Error checking limits, allowing request',
    };
  }
}
