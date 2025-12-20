/**
 * Client Model
 * MongoDB schema for storing client information and platform connections
 * Multi-client architecture: Each user can manage multiple clients
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

/**
 * Platform Data Interfaces
 */
interface PlatformMetrics {
  sessions?: number;
  users?: number;
  pageviews?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
}

interface PlatformDimensions {
  topSources?: { source: string; sessions: number }[];
  devices?: { device: string; percentage: number }[];
  topPages?: { page: string; views: number }[];
}

interface GoogleAnalyticsPlatform {
  connected: boolean;
  accountId?: string;
  propertyId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastSync?: Date;
  status: 'active' | 'expired' | 'error';
  metrics?: PlatformMetrics;
  dimensions?: PlatformDimensions;
}

interface Campaign {
  name: string;
  spend: number;
  clicks: number;
  impressions: number;
  ctr?: number;
  conversions?: number;
  cpm?: number;
  roas?: number;
  leads?: number;
}

interface GoogleAdsPlatform {
  connected: boolean;
  customerId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastSync?: Date;
  status: 'active' | 'expired' | 'error';
  campaigns?: Campaign[];
}

interface MetaAdsPlatform {
  connected: boolean;
  adAccountId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastSync?: Date;
  status: 'active' | 'expired' | 'error';
  campaigns?: Campaign[];
}

interface LinkedInAdsPlatform {
  connected: boolean;
  accountId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastSync?: Date;
  status: 'active' | 'expired' | 'error';
  campaigns?: Campaign[];
}

/**
 * Client Document Interface
 */
export interface IClient {
  userId: Types.ObjectId;
  name: string;
  email?: string;
  logo?: string;
  platforms: {
    googleAnalytics?: GoogleAnalyticsPlatform;
    googleAds?: GoogleAdsPlatform;
    metaAds?: MetaAdsPlatform;
    linkedInAds?: LinkedInAdsPlatform;
  };
  status: 'active' | 'inactive' | 'archived';

  // Hybrid Mode: Data source and education metadata
  dataSource: 'real' | 'mock';
  mockScenario?: Types.ObjectId;
  educationMetadata?: {
    assignmentId?: string;
    caseStudyName?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    learningObjectives?: string[];
  };
}

/**
 * Client Instance Methods
 */
export interface IClientMethods {
  updatePlatform(platformName: string, platformData: any): Promise<any>;
  archive(): Promise<any>;
  getConnectedPlatforms(): string[];
  hasPlatformData(): boolean;
}

/**
 * Client Static Methods
 */
export interface IClientModel extends Model<IClient, {}, IClientMethods> {
  findByUserId(userId: string): Promise<any[]>;
  findByClientId(clientId: string, userId: string): Promise<any>;
  createClient(
    userId: string,
    name: string,
    email?: string,
    logo?: string
  ): Promise<any>;
}

/**
 * Client Schema
 */
const ClientSchema = new Schema<IClient, IClientModel, IClientMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    platforms: {
      googleAnalytics: {
        connected: { type: Boolean, default: false },
        accountId: String,
        propertyId: String,
        accessToken: String,
        refreshToken: String,
        expiresAt: Date,
        lastSync: Date,
        status: {
          type: String,
          enum: ['active', 'expired', 'error'],
          default: 'active',
        },
        metrics: {
          sessions: Number,
          users: Number,
          pageviews: Number,
          bounceRate: Number,
          avgSessionDuration: Number,
        },
        dimensions: {
          topSources: [
            {
              source: String,
              sessions: Number,
            },
          ],
          devices: [
            {
              device: String,
              percentage: Number,
            },
          ],
          topPages: [
            {
              page: String,
              views: Number,
            },
          ],
        },
      },
      googleAds: {
        connected: { type: Boolean, default: false },
        customerId: String,
        accessToken: String,
        refreshToken: String,
        expiresAt: Date,
        lastSync: Date,
        status: {
          type: String,
          enum: ['active', 'expired', 'error'],
          default: 'active',
        },
        campaigns: [
          {
            name: String,
            spend: Number,
            clicks: Number,
            impressions: Number,
            ctr: Number,
            conversions: Number,
          },
        ],
      },
      metaAds: {
        connected: { type: Boolean, default: false },
        adAccountId: String,
        accessToken: String,
        refreshToken: String,
        expiresAt: Date,
        lastSync: Date,
        status: {
          type: String,
          enum: ['active', 'expired', 'error'],
          default: 'active',
        },
        campaigns: [
          {
            name: String,
            spend: Number,
            impressions: Number,
            clicks: Number,
            cpm: Number,
            roas: Number,
          },
        ],
      },
      linkedInAds: {
        connected: { type: Boolean, default: false },
        accountId: String,
        accessToken: String,
        refreshToken: String,
        expiresAt: Date,
        lastSync: Date,
        status: {
          type: String,
          enum: ['active', 'expired', 'error'],
          default: 'active',
        },
        campaigns: [
          {
            name: String,
            spend: Number,
            impressions: Number,
            clicks: Number,
            leads: Number,
          },
        ],
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
      required: true,
    },
    // Hybrid Mode: Data source and education metadata
    dataSource: {
      type: String,
      enum: ['real', 'mock'],
      default: 'real',
      required: true,
    },
    mockScenario: {
      type: Schema.Types.ObjectId,
      ref: 'MockDataScenario',
    },
    educationMetadata: {
      assignmentId: String,
      caseStudyName: String,
      difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
      },
      learningObjectives: [String],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for Performance
 */
ClientSchema.index({ userId: 1, status: 1 });
ClientSchema.index({ userId: 1, name: 1 });
ClientSchema.index({ _id: 1, userId: 1 });
ClientSchema.index({ dataSource: 1 });
ClientSchema.index({ mockScenario: 1 });

/**
 * Instance Methods
 */
ClientSchema.methods.updatePlatform = async function (
  platformName: string,
  platformData: any
) {
  this.platforms = this.platforms || {};
  (this.platforms as any)[platformName] = platformData;
  return this.save();
};

ClientSchema.methods.archive = async function () {
  this.status = 'archived';
  return this.save();
};

ClientSchema.methods.getConnectedPlatforms = function (): string[] {
  const connected: string[] = [];

  if (this.platforms?.googleAnalytics?.connected) connected.push('Google Analytics');
  if (this.platforms?.googleAds?.connected) connected.push('Google Ads');
  if (this.platforms?.metaAds?.connected) connected.push('Meta Ads');
  if (this.platforms?.linkedInAds?.connected) connected.push('LinkedIn Ads');

  return connected;
};

ClientSchema.methods.hasPlatformData = function (): boolean {
  return this.getConnectedPlatforms().length > 0;
};

/**
 * Static Methods
 */
ClientSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId, status: 'active' })
    .sort({ name: 1 })
    .exec();
};

ClientSchema.statics.findByClientId = function (
  clientId: string,
  userId: string
) {
  return this.findOne({ _id: clientId, userId }).exec();
};

ClientSchema.statics.createClient = function (
  userId: string,
  name: string,
  email?: string,
  logo?: string
) {
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
 * Export Model
 */
const ClientModel =
  (mongoose.models.Client as IClientModel) ||
  mongoose.model<IClient, IClientModel>('Client', ClientSchema);

export default ClientModel;
