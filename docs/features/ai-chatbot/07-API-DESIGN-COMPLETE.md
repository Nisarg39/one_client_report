# AI Chatbot - API Design (COMPLETE)

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-21 (Updated for Multi-Client Architecture)

---

## Server Actions (Next.js 16)

All chatbot APIs implemented as Server Actions for simplicity and performance.

**Multi-Client Note**: All actions now include `clientId` parameter for multi-client support.

### 1. Message Management

```typescript
// /src/app/actions/chat/sendMessage.ts
'use server';

export async function sendMessage(
  conversationId: string,
  message: string
): Promise<ReadableStream> {
  // 1. Validate input
  const schema = z.object({
    conversationId: z.string().uuid(),
    message: z.string().min(1).max(2000),
  });

  // 2. Get user from session (JWT)
  const user = await getCurrentUser();

  // 3. Check rate limits
  await checkRateLimit(user.id);

  // 4. Save user message to MongoDB
  await saveMessage(conversationId, {
    role: 'user',
    content: message,
    timestamp: new Date(),
  });

  // 5. Get conversation context (last 10 messages)
  const context = await getConversationContext(conversationId);

  // 6. Get user's platform data
  const platformData = await getPlatformData(user.id);

  // 7. Build prompt with context + platform data
  const prompt = buildPrompt(context, platformData, message);

  // 8. Call OpenAI API with streaming
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: prompt,
    stream: true,
  });

  // 9. Return SSE stream to client
  return createSSEStream(stream, conversationId);
}
```

### 2. Conversation Management

```typescript
// Get all user conversations
export async function getConversations(
  userId: string
): Promise<Conversation[]> {
  return await Conversation.find({ userId, status: 'active' })
    .sort({ lastMessageAt: -1 })
    .limit(50);
}

// Get specific conversation history
export async function getConversationHistory(
  conversationId: string
): Promise<Message[]> {
  const conversation = await Conversation.findOne({ conversationId });
  if (!conversation) throw new Error('Conversation not found');

  // Return only last 100 messages for performance
  return conversation.messages.slice(-100);
}

// Create new conversation
export async function createConversation(userId: string): Promise<string> {
  const conversationId = uuidv4();

  await Conversation.create({
    conversationId,
    userId,
    messages: [],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return conversationId;
}

// Delete conversation (soft delete)
export async function deleteConversation(conversationId: string): Promise<void> {
  await Conversation.updateOne(
    { conversationId },
    { $set: { status: 'deleted', updatedAt: new Date() } }
  );
}
```

### 3. Client Management (Multi-Client)

```typescript
// Get all clients for a user
export async function getClients(userId: string): Promise<Client[]> {
  return await Client.find({ userId, status: 'active' })
    .sort({ name: 1 })
    .select('-platforms.googleAnalytics.accessToken -platforms.googleAnalytics.refreshToken') // Exclude sensitive tokens
    .exec();
}

// Get specific client by ID
export async function getClientById(
  clientId: string,
  userId: string
): Promise<Client | null> {
  // Security: verify client belongs to user
  return await Client.findOne({ _id: clientId, userId });
}

// Create new client
export async function createClient(data: {
  name: string;
  email?: string;
  logo?: string;
}): Promise<Client> {
  const user = await requireAuth();

  const client = await Client.create({
    userId: user.id,
    name: data.name,
    email: data.email,
    logo: data.logo,
    platforms: {},
    status: 'active',
  });

  return client;
}

// Update client details
export async function updateClient(
  clientId: string,
  data: {
    name?: string;
    email?: string;
    logo?: string;
  }
): Promise<Client> {
  const user = await requireAuth();

  // Security: verify ownership
  const client = await Client.findOne({ _id: clientId, userId: user.id });
  if (!client) throw new Error('Client not found');

  if (data.name) client.name = data.name;
  if (data.email !== undefined) client.email = data.email;
  if (data.logo !== undefined) client.logo = data.logo;

  await client.save();
  return client;
}

// Update client platforms
export async function updateClientPlatforms(
  clientId: string,
  platformName: string,
  platformData: any
): Promise<void> {
  const user = await requireAuth();

  const client = await Client.findOne({ _id: clientId, userId: user.id });
  if (!client) throw new Error('Client not found');

  // Update specific platform
  client.platforms = client.platforms || {};
  client.platforms[platformName] = platformData;

  await client.save();
}

// Archive client (soft delete)
export async function archiveClient(clientId: string): Promise<void> {
  const user = await requireAuth();

  await Client.updateOne(
    { _id: clientId, userId: user.id },
    { $set: { status: 'archived', updatedAt: new Date() } }
  );
}
```

### 4. Platform Data Access

```typescript
// Get client's connected platforms (multi-client version)
export async function getConnectedPlatforms(
  clientId: string,
  userId: string
): Promise<PlatformStatus[]> {
  const client = await Client.findOne({ _id: clientId, userId });
  if (!client) throw new Error('Client not found');

  return [
    {
      name: 'Google Analytics',
      connected: client.platforms?.googleAnalytics?.connected || false,
      status: client.platforms?.googleAnalytics?.status,
      lastSync: client.platforms?.googleAnalytics?.lastSync,
    },
    {
      name: 'Google Ads',
      connected: client.platforms?.googleAds?.connected || false,
      status: client.platforms?.googleAds?.status,
      lastSync: client.platforms?.googleAds?.lastSync,
    },
    {
      name: 'Meta Ads',
      connected: client.platforms?.metaAds?.connected || false,
      status: client.platforms?.metaAds?.status,
      lastSync: client.platforms?.metaAds?.lastSync,
    },
    {
      name: 'LinkedIn Ads',
      connected: client.platforms?.linkedinAds?.connected || false,
      status: client.platforms?.linkedinAds?.status,
      lastSync: client.platforms?.linkedinAds?.lastSync,
    },
  ];
}

// Get client's platform data for AI context
export async function getClientPlatformData(
  clientId: string,
  userId: string
): Promise<any> {
  const client = await Client.findOne({ _id: clientId, userId });
  if (!client) return null;

  // Return platform metrics (without sensitive tokens)
  return {
    googleAnalytics: client.platforms?.googleAnalytics?.metrics || null,
    googleAds: client.platforms?.googleAds?.campaigns || null,
    metaAds: client.platforms?.metaAds?.campaigns || null,
    linkedinAds: client.platforms?.linkedinAds?.campaigns || null,
  };
}
```

### 5. Feedback & Analytics

```typescript
// Rate AI response (thumbs up/down)
export async function rateChatResponse(
  conversationId: string,
  messageId: string,
  rating: 'positive' | 'negative'
): Promise<void> {
  await Conversation.updateOne(
    { conversationId, 'messages.messageId': messageId },
    { $set: { 'messages.$.metadata.feedbackRating': rating } }
  );
}
```

---

## Error Handling

```typescript
// Standardized error responses
export class ChatbotError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode: number = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Error codes
const ERRORS = {
  RATE_LIMIT_EXCEEDED: new ChatbotError(
    'RATE_LIMIT_EXCEEDED',
    'You have reached your hourly message limit (50). Try again in X minutes.',
    429
  ),
  INVALID_INPUT: new ChatbotError(
    'INVALID_INPUT',
    'Invalid message content.',
    400
  ),
  AI_SERVICE_ERROR: new ChatbotError(
    'AI_SERVICE_ERROR',
    'AI service temporarily unavailable. Please try again.',
    503
  ),
  PLATFORM_NOT_CONNECTED: new ChatbotError(
    'PLATFORM_NOT_CONNECTED',
    'Platform not connected. Please connect in Settings.',
    400
  ),
};
```

---

## Rate Limiting

```typescript
// Redis-based rate limiting (or in-memory for V1)
export async function checkRateLimit(userId: string): Promise<void> {
  const key = `chat:ratelimit:${userId}`;
  const hourlyKey = `${key}:hour`;
  const dailyKey = `${key}:day`;

  // Check hourly limit (50 messages)
  const hourlyCount = await incrementCounter(hourlyKey, 3600); // 1 hour TTL
  if (hourlyCount > 50) {
    throw ERRORS.RATE_LIMIT_EXCEEDED;
  }

  // Check daily limit (200 messages)
  const dailyCount = await incrementCounter(dailyKey, 86400); // 24 hours TTL
  if (dailyCount > 200) {
    throw ERRORS.RATE_LIMIT_EXCEEDED;
  }
}
```

---

## Streaming Response (SSE)

```typescript
function createSSEStream(
  openaiStream: OpenAI.Stream,
  conversationId: string
): ReadableStream {
  let fullResponse = '';

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of openaiStream) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullResponse += content;

          // Send chunk to client
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
        }

        // Save complete response to MongoDB
        await saveMessage(conversationId, {
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
          metadata: {
            model: 'gpt-4o-mini',
            tokensUsed: calculateTokens(fullResponse),
          },
        });

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
```

---

## Input Validation (Zod)

```typescript
const messageSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(2000).trim(),
});

const conversationSchema = z.object({
  userId: z.string(),
  title: z.string().max(100).optional(),
});

const feedbackSchema = z.object({
  conversationId: z.string().uuid(),
  messageId: z.string().uuid(),
  rating: z.enum(['positive', 'negative']),
});
```

---

## Document Approval

**Status:** ✅ Complete (Updated for Multi-Client)

- [x] Server Actions designed
- [x] Client management actions added
- [x] Multi-client support in all actions
- [x] Error handling defined
- [x] Rate limiting implemented
- [x] Streaming response architecture
- [x] Input validation with Zod
- [x] Security: Client ownership verification

---

**Related Documents:**
- **Previous:** [06-DATABASE-SCHEMA-COMPLETE.md](./06-DATABASE-SCHEMA-COMPLETE.md)
- **Next:** [08-IMPLEMENTATION-ROADMAP-COMPLETE.md](./08-IMPLEMENTATION-ROADMAP-COMPLETE.md)
- **Multi-Client Strategy:** [12-MULTI-CLIENT-STRATEGY.md](./12-MULTI-CLIENT-STRATEGY.md)
