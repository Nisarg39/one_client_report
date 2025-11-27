/**
 * Platform Connection Model
 *
 * Stores encrypted OAuth credentials and connection metadata
 * for marketing platform integrations
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { encryptToken, decryptToken, EncryptedData } from '@/lib/platforms/encryption';
import { PlatformCredentials, PlatformConnectionStatus } from '@/lib/platforms/types';

/**
 * Platform Connection Document Interface
 */
export interface IPlatformConnection extends Document {
  userId: mongoose.Types.ObjectId;
  clientId: string;
  platformId: string;
  platformName: string;

  // Encrypted access token
  encryptedAccessToken: string;
  accessTokenIV: string;
  accessTokenAuthTag: string;

  // Encrypted refresh token (optional)
  encryptedRefreshToken?: string;
  refreshTokenIV?: string;
  refreshTokenAuthTag?: string;

  expiresAt: Date;
  scopes: string[];

  // Platform-specific metadata
  metadata: {
    accountId?: string;
    propertyId?: string;
    accountName?: string;
    [key: string]: any;
  };

  status: PlatformConnectionStatus;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Virtual methods
  getDecryptedAccessToken(): string;
  getDecryptedRefreshToken(): string | null;
  isExpired(): boolean;
  toPlatformCredentials(): PlatformCredentials;
}

/**
 * Static methods interface
 */
interface IPlatformConnectionModel extends Model<IPlatformConnection> {
  createConnection(data: {
    userId: string;
    clientId: string;
    platformId: string;
    platformName: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
    scopes: string[];
    metadata?: Record<string, any>;
  }): Promise<IPlatformConnection>;

  findByUserAndPlatform(
    userId: string,
    clientId: string,
    platformId: string
  ): Promise<IPlatformConnection | null>;

  findByUserId(userId: string): Promise<IPlatformConnection[]>;

  findByClientId(clientId: string): Promise<IPlatformConnection[]>;

  updateTokens(
    connectionId: string,
    accessToken: string,
    refreshToken: string | undefined,
    expiresAt: Date
  ): Promise<IPlatformConnection | null>;

  markAsExpired(connectionId: string): Promise<void>;

  markAsRevoked(connectionId: string): Promise<void>;

  deleteConnection(connectionId: string): Promise<void>;
}

/**
 * Platform Connection Schema
 */
const PlatformConnectionSchema = new Schema<IPlatformConnection>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clientId: {
      type: String,
      required: true,
      index: true,
    },
    platformId: {
      type: String,
      required: true,
      enum: ['google-analytics', 'meta-ads', 'google-ads', 'linkedin-ads'],
    },
    platformName: {
      type: String,
      required: true,
    },

    // Encrypted access token
    encryptedAccessToken: { type: String, required: true },
    accessTokenIV: { type: String, required: true },
    accessTokenAuthTag: { type: String, required: true },

    // Encrypted refresh token (optional)
    encryptedRefreshToken: String,
    refreshTokenIV: String,
    refreshTokenAuthTag: String,

    expiresAt: { type: Date, required: true },
    scopes: [{ type: String }],

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: String,
      enum: ['active', 'expired', 'revoked', 'error'],
      default: 'active',
      index: true,
    },

    lastSyncedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound indexes
PlatformConnectionSchema.index({ userId: 1, clientId: 1, platformId: 1 }, { unique: true });
PlatformConnectionSchema.index({ status: 1, expiresAt: 1 });

/**
 * Instance Methods
 */

// Get decrypted access token
PlatformConnectionSchema.methods.getDecryptedAccessToken = function (): string {
  const encryptedData: EncryptedData = {
    encrypted: this.encryptedAccessToken,
    iv: this.accessTokenIV,
    authTag: this.accessTokenAuthTag,
  };
  return decryptToken(encryptedData);
};

// Get decrypted refresh token
PlatformConnectionSchema.methods.getDecryptedRefreshToken = function (): string | null {
  if (!this.encryptedRefreshToken || !this.refreshTokenIV || !this.refreshTokenAuthTag) {
    return null;
  }

  const encryptedData: EncryptedData = {
    encrypted: this.encryptedRefreshToken,
    iv: this.refreshTokenIV,
    authTag: this.refreshTokenAuthTag,
  };
  return decryptToken(encryptedData);
};

// Check if token is expired (with 5-minute safety buffer)
PlatformConnectionSchema.methods.isExpired = function (): boolean {
  const now = new Date();
  const buffer = 5 * 60 * 1000; // 5 minute buffer
  return now.getTime() >= this.expiresAt.getTime() - buffer;
};

// Convert to PlatformCredentials
PlatformConnectionSchema.methods.toPlatformCredentials = function (): PlatformCredentials {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    clientId: this.clientId,
    platformId: this.platformId,
    accessToken: this.getDecryptedAccessToken(),
    refreshToken: this.getDecryptedRefreshToken() || undefined,
    expiresAt: this.expiresAt,
    scopes: this.scopes,
    metadata: this.metadata,
  };
};

/**
 * Static Methods
 */

// Create new connection with encrypted tokens
PlatformConnectionSchema.statics.createConnection = async function (data: {
  userId: string;
  clientId: string;
  platformId: string;
  platformName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
  metadata?: Record<string, any>;
}): Promise<IPlatformConnection> {
  // Encrypt access token
  const accessTokenData = encryptToken(data.accessToken);

  // Encrypt refresh token if provided
  let refreshTokenData: EncryptedData | undefined;
  if (data.refreshToken) {
    refreshTokenData = encryptToken(data.refreshToken);
  }

  // Create connection
  const connection = await this.create({
    userId: data.userId,
    clientId: data.clientId,
    platformId: data.platformId,
    platformName: data.platformName,
    encryptedAccessToken: accessTokenData.encrypted,
    accessTokenIV: accessTokenData.iv,
    accessTokenAuthTag: accessTokenData.authTag,
    encryptedRefreshToken: refreshTokenData?.encrypted,
    refreshTokenIV: refreshTokenData?.iv,
    refreshTokenAuthTag: refreshTokenData?.authTag,
    expiresAt: data.expiresAt,
    scopes: data.scopes,
    metadata: data.metadata || {},
    status: 'active',
  });

  return connection;
};

// Find connection by user and platform
PlatformConnectionSchema.statics.findByUserAndPlatform = async function (
  userId: string,
  clientId: string,
  platformId: string
): Promise<IPlatformConnection | null> {
  return this.findOne({ userId, clientId, platformId });
};

// Find all connections for a user
PlatformConnectionSchema.statics.findByUserId = async function (
  userId: string
): Promise<IPlatformConnection[]> {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Find all connections for a client
PlatformConnectionSchema.statics.findByClientId = async function (
  clientId: string
): Promise<IPlatformConnection[]> {
  return this.find({ clientId }).sort({ createdAt: -1 });
};

// Update tokens
PlatformConnectionSchema.statics.updateTokens = async function (
  connectionId: string,
  accessToken: string,
  refreshToken: string | undefined,
  expiresAt: Date
): Promise<IPlatformConnection | null> {
  const accessTokenData = encryptToken(accessToken);

  let refreshTokenData: EncryptedData | undefined;
  if (refreshToken) {
    refreshTokenData = encryptToken(refreshToken);
  }

  return this.findByIdAndUpdate(
    connectionId,
    {
      encryptedAccessToken: accessTokenData.encrypted,
      accessTokenIV: accessTokenData.iv,
      accessTokenAuthTag: accessTokenData.authTag,
      encryptedRefreshToken: refreshTokenData?.encrypted,
      refreshTokenIV: refreshTokenData?.iv,
      refreshTokenAuthTag: refreshTokenData?.authTag,
      expiresAt,
      status: 'active',
    },
    { new: true }
  );
};

// Mark as expired
PlatformConnectionSchema.statics.markAsExpired = async function (
  connectionId: string
): Promise<void> {
  await this.findByIdAndUpdate(connectionId, { status: 'expired' });
};

// Mark as revoked
PlatformConnectionSchema.statics.markAsRevoked = async function (
  connectionId: string
): Promise<void> {
  await this.findByIdAndUpdate(connectionId, { status: 'revoked' });
};

// Delete connection
PlatformConnectionSchema.statics.deleteConnection = async function (
  connectionId: string
): Promise<void> {
  await this.findByIdAndDelete(connectionId);
};

// Export model
const PlatformConnectionModel =
  (mongoose.models.PlatformConnection as IPlatformConnectionModel) ||
  mongoose.model<IPlatformConnection, IPlatformConnectionModel>(
    'PlatformConnection',
    PlatformConnectionSchema
  );

export default PlatformConnectionModel;
