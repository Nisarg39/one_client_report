/**
 * Client Model
 * MongoDB schema for multi-client architecture
 *
 * Each user (agency/freelancer) can manage multiple clients
 * Each client has independent platform configurations
 */

import mongoose, { Schema, Model } from 'mongoose';
import type { Client, ClientStatus, ClientPlatforms } from '@/types/chat';

/**
 * Platform Metrics Schema (embedded in each platform)
 */
const PlatformMetricsSchema = new Schema(
  {
    // Dynamic metrics - varies by platform
    // Stored as flexible object to accommodate different platform data
  },
  { _id: false, strict: false } // Allow dynamic fields
);

/**
 * Google Analytics Platform Schema
 */
const GoogleAnalyticsPlatformSchema = new Schema(
  {
    connected: { type: Boolean, default: false },
    accountId: String,
    propertyId: String,
    accessToken: String, // Should be encrypted
    refreshToken: String, // Should be encrypted
    expiresAt: Date,
    lastSync: Date,
    metrics: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

/**
 * Google Ads Platform Schema
 */
const GoogleAdsPlatformSchema = new Schema(
  {
    connected: { type: Boolean, default: false },
    customerId: String,
    accessToken: String, // Should be encrypted
    refreshToken: String, // Should be encrypted
    expiresAt: Date,
    lastSync: Date,
    metrics: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

/**
 * Meta Ads Platform Schema
 */
const MetaAdsPlatformSchema = new Schema(
  {
    connected: { type: Boolean, default: false },
    adAccountId: String,
    accessToken: String, // Should be encrypted
    expiresAt: Date,
    lastSync: Date,
    metrics: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

/**
 * LinkedIn Ads Platform Schema
 */
const LinkedInAdsPlatformSchema = new Schema(
  {
    connected: { type: Boolean, default: false },
    accountId: String,
    accessToken: String, // Should be encrypted
    refreshToken: String, // Should be encrypted
    expiresAt: Date,
    lastSync: Date,
    metrics: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

/**
 * Client Schema
 */
const ClientSchema = new Schema<Client>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
    },
    platforms: {
      googleAnalytics: {
        type: GoogleAnalyticsPlatformSchema,
        default: undefined,
      },
      googleAds: {
        type: GoogleAdsPlatformSchema,
        default: undefined,
      },
      metaAds: {
        type: MetaAdsPlatformSchema,
        default: undefined,
      },
      linkedInAds: {
        type: LinkedInAdsPlatformSchema,
        default: undefined,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Indexes for performance
 */

// Compound index for querying user's clients by status
ClientSchema.index({ userId: 1, status: 1 });

// Compound index for searching by userId and name
ClientSchema.index({ userId: 1, name: 1 });

/**
 * Instance Methods
 */

/**
 * Get list of connected platforms for this client
 */
ClientSchema.methods.getConnectedPlatforms = function (): string[] {
  const connected: string[] = [];

  if (this.platforms?.googleAnalytics?.connected) {
    connected.push('googleAnalytics');
  }
  if (this.platforms?.googleAds?.connected) {
    connected.push('googleAds');
  }
  if (this.platforms?.metaAds?.connected) {
    connected.push('metaAds');
  }
  if (this.platforms?.linkedInAds?.connected) {
    connected.push('linkedInAds');
  }

  return connected;
};

/**
 * Check if client has any platforms connected
 */
ClientSchema.methods.hasConnectedPlatforms = function (): boolean {
  return this.getConnectedPlatforms().length > 0;
};

/**
 * Archive the client (soft delete)
 */
ClientSchema.methods.archive = async function (): Promise<Client> {
  this.status = 'archived';
  return this.save();
};

/**
 * Activate the client
 */
ClientSchema.methods.activate = async function (): Promise<Client> {
  this.status = 'active';
  return this.save();
};

/**
 * Deactivate the client
 */
ClientSchema.methods.deactivate = async function (): Promise<Client> {
  this.status = 'inactive';
  return this.save();
};

/**
 * Static Methods
 */

/**
 * Find all active clients for a user
 */
ClientSchema.statics.findActiveByUser = function (
  userId: string
): Promise<Client[]> {
  return this.find({ userId, status: 'active' })
    .sort({ name: 1 }) // Alphabetical order
    .exec();
};

/**
 * Find all clients for a user (including archived)
 */
ClientSchema.statics.findAllByUser = function (
  userId: string
): Promise<Client[]> {
  return this.find({ userId })
    .sort({ status: 1, name: 1 }) // Active first, then alphabetical
    .exec();
};

/**
 * Find client by ID and userId (ensures user owns the client)
 */
ClientSchema.statics.findByIdAndUser = function (
  clientId: string,
  userId: string
): Promise<Client | null> {
  return this.findOne({ _id: clientId, userId }).exec();
};

/**
 * Create new client
 */
ClientSchema.statics.createClient = function (
  userId: string,
  name: string,
  email?: string,
  logo?: string
): Promise<Client> {
  return this.create({
    userId,
    name,
    email,
    logo,
    platforms: {},
    status: 'active',
  });
};

/**
 * Get client count for user
 */
ClientSchema.statics.countByUser = function (
  userId: string
): Promise<number> {
  return this.countDocuments({ userId, status: 'active' }).exec();
};

/**
 * Export Model
 * Use singleton pattern to prevent "model already defined" errors in development
 */
const ClientModel: Model<Client> =
  mongoose.models.Client || mongoose.model<Client>('Client', ClientSchema);

export default ClientModel;
