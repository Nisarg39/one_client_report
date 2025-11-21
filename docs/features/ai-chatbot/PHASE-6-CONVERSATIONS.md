# Phase 6: Conversation Persistence & History

**Document Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** Implementation Roadmap
**Timeline:** 1-2 weeks
**Priority:** High

---

## Table of Contents

1. [Overview](#overview)
2. [Current State](#current-state)
3. [Enhanced Architecture](#enhanced-architecture)
4. [Data Models](#data-models)
5. [Persistence Strategy](#persistence-strategy)
6. [Retrieval & Search](#retrieval--search)
7. [Performance Optimizations](#performance-optimizations)
8. [Export Functionality](#export-functionality)
9. [Implementation Plan](#implementation-plan)
10. [Success Criteria](#success-criteria)

---

## Overview

### Purpose
Implement robust conversation persistence, enabling users to access chat history, search past conversations, and export data for reporting purposes.

### Goals
1. **Complete History**: Store all conversations permanently
2. **Fast Retrieval**: Quick access to recent and archived chats
3. **Smart Search**: Find conversations by content, date, client, or topic
4. **Export Options**: Download conversations in multiple formats
5. **Data Integrity**: Never lose user conversations

### Deliverables
- Enhanced Conversation model with full message history
- Conversation list UI with search/filter
- Message retrieval with pagination
- Export functionality (JSON, CSV, PDF)
- Archive/delete conversations
- Conversation analytics dashboard

---

## Current State

### What's Already Implemented

```typescript
// Current Conversation Model (from Phase 4)
interface Conversation {
  conversationId: string;
  clientId: ObjectId;
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  messageCount: number;
  lastMessageAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Current Features
✅ Create new conversations
✅ Add messages to conversations
✅ Get conversation by ID
✅ List conversations by client
✅ Soft delete conversations
✅ Auto-generate summary from first messages
```

### Gaps to Address

```
❌ No full-text search on conversation content
❌ No conversation tagging or categorization
❌ No export functionality
❌ No conversation analytics
❌ Limited pagination (loads all messages)
❌ No message editing history
❌ No conversation sharing
❌ No conversation templates
```

---

## Enhanced Architecture

### Conversation Management System

```
┌─────────────────────────────────────────────────────────────┐
│                    Chat Interface                           │
│  - Current conversation view                                │
│  - Sidebar with conversation list                           │
│  - Search bar                                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            Conversation Service Layer                       │
│  - Create/read/update/delete operations                     │
│  - Search & filter                                          │
│  - Pagination                                               │
│  - Export                                                   │
└───────┬───────────┬──────────┬──────────┬──────────────────┘
        │           │          │          │
        ▼           ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
   │MongoDB │ │ Redis  │ │Search  │ │ Export  │
   │Storage │ │ Cache  │ │ Index  │ │ Service │
   │        │ │        │ │(Algolia)│ │         │
   └────────┘ └────────┘ └────────┘ └─────────┘
```

### Directory Structure

```
src/
├── app/
│   ├── chat/
│   │   ├── page.tsx                    # Main chat page
│   │   ├── [conversationId]/
│   │   │   └── page.tsx               # Individual conversation view
│   │   └── history/
│   │       └── page.tsx               # Conversation history page
│   └── actions/
│       └── conversations/
│           ├── createConversation.ts
│           ├── getConversation.ts
│           ├── getConversations.ts    # ✅ Already exists
│           ├── updateConversation.ts
│           ├── deleteConversation.ts
│           ├── searchConversations.ts  # 🆕 New
│           ├── exportConversation.ts   # 🆕 New
│           └── archiveConversation.ts  # 🆕 New
├── components/
│   └── chat/
│       ├── ChatSidebar.tsx            # ✅ Already exists
│       ├── ConversationList.tsx       # 🆕 Enhanced version
│       ├── ConversationSearch.tsx     # 🆕 New
│       ├── ConversationItem.tsx       # 🆕 New
│       ├── ExportMenu.tsx             # 🆕 New
│       └── ConversationAnalytics.tsx  # 🆕 New
├── lib/
│   ├── conversations/
│   │   ├── search.ts                  # 🆕 Search implementation
│   │   ├── export.ts                  # 🆕 Export utilities
│   │   └── analytics.ts               # 🆕 Analytics
│   └── cache/
│       └── conversations.ts           # 🆕 Caching strategies
└── models/
    └── Conversation.ts                # Enhanced model
```

---

## Data Models

### Enhanced Conversation Model

```typescript
// src/models/Conversation.ts (Enhanced)

import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    platform?: string;           // Which platform data was queried
    tokensUsed?: number;         // AI tokens used
    responseTime?: number;       // Response time in ms
    error?: string;              // If there was an error
  };
}

export interface IConversation extends Document {
  conversationId: string;
  clientId: mongoose.Types.ObjectId;
  userId: string;

  // Message history
  messages: IMessage[];
  messageCount: number;

  // Metadata
  title: string;                      // 🆕 Auto-generated or user-set
  summary: string;
  tags: string[];                     // 🆕 User-defined tags
  category?: string;                  // 🆕 Auto-categorized (analytics, campaigns, etc.)

  // Analytics
  platformsQueried: string[];         // 🆕 Track which platforms were used
  avgResponseTime: number;            // 🆕 Average AI response time
  totalTokensUsed: number;            // 🆕 Total AI tokens

  // State
  isActive: boolean;
  isArchived: boolean;                // 🆕 Archive instead of delete
  isPinned: boolean;                  // 🆕 Pin important conversations
  status: 'active' | 'archived' | 'deleted';  // 🆕

  // Timestamps
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;                  // 🆕

  // Methods
  getSummary(): string;
  addMessage(message: IMessage): Promise<void>;
  updateAnalytics(metadata: IMessage['metadata']): void;
  archive(): Promise<void>;
  pin(): Promise<void>;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    platform: String,
    tokensUsed: Number,
    responseTime: Number,
    error: String,
  },
});

const ConversationSchema = new Schema<IConversation>(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
    messageCount: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      enum: ['analytics', 'campaigns', 'performance', 'troubleshooting', 'general'],
      index: true,
    },
    platformsQueried: {
      type: [String],
      default: [],
    },
    avgResponseTime: {
      type: Number,
      default: 0,
    },
    totalTokensUsed: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
      index: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    archivedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
ConversationSchema.index({ userId: 1, status: 1, lastMessageAt: -1 });
ConversationSchema.index({ clientId: 1, status: 1, lastMessageAt: -1 });
ConversationSchema.index({ userId: 1, isPinned: -1, lastMessageAt: -1 });

// Full-text search index
ConversationSchema.index({
  title: 'text',
  summary: 'text',
  'messages.content': 'text',
});

/**
 * Instance Methods
 */

ConversationSchema.methods.addMessage = async function (message: IMessage) {
  this.messages.push(message);
  this.messageCount = this.messages.length;
  this.lastMessageAt = message.timestamp;

  // Auto-generate title from first user message
  if (!this.title && message.role === 'user' && this.messageCount === 1) {
    this.title = message.content.substring(0, 60) + (message.content.length > 60 ? '...' : '');
  }

  // Update analytics
  if (message.metadata) {
    this.updateAnalytics(message.metadata);
  }

  await this.save();
};

ConversationSchema.methods.updateAnalytics = function (metadata: IMessage['metadata']) {
  if (metadata?.platform && !this.platformsQueried.includes(metadata.platform)) {
    this.platformsQueried.push(metadata.platform);
  }

  if (metadata?.tokensUsed) {
    this.totalTokensUsed += metadata.tokensUsed;
  }

  if (metadata?.responseTime) {
    // Update running average
    const totalMessages = this.messageCount;
    this.avgResponseTime =
      (this.avgResponseTime * (totalMessages - 1) + metadata.responseTime) / totalMessages;
  }
};

ConversationSchema.methods.archive = async function () {
  this.isArchived = true;
  this.status = 'archived';
  this.archivedAt = new Date();
  await this.save();
};

ConversationSchema.methods.pin = async function () {
  this.isPinned = !this.isPinned;
  await this.save();
};

/**
 * Static Methods
 */

ConversationSchema.statics.findActiveByUser = async function (
  userId: string,
  clientId?: string,
  limit: number = 50,
  skip: number = 0
) {
  const query: any = {
    userId,
    status: 'active',
  };

  if (clientId) {
    query.clientId = new mongoose.Types.ObjectId(clientId);
  }

  return this.find(query)
    .sort({ isPinned: -1, lastMessageAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-messages'); // Exclude messages for list view
};

ConversationSchema.statics.searchConversations = async function (
  userId: string,
  searchQuery: string,
  filters?: {
    clientId?: string;
    tags?: string[];
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const query: any = {
    userId,
    status: { $ne: 'deleted' },
    $text: { $search: searchQuery },
  };

  if (filters?.clientId) {
    query.clientId = new mongoose.Types.ObjectId(filters.clientId);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters?.category) {
    query.category = filters.category;
  }

  if (filters?.startDate || filters?.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = filters.startDate;
    if (filters.endDate) query.createdAt.$lte = filters.endDate;
  }

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .select('-messages');
};

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);
```

---

## Persistence Strategy

### Message Storage

```typescript
// src/lib/conversations/persistence.ts

import ConversationModel from '@/models/Conversation';
import { redis } from '@/lib/cache/redis';

/**
 * Save message to conversation
 * - Updates MongoDB document
 * - Invalidates cache
 * - Updates analytics
 */
export async function persistMessage(
  conversationId: string,
  message: {
    role: 'user' | 'assistant';
    content: string;
    metadata?: any;
  }
) {
  const conversation = await ConversationModel.findOne({ conversationId });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  await conversation.addMessage({
    ...message,
    timestamp: new Date(),
  });

  // Invalidate cache
  await redis.del(`conversation:${conversationId}`);
  await redis.del(`conversations:list:${conversation.userId}`);

  return conversation;
}

/**
 * Batch save messages (for imports or migrations)
 */
export async function batchPersistMessages(
  conversationId: string,
  messages: Array<{ role: string; content: string; timestamp: Date }>
) {
  const conversation = await ConversationModel.findOne({ conversationId });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  conversation.messages.push(...messages);
  conversation.messageCount = conversation.messages.length;
  conversation.lastMessageAt = messages[messages.length - 1].timestamp;

  await conversation.save();

  // Invalidate cache
  await redis.del(`conversation:${conversationId}`);
}
```

### Caching Strategy

```typescript
// src/lib/cache/conversations.ts

import { redis } from './redis';

const CACHE_TTL = {
  conversationList: 300,        // 5 minutes
  conversationDetail: 600,      // 10 minutes
  conversationSearch: 180,      // 3 minutes
};

/**
 * Cache conversation list for a user
 */
export async function cacheConversationList(
  userId: string,
  conversations: any[]
) {
  const key = `conversations:list:${userId}`;
  await redis.set(key, JSON.stringify(conversations), {
    ex: CACHE_TTL.conversationList,
  });
}

/**
 * Get cached conversation list
 */
export async function getCachedConversationList(userId: string) {
  const key = `conversations:list:${userId}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached as string) : null;
}

/**
 * Cache individual conversation
 */
export async function cacheConversation(conversationId: string, conversation: any) {
  const key = `conversation:${conversationId}`;
  await redis.set(key, JSON.stringify(conversation), {
    ex: CACHE_TTL.conversationDetail,
  });
}

/**
 * Get cached conversation
 */
export async function getCachedConversation(conversationId: string) {
  const key = `conversation:${conversationId}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached as string) : null;
}
```

---

## Retrieval & Search

### Advanced Search Implementation

```typescript
// src/app/actions/conversations/searchConversations.ts

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';

const SearchSchema = z.object({
  query: z.string().min(1),
  clientId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().default(20),
  skip: z.number().default(0),
});

export async function searchConversations(input: z.infer<typeof SearchSchema>) {
  try {
    const validated = SearchSchema.parse(input);

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    await connectDB();

    const filters: any = {};

    if (validated.clientId) {
      filters.clientId = validated.clientId;
    }

    if (validated.tags) {
      filters.tags = validated.tags;
    }

    if (validated.category) {
      filters.category = validated.category;
    }

    if (validated.startDate) {
      filters.startDate = new Date(validated.startDate);
    }

    if (validated.endDate) {
      filters.endDate = new Date(validated.endDate);
    }

    const results = await (ConversationModel as any).searchConversations(
      user.id,
      validated.query,
      filters
    );

    // Paginate
    const paginatedResults = results.slice(validated.skip, validated.skip + validated.limit);

    return {
      success: true,
      conversations: paginatedResults.map((conv: any) => ({
        conversationId: conv.conversationId,
        clientId: String(conv.clientId),
        title: conv.title,
        summary: conv.summary,
        tags: conv.tags,
        messageCount: conv.messageCount,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        createdAt: conv.createdAt.toISOString(),
      })),
      total: results.length,
      hasMore: validated.skip + validated.limit < results.length,
    };
  } catch (error: any) {
    console.error('[searchConversations] Error:', error);
    return {
      success: false,
      error: 'Search failed. Please try again.',
    };
  }
}
```

### Pagination with Cursor

```typescript
// src/app/actions/conversations/getConversationsPaginated.ts

'use server';

export async function getConversationsPaginated(input: {
  clientId?: string;
  cursor?: string;  // Last conversation ID
  limit?: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    await connectDB();

    const query: any = {
      userId: user.id,
      status: 'active',
    };

    if (input.clientId) {
      query.clientId = new mongoose.Types.ObjectId(input.clientId);
    }

    // Cursor-based pagination
    if (input.cursor) {
      const cursorConv = await ConversationModel.findOne({
        conversationId: input.cursor,
      });

      if (cursorConv) {
        query.lastMessageAt = { $lt: cursorConv.lastMessageAt };
      }
    }

    const limit = input.limit || 20;

    const conversations = await ConversationModel.find(query)
      .sort({ isPinned: -1, lastMessageAt: -1 })
      .limit(limit + 1) // Fetch one extra to determine if there are more
      .select('-messages');

    const hasMore = conversations.length > limit;
    const results = hasMore ? conversations.slice(0, limit) : conversations;

    return {
      success: true,
      conversations: results.map((conv) => ({
        conversationId: conv.conversationId,
        clientId: String(conv.clientId),
        title: conv.title,
        summary: conv.summary,
        tags: conv.tags,
        isPinned: conv.isPinned,
        messageCount: conv.messageCount,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        createdAt: conv.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? results[results.length - 1].conversationId : null,
      hasMore,
    };
  } catch (error: any) {
    console.error('[getConversationsPaginated] Error:', error);
    return { success: false, error: 'Failed to fetch conversations' };
  }
}
```

---

## Performance Optimizations

### Message Lazy Loading

```typescript
// Load initial messages (last 50) then paginate older messages

export async function getConversationMessages(
  conversationId: string,
  options: {
    limit?: number;
    before?: Date;  // Get messages before this timestamp
  } = {}
) {
  const conversation = await ConversationModel.findOne({ conversationId });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  let messages = conversation.messages;

  // Filter by timestamp if provided
  if (options.before) {
    messages = messages.filter((m) => m.timestamp < options.before!);
  }

  // Sort newest first
  messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Limit
  const limit = options.limit || 50;
  messages = messages.slice(0, limit);

  // Reverse to show oldest first
  messages.reverse();

  return {
    messages,
    hasMore: conversation.messages.length > limit,
  };
}
```

### Database Indexes

```typescript
// Optimized indexes for common queries

// 1. User's active conversations sorted by last message
ConversationSchema.index({ userId: 1, status: 1, lastMessageAt: -1 });

// 2. Client's conversations
ConversationSchema.index({ clientId: 1, status: 1, lastMessageAt: -1 });

// 3. Pinned conversations first
ConversationSchema.index({ userId: 1, isPinned: -1, lastMessageAt: -1 });

// 4. Full-text search
ConversationSchema.index({
  title: 'text',
  summary: 'text',
  'messages.content': 'text',
});

// 5. Tag filtering
ConversationSchema.index({ tags: 1 });

// 6. Category filtering
ConversationSchema.index({ category: 1 });
```

---

## Export Functionality

### Export Service

```typescript
// src/lib/conversations/export.ts

import ConversationModel from '@/models/Conversation';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'markdown';

/**
 * Export conversation to various formats
 */
export async function exportConversation(
  conversationId: string,
  format: ExportFormat
): Promise<Buffer | string> {
  const conversation = await ConversationModel.findOne({ conversationId })
    .populate('clientId', 'name email');

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  switch (format) {
    case 'json':
      return exportAsJSON(conversation);
    case 'csv':
      return exportAsCSV(conversation);
    case 'pdf':
      return exportAsPDF(conversation);
    case 'markdown':
      return exportAsMarkdown(conversation);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function exportAsJSON(conversation: any): string {
  return JSON.stringify(
    {
      conversationId: conversation.conversationId,
      title: conversation.title,
      client: conversation.clientId?.name,
      createdAt: conversation.createdAt,
      messageCount: conversation.messageCount,
      messages: conversation.messages.map((m: any) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
    },
    null,
    2
  );
}

function exportAsCSV(conversation: any): string {
  const data = conversation.messages.map((m: any) => ({
    timestamp: m.timestamp.toISOString(),
    role: m.role,
    content: m.content.replace(/\n/g, ' '),
  }));

  const parser = new Parser({
    fields: ['timestamp', 'role', 'content'],
  });

  return parser.parse(data);
}

async function exportAsPDF(conversation: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(18).text(conversation.title || 'Conversation', { align: 'center' });
    doc.fontSize(12).text(`Client: ${conversation.clientId?.name || 'N/A'}`, { align: 'center' });
    doc.fontSize(10).text(`Date: ${conversation.createdAt.toLocaleDateString()}`, {
      align: 'center',
    });
    doc.moveDown(2);

    // Messages
    conversation.messages.forEach((message: any) => {
      doc
        .fontSize(10)
        .fillColor('#666')
        .text(
          `${message.role.toUpperCase()} - ${message.timestamp.toLocaleString()}`,
          { continued: false }
        );

      doc.fontSize(11).fillColor('#000').text(message.content);
      doc.moveDown();
    });

    doc.end();
  });
}

function exportAsMarkdown(conversation: any): string {
  let markdown = `# ${conversation.title || 'Conversation'}\n\n`;
  markdown += `**Client:** ${conversation.clientId?.name || 'N/A'}  \n`;
  markdown += `**Date:** ${conversation.createdAt.toLocaleDateString()}  \n`;
  markdown += `**Messages:** ${conversation.messageCount}  \n\n`;
  markdown += `---\n\n`;

  conversation.messages.forEach((message: any) => {
    const timestamp = message.timestamp.toLocaleString();
    markdown += `### ${message.role.toUpperCase()} - ${timestamp}\n\n`;
    markdown += `${message.content}\n\n`;
  });

  return markdown;
}
```

### Export Server Action

```typescript
// src/app/actions/conversations/exportConversation.ts

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import { exportConversation } from '@/lib/conversations/export';
import { connectDB } from '@/lib/db';

const ExportSchema = z.object({
  conversationId: z.string().min(1),
  format: z.enum(['json', 'csv', 'pdf', 'markdown']),
});

export async function exportConversationAction(input: z.infer<typeof ExportSchema>) {
  try {
    const validated = ExportSchema.parse(input);

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    await connectDB();

    const exported = await exportConversation(validated.conversationId, validated.format);

    // Convert Buffer to base64 for PDF
    const data =
      validated.format === 'pdf'
        ? Buffer.from(exported as Buffer).toString('base64')
        : exported;

    return {
      success: true,
      data,
      format: validated.format,
    };
  } catch (error: any) {
    console.error('[exportConversation] Error:', error);
    return {
      success: false,
      error: 'Export failed. Please try again.',
    };
  }
}
```

---

## Implementation Plan

### Week 1: Enhanced Model & Core Features

#### Day 1-2: Update Data Model
- [ ] Enhance Conversation model with new fields
- [ ] Add indexes for performance
- [ ] Create migration script for existing conversations
- [ ] Test model methods

#### Day 3-4: Persistence & Caching
- [ ] Implement caching layer
- [ ] Add message persistence optimizations
- [ ] Test cache invalidation
- [ ] Performance benchmarking

#### Day 5: Search Implementation
- [ ] Implement full-text search
- [ ] Add filtering by tags, category, date
- [ ] Test search accuracy
- [ ] Optimize search queries

### Week 2: UI & Export Features

#### Day 1-2: Conversation List UI
- [ ] Build ConversationList component with pagination
- [ ] Add search interface
- [ ] Implement tag filtering
- [ ] Add pin/archive actions

#### Day 3-4: Export Functionality
- [ ] Implement export service (JSON, CSV, PDF, Markdown)
- [ ] Build export UI component
- [ ] Test all export formats
- [ ] Add download functionality

#### Day 5: Polish & Testing
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation

---

## Success Criteria

### Functional Requirements
- [ ] All conversations persisted permanently
- [ ] Fast conversation retrieval (< 200ms)
- [ ] Full-text search working accurately
- [ ] Export to all 4 formats functional
- [ ] Pagination smooth and performant
- [ ] Archive/pin features working
- [ ] Cache hit rate > 70%

### Performance Requirements
- [ ] Conversation list loads in < 500ms
- [ ] Search results in < 1s
- [ ] Export generation in < 3s
- [ ] Database queries optimized with indexes
- [ ] No memory leaks on large conversations

### User Experience
- [ ] Intuitive conversation navigation
- [ ] Search feels instant
- [ ] Export downloads immediately
- [ ] No data loss ever
- [ ] Smooth scrolling and pagination

---

**Next Phase**: [PHASE-7-LAUNCH.md](./PHASE-7-LAUNCH.md) - Testing, Deployment & Launch
