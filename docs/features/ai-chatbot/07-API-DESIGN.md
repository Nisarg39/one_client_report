# AI Chatbot - API Design

**Document Status**: 🟡 In Progress
**Last Updated**: 2025-11-16
**Owner**: Engineering Team

---

## Table of Contents
1. [Server Actions Overview](#1-server-actions-overview)
2. [Chat Operations](#2-chat-operations)
3. [Platform Integration Actions](#3-platform-integration-actions)
4. [AI Service Layer](#4-ai-service-layer)
5. [Error Responses](#5-error-responses)
6. [Rate Limiting](#6-rate-limiting)
7. [Webhooks & Callbacks](#7-webhooks--callbacks)

---

## 1. Server Actions Overview

### Question:
What Server Actions do you need for the chatbot?

**Server Actions Location:**
```
/src/backend/server_actions/chatActions.ts
```

**Base Response Type:**
```typescript
type ActionResponse<T> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}
```

### Your Answer:

**Server Actions to Create:**
```
Chat Actions (/chatActions.ts):
1. sendChatMessage()
2. getChatHistory()
3. createConversation()
4. deleteConversation()
5. submitMessageFeedback()

Integration Actions (/integrationActions.ts):
1. connectPlatform()
2. disconnectPlatform()
3. getConnectedPlatforms()
4. refreshPlatformData()

[Add more as needed]
```

---

## 2. Chat Operations

### sendChatMessage

**Purpose:** Send a user message and get AI response

**Signature:**
```typescript
'use server'

export async function sendChatMessage(
  conversationId: string,
  message: string
): Promise<ActionResponse<{
  aiResponse: string
  messageId: string
  tokensUsed: number
}>>
```

**Input Validation:**
```typescript
const schema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(2000)
})
```

**Logic Flow:**
```
1. Validate input (Zod schema)
2. Verify user session (get userId from cookies)
3. Check rate limits (X messages per hour)
4. Fetch conversation from MongoDB
5. Verify user owns conversation (userId match)
6. Load recent message history (last 10-20 messages)
7. Build prompt context (system message + history + new message)
8. Call OpenAI API
9. Save user message to DB
10. Save AI response to DB
11. Update conversation metadata (lastMessageAt, messageCount, tokensUsed)
12. Return AI response
```

**Error Handling:**
```typescript
Errors:
- CONVERSATION_NOT_FOUND: "Conversation not found"
- UNAUTHORIZED: "You don't have access to this conversation"
- RATE_LIMIT_EXCEEDED: "Too many messages, try again later"
- AI_API_ERROR: "AI service unavailable"
- INVALID_INPUT: "Message is too long or empty"
```

### Your Questions:

**Should responses be streamed or returned all at once?**
- [ ] Stream token-by-token (better UX)
- [ ] Return complete response (simpler)

**Answer:**
```
[Your choice + implementation approach if streaming]
```

**Context window size:**
```
How many previous messages to include in AI context?
- Last [X] messages
- Last [X] minutes of conversation
- Smart truncation (summarize old messages)
```

---

### getChatHistory

**Purpose:** Load previous conversation messages

**Signature:**
```typescript
export async function getChatHistory(
  conversationId: string,
  options?: {
    limit?: number
    offset?: number
    before?: Date
  }
): Promise<ActionResponse<{
  messages: Message[]
  hasMore: boolean
  total: number
}>>
```

**Logic:**
```
1. Validate conversationId
2. Verify user session
3. Check user owns conversation
4. Query messages with pagination
5. Return messages sorted by timestamp (oldest first)
```

### Your Questions:

**Pagination:**
```
- Default page size: [20 messages]
- Max page size: [100 messages]
- Load more strategy: [Infinite scroll / "Load more" button / Show all]
```

**Performance:**
```
- Cache recent conversations: [Yes/No]
- Cache duration: [5 minutes / 15 minutes / Session]
```

---

### createConversation

**Purpose:** Start a new chat conversation

**Signature:**
```typescript
export async function createConversation(
  context?: {
    currentPage?: string
    initialIntent?: string
  }
): Promise<ActionResponse<{
  conversationId: string
  welcomeMessage: string
}>>
```

**Logic:**
```
1. Verify user session (get userId)
2. Create conversation document in MongoDB
3. Generate welcome message (contextual based on page)
4. Save welcome message as first message
5. Return conversationId
```

### Your Questions:

**Welcome Message:**
```
Should welcome message be contextual?
- On /dashboard: "Hi! Need help generating a report?"
- On /demo: "Welcome to the demo! Ask me anything about our features."
- On /onboarding: "Let's get you set up! First, let's connect your Google Analytics."

Contextual: [Yes/No]

If Yes, provide examples:
- [Page]: [Message]
- [Page]: [Message]
```

**Auto-create conversation:**
```
Should conversation be created automatically when user opens chat?
Or only when they send first message?

[Your answer]
```

---

### deleteConversation

**Purpose:** Delete or archive a conversation

**Signature:**
```typescript
export async function deleteConversation(
  conversationId: string,
  hardDelete?: boolean
): Promise<ActionResponse<void>>
```

**Logic:**
```
1. Verify user session
2. Check user owns conversation
3. If hardDelete: Remove from database
4. Else: Mark status = 'deleted' (soft delete)
5. Return success
```

### Your Questions:

**Delete Behavior:**
```
- [ ] Soft delete (default): Set status = 'deleted', keep data
- [ ] Hard delete: Remove from database permanently
- [ ] User choice: Let user decide

Default: [Your choice]

Auto-purge soft-deleted conversations after: [30 days / Never]
```

---

### submitMessageFeedback

**Purpose:** User rates AI response (thumbs up/down)

**Signature:**
```typescript
export async function submitMessageFeedback(
  messageId: string,
  rating: 'positive' | 'negative',
  comment?: string
): Promise<ActionResponse<void>>
```

**Logic:**
```
1. Verify user session
2. Find message by ID
3. Update message.feedback field
4. Optionally: Send to analytics service
5. Return success
```

### Your Questions:

**Feedback Options:**
```
- [ ] Thumbs up/down only
- [ ] Thumbs up/down + optional comment
- [ ] 1-5 star rating
- [ ] Other: _________________

Chosen: [Your answer]
```

**What to do with feedback:**
```
- [ ] Store in database for analysis
- [ ] Send to analytics dashboard
- [ ] Trigger alert if many negative ratings
- [ ] Use for AI prompt improvement
```

---

## 3. Platform Integration Actions

### connectPlatform

**Purpose:** Initiate OAuth flow or save API key for platform

**Signature:**
```typescript
export async function connectPlatform(
  platform: 'google_analytics' | 'google_ads' | 'meta_ads' | string,
  method: 'oauth' | 'api_key',
  params?: {
    apiKey?: string // If method = 'api_key'
    redirectUrl?: string // If method = 'oauth'
  }
): Promise<ActionResponse<{
  oauthUrl?: string // If OAuth
  success: boolean
  message: string
}>>
```

**Logic (OAuth):**
```
1. Verify user session
2. Generate OAuth URL with state token
3. Save state token in session (CSRF protection)
4. Return OAuth URL to client
5. Client opens OAuth popup/redirect
6. After user authorizes, callback to handleOAuthCallback()
```

**Logic (API Key):**
```
1. Verify user session
2. Validate API key format
3. Test API key (make lightweight API call)
4. If valid: Encrypt and save to database
5. Return success
```

### Your Questions:

**OAuth Callback URL:**
```
Callback URL: [e.g., /api/auth/callback/[platform]]
Handle where: [API Route / Server Action]
Redirect after success: [Back to chat / Dashboard / Settings]
```

**API Key Validation:**
```
Should you validate API keys immediately?
[Yes - Make test API call / No - Save and validate later]

If test fails:
- Return error to user
- Show instructions for fixing
- Other: _________________
```

---

### disconnectPlatform

**Purpose:** Revoke platform connection

**Signature:**
```typescript
export async function disconnectPlatform(
  platform: string
): Promise<ActionResponse<void>>
```

**Logic:**
```
1. Verify user session
2. Find integration in database
3. Optionally: Revoke OAuth token with platform API
4. Delete integration from database
5. Return success
```

### Your Questions:

**Revoke OAuth Token:**
```
Should you revoke the token with the platform API?
[Yes - Fully disconnect / No - Just delete from DB]

If Yes:
- Google: Call https://oauth2.googleapis.com/revoke
- Meta: Call graph.facebook.com/{user-id}/permissions
- [Other platforms]
```

---

### getConnectedPlatforms

**Purpose:** Get list of user's connected platforms

**Signature:**
```typescript
export async function getConnectedPlatforms(): Promise<ActionResponse<{
  platforms: {
    platform: string
    isConnected: boolean
    connectedAt: Date
    status: 'active' | 'expired' | 'error'
    accountInfo?: {
      accountId: string
      name: string
    }
  }[]
}>>
```

**Logic:**
```
1. Verify user session
2. Query PlatformIntegrations for userId
3. For each integration:
   - Check if token is expired
   - Optionally: Fetch account name from platform API
4. Return list
```

### Your Questions:

**Real-time Status Check:**
```
Should you check if tokens are still valid every time?
[Yes - Make API call / No - Trust DB status / Cache for X minutes]

If Yes:
- Performance impact: [Acceptable / Too slow]
- Cache status for: [5 min / 15 min / 1 hour]
```

---

### refreshPlatformData

**Purpose:** Fetch latest data from connected platform

**Signature:**
```typescript
export async function refreshPlatformData(
  platform: string,
  dateRange?: {
    startDate: string
    endDate: string
  }
): Promise<ActionResponse<{
  data: unknown // Platform-specific data
  lastSyncedAt: Date
}>>
```

**Logic:**
```
1. Verify user session
2. Check platform is connected
3. Get OAuth token from database
4. Call platform API (Google Analytics, etc.)
5. Parse and validate response
6. Cache data in MongoDB
7. Update lastSyncedAt timestamp
8. Return data
```

### Your Questions:

**Data Caching:**
```
Cache fetched data in MongoDB?
[Yes - Cache for X minutes / No - Always fetch fresh]

Cache duration:
- Real-time data (sessions today): [5 min]
- Historical data (last month): [1 hour / 1 day]
```

**Background Jobs:**
```
Should data refresh happen in background?
[Yes - Queue job / No - Synchronous / User choice]

If background:
- Job queue: [BullMQ / Inngest / Custom]
- Notify user when complete: [In chat / Email / Dashboard notification]
```

---

## 4. AI Service Layer

### Question:
How should you structure AI API calls?

**Service Layer Structure:**
```typescript
// /src/backend/services/aiService.ts

export class AIService {
  async generateChatResponse(
    messages: { role: string; content: string }[],
    options?: {
      model?: string
      temperature?: number
      maxTokens?: number
    }
  ): Promise<{
    response: string
    tokensUsed: number
    model: string
  }>

  async moderateContent(text: string): Promise<{
    flagged: boolean
    categories: string[]
  }>

  async detectIntent(message: string): Promise<{
    intent: string
    confidence: number
    entities: Record<string, unknown>
  }>
}
```

### Your Answer:

**AI Service Functions:**
```
Which functions do you need?

- generateChatResponse(): [Yes]
- moderateContent(): [Yes/No - content filtering]
- detectIntent(): [Yes/No - classify user intent]
- generateSummary(): [Yes/No - summarize conversations]
- extractEntities(): [Yes/No - extract platform names, dates, etc.]
- Other: _________________
```

**System Prompt:**
```typescript
const SYSTEM_PROMPT = `You are a helpful AI assistant for OneReport, a marketing analytics platform.

Your capabilities:
- Help users connect marketing platforms (Google Analytics, Meta Ads, etc.)
- Answer questions about their marketing data
- Generate custom reports
- Provide insights and recommendations

Guidelines:
- Be concise and friendly
- Always offer to take action (connect platforms, generate reports)
- If you can't answer, suggest alternatives or offer to escalate to support
- Format code/technical content with markdown

Current user context:
- Connected platforms: {platforms}
- Current page: {page}
`

What should your system prompt be?
[Your custom system prompt]
```

**Function Calling:**
```
Should you use OpenAI function calling for actions?

Example:
functions: [
  {
    name: "connect_google_analytics",
    description: "Initiate Google Analytics connection",
    parameters: { method: "oauth" | "api_key" }
  }
]

Use function calling: [Yes/No]

If Yes, which functions:
1. connect_platform
2. generate_report
3. fetch_platform_data
4. [Other]
```

---

## 5. Error Responses

### Question:
How should errors be structured and handled?

**Error Codes:**
```typescript
enum ChatErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  MESSAGE_TOO_LONG = 'MESSAGE_TOO_LONG',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Resources
  CONVERSATION_NOT_FOUND = 'CONVERSATION_NOT_FOUND',
  MESSAGE_NOT_FOUND = 'MESSAGE_NOT_FOUND',

  // AI Service
  AI_API_ERROR = 'AI_API_ERROR',
  AI_MODERATION_FLAGGED = 'AI_MODERATION_FLAGGED',

  // Platform Integration
  PLATFORM_NOT_CONNECTED = 'PLATFORM_NOT_CONNECTED',
  PLATFORM_API_ERROR = 'PLATFORM_API_ERROR',
  OAUTH_ERROR = 'OAUTH_ERROR',

  // Generic
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

**Error Response Format:**
```typescript
type ErrorResponse = {
  success: false
  error: {
    code: ChatErrorCode
    message: string // User-friendly message
    details?: unknown // Technical details for debugging
    retryable?: boolean // Can user retry?
    retryAfter?: number // Seconds until retry (for rate limits)
  }
}
```

### Your Answer:

**Error Handling Strategy:**
```
User-Facing Errors:
- Show friendly message in chat
- Offer suggestions (e.g., "Try reconnecting your account")
- Provide retry button if applicable

Developer Errors:
- Log to console/monitoring service
- Include stack trace
- Alert team if critical

Which errors should trigger alerts:
- [ ] AI_API_ERROR (OpenAI down)
- [ ] INTERNAL_ERROR (unexpected crashes)
- [ ] High rate of PLATFORM_API_ERROR
- [ ] Other: _________________
```

**Retry Logic:**
```
Which operations should auto-retry?
- AI API calls: [Yes - max 3 retries with backoff]
- Platform API calls: [Yes - max 2 retries]
- Database operations: [No - fail immediately]

Exponential backoff:
- Delay: [1s, 2s, 4s]
```

---

## 6. Rate Limiting

### Question:
How should you implement rate limiting?

**Rate Limits:**
```typescript
const RATE_LIMITS = {
  // Per user
  messagesPerHour: 50,
  messagesPerDay: 200,

  // Per conversation
  messagesPerConversation: 100,

  // Per IP (for guests)
  guestMessagesPerHour: 10
}
```

**Implementation:**
```typescript
// Option A: In-memory (simple, lost on restart)
const rateLimitMap = new Map<string, { count: number; resetAt: Date }>()

// Option B: MongoDB (persistent)
const RateLimitSchema = new Schema({
  userId: String,
  resource: String, // 'chat_message'
  count: Number,
  windowStart: Date,
  windowEnd: Date
})

// Option C: Redis (best for high traffic)
await redis.incr(`rate_limit:${userId}:chat_messages`)
await redis.expire(`rate_limit:${userId}:chat_messages`, 3600)
```

### Your Answer:

**Rate Limit Implementation:** [In-memory / MongoDB / Redis / None]

```
[Reasoning]
```

**Rate Limit Values:**
```
Guest Users:
- [X] messages per hour
- [X] messages per day

Authenticated Users:
- [X] messages per hour
- [X] messages per day

Premium Users (if applicable):
- [X] messages per hour (or unlimited)

Per-Conversation Limit:
- [X] messages total (prevent runaway conversations)
```

**Rate Limit Response:**
```
When user exceeds limit:
- Show message: "You've reached your message limit. Try again in [X] minutes."
- Offer upgrade: [Yes/No - "Upgrade to Pro for unlimited messages"]
- Show countdown timer: [Yes/No]
```

---

## 7. Webhooks & Callbacks

### Question:
Do you need webhooks for external events?

**Use Cases:**
- OAuth callbacks (Google, Meta)
- Platform data updates (webhooks from GA, Ads)
- Payment events (Stripe webhooks for subscription changes)

**OAuth Callback:**
```typescript
// /src/app/api/auth/callback/[platform]/route.ts

export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  // 1. Verify state token (CSRF protection)
  // 2. Exchange code for access token
  // 3. Save token to database
  // 4. Redirect user back to chat
}
```

### Your Answer:

**Webhooks Needed:**
```
- [ ] OAuth callbacks: [Yes - which platforms?]
- [ ] Platform data webhooks: [Yes/No - which platforms support?]
- [ ] Payment webhooks: [Yes/No - Stripe?]
- [ ] Other: _________________
```

**OAuth Callback Implementation:**
```
Callback URL pattern: [/api/auth/callback/[platform]]
State token storage: [Session / Database / Redis]
Redirect after success: [/dashboard/chat / /settings / Custom]
Error handling: [Show error page / Redirect with error param]
```

---

## API Documentation

### Question:
Should you generate API documentation?

**Your Answer:**
```
- [ ] Yes - Auto-generate from TypeScript types
- [ ] Yes - Manual documentation in /docs/api/
- [ ] No - TypeScript types are sufficient

If Yes:
- Tool: [TypeDoc / TSDoc / Swagger / Custom]
- Format: [Markdown / HTML / Interactive]
```

---

## Additional API Considerations

### Question:
Any other API requirements?

**Your Answer:**
```
[Versioning strategy, deprecation policy, backward compatibility,
API performance targets, logging/tracing, etc.]
```

---

## Document Approval

**Status:** 🟡 Awaiting Input

Once all questions are answered:
- [ ] Engineering Lead Review
- [ ] API Design Review
- [ ] Security Review
- [ ] Status → ✅ Approved

---

**Previous Document:** [06-DATABASE-SCHEMA.md](./06-DATABASE-SCHEMA.md)
**Next Document:** [08-IMPLEMENTATION-ROADMAP.md](./08-IMPLEMENTATION-ROADMAP.md)
