/**
 * Subscription Mongoose Model
 *
 * Tracks user subscriptions for Professional, Agency, and Enterprise tiers
 * Handles subscription lifecycle: active, expired, cancelled
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Subscription Document Interface
 */
export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  // Subscription Status
  status: 'active' | 'expired' | 'cancelled';
  usageTier: 'professional' | 'agency' | 'enterprise';

  // PayU Integration
  payuOrderId: string;
  payuTransactionId?: string; // mihpayid from PayU
  payuCustomerId?: string; // PayU customer ID (if available)

  // Billing Period
  startDate: Date;
  endDate: Date; // Auto-calculated: startDate + 1 month

  // Payment Details
  amount: number; // 299 for professional, 999 for agency
  currency: string; // INR

  // Cancellation
  cancelledAt?: Date;
  cancellationReason?: string;

  // Auto-renewal (Phase 2 - not used in Phase 1)
  autoRenew: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription Schema
 */
const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
      required: true,
    },
    usageTier: {
      type: String,
      enum: ['professional', 'agency', 'enterprise'],
      required: [true, 'Usage tier is required'],
    },
    payuOrderId: {
      type: String,
      required: [true, 'PayU order ID is required'],
      unique: true,
    },
    payuTransactionId: {
      type: String,
    },
    payuCustomerId: {
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      required: true,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    autoRenew: {
      type: Boolean,
      default: false, // Phase 1: No auto-renewal
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance
 */
SubscriptionSchema.index({ userId: 1, status: 1 }); // Find active subscriptions
SubscriptionSchema.index({ endDate: 1, status: 1 }); // Check expired subscriptions
SubscriptionSchema.index({ payuTransactionId: 1 }); // Idempotency checks

/**
 * Static Methods
 */

/**
 * Get active subscription for a user (includes cancelled subscriptions that haven't expired yet)
 */
SubscriptionSchema.statics.getActiveSubscription = async function (
  userId: string | mongoose.Types.ObjectId
): Promise<ISubscription | null> {
  return this.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: ['active', 'cancelled'] }, // Include both active and cancelled (grace period)
    endDate: { $gte: new Date() }, // Only return if not expired yet
  }).sort({ createdAt: -1 }); // Get most recent if multiple
};

/**
 * Create a new subscription with auto-calculated end date
 */
SubscriptionSchema.statics.createSubscription = async function (data: {
  userId: string | mongoose.Types.ObjectId;
  usageTier: 'professional' | 'agency' | 'enterprise';
  payuOrderId: string;
  payuTransactionId?: string;
  amount: number;
  startDate?: Date;
}): Promise<ISubscription> {
  const startDate = data.startDate || new Date();

  // Calculate end date: 1 month from start date
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  return this.create({
    userId: data.userId,
    usageTier: data.usageTier,
    payuOrderId: data.payuOrderId,
    payuTransactionId: data.payuTransactionId,
    amount: data.amount,
    currency: 'INR',
    startDate,
    endDate,
    status: 'active',
    autoRenew: false,
  });
};

/**
 * Check and update expired subscriptions
 * Run this periodically (e.g., daily cron job)
 */
SubscriptionSchema.statics.updateExpiredSubscriptions = async function (): Promise<number> {
  const now = new Date();

  // Update BOTH active and cancelled subscriptions that have passed endDate
  const result = await this.updateMany(
    {
      status: { $in: ['active', 'cancelled'] }, // Handle both statuses
      endDate: { $lt: now },
      autoRenew: false, // Don't auto-expire if auto-renew is enabled (Phase 2)
    },
    {
      $set: { status: 'expired' },
    }
  );

  // Also update corresponding User documents
  if (result.modifiedCount > 0) {
    // Find all subscriptions we just expired
    const expiredSubs = await this.find({
      status: 'expired',
      endDate: { $lt: now },
    }).select('userId');

    // Update users to expired status and free tier
    const userIds = expiredSubs.map((sub: any) => sub.userId);
    await mongoose.model('User').updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          subscriptionStatus: 'expired',
          usageTier: 'free',
        }
      }
    );
  }

  return result.modifiedCount;
};

/**
 * Cancel a subscription
 */
SubscriptionSchema.statics.cancelSubscription = async function (
  subscriptionId: string | mongoose.Types.ObjectId,
  reason?: string
): Promise<ISubscription | null> {
  return this.findByIdAndUpdate(
    subscriptionId,
    {
      $set: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason || 'User requested cancellation',
      },
    },
    { new: true }
  );
};

/**
 * Get all subscriptions for a user (for history)
 */
SubscriptionSchema.statics.getUserSubscriptions = async function (
  userId: string | mongoose.Types.ObjectId
): Promise<ISubscription[]> {
  return this.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 }); // Most recent first
};

/**
 * Model Interface (with static methods)
 */
interface ISubscriptionModel extends Model<ISubscription> {
  getActiveSubscription(
    userId: string | mongoose.Types.ObjectId
  ): Promise<ISubscription | null>;
  createSubscription(data: {
    userId: string | mongoose.Types.ObjectId;
    usageTier: 'professional' | 'agency' | 'enterprise';
    payuOrderId: string;
    payuTransactionId?: string;
    amount: number;
    startDate?: Date;
  }): Promise<ISubscription>;
  updateExpiredSubscriptions(): Promise<number>;
  cancelSubscription(
    subscriptionId: string | mongoose.Types.ObjectId,
    reason?: string
  ): Promise<ISubscription | null>;
  getUserSubscriptions(
    userId: string | mongoose.Types.ObjectId
  ): Promise<ISubscription[]>;
}

/**
 * Export Model
 */
const SubscriptionModel: ISubscriptionModel =
  (mongoose.models.Subscription as ISubscriptionModel) ||
  mongoose.model<ISubscription, ISubscriptionModel>('Subscription', SubscriptionSchema);

export default SubscriptionModel;
