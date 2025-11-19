/**
 * Conversation Model
 * MongoDB schema for storing chat conversations
 */

import mongoose, { Schema, Model } from 'mongoose';
import type { Conversation, Message, ConversationStatus } from '@/types/chat';

/**
 * Message Schema (embedded in Conversation)
 */
const MessageSchema = new Schema<Message>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000, // Prevent extremely long messages
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false } // Don't create separate IDs for embedded messages
);

/**
 * Conversation Schema
 */
const ConversationSchema = new Schema<Conversation>(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true, // Index for fast lookups
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index for querying user's conversations
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true, // Index for querying client's conversations
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
      required: true,
    },
    messageCount: {
      type: Number,
      default: 0,
      required: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
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

// Multi-client compound index: Query user's conversations for a specific client
ConversationSchema.index({ userId: 1, clientId: 1, status: 1 });

// Index for querying client's conversations by last message time (for sorting)
ConversationSchema.index({ clientId: 1, lastMessageAt: -1 });

// Index for querying user's conversations by status (backwards compatibility)
ConversationSchema.index({ userId: 1, status: 1 });

// Index for querying by last message time (for sorting)
ConversationSchema.index({ userId: 1, lastMessageAt: -1 });

// TTL index - automatically delete conversations after 90 days
ConversationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 } // 90 days in seconds
);

/**
 * Instance Methods
 */

/**
 * Add a message to the conversation
 */
ConversationSchema.methods.addMessage = async function (
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<Conversation> {
  this.messages.push({
    role,
    content,
    timestamp: new Date(),
  });

  this.messageCount = this.messages.length;
  this.lastMessageAt = new Date();

  return this.save();
};

/**
 * Archive the conversation
 */
ConversationSchema.methods.archive = async function (): Promise<Conversation> {
  this.status = 'archived';
  return this.save();
};

/**
 * Soft delete the conversation
 */
ConversationSchema.methods.softDelete = async function (): Promise<Conversation> {
  this.status = 'deleted';
  return this.save();
};

/**
 * Get conversation summary (first user message)
 */
ConversationSchema.methods.getSummary = function (): string {
  const firstUserMessage = this.messages.find((msg: Message) => msg.role === 'user');
  if (!firstUserMessage) return 'New conversation';

  // Truncate to 50 characters
  return firstUserMessage.content.length > 50
    ? firstUserMessage.content.substring(0, 50) + '...'
    : firstUserMessage.content;
};

/**
 * Static Methods
 */

/**
 * Find active conversations for a user and client
 */
ConversationSchema.statics.findActiveByUser = function (
  userId: string,
  clientId?: string
): Promise<Conversation[]> {
  const query: any = { userId, status: 'active' };

  // If clientId provided, filter by client (multi-client mode)
  if (clientId) {
    query.clientId = clientId;
  }

  return this.find(query)
    .sort({ lastMessageAt: -1 }) // Most recent first
    .limit(50) // Limit to 50 conversations
    .exec();
};

/**
 * Find conversation by conversationId and userId
 */
ConversationSchema.statics.findByConversationId = function (
  conversationId: string,
  userId: string
): Promise<Conversation | null> {
  return this.findOne({ conversationId, userId }).exec();
};

/**
 * Create new conversation
 */
ConversationSchema.statics.createConversation = function (
  conversationId: string,
  userId: string,
  clientId: string
): Promise<Conversation> {
  return this.create({
    conversationId,
    userId,
    clientId,
    messages: [],
    status: 'active',
    messageCount: 0,
    lastMessageAt: new Date(),
  });
};

/**
 * Get conversation count for user
 */
ConversationSchema.statics.countByUser = function (
  userId: string
): Promise<number> {
  return this.countDocuments({ userId, status: 'active' }).exec();
};

/**
 * Pre-save hook to update messageCount
 */
ConversationSchema.pre('save', function (next) {
  // Update message count automatically
  if (this.isModified('messages')) {
    this.messageCount = this.messages.length;
  }
  next();
});

/**
 * Export Model
 * Use singleton pattern to prevent "model already defined" errors in development
 */
const ConversationModel: Model<Conversation> =
  mongoose.models.Conversation ||
  mongoose.model<Conversation>('Conversation', ConversationSchema);

export default ConversationModel;
