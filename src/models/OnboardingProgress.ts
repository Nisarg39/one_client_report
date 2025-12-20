/**
 * OnboardingProgress Mongoose Model
 *
 * Tracks user onboarding completion status
 * Used to determine if new users should be redirected to onboarding flow
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * OnboardingProgress Document Interface
 */
export interface IOnboardingProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;  // Reference to User
  completed: boolean;
  currentStep: number;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * OnboardingProgress Schema
 */
const OnboardingProgressSchema = new Schema<IOnboardingProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,  // One onboarding record per user
    },
    completed: {
      type: Boolean,
      default: false,
    },
    currentStep: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,  // 4 onboarding steps (adjust based on your onboarding flow)
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance
 */
OnboardingProgressSchema.index({ completed: 1 });

/**
 * Static Methods
 */

/**
 * Find onboarding progress by user ID
 */
OnboardingProgressSchema.statics.findByUserId = async function (
  userId: string | mongoose.Types.ObjectId
) {
  return this.findOne({ userId });
};

/**
 * Mark onboarding as completed
 */
OnboardingProgressSchema.statics.markCompleted = async function (
  userId: string | mongoose.Types.ObjectId
) {
  return this.findOneAndUpdate(
    { userId },
    {
      completed: true,
      currentStep: 4,  // Final step
      completedAt: new Date(),
    },
    {
      upsert: true,  // Create if doesn't exist
      new: true,
    }
  );
};

/**
 * Update current step
 */
OnboardingProgressSchema.statics.updateStep = async function (
  userId: string | mongoose.Types.ObjectId,
  step: number
) {
  return this.findOneAndUpdate(
    { userId },
    {
      currentStep: step,
    },
    {
      upsert: true,
      new: true,
    }
  );
};

/**
 * Model Interface (with static methods)
 */
interface IOnboardingProgressModel extends Model<IOnboardingProgress> {
  findByUserId(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IOnboardingProgress | null>;
  markCompleted(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IOnboardingProgress>;
  updateStep(
    userId: string | mongoose.Types.ObjectId,
    step: number
  ): Promise<IOnboardingProgress>;
}

/**
 * Export Model
 */
const OnboardingProgressModel: IOnboardingProgressModel =
  (mongoose.models.OnboardingProgress as IOnboardingProgressModel) ||
  mongoose.model<IOnboardingProgress, IOnboardingProgressModel>(
    'OnboardingProgress',
    OnboardingProgressSchema
  );

export default OnboardingProgressModel;
