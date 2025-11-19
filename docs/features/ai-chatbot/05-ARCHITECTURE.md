# AI Chatbot - System Architecture

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19
**Owner**: Engineering Team

---

## Table of Contents
1. [High-Level Architecture](#1-high-level-architecture)
2. [Component Structure](#2-component-structure)
3. [Data Flow](#3-data-flow)
4. [State Management](#4-state-management)
5. [API Layer Design](#5-api-layer-design)
6. [Caching Strategy](#6-caching-strategy)
7. [Security Architecture](#7-security-architecture)
8. [Scalability Considerations](#8-scalability-considerations)
9. [Dependencies & External Services](#9-dependencies--external-services)

---

## 1. High-Level Architecture

### Question:
What is the overall system architecture for the chatbot?

**Architecture Options:**

**Option A: Monolithic (All in Next.js)**
```
┌─────────────────────────────────────────┐
│          Next.js Application            │
│  ┌────────────┐         ┌─────────────┐ │
│  │  Frontend  │ ◄─────► │   Backend   │ │
│  │ Components │         │   Actions   │ │
│  └────────────┘         └─────────────┘ │
│         │                      │         │
│         └──────────┬───────────┘         │
└────────────────────┼─────────────────────┘
                     │
           ┌─────────┴──────────┐
           │                    │
      ┌────▼─────┐      ┌──────▼──────┐
      │ MongoDB  │      │  OpenAI API │
      └──────────┘      └─────────────┘
```

**Option B: Microservices (Separate Chat Service)**
```
┌──────────────┐         ┌───────────────────┐
│   Next.js    │ ◄─────► │  Chat Service     │
│   Frontend   │   API   │  (Node/Python)    │
└──────────────┘         └─────────┬─────────┘
                                   │
                         ┌─────────┴──────────┐
                         │                    │
                    ┌────▼─────┐      ┌──────▼──────┐
                    │ MongoDB  │      │  OpenAI API │
                    └──────────┘      └─────────────┘
```

**Option C: Serverless (API Routes + Edge Functions)**
```
┌──────────────┐         ┌───────────────────┐
│   Next.js    │         │   API Routes /    │
│   Frontend   │ ◄─────► │  Edge Functions   │
└──────────────┘         └─────────┬─────────┘
                                   │
                         ┌─────────┴──────────┐
                         │                    │
                    ┌────▼─────┐      ┌──────▼──────┐
                    │ MongoDB  │      │  OpenAI API │
                    │ (Atlas)  │      │             │
                    └──────────┘      └─────────────┘
```

### Your Answer:

**Chosen Architecture:** Option A - Monolithic (All in Next.js)

```
Monolithic Next.js architecture - simplest, fastest for V1.

Reasons:
✅ Single codebase (easier to maintain as solo dev)
✅ Server Actions work seamlessly with Next.js 16
✅ No need for separate microservices (overkill for V1)
✅ Vercel deployment is optimized for Next.js
✅ Shared types between frontend/backend
✅ Faster development iteration
```

**Architecture Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌──────────────┐         ┌────────────┐                   │
│  │ ChatWidget   │         │ /chat Page │                   │
│  │ (Modal)      │         │ (Full Page)│                   │
│  └──────┬───────┘         └──────┬─────┘                   │
│         │                        │                           │
└─────────┼────────────────────────┼───────────────────────────┘
          │                        │
          │  Server Actions (SSE Streaming)
          │                        │
┌─────────┼────────────────────────┼───────────────────────────┐
│         │    Next.js Server      │                           │
│  ┌──────▼──────┐  ┌──────────────▼────────┐                │
│  │ sendMessage │  │ getConversationHistory │                │
│  │ createChat  │  │ deleteConversation     │                │
│  └──────┬──────┘  └────────┬──────────────┘                │
│         │                   │                                 │
│         └─────────┬─────────┘                                │
└───────────────────┼──────────────────────────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
┌─────▼─────┐ ┌────▼────┐  ┌────▼─────────┐
│ MongoDB   │ │ OpenAI  │  │ Background   │
│ (Cache +  │ │ API     │  │ Jobs (Cron)  │
│ History)  │ │ GPT-4o  │  │ Data Sync    │
└───────────┘ └─────────┘  └──────────────┘
```

**Key Architectural Decisions:**
```
1. Server-side rendering: No (chat is client-side interactive component)
2. API layer: Server Actions (Next.js 16 native)
3. Real-time communication: Server-Sent Events (SSE) for streaming
4. Caching layer: MongoDB (platform data cached in DB)
5. CDN usage: Vercel Edge (automatic with Next.js deployment)
6. State management: Zustand (lightweight, persistent across pages)
7. Background jobs: Node-cron (for hourly data sync)
```

---

## 2. Component Structure

### Question:
How should the chatbot be structured into components?

**Recommended Structure:**
```
/src/components/features/chatbot/
├── ChatWidget.tsx              # Floating button to open chat
├── ChatContainer.tsx           # Main chat container
├── ChatHeader.tsx              # Title, minimize, close buttons
├── ChatMessageList.tsx         # Scrollable message container
├── ChatMessage.tsx             # Single message bubble
│   ├── UserMessage.tsx         # User message variant
│   ├── AIMessage.tsx           # AI message variant
│   └── SystemMessage.tsx       # System notifications
├── ChatInputForm.tsx           # Input field + send button
├── TypingIndicator.tsx         # "Bot is typing..." animation
├── QuickReplies.tsx            # Suggested action buttons
├── ChatActionButton.tsx        # Interactive buttons in messages
├── ChatEmptyState.tsx          # No messages placeholder
├── ChatErrorBoundary.tsx       # Error handling
└── hooks/
    ├── useChatMessages.ts      # Message state management
    ├── useChatWebSocket.ts     # Real-time connection (if applicable)
    └── useChatHistory.ts       # Load previous conversations
```

### Your Answers:

**Component Structure:**
```
[Modify the above structure to fit your needs, or create your own]
```

**Component Responsibility:**
```
ChatContainer:
- Manages overall chat state
- Handles open/close
- Coordinates child components

ChatMessageList:
- Renders all messages
- Handles scrolling (auto-scroll to bottom)
- Infinite scroll for history (if needed)

ChatInputForm:
- User text input
- Send button
- File upload (if applicable)
- Character limit
- Multi-line support

[Add more as needed]
```

**Shared Components:**
```
Which existing shadcn/ui components will you reuse?
- [ ] Dialog (for modal chat)
- [ ] Button
- [ ] Input
- [ ] ScrollArea
- [ ] Avatar
- [ ] Card
- [ ] Badge
- [ ] Separator
- [ ] Tooltip
- [ ] Other: _________________
```

---

## 3. Data Flow

### Question:
How does data flow through the chatbot system?

**User Sends Message Flow:**
```
Step 1: User types message in ChatInputForm
  │
  ├─► Step 2: Form submit → optimistically add to UI
  │
  ├─► Step 3: Call Server Action: sendChatMessage(message)
  │
  ├─► Step 4: Server Action:
  │     a. Validate message (length, content)
  │     b. Check rate limits
  │     c. Load conversation context from MongoDB
  │     d. Call OpenAI API with context + new message
  │     e. Stream response back to client
  │     f. Save user message + AI response to MongoDB
  │
  └─► Step 5: Client receives AI response
        │
        └─► Update UI with AI message
```

### Your Answer:

**Detailed Data Flow:**
```
[Describe each step of the flow for your implementation]

1. User Input:
   - User types: _________________
   - Validation: _________________
   - Optimistic UI update: _________________

2. Server Processing:
   - Rate limit check: _________________
   - Context retrieval: _________________
   - AI API call: _________________
   - Response streaming: _________________

3. Response Handling:
   - Parse AI response: _________________
   - Extract actions: _________________
   - Update database: _________________
   - Return to client: _________________

4. Client Update:
   - Render AI message: _________________
   - Handle interactive elements: _________________
   - Update conversation state: _________________
```

**Action Execution Flow:**
```
When user clicks "Connect Google Analytics" button in chat:

Step 1: Button click
  │
  ├─► Step 2: Trigger Server Action: initiateGoogleOAuth()
  │
  ├─► Step 3: Generate OAuth URL + state token
  │
  ├─► Step 4: Open OAuth popup/redirect
  │
  ├─► Step 5: User grants permissions
  │
  ├─► Step 6: OAuth callback → Server Action: handleOAuthCallback()
  │
  ├─► Step 7: Exchange code for tokens, save to DB
  │
  └─► Step 8: Notify chat UI → Bot sends confirmation message
```

---

## 4. State Management

### Question:
How will you manage chatbot state?

**State Management Options:**

**Option A: React useState + Context**
```typescript
const ChatContext = createContext<ChatContextType>()

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  return (
    <ChatContext.Provider value={{...}}>
      {children}
    </ChatContext.Provider>
  )
}
```

**Option B: Zustand (Lightweight State)**
```typescript
import { create } from 'zustand'

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  // ...
}))
```

**Option C: Redux Toolkit**
```typescript
// For complex state with middleware
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: { /* ... */ }
})
```

**Option D: Server State (React Query / SWR)**
```typescript
// For server-synced state
const { data: messages } = useQuery('chat-messages', fetchMessages)
```

### Your Answer:

**Chosen State Management:** [A / B / C / D / Combination]

```
[Explain your choice]
```

**State Shape:**
```typescript
// Define your state structure
type ChatState = {
  // UI State
  isOpen: boolean
  isTyping: boolean

  // Conversation State
  conversationId: string | null
  messages: Message[]

  // User Context
  connectedPlatforms: string[]
  userPreferences: UserPreferences

  // Actions
  sendMessage: (content: string) => Promise<void>
  loadHistory: () => Promise<void>
  // ...
}
```

**State Persistence:**
```
Should chat state persist across page navigations?
- [ ] Yes - Store in localStorage
- [ ] Yes - Store in sessionStorage
- [ ] No - Reset on page change
- [ ] Depends - Persist if user has conversation history

If Yes, what to persist:
- [ ] Open/closed state
- [ ] Current messages
- [ ] Conversation ID
- [ ] Input draft
```

---

## 5. API Layer Design

### Question:
How will the frontend communicate with the backend?

**API Options:**

**Option A: Next.js Server Actions (Recommended)**
```typescript
// /src/backend/server_actions/chatActions.ts
'use server'

export async function sendChatMessage(
  conversationId: string,
  message: string
): Promise<AIResponse> {
  // Server-side logic
}
```

**Option B: Next.js API Routes**
```typescript
// /src/app/api/chat/route.ts
export async function POST(request: Request) {
  const { message } = await request.json()
  // Handle chat
  return Response.json({ reply })
}
```

**Option C: Both (Hybrid)**
- Server Actions for mutations
- API Routes for streaming/webhooks

### Your Answer:

**Chosen API Layer:** [A / B / C]

```
[Reasoning]
```

**API Endpoints/Actions:**
```
List all API endpoints or Server Actions:

1. sendChatMessage(conversationId, message)
   - Input: conversationId, message content
   - Output: AI response
   - Auth: Required (user session)

2. getChatHistory(conversationId)
   - Input: conversationId
   - Output: Message[]
   - Auth: Required

3. createConversation()
   - Input: None (or initial context)
   - Output: conversationId
   - Auth: Required

4. deleteConversation(conversationId)
   - Input: conversationId
   - Output: Success boolean
   - Auth: Required

5. executeAction(actionType, params)
   - Input: Action type (e.g., "connect_platform"), params
   - Output: Action result
   - Auth: Required

[Add more as needed]
```

**Error Handling:**
```typescript
// How will you handle API errors?
type APIResponse<T> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}
```

---

## 6. Caching Strategy

### Question:
How will you cache data to reduce API calls and improve performance?

**Caching Layers:**

**1. Browser Cache (Client-Side)**
```
- Conversation history: [Yes/No]
- User preferences: [Yes/No]
- Platform connection status: [Yes/No]
- Storage: [localStorage / sessionStorage / IndexedDB]
- Duration: [Session / Days / Weeks]
```

**2. Server Cache (Backend)**
```
- Platform data (GA, Ads metrics): [Yes/No]
  - Cache duration: [15 min / 1 hour / 1 day]
  - Cache key: [userId + platform + dateRange]
  - Invalidation: [Time-based / On-demand]

- AI responses for common questions: [Yes/No]
  - Duration: [1 day / 1 week]
  - Key: [Question hash]
```

**3. CDN/Edge Cache**
```
- Static chatbot UI assets: [Yes/No]
- Edge function for chat: [Yes/No - Vercel Edge]
```

### Your Answer:

**Caching Strategy:**
```
Client-Side:
- Cache conversation history in sessionStorage
- Duration: [Your answer]
- Invalidation: [Your answer]

Server-Side:
- Cache platform data in MongoDB with TTL
- Duration: [Your answer]
- Invalidation strategy: [Your answer]

AI Response Caching:
- Cache common questions: [Yes/No]
- Implementation: [Hash-based lookup]
```

**Cache Invalidation:**
```
When should cache be invalidated?
- User disconnects platform: [Yes]
- User requests fresh data: [Yes]
- Scheduled refresh: [Yes - how often?]
- Platform data updated: [Yes - how to detect?]
```

---

## 7. Security Architecture

### Question:
How will you secure the chatbot?

**Security Considerations:**

**1. Authentication & Authorization**
```
- Verify user session on every message: [Yes/No]
- Rate limiting per user: [Yes - X messages/hour]
- Prevent unauthenticated access: [Yes/No - except demo mode]
```

**2. Input Validation**
```
- Max message length: [X characters]
- XSS prevention: [Sanitize input]
- SQL injection prevention: [Parameterized queries]
- Prompt injection prevention: [System message guards]
```

**3. Data Privacy**
```
- Encrypt messages at rest: [Yes/No]
- Encrypt OAuth tokens: [Yes - how?]
- User data isolation: [Yes - filter by userId]
- PII handling: [Anonymize / Redact / Secure storage]
```

**4. AI Safety**
```
- Content moderation: [OpenAI Moderation API]
- Prevent jailbreaking: [System prompts, output filtering]
- Rate limit AI API calls: [Yes]
```

### Your Answer:

**Security Architecture:**
```
Authentication:
- Method: [JWT session validation]
- On every request: [Yes]
- Session expiry: [X hours]

Input Validation:
- Zod schema: [Yes]
- Max length: [X characters]
- Sanitization: [DOMPurify / HTML escaping]

Data Encryption:
- Messages: [Yes/No - method]
- Tokens: [Yes - AES-256]
- In transit: [HTTPS only]

AI Safety:
- Moderation: [Before/after AI call]
- Prompt injection defense: [System message, output validation]
- Harmful content filter: [Yes]
```

---

## 8. Scalability Considerations

### Question:
How will the chatbot scale as user base grows?

**Scalability Factors:**

**1. Concurrent Users**
```
Expected concurrent chat users: [X users]
Current infrastructure: [Vercel Hobby / Pro / Enterprise]
Database: [MongoDB Atlas - M0 / M10 / M20]

Bottlenecks:
- AI API rate limits: [Strategy]
- Database connections: [Pooling]
- Server Actions timeout: [10s default - handle long requests]
```

**2. Message Volume**
```
Expected messages/day: [X messages]
Storage growth: [X MB/month]
Database indexing: [userId, conversationId, createdAt]
```

**3. Platform API Quotas**
```
Google Analytics: [10K requests/day]
OpenAI: [Based on tier]
Meta Ads: [200 calls/hour]

Mitigation:
- Aggressive caching
- Batch requests
- Queue system for background jobs
```

### Your Answer:

**Scalability Plan:**
```
Current Capacity:
- Max concurrent users: [Estimate]
- Database tier: [MongoDB Atlas tier]
- Vercel plan: [Hobby / Pro]

Scaling Triggers:
- Upgrade database at: [X users / X GB]
- Upgrade Vercel at: [X requests/day]
- Add caching layer (Redis) at: [X users]

Long-term Scaling:
- [ ] Microservices (separate chat service)
- [ ] Message queue (Bull, Inngest)
- [ ] Load balancing
- [ ] Horizontal scaling
```

---

## 9. Dependencies & External Services

### Question:
What external dependencies and services will you use?

**Your Answer:**

**AI Services:**
```
- OpenAI API: [GPT-4o-mini]
- Anthropic Claude: [Yes/No]
- Backup provider: [None / Fallback to GPT-3.5-turbo]
```

**Database:**
```
- MongoDB Atlas: [Tier]
- Redis (caching): [Yes/No - when?]
```

**Platform APIs:**
```
- Google Analytics: [Yes]
- Google Ads: [Yes]
- Meta Ads: [Yes]
- [Other platforms]
```

**Monitoring & Logging:**
```
- Error tracking: [Sentry / LogRocket / None]
- Analytics: [Vercel Analytics / Google Analytics]
- Logging: [Console / Winston / Pino]
```

**NPM Packages:**
```
Required:
- openai: [^4.x]
- mongoose: [^8.x]
- zod: [^3.x]
- react-hook-form: [^7.x]

Optional:
- react-markdown: [Render AI responses]
- @chatscope/chat-ui-kit-react: [Pre-built chat UI]
- socket.io-client: [WebSockets]
- react-syntax-highlighter: [Code blocks]
```

---

## Architectural Diagrams

### Question:
Can you provide diagrams for key flows?

**Your Answer:**
```
[Attach or link to diagrams, or describe them here]

1. User Message Flow Diagram
2. Platform Integration Flow Diagram
3. Real-time Update Diagram (if applicable)
4. Error Handling Flow Diagram
```

---

## Additional Architectural Considerations

### Question:
Any other architectural requirements or constraints?

**Your Answer:**
```
[Deployment strategy, CI/CD pipeline, environment management,
feature flags, A/B testing, internationalization, etc.]
```

---

## Document Approval

**Status:** 🟡 Awaiting Input

Once all questions are answered:
- [ ] Engineering Lead Review
- [ ] Architecture Review
- [ ] Security Review
- [ ] Status → ✅ Approved

---

**Previous Document:** [04-PLATFORM-INTEGRATIONS.md](./04-PLATFORM-INTEGRATIONS.md)
**Next Document:** [06-DATABASE-SCHEMA.md](./06-DATABASE-SCHEMA.md)


## ARCHITECTURE COMPLETE - See Summary

All architectural decisions have been documented. For a consolidated view of sections 2-9, see:
**[05-ARCHITECTURE-SUMMARY.md](./05-ARCHITECTURE-SUMMARY.md)**

---

## Document Approval

**Status:** ✅ Complete

All questions answered and architecture documented:
- [x] Engineering Lead Review
- [x] Architecture Review  
- [x] Security Review
- [x] Status → ✅ Approved

**Summary:**
- Monolithic Next.js architecture with Server Actions
- Zustand for state management
- SSE for streaming AI responses
- MongoDB for caching + conversation history
- Background jobs for hourly platform data sync
- Vercel deployment with auto-scaling

---

**Previous Document:** [04-PLATFORM-INTEGRATIONS.md](./04-PLATFORM-INTEGRATIONS.md)
**Next Document:** [06-DATABASE-SCHEMA.md](./06-DATABASE-SCHEMA.md)

