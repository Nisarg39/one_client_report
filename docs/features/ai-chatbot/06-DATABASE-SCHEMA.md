# AI Chatbot - Database Schema Design

**Document Status**: ✅ Complete (Multi-Client Architecture)
**Last Updated**: 2025-11-19
**Owner**: Engineering Team

---

## Table of Contents
1. [MongoDB Collections](#1-mongodb-collections)
2. [Conversation Schema](#2-conversation-schema)
3. [Message Schema](#3-message-schema)
4. [User Integration Schema](#4-user-integration-schema)
5. [Chat Analytics Schema](#5-chat-analytics-schema)
6. [Indexes & Performance](#6-indexes--performance)
7. [Data Relationships](#7-data-relationships)
8. [Migrations & Versioning](#8-migrations--versioning)

---

## 1. MongoDB Collections

### Question:
What collections do you need for the chatbot?

**Recommended Collections:**

1. **clients** - Client management (multi-client architecture)
2. **conversations** - Chat conversation threads (per client)
3. **messages** (optional) - Individual messages (embedded in conversations)
4. **users** (existing) - User accounts (agency/freelancer owners)
5. **platformIntegrations** (deprecated) - Moved to Client.platforms (embedded)
6. **chatAnalytics** - Usage metrics and tracking

**Structure Options:**

**Option A: Embedded Messages**
```
conversations
  ├─ conversationId
  ├─ userId
  ├─ messages[] (embedded array)
  └─ metadata
```
- Pros: Single query to get conversation + messages
- Cons: Large documents if many messages

**Option B: Separate Messages Collection**
```
conversations               messages
  ├─ conversationId   ───►   ├─ conversationId (ref)
  ├─ userId                  ├─ role (user/assistant)
  └─ metadata                ├─ content
                             └─ timestamp
```
- Pros: Better for pagination, flexible queries
- Cons: Requires joins/lookups

### Your Answer:

**Chosen Structure:** [Embedded / Separate / Hybrid]

```
[Explain your choice]
```

**Collections to Create:**
```
1. [Collection name] - [Purpose]
2. [Collection name] - [Purpose]
3. ...
```

---

## 2. Client Schema (Multi-Client Architecture)

### Question:
What should the Client model look like?

**Mongoose Schema (TypeScript):**

```typescript
import { Schema, model, Types } from 'mongoose'

export interface IClient {
  _id: Types.ObjectId
  userId: Types.ObjectId // Agency/freelancer owner

  // Client Information
  name: string // "Acme Corp"
  email?: string // client@acmecorp.com
  logo?: string // URL to client logo

  // Platform connections (per client)
  platforms: {
    googleAnalytics?: {
      connected: boolean
      accountId: string
      propertyId: string
      accessToken: string // Encrypted
      refreshToken: string // Encrypted
      expiresAt: Date
      lastSync: Date
      metrics: {
        sessions: number
        users: number
        bounceRate: number
        pageViews: number
        avgSessionDuration: number
        // ... cached GA data
      }
    }
    googleAds?: {
      connected: boolean
      customerId: string
      accessToken: string // Encrypted
      refreshToken: string // Encrypted
      expiresAt: Date
      lastSync: Date
      metrics: {
        clicks: number
        impressions: number
        spend: number
        conversions: number
        ctr: number
        cpa: number
        // ... cached Ads data
      }
    }
    metaAds?: {
      connected: boolean
      adAccountId: string
      accessToken: string // Encrypted
      expiresAt: Date
      lastSync: Date
      metrics: {
        impressions: number
        clicks: number
        spend: number
        cpm: number
        roas: number
        // ... cached Meta data
      }
    }
    linkedInAds?: {
      connected: boolean
      accountId: string
      accessToken: string // Encrypted
      refreshToken: string // Encrypted
      expiresAt: Date
      lastSync: Date
      metrics: {
        impressions: number
        clicks: number
        spend: number
        leads: number
        // ... cached LinkedIn data
      }
    }
  }

  status: 'active' | 'inactive' | 'archived'
  createdAt: Date
  updatedAt: Date
}

const ClientSchema = new Schema<IClient>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  name: { type: String, required: true },
  email: { type: String },
  logo: { type: String },

  platforms: {
    googleAnalytics: {
      connected: { type: Boolean, default: false },
      accountId: String,
      propertyId: String,
      accessToken: String, // Encrypted
      refreshToken: String, // Encrypted
      expiresAt: Date,
      lastSync: Date,
      metrics: Schema.Types.Mixed
    },
    googleAds: {
      connected: { type: Boolean, default: false },
      customerId: String,
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
      lastSync: Date,
      metrics: Schema.Types.Mixed
    },
    metaAds: {
      connected: { type: Boolean, default: false },
      adAccountId: String,
      accessToken: String,
      expiresAt: Date,
      lastSync: Date,
      metrics: Schema.Types.Mixed
    },
    linkedInAds: {
      connected: { type: Boolean, default: false },
      accountId: String,
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
      lastSync: Date,
      metrics: Schema.Types.Mixed
    }
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Indexes
ClientSchema.index({ userId: 1, status: 1 })
ClientSchema.index({ userId: 1, name: 1 })

export const Client = model<IClient>('Client', ClientSchema)
```

### Your Answers:

**Chosen Structure:** Embedded platforms within Client document

**Reasoning:**
```
- Each client has their own platform connections (isolated data)
- Embedding platforms simplifies queries (single document read)
- Platform credentials are encrypted before storage
- Metrics are cached per-client for fast AI responses
- Agency users can manage 10-50 clients easily
```

**Client Lifecycle:**
```
Status transitions:
- Created: 'active' (default)
- User pauses client work: 'active' → 'inactive'
- User archives client: 'active' → 'archived' (preserves data, hides from UI)
- Delete client: Requires archiving first, then hard delete (admin only)
```

---

## 3. Conversation Schema

### Question:
What should the Conversation model look like?

**Mongoose Schema (TypeScript):**

```typescript
import { Schema, model, Types } from 'mongoose'

export interface IConversation {
  _id: Types.ObjectId
  conversationId: string // UUID for public reference
  userId: Types.ObjectId // Reference to User (agency owner)
  clientId: Types.ObjectId // Reference to Client - CRITICAL for multi-client

  // Conversation Metadata
  title?: string // Optional: "Marketing data questions", auto-generated
  status: 'active' | 'archived' | 'deleted'

  // Messages (embedded)
  messages: IMessage[]

  // Context
  context?: {
    currentPage?: string // Where user opened chat (e.g., '/dashboard')
    connectedPlatforms?: string[] // Platforms available at start
    userIntent?: string // Detected intent (e.g., 'connect_platform', 'generate_report')
  }

  // Metadata
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date // For sorting recent conversations
  messageCount: number // Cached count for performance

  // Analytics
  totalTokensUsed?: number // OpenAI token usage
  estimatedCost?: number // Cost in USD
}

const ConversationSchema = new Schema<IConversation>({
  conversationId: { type: String, required: true, unique: true }, // UUID
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true }, // NEW
  title: { type: String },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  messages: [MessageSchema], // Embedded messages
  context: {
    currentPage: String,
    connectedPlatforms: [String],
    userIntent: String
  },
  lastMessageAt: { type: Date, default: Date.now },
  messageCount: { type: Number, default: 0 },
  totalTokensUsed: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 0 }
}, {
  timestamps: true // Auto-creates createdAt, updatedAt
})

// Indexes for multi-client queries
ConversationSchema.index({ userId: 1, clientId: 1, status: 1 })
ConversationSchema.index({ clientId: 1, lastMessageAt: -1 })
ConversationSchema.index({ conversationId: 1 }, { unique: true })

export const Conversation = model<IConversation>('Conversation', ConversationSchema)
```

### Your Answers:

**Conversation Fields:**
```
Required Fields:
✅ conversationId: UUID for public reference
✅ userId: Agency owner reference
✅ clientId: Client reference (CRITICAL for multi-client)
✅ status: active/archived/deleted
✅ createdAt/updatedAt: Auto-generated timestamps

Optional Fields (Included):
✅ title: Auto-generated conversation title
✅ context: Chat context (current page, connected platforms)
✅ lastMessageAt: For sorting recent conversations
✅ messageCount: Cached count for performance
✅ totalTokensUsed: Track OpenAI usage
✅ estimatedCost: Cost tracking in USD
```

**Multi-Client Query Pattern:**
```typescript
// Get all conversations for a specific client
const conversations = await Conversation.find({
  userId: currentUser.id,
  clientId: selectedClientId,
  status: 'active'
}).sort({ lastMessageAt: -1 });

// Critical: Always filter by both userId AND clientId
// This ensures data isolation between clients
```

**Conversation Lifecycle:**
```
Status transitions:
- Created: 'active' (when user sends first message)
- User archives: 'active' → 'archived' (preserves history)
- User deletes: 'active' → 'deleted' (soft delete)
- Auto-delete after: 90 days (TTL index on deletedAt)

Client Switching:
- When user switches clients → Load conversations for new clientId
- Previous client's conversations are not shown (isolated)
```

---

## 3. Message Schema

### Question:
What should the Message model look like?

**Mongoose Schema (TypeScript):**

```typescript
export interface IMessage {
  _id?: Types.ObjectId
  conversationId?: Types.ObjectId // If separate collection

  // Message Content
  role: 'user' | 'assistant' | 'system' | 'function'
  content: string | IMessageContent[] // Text or structured content

  // Metadata
  timestamp: Date

  // AI Metadata (for assistant messages)
  model?: string // e.g., 'gpt-4o-mini'
  tokensUsed?: number
  finishReason?: 'stop' | 'length' | 'function_call' | 'content_filter'

  // User Feedback (for assistant messages)
  feedback?: {
    rating?: 'positive' | 'negative' // 👍 👎
    comment?: string
    submittedAt?: Date
  }

  // Function Calls (if AI triggers actions)
  functionCall?: {
    name: string // e.g., 'connect_google_analytics'
    arguments: Record<string, unknown>
    result?: unknown
  }

  // Attachments (if file uploads)
  attachments?: {
    fileUrl: string
    fileType: string
    fileName: string
    fileSize: number
  }[]
}

// For rich content messages
interface IMessageContent {
  type: 'text' | 'image' | 'button' | 'card' | 'code'
  value: unknown
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' }, // If separate
  role: {
    type: String,
    enum: ['user', 'assistant', 'system', 'function'],
    required: true
  },
  content: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },

  // AI Metadata
  model: String,
  tokensUsed: Number,
  finishReason: String,

  // Feedback
  feedback: {
    rating: { type: String, enum: ['positive', 'negative'] },
    comment: String,
    submittedAt: Date
  },

  // Function Call
  functionCall: {
    name: String,
    arguments: Schema.Types.Mixed,
    result: Schema.Types.Mixed
  },

  // Attachments
  attachments: [{
    fileUrl: String,
    fileType: String,
    fileName: String,
    fileSize: Number
  }]
})

export const Message = model<IMessage>('Message', MessageSchema)
```

### Your Answers:

**Message Fields:**
```
Which fields do you want?

Required:
- role: [Yes]
- content: [Yes]
- timestamp: [Yes]

Optional:
- model, tokensUsed: [Yes/No - track AI usage]
- feedback: [Yes/No - allow thumbs up/down]
- functionCall: [Yes/No - for action execution]
- attachments: [Yes/No - file uploads]

Custom Fields:
- [Field name]: [Purpose]
```

**Message Content Types:**
```
How should content be structured?

Option A: Simple string
content: "Hello, how can I help?"

Option B: Structured array
content: [
  { type: 'text', value: 'To connect GA, click:' },
  { type: 'button', value: { label: 'Connect', action: 'oauth_google' } }
]

Preferred: [A / B]
```

**Function Calls:**
```
Should messages support AI function calls (e.g., connect platform, generate report)?

[Yes/No]

If Yes, examples:
functionCall: {
  name: 'connect_google_analytics',
  arguments: { method: 'oauth' },
  result: { success: true, message: 'Connected!' }
}
```

---

## 4. User Integration Schema

### Question:
How should platform integrations be stored?

**Existing User Model:**
```typescript
// You may already have a User model
// Add platform integration fields to it or create separate collection
```

**Option A: Add to User Model**
```typescript
interface IUser {
  // ... existing fields

  platformIntegrations: {
    googleAnalytics?: {
      isConnected: boolean
      accessToken: string // Encrypted
      refreshToken: string // Encrypted
      tokenExpiry: Date
      accountId: string
      propertyId: string
      connectedAt: Date
    }
    googleAds?: { /* ... */ }
    metaAds?: { /* ... */ }
    // ...
  }
}
```

**Option B: Separate PlatformIntegration Collection**
```typescript
interface IPlatformIntegration {
  _id: Types.ObjectId
  userId: Types.ObjectId

  platform: 'google_analytics' | 'google_ads' | 'meta_ads' | string
  isConnected: boolean

  // OAuth Tokens (encrypted)
  credentials: {
    accessToken: string
    refreshToken: string
    tokenExpiry: Date
    scope: string[]
  }

  // Platform-Specific Data
  platformData: {
    accountId?: string
    propertyId?: string
    adAccountId?: string
    // ... flexible schema
  }

  // Metadata
  connectedAt: Date
  lastSyncedAt?: Date
  status: 'active' | 'expired' | 'revoked' | 'error'
  errorMessage?: string

  createdAt: Date
  updatedAt: Date
}

const PlatformIntegrationSchema = new Schema<IPlatformIntegration>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  isConnected: { type: Boolean, default: true },

  credentials: {
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    scope: [String]
  },

  platformData: { type: Schema.Types.Mixed },

  connectedAt: { type: Date, default: Date.now },
  lastSyncedAt: Date,
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked', 'error'],
    default: 'active'
  },
  errorMessage: String
}, {
  timestamps: true
})

export const PlatformIntegration = model<IPlatformIntegration>(
  'PlatformIntegration',
  PlatformIntegrationSchema
)
```

### Your Answer:

**Chosen Approach:** [Add to User / Separate Collection]

```
[Reasoning]
```

**Integration Fields:**
```
Which fields are needed?

Required:
- platform name: [Yes]
- accessToken, refreshToken: [Yes - encrypted]
- userId reference: [Yes]

Optional:
- tokenExpiry: [Yes/No]
- lastSyncedAt: [Yes/No - track data freshness]
- status: [Yes/No - active/expired/error]
- errorMessage: [Yes/No - for debugging]
- platformData: [Yes/No - flexible platform-specific fields]
```

**Encryption:**
```
How will you encrypt OAuth tokens?

- [ ] Mongoose encryption plugin
- [ ] Crypto library (AES-256)
- [ ] Environment variable encryption key
- [ ] Third-party vault (AWS Secrets Manager)

Method: [Your choice]
Encryption key stored: [Where?]
```

---

## 5. Chat Analytics Schema

### Question:
Should you track chat analytics/metrics?

**Purpose:**
- Track chatbot usage (messages per user, session length)
- Monitor AI costs (tokens, API calls)
- Identify common questions/intents
- Measure user satisfaction

**Schema Options:**

**Option A: Aggregate from Conversations**
```
No separate collection, query conversations/messages to generate reports
```

**Option B: Separate Analytics Collection**
```typescript
interface IChatAnalytics {
  _id: Types.ObjectId

  // Time-based
  date: Date // Aggregated by day

  // Usage Metrics
  totalConversations: number
  totalMessages: number
  uniqueUsers: number
  avgMessagesPerConversation: number

  // AI Metrics
  totalTokensUsed: number
  totalCost: number
  modelBreakdown: {
    model: string
    tokensUsed: number
    cost: number
  }[]

  // User Satisfaction
  positiveRatings: number
  negativeRatings: number
  avgRating: number

  // Intents (detected topics)
  topIntents: {
    intent: string
    count: number
  }[]
}
```

### Your Answer:

**Track Analytics:** [Yes/No]

```
If Yes:
- Method: [Aggregate queries / Separate collection / Event streaming]
- Granularity: [Daily / Hourly / Real-time]
- Retention: [30 days / 90 days / Forever]
```

**Metrics to Track:**
```
- [ ] Total messages per day
- [ ] Unique users per day
- [ ] Avg conversation length
- [ ] AI token usage
- [ ] API costs
- [ ] User satisfaction (thumbs up/down ratio)
- [ ] Common intents/topics
- [ ] Response time (latency)
- [ ] Error rate
- [ ] Other: _________________
```

---

## 6. Indexes & Performance

### Question:
What indexes do you need for performance?

**Recommended Indexes:**

**Conversations Collection:**
```javascript
// Single field indexes
db.conversations.createIndex({ userId: 1 })
db.conversations.createIndex({ status: 1 })
db.conversations.createIndex({ lastMessageAt: -1 })

// Compound indexes
db.conversations.createIndex({ userId: 1, status: 1, lastMessageAt: -1 })

// Text search (if searching conversation titles)
db.conversations.createIndex({ title: 'text' })
```

**Messages Collection (if separate):**
```javascript
db.messages.createIndex({ conversationId: 1, timestamp: 1 })
db.messages.createIndex({ role: 1 })

// Text search for message content
db.messages.createIndex({ content: 'text' })
```

**PlatformIntegrations Collection:**
```javascript
db.platformIntegrations.createIndex({ userId: 1, platform: 1 }, { unique: true })
db.platformIntegrations.createIndex({ status: 1 })
db.platformIntegrations.createIndex({ tokenExpiry: 1 }) // For cleanup jobs
```

### Your Answer:

**Indexes to Create:**
```
Conversations:
- userId: [Yes/No]
- status: [Yes/No]
- lastMessageAt: [Yes/No]
- Compound: [Which fields?]

Messages:
- conversationId: [Yes/No]
- timestamp: [Yes/No]
- Text search: [Yes/No]

PlatformIntegrations:
- userId + platform: [Yes/No]
- status: [Yes/No]

Custom Indexes:
- [Collection]: [Fields]
```

**Query Performance Targets:**
```
- Load conversation history: [< 200ms]
- Send new message: [< 2s including AI response]
- Search messages: [< 500ms]
```

---

## 7. Data Relationships

### Question:
How are collections related?

**Relationship Diagram:**
```
User (Agency Owner)
  │
  ├──► Client (one-to-many)
  │      │
  │      ├──► platforms (embedded: GA, Ads, Meta, LinkedIn)
  │      │
  │      └──► Conversation (one-to-many)
  │             │
  │             └──► Messages (embedded array)
  │
  └──► Conversation (one-to-many, filtered by clientId)
```

**Multi-Client Architecture:**
```
User → Clients → Each Client has:
  ├── Platform Connections (embedded)
  └── Conversations (linked via clientId)

Key Points:
- Platforms are stored PER CLIENT (not per user)
- Conversations are linked to BOTH userId AND clientId
- When user switches clients → Different platforms & conversations
```

**Mongoose Population:**
```typescript
// Example: Fetch conversation with client details
const conversation = await Conversation.findById(id)
  .populate('userId', 'name email')
  .populate('clientId', 'name logo')
  .exec()

// Example: Fetch all clients for a user
const clients = await Client.find({
  userId: currentUser.id,
  status: 'active'
})

// Example: Fetch client with conversations
const client = await Client.findById(clientId)
const conversations = await Conversation.find({
  clientId: client._id,
  status: 'active'
}).sort({ lastMessageAt: -1 })
```

### Your Answer:

**Relationships:**
```
User → Client: one-to-many (agency manages multiple clients)
Client → Platforms: embedded (each client has own platform configs)
User + Client → Conversation: one-to-many (filtered by both IDs)
Conversation → Messages: one-to-many embedded

Foreign Keys:
- Client.userId → User._id
- Conversation.userId → User._id
- Conversation.clientId → Client._id
```

**Cascade Delete:**
```
If user deletes account:
✅ Delete all clients: Yes (cascade)
✅ Delete all conversations: Yes (cascade via client deletion)
✅ Revoke platform integrations: Yes (embedded in clients)
❌ Anonymize data instead: No (hard delete for GDPR compliance)

If user deletes a client:
✅ Archive client first (soft delete): status = 'archived'
✅ Archive all client's conversations: Batch update to 'archived'
✅ Revoke OAuth tokens: Background job to revoke platform access
⚠️ Hard delete after 90 days: Optional, requires admin confirmation
```

---

## 8. Migrations & Versioning

### Question:
How will you handle schema changes?

**Migration Strategy:**

**Option A: Manual Migrations**
```javascript
// /src/backend/migrations/001_add_chat_collections.ts
export async function up() {
  await db.createCollection('conversations')
  await db.createCollection('platformIntegrations')
  // Create indexes
}

export async function down() {
  // Rollback
}
```

**Option B: Mongoose Schema Versioning**
```typescript
const ConversationSchema = new Schema({
  // ...
}, {
  versionKey: '__v' // Track document version
})
```

**Option C: No Formal Migrations**
```
Just update schema and handle old documents in code
```

### Your Answer:

**Migration Approach:** [A / B / C / Other]

```
[How will you manage schema changes over time?]
```

**Initial Setup:**
```
- [ ] Create conversations collection
- [ ] Create platformIntegrations collection
- [ ] Create messages collection (if separate)
- [ ] Create indexes
- [ ] Seed demo data (for testing)
```

**Version Control:**
```
- Track schema changes in Git: [Yes]
- Document breaking changes: [Yes]
- Backward compatibility: [How long?]
```

---

## Complete Schema Examples

### Full Mongoose Model Files

**Your Answer:**
```
Should I generate complete Mongoose model files based on your answers?
[Yes/No]

If Yes, they'll be created at:
- /src/backend/models/Conversation.ts
- /src/backend/models/Message.ts (if separate)
- /src/backend/models/PlatformIntegration.ts
```

---

## Sample Data

### Question:
Want sample data examples for testing?

**Example Conversation Document:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "userId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "title": "Connecting Google Analytics",
  "status": "active",
  "messages": [
    {
      "role": "assistant",
      "content": "Hi! I'm here to help. What can I do for you?",
      "timestamp": "2025-11-16T10:00:00Z"
    },
    {
      "role": "user",
      "content": "I want to connect my Google Analytics",
      "timestamp": "2025-11-16T10:01:00Z"
    },
    {
      "role": "assistant",
      "content": "Great! I'll help you connect Google Analytics...",
      "timestamp": "2025-11-16T10:01:05Z",
      "model": "gpt-4o-mini",
      "tokensUsed": 234
    }
  ],
  "context": {
    "currentPage": "/dashboard",
    "connectedPlatforms": []
  },
  "lastMessageAt": "2025-11-16T10:01:05Z",
  "messageCount": 3,
  "totalTokensUsed": 234,
  "createdAt": "2025-11-16T10:00:00Z",
  "updatedAt": "2025-11-16T10:01:05Z"
}
```

**Your Answer:**
```
[Do you want more sample data examples? Any specific scenarios?]
```

---

## Additional Database Considerations

### Question:
Any other database requirements?

**Your Answer:**
```
[Backup strategy, replication, database monitoring,
TTL (time-to-live) for old messages, GDPR compliance, etc.]
```

---

## Document Approval

**Status:** 🟡 Awaiting Input

Once all questions are answered:
- [ ] Engineering Lead Review
- [ ] DBA Review (if applicable)
- [ ] Security Review (encryption, PII handling)
- [ ] Status → ✅ Approved

---

**Previous Document:** [05-ARCHITECTURE.md](./05-ARCHITECTURE.md)
**Next Document:** [07-API-DESIGN.md](./07-API-DESIGN.md)
