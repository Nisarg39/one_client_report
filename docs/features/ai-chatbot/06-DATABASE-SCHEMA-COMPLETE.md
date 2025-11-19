# AI Chatbot - Database Schema (COMPLETE)

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19

---

## MongoDB Collections & Schemas

### 1. Conversations Collection

```typescript
interface Conversation {
  _id: ObjectId;
  conversationId: string; // UUID
  userId: ObjectId; // Reference to User
  title?: string; // Optional conversation title
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
  messageId: string; // UUID
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string; // 'gpt-4o-mini'
    tokensUsed?: number;
    cost?: number; // In USD
    feedbackRating?: 'positive' | 'negative'; // Thumbs up/down
  };
}
```

**Indexes:**
```javascript
db.conversations.createIndex({ userId: 1, status: 1 });
db.conversations.createIndex({ conversationId: 1 }, { unique: true });
db.conversations.createIndex({ lastMessageAt: -1 }); // For sorting
db.conversations.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL
```

---

### 2. User Schema Extension

Extend existing User model to include chatbot-related fields:

```typescript
interface User {
  // ... existing fields ...

  chatbot?: {
    totalConversations: number;
    totalMessages: number;
    lastChatAt?: Date;
    preferences?: {
      quickReplies: string[]; // Custom quick replies
      notifications: boolean;
    };
  };

  platforms?: {
    googleAnalytics?: {
      connected: boolean;
      propertyId?: string;
      status: 'active' | 'expired' | 'error';
      lastSync?: Date;
      metrics?: {
        sessions: number;
        users: number;
        pageviews: number;
        bounceRate: number;
        avgSessionDuration: number;
        // ... more cached metrics
      };
      dimensions?: {
        topSources: { source: string; sessions: number }[];
        devices: { device: string; percentage: number }[];
        topPages: { page: string; views: number }[];
        // ... more dimensions
      };
    };

    googleAds?: {
      connected: boolean;
      customerId?: string;
      status: 'active' | 'expired' | 'error';
      lastSync?: Date;
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
      adAccountId?: string;
      status: 'active' | 'expired' | 'error';
      lastSync?: Date;
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
      accountId?: string;
      status: 'active' | 'expired' | 'error';
      lastSync?: Date;
      campaigns?: {
        name: string;
        spend: number;
        impressions: number;
        clicks: number;
        leads: number;
      }[];
    };
  };
}
```

---

### 3. Demo Data Collection (Optional)

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

**Status:** ✅ Complete

- [x] Database schema designed
- [x] Indexes optimized
- [x] Data retention strategy defined
- [x] Security reviewed

---

**Previous Document:** [05-ARCHITECTURE.md](./05-ARCHITECTURE.md)
**Next Document:** [07-API-DESIGN.md](./07-API-DESIGN.md)
