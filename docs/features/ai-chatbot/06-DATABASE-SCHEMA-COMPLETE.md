# AI Chatbot - Database Schema (COMPLETE)

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-21 (Updated for Multi-Client Architecture)

---

## MongoDB Collections & Schemas

### 1. Clients Collection

**Multi-Client Architecture**: Each user can manage multiple clients, each with independent platform configurations.

```typescript
interface Client {
  _id: ObjectId;
  userId: ObjectId;              // Who owns this client (agency user)
  name: string;                  // "Acme Corp"
  email?: string;                // client@acmecorp.com
  logo?: string;                 // URL to client logo

  // Platform connections (per client)
  platforms: {
    googleAnalytics?: {
      connected: boolean;
      accountId: string;
      propertyId: string;
      accessToken: string;       // Encrypted
      refreshToken: string;      // Encrypted
      expiresAt: Date;
      lastSync: Date;
      status: 'active' | 'expired' | 'error';
      metrics?: {
        sessions: number;
        users: number;
        pageviews: number;
        bounceRate: number;
        avgSessionDuration: number;
      };
      dimensions?: {
        topSources: { source: string; sessions: number }[];
        devices: { device: string; percentage: number }[];
        topPages: { page: string; views: number }[];
      };
    };

    googleAds?: {
      connected: boolean;
      customerId: string;
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
      lastSync: Date;
      status: 'active' | 'expired' | 'error';
      campaigns?: {
        name: string;
        spend: number;
        clicks: number;
        impressions: number;
        ctr: number;
        conversions: number;
      }[];
    };

    metaAds?: {
      connected: boolean;
      adAccountId: string;
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
      lastSync: Date;
      status: 'active' | 'expired' | 'error';
      campaigns?: {
        name: string;
        spend: number;
        impressions: number;
        clicks: number;
        cpm: number;
        roas?: number;
      }[];
    };

    linkedinAds?: {
      connected: boolean;
      accountId: string;
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
      lastSync: Date;
      status: 'active' | 'expired' | 'error';
      campaigns?: {
        name: string;
        spend: number;
        impressions: number;
        clicks: number;
        leads: number;
      }[];
    };
  };

  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
```javascript
db.clients.createIndex({ userId: 1, status: 1 });
db.clients.createIndex({ userId: 1, name: 1 });
db.clients.createIndex({ _id: 1, userId: 1 }); // Security: verify ownership
```

---

### 2. Conversations Collection

**Multi-Client**: Conversations are scoped to both user AND client.

```typescript
interface Conversation {
  _id: ObjectId;
  conversationId: string;        // UUID
  userId: ObjectId;              // Agency owner (Reference to User)
  clientId: ObjectId;            // Which client this chat is about (Reference to Client)
  title?: string;                // Optional conversation title
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  status: 'active' | 'archived' | 'deleted';
  metadata?: {
    platformsQueried?: string[]; // Which platforms user asked about
    totalTokensUsed?: number;
  };
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;              // 'gpt-4o-mini'
    tokensUsed?: number;
    cost?: number;               // In USD
    feedbackRating?: 'positive' | 'negative'; // Thumbs up/down
  };
}
```

**Indexes:**
```javascript
// Multi-client compound index: Query user's conversations for a specific client
db.conversations.createIndex({ userId: 1, clientId: 1, status: 1 });

// Query client's conversations by last message time
db.conversations.createIndex({ clientId: 1, lastMessageAt: -1 });

// Backwards compatibility: Query all user's conversations
db.conversations.createIndex({ userId: 1, status: 1 });
db.conversations.createIndex({ userId: 1, lastMessageAt: -1 });

// Unique conversation ID
db.conversations.createIndex({ conversationId: 1 }, { unique: true });

// TTL: Auto-delete after 90 days
db.conversations.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
```

---

### 3. User Schema Extension

Extend existing User model to include chatbot-related fields:

```typescript
interface User {
  // ... existing fields (email, password, name, etc.) ...

  chatbot?: {
    totalConversations: number;
    totalMessages: number;
    lastChatAt?: Date;
    preferences?: {
      quickReplies: string[];    // Custom quick replies
      notifications: boolean;
    };
  };
}
```

**Note**: Platforms are now stored in the **Client** collection, not User.

---

### 4. Data Relationships

```
User (1) → Clients (Many)
  └─ Each client has platforms

User (1) + Client (1) → Conversations (Many)
  └─ Conversations filtered by userId + clientId

Client (1) → Platform Data (Embedded)
  └─ Each client has their own platform connections
```

**Query Examples:**
```typescript
// Get all clients for a user
db.clients.find({ userId: user._id, status: 'active' });

// Get conversations for a specific client
db.conversations.find({
  userId: user._id,
  clientId: client._id,
  status: 'active'
});

// Get client's platform data
const client = await Client.findById(clientId);
const googleAnalyticsData = client.platforms?.googleAnalytics?.metrics;
```

---

### 5. Demo Data Collection (Optional)

For users without connected platforms:

```typescript
interface DemoData {
  _id: ObjectId;
  platform: 'googleAnalytics' | 'googleAds' | 'metaAds' | 'linkedinAds';
  data: any; // Sample metrics/dimensions
  createdAt: Date;
}
```

**Sample Demo Data:**
```json
{
  "platform": "googleAnalytics",
  "data": {
    "metrics": {
      "sessions": 15234,
      "users": 12450,
      "pageviews": 45678,
      "bounceRate": 0.45,
      "avgSessionDuration": 185
    },
    "dimensions": {
      "topSources": [
        { "source": "google / organic", "sessions": 8500 },
        { "source": "direct", "sessions": 3200 },
        { "source": "facebook / social", "sessions": 2100 }
      ]
    }
  }
}
```

---

## Data Retention & Cleanup

**Automatic Cleanup (Cron Job):**
```javascript
// Run daily at 3 AM UTC
async function cleanupOldConversations() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  await Conversation.deleteMany({
    status: 'deleted',
    updatedAt: { $lt: ninetyDaysAgo }
  });

  // Archive old active conversations
  await Conversation.updateMany(
    {
      status: 'active',
      lastMessageAt: { $lt: ninetyDaysAgo }
    },
    { $set: { status: 'archived' } }
  );
}
```

---

## Security Considerations

✅ **User Isolation**: All queries filter by userId
✅ **Encrypted at Rest**: MongoDB Atlas encryption
✅ **No Sensitive Data**: OAuth tokens stored separately (not in chatbot schema)
✅ **Input Validation**: Zod schemas on all mutations
✅ **Rate Limiting**: Tracked via user.chatbot.lastChatAt

---

## Document Approval

**Status:** ✅ Complete (Updated for Multi-Client)

- [x] Database schema designed
- [x] Multi-client architecture implemented
- [x] Client collection added
- [x] Conversation model updated with clientId
- [x] Indexes optimized
- [x] Data retention strategy defined
- [x] Security reviewed

---

**Related Documents:**
- **Previous:** [05-ARCHITECTURE.md](./05-ARCHITECTURE.md)
- **Next:** [07-API-DESIGN-COMPLETE.md](./07-API-DESIGN-COMPLETE.md)
- **Multi-Client Strategy:** [12-MULTI-CLIENT-STRATEGY.md](./12-MULTI-CLIENT-STRATEGY.md)
