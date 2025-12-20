/**
 * User Mongoose Model
 *
 * User authentication and profile data
 * Compatible with NextAuth.js
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * User Document Interface
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  phone?: string;

  // OAuth provider data (OAuth-only authentication)
  provider: 'google' | 'github';
  providerId?: string;

  // User metadata
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';

  // Hybrid Mode: Account type and restrictions
  accountType: 'business' | 'education' | 'instructor';
  usageTier: 'free' | 'pro' | 'agency' | 'enterprise' | 'student';

  educationMetadata?: {
    institution?: string;
    studentId?: string;
    enrollmentCode?: string;
    instructorId?: mongoose.Types.ObjectId;
    expiresAt?: Date;
  };

  restrictions: {
    maxClients: number;
    maxMessagesPerDay: number;
    maxConversations: number;
    allowRealAPIs: boolean;
    allowedAgents: string[];
    aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo';
  };

  // Payment & Subscription
  currentSubscriptionId?: mongoose.Types.ObjectId;
  subscriptionStatus: 'none' | 'trial' | 'active' | 'expired' | 'cancelled';
  subscriptionEndDate?: Date;

  // Trial Tracking
  trialStartDate?: Date;
  trialEndDate?: Date;
  hasUsedTrial: boolean;

  // Phase 6.6: Notification preferences
  notificationPreferences?: {
    email: {
      enabled: boolean;
      newMessages: boolean;
      platformUpdates: boolean;
      weeklyReports: boolean;
      frequency: 'instant' | 'daily' | 'weekly';
    };
    inApp: {
      enabled: boolean;
    };
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Methods
  toAuthUser(): {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

/**
 * User Schema
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    provider: {
      type: String,
      enum: ['google', 'github'],
      required: [true, 'OAuth provider is required'],
    },
    providerId: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    // Hybrid Mode: Account type and restrictions
    accountType: {
      type: String,
      enum: ['business', 'education', 'instructor'],
      default: 'business',
      required: [true, 'Account type is required'],
    },
    usageTier: {
      type: String,
      enum: ['free', 'pro', 'agency', 'enterprise', 'student'],
      default: 'pro',
      required: [true, 'Usage tier is required'],
    },
    educationMetadata: {
      institution: String,
      studentId: String,
      enrollmentCode: String,
      instructorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      expiresAt: Date,
    },
    restrictions: {
      type: {
        maxClients: {
          type: Number,
          default: 999999, // Unlimited for existing users
        },
        maxMessagesPerDay: {
          type: Number,
          default: 10000,
        },
        maxConversations: {
          type: Number,
          default: 999999,
        },
        allowRealAPIs: {
          type: Boolean,
          default: true,
        },
        allowedAgents: {
          type: [String],
          default: [], // Empty array = all agents allowed
        },
        aiModel: {
          type: String,
          enum: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
          default: 'gpt-4-turbo',
        },
      },
      required: true,
      default: () => ({
        maxClients: 999999,
        maxMessagesPerDay: 10000,
        maxConversations: 999999,
        allowRealAPIs: true,
        allowedAgents: [],
        aiModel: 'gpt-4-turbo',
      }),
    },
    // Payment & Subscription
    currentSubscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    subscriptionStatus: {
      type: String,
      enum: ['none', 'trial', 'active', 'expired', 'cancelled'],
      default: 'trial', // New users start in trial
    },
    subscriptionEndDate: {
      type: Date,
    },
    // Trial Tracking
    trialStartDate: {
      type: Date,
    },
    trialEndDate: {
      type: Date,
    },
    hasUsedTrial: {
      type: Boolean,
      default: false,
    },
    // Phase 6.6: Notification preferences
    notificationPreferences: {
      email: {
        enabled: {
          type: Boolean,
          default: true,
        },
        newMessages: {
          type: Boolean,
          default: true,
        },
        platformUpdates: {
          type: Boolean,
          default: true,
        },
        weeklyReports: {
          type: Boolean,
          default: false,
        },
        frequency: {
          type: String,
          enum: ['instant', 'daily', 'weekly'],
          default: 'instant',
        },
      },
      inApp: {
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance
 */
// UserSchema.index({ email: 1 }); // Redundant as email is unique: true
UserSchema.index({ providerId: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ accountType: 1 });
UserSchema.index({ usageTier: 1 });
UserSchema.index({ subscriptionStatus: 1 });
UserSchema.index({ subscriptionEndDate: 1 });

/**
 * Instance Methods
 */

/**
 * Convert user document to AuthUser format
 * (compatible with the auth adapter)
 */
UserSchema.methods.toAuthUser = function (): {
  id: string;
  name: string;
  email: string;
  image?: string | null;
} {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    image: this.image,
  };
};

/**
 * Static Methods
 */

/**
 * Get tier-specific restrictions
 * Used during user creation/upgrade
 */
UserSchema.statics.getTierRestrictions = function (usageTier: string) {
  const tierConfig: Record<string, any> = {
    student: {
      maxClients: 5,
      maxMessagesPerDay: 50,
      maxConversations: 999999, // Unlimited conversations
      allowRealAPIs: false,
      allowedAgents: [],
      aiModel: 'gpt-3.5-turbo' as const,
    },
    free: {
      maxClients: 5,
      maxMessagesPerDay: 50,
      maxConversations: 999999, // Unlimited conversations
      allowRealAPIs: false,
      allowedAgents: [],
      aiModel: 'gpt-3.5-turbo' as const,
    },
    pro: {
      maxClients: 10,
      maxMessagesPerDay: 150, // 150 messages/day (trial enforces 50/day separately)
      maxConversations: 999999,
      allowRealAPIs: true,
      allowedAgents: [],
      aiModel: 'gpt-3.5-turbo' as const,
    },
    agency: {
      maxClients: 25,
      maxMessagesPerDay: 300, // 300 messages/day (trial enforces 50/day separately)
      maxConversations: 999999,
      allowRealAPIs: true,
      allowedAgents: [],
      aiModel: 'gpt-3.5-turbo' as const,
    },
    enterprise: {
      maxClients: 999999,
      maxMessagesPerDay: 999999,
      maxConversations: 999999,
      allowRealAPIs: true,
      allowedAgents: [],
      aiModel: 'gpt-4-turbo' as const,
    },
  };
  return tierConfig[usageTier] || tierConfig.pro;
};

/**
 * Find user by email
 */
UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Find user by provider ID
 */
UserSchema.statics.findByProviderId = async function (
  provider: string,
  providerId: string
) {
  return this.findOne({ provider, providerId });
};

/**
 * Create or update user from OAuth provider
 */
UserSchema.statics.upsertFromOAuth = async function (profile: {
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
}) {
  const existingUser = await (this as IUserModel).findByEmail(profile.email);

  if (existingUser) {
    // Update existing user
    existingUser.name = profile.name;
    existingUser.image = profile.image || existingUser.image;
    existingUser.emailVerified = new Date();
    existingUser.provider = profile.provider as 'google' | 'github';
    existingUser.providerId = profile.providerId;
    await existingUser.save();
    return existingUser;
  }

  // Create new user
  const newUser = await this.create({
    email: profile.email,
    name: profile.name,
    image: profile.image,
    emailVerified: new Date(),
    provider: profile.provider,
    providerId: profile.providerId,
    status: 'active',
  });

  // ⭐ AUTO-CREATE DEFAULT WORKSPACE
  // Automatically create a workspace for the new user so they never have to manually create one
  try {
    const ClientModel = require('./Client').default;
    await ClientModel.create({
      userId: newUser._id,
      name: `${profile.name}'s Workspace`,
      email: profile.email,
      website: '',
      industry: '',
      platforms: {
        googleAnalytics: { connected: false },
        googleAds: { connected: false },
        metaAds: { connected: false },
        linkedInAds: { connected: false },
      },
      status: 'active',
      dataSource: 'real', // Default to real data; will be set to 'mock' for students
    });
    console.log(`✅ Auto-created workspace for new user: ${profile.email}`);
  } catch (error) {
    console.error('❌ Failed to create default workspace:', error);
    // Don't fail user creation if workspace creation fails
    // User can create workspace manually later if needed
  }

  return newUser;
};

/**
 * Model Interface (with static methods)
 */
interface IUserModel extends Model<IUser> {
  getTierRestrictions(usageTier: string): {
    maxClients: number;
    maxMessagesPerDay: number;
    maxConversations: number;
    allowRealAPIs: boolean;
    allowedAgents: string[];
    aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo';
  };
  findByEmail(email: string): Promise<IUser | null>;
  findByProviderId(
    provider: string,
    providerId: string
  ): Promise<IUser | null>;
  upsertFromOAuth(profile: {
    email: string;
    name: string;
    image?: string;
    provider: string;
    providerId: string;
  }): Promise<IUser>;
}

/**
 * Export Model
 */
const UserModel: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>('User', UserSchema);

export default UserModel;
