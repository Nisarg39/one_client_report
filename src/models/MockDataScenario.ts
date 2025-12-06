/**
 * MockDataScenario Model
 *
 * Stores pre-built and instructor-created case study scenarios
 * for education mode with simulated platform data
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

/**
 * Mock Data Scenario Document Interface
 */
export interface IMockDataScenario {
  _id: Types.ObjectId;

  // Metadata
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  industry: string;

  // Generated platform data (frozen snapshot)
  platformData: {
    googleAnalyticsMulti?: any;
    googleAds?: any;
    metaAds?: any;
    linkedInAds?: any;
  };

  // Learning components
  learningObjectives: string[];
  keyInsights: string[];
  modelAnswer?: string; // Hidden from students

  // Instructor tools
  createdBy: Types.ObjectId; // Instructor who created it
  isPublic: boolean; // Can other instructors use it?
  usageCount: number; // How many students have used it

  // Analytics
  avgCompletionTime?: number; // Minutes
  avgStudentScore?: number; // 0-100

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Instance Methods
 */
export interface IMockDataScenarioMethods {
  incrementUsage(): Promise<any>;
  updateAnalytics(completionTime: number, score?: number): Promise<any>;
}

/**
 * Static Methods
 */
export interface IMockDataScenarioModel extends Model<IMockDataScenario, {}, IMockDataScenarioMethods> {
  findByDifficulty(difficulty: string): Promise<any[]>;
  findPublicScenarios(): Promise<any[]>;
  findByInstructor(instructorId: string): Promise<any[]>;
}

/**
 * MockDataScenario Schema
 */
const MockDataScenarioSchema = new Schema<IMockDataScenario, IMockDataScenarioModel, IMockDataScenarioMethods>(
  {
    // Metadata
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Platform data (stored as JSON)
    platformData: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // Learning components
    learningObjectives: {
      type: [String],
      default: [],
    },
    keyInsights: {
      type: [String],
      default: [],
    },
    modelAnswer: {
      type: String,
      maxlength: 5000,
    },

    // Instructor tools
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },

    // Analytics
    avgCompletionTime: {
      type: Number,
      default: 0,
    },
    avgStudentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for Performance
 */
MockDataScenarioSchema.index({ difficulty: 1, isPublic: 1 });
MockDataScenarioSchema.index({ createdBy: 1 });
MockDataScenarioSchema.index({ industry: 1, difficulty: 1 });

/**
 * Instance Methods
 */

/**
 * Increment usage count when a student uses this scenario
 */
MockDataScenarioSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  return this.save();
};

/**
 * Update analytics with completion time and score
 */
MockDataScenarioSchema.methods.updateAnalytics = async function (
  completionTime: number,
  score?: number
) {
  // Update average completion time
  const totalCompletionTime = (this.avgCompletionTime || 0) * (this.usageCount - 1) + completionTime;
  this.avgCompletionTime = totalCompletionTime / this.usageCount;

  // Update average score if provided
  if (score !== undefined) {
    const totalScore = (this.avgStudentScore || 0) * (this.usageCount - 1) + score;
    this.avgStudentScore = totalScore / this.usageCount;
  }

  return this.save();
};

/**
 * Static Methods
 */

/**
 * Find scenarios by difficulty level
 */
MockDataScenarioSchema.statics.findByDifficulty = function (difficulty: string) {
  return this.find({ difficulty, isPublic: true })
    .sort({ usageCount: -1 }) // Most popular first
    .exec();
};

/**
 * Find all public scenarios
 */
MockDataScenarioSchema.statics.findPublicScenarios = function () {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .exec();
};

/**
 * Find scenarios created by a specific instructor
 */
MockDataScenarioSchema.statics.findByInstructor = function (instructorId: string) {
  return this.find({ createdBy: instructorId })
    .sort({ createdAt: -1 })
    .exec();
};

/**
 * Export Model
 */
const MockDataScenarioModel =
  (mongoose.models.MockDataScenario as IMockDataScenarioModel) ||
  mongoose.model<IMockDataScenario, IMockDataScenarioModel>('MockDataScenario', MockDataScenarioSchema);

export default MockDataScenarioModel;
