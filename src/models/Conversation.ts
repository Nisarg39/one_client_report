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
    feedback: {
      type: String,
      enum: ['positive', 'negative'],
      required: false,
    },
    messageId: {
      type: String,
      required: false,
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
    // Phase 6: New fields for conversation features
    title: {
      type: String,
      maxlength: 100,
      default: '', // Empty string means use first message as title
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Phase 6.6: Token usage tracking for AI cost monitoring
    tokenUsage: {
      promptTokens: {
        type: Number,
        default: 0,
      },
      completionTokens: {
        type: Number,
        default: 0,
      },
      totalTokens: {
        type: Number,
        default: 0,
      },
    },
    archivedAt: {
      type: Date,
      required: false,
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

// Phase 6: Text index for full-text search on messages and title
ConversationSchema.index(
  { 'messages.content': 'text', title: 'text' },
  { name: 'conversation_text_search' }
);

// Phase 6: Compound index for pinned conversations (pinned first, then by date)
ConversationSchema.index({ userId: 1, clientId: 1, isPinned: -1, lastMessageAt: -1 });

// Phase 6: Index for filtering by status with pinned sort
ConversationSchema.index({ userId: 1, clientId: 1, status: 1, isPinned: -1, lastMessageAt: -1 });

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
  this.archivedAt = new Date();
  return this.save();
};

/**
 * Unarchive the conversation
 */
ConversationSchema.methods.unarchive = async function (): Promise<Conversation> {
  this.status = 'active';
  this.archivedAt = undefined;
  return this.save();
};

/**
 * Pin the conversation
 */
ConversationSchema.methods.pin = async function (): Promise<Conversation> {
  this.isPinned = true;
  return this.save();
};

/**
 * Unpin the conversation
 */
ConversationSchema.methods.unpin = async function (): Promise<Conversation> {
  this.isPinned = false;
  return this.save();
};

/**
 * Toggle pin status
 */
ConversationSchema.methods.togglePin = async function (): Promise<Conversation> {
  this.isPinned = !this.isPinned;
  return this.save();
};

/**
 * Rename the conversation
 */
ConversationSchema.methods.rename = async function (newTitle: string): Promise<Conversation> {
  this.title = newTitle.substring(0, 100); // Max 100 characters
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
 * Sorted by: pinned first, then by lastMessageAt
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
    .sort({ isPinned: -1, lastMessageAt: -1 }) // Pinned first, then most recent
    .limit(50) // Limit to 50 conversations
    .exec();
};

/**
 * Find conversations by status (active, archived) with pagination
 */
ConversationSchema.statics.findByStatus = function (
  userId: string,
  status: 'active' | 'archived' | 'all',
  clientId?: string,
  limit: number = 20,
  skip: number = 0
): Promise<Conversation[]> {
  const query: any = { userId };

  if (clientId) {
    query.clientId = clientId;
  }

  if (status !== 'all') {
    query.status = status;
  } else {
    // Exclude deleted when showing 'all'
    query.status = { $ne: 'deleted' };
  }

  return this.find(query)
    .sort({ isPinned: -1, lastMessageAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

/**
 * Count conversations by status
 */
ConversationSchema.statics.countByStatus = function (
  userId: string,
  status: 'active' | 'archived' | 'all',
  clientId?: string
): Promise<number> {
  const query: any = { userId };

  if (clientId) {
    query.clientId = clientId;
  }

  if (status !== 'all') {
    query.status = status;
  } else {
    query.status = { $ne: 'deleted' };
  }

  return this.countDocuments(query).exec();
};

/**
 * Search conversations by text query
 * Uses MongoDB text index on messages.content and title
 */
ConversationSchema.statics.searchConversations = function (
  userId: string,
  query: string,
  clientId?: string,
  limit: number = 20
): Promise<Conversation[]> {
  const searchQuery: any = {
    userId,
    status: { $ne: 'deleted' },
    $text: { $search: query },
  };

  if (clientId) {
    searchQuery.clientId = clientId;
  }

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
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
 * Conversation Instance Methods Interface
 */
interface IConversationMethods {
  addMessage(
    role: 'user' | 'assistant' | 'system',
    content: string
  ): Promise<any>;
  archive(): Promise<any>;
  unarchive(): Promise<any>;
  softDelete(): Promise<any>;
  getSummary(): string;
  pin(): Promise<any>;
  unpin(): Promise<any>;
  togglePin(): Promise<any>;
  rename(newTitle: string): Promise<any>;
}

/**
 * Conversation Static Methods Interface
 */
interface IConversationModel extends Model<Conversation, {}, IConversationMethods> {
  findActiveByUser(userId: string, clientId?: string): Promise<any[]>;
  findByStatus(
    userId: string,
    status: 'active' | 'archived' | 'all',
    clientId?: string,
    limit?: number,
    skip?: number
  ): Promise<any[]>;
  countByStatus(
    userId: string,
    status: 'active' | 'archived' | 'all',
    clientId?: string
  ): Promise<number>;
  searchConversations(
    userId: string,
    query: string,
    clientId?: string,
    limit?: number
  ): Promise<any[]>;
  findByConversationId(
    conversationId: string,
    userId: string
  ): Promise<any | null>;
  createConversation(
    conversationId: string,
    userId: string,
    clientId: string
  ): Promise<any>;
  countByUser(userId: string): Promise<number>;
}

/**
 * Export Model
 * Use singleton pattern to prevent "model already defined" errors in development
 */
const ConversationModel: IConversationModel =
  (mongoose.models.Conversation as unknown as IConversationModel) ||
  mongoose.model<Conversation, IConversationModel>('Conversation', ConversationSchema);

export default ConversationModel;
