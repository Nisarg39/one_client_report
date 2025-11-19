# Architecture Summary - Quick Reference

**This file contains consolidated answers for sections 2-9 of 05-ARCHITECTURE.md**

## 2. Component Structure

```
/src/components/features/chatbot/
├── ChatWidget.tsx              # Floating button (bottom-right)
├── ChatModal.tsx               # Modal overlay container
├── ChatContainer.tsx           # Main chat UI wrapper
├── ChatHeader.tsx              # Title, minimize, close buttons
├── MessageList.tsx             # Scrollable message area
├── Message.tsx                 # Single message bubble (user/AI variants)
├── TypingIndicator.tsx         # Bouncing dots animation
├── ChatInput.tsx               # Textarea + send button
├── QuickReplyButtons.tsx       # Suggested prompts
├── EmptyState.tsx              # No messages placeholder
├── ConversationSidebar.tsx     # For /chat page
└── hooks/
    ├── useChatStore.ts         # Zustand store
    ├── useStreamingResponse.ts # SSE streaming
    └── useChatHistory.ts       # Load conversations
```

## 3. Data Flow

```
User sends message → Client (optimistic UI) → Server Action (sendMessage) →
→ Store in MongoDB → Call OpenAI API (streaming) → Stream tokens via SSE →
→ Client receives tokens → Render incrementally → Save complete response to DB
```

## 4. State Management

- **Global State**: Zustand store (chatOpen, currentConversationId, messages)
- **Local State**: React useState for input text, typing indicator
- **Persistence**: localStorage for chatOpen state across pages
- **Server State**: MongoDB for conversation history

## 5. API Layer Design

**Server Actions:**
- `sendMessage(conversationId, message)` - Send user message, get AI response (SSE)
- `getConversations(userId)` - Get user's conversation list
- `getConversationHistory(conversationId)` - Load specific conversation
- `deleteConversation(conversationId)` - Delete conversation
- `createConversation(userId)` - Create new conversation

## 6. Caching Strategy

- **Platform Data**: Cached in MongoDB (1-hour TTL)
- **Conversation History**: MongoDB (no cache needed)
- **AI Responses**: Not cached (each query is unique)
- **Static Assets**: Vercel CDN

## 7. Security Architecture

- **Authentication**: JWT (existing system)
- **Authorization**: UserId-based (strict isolation)
- **API Keys**: Environment variables only
- **Input Sanitization**: Zod validation on all inputs
- **Rate Limiting**: 50 msg/hour per user
- **No direct token access**: Chatbot queries MongoDB only

## 8. Scalability Considerations

- **Horizontal Scaling**: Stateless Server Actions (Vercel auto-scales)
- **Database**: MongoDB Atlas (auto-scaling)
- **Connection Pooling**: MongoDB connection pool (max 100)
- **Background Jobs**: Separate process (can scale independently)

## 9. Dependencies & External Services

**External APIs:**
- OpenAI API (GPT-4o-mini)
- Google Analytics API (background jobs)
- Google Ads API (background jobs)
- Meta Ads API (background jobs)
- LinkedIn Ads API (background jobs)

**NPM Packages:**
- openai (AI responses)
- zustand (state management)
- react-markdown (rendering)
- framer-motion (animations)
- zod (validation)
- node-cron (background jobs)
