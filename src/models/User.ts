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

  // OAuth provider data (OAuth-only authentication)
  provider: 'google' | 'github';
  providerId?: string;

  // User metadata
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';

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
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance
 */
UserSchema.index({ email: 1 });
UserSchema.index({ providerId: 1 });
UserSchema.index({ status: 1 });

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
  return this.create({
    email: profile.email,
    name: profile.name,
    image: profile.image,
    emailVerified: new Date(),
    provider: profile.provider,
    providerId: profile.providerId,
    status: 'active',
  });
};

/**
 * Model Interface (with static methods)
 */
interface IUserModel extends Model<IUser> {
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
