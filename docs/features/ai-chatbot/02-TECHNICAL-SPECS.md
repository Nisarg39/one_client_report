# AI Chatbot - Technical Specifications

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19
**Owner**: Engineering Team

---

## Table of Contents
1. [AI Provider & Model Selection](#1-ai-provider--model-selection)
2. [Chatbot Capabilities](#2-chatbot-capabilities)
3. [Data Access & Context](#3-data-access--context)
4. [Real-time Communication](#4-real-time-communication)
5. [Message Persistence](#5-message-persistence)
6. [Rate Limiting & Quotas](#6-rate-limiting--quotas)
7. [File Uploads & Media](#7-file-uploads--media)
8. [Multimodal Features](#8-multimodal-features)
9. [Fallback & Error Handling](#9-fallback--error-handling)

---

## 1. AI Provider & Model Selection

### Questions:

#### 1.1 AI Provider
Which AI provider will you use?

**Options:**
- [x] **OpenAI** (GPT-4o, GPT-4o-mini, GPT-3.5-turbo)
- [ ] **Anthropic Claude** (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku)
- [ ] **Google Gemini** (Gemini 1.5 Pro, Gemini 1.5 Flash)
- [ ] **Open Source** (Llama 3, Mistral, etc. via Ollama/Replicate)
- [x] **Multiple Providers** (fallback strategy) - Future V2
- [ ] Other: _________________

**Your Answer:**
```
V1: OpenAI (Primary provider)
V2: Multi-provider support (OpenAI + Claude + Gemini)

Architecture: AI Abstraction Layer (provider-agnostic design)
```

**Reasoning:**
```
V1 - Start with OpenAI:
✅ Cost-effective (GPT-4o-mini: $0.15 per 1M tokens)
✅ Excellent for data queries and conversational AI
✅ Well-documented, easy to integrate
✅ Fast response times (< 2 seconds)
✅ Already have OPENAI_API_KEY in .env.example

V2 - Add Multiple Providers:
✅ Use abstraction layer pattern for easy provider switching
✅ Add Claude for complex reasoning (if needed)
✅ Add Gemini for Google ecosystem integration (if needed)
✅ Fallback strategy: If OpenAI down, use Claude as backup
✅ A/B testing: Compare providers for best results

Technical Implementation:
- Create AIService interface that all providers implement
- Switch providers via environment variable or config
- No code changes needed when adding new providers
```

#### 1.2 Model Selection
Which specific model(s)?

**Primary Model:**
```
Model: GPT-4o-mini
Use Case: All data queries, conversational responses
Cost: $0.15 per 1M tokens (~$0.0000015 per query)
Speed: Fast (1-3 seconds)
Context Window: 128K tokens (very large)
```

**Advanced Model (if applicable):**
```
Model: GPT-4o (for future, if needed)
Use Case: Complex data analysis, multi-platform queries
Cost: $2.50 per 1M tokens (~$0.000025 per query)
Speed: Slower (2-5 seconds)
When to use: If GPT-4o-mini struggles with complex queries

Decision: Start with GPT-4o-mini only for V1.
Upgrade to GPT-4o for specific queries only if needed in V2.
```

#### 1.3 Budget Considerations
What's your expected AI API budget?

**Your Answer:**
- **Monthly Budget:** $50 (conservative, actual ~$11/month expected)
- **Cost per User/Month:** ~$0.11 (with 5 questions per user)
- **Expected Monthly Messages:** ~2,500 messages (100 active users)
- **Cost Optimization Strategy:**
  ```
  ✅ Use GPT-4o-mini ($0.15/1M tokens)
  ✅ Cache responses in MongoDB
  ✅ Set rate limits per user
  ✅ Monitor token usage
  ✅ Optimize prompts
  ```

#### 1.4 API Configuration
Do you already have an API key?

**Your Answer:**
- [ ] Yes - Already have OpenAI API key
- [x] Need to create new API key
- [x] Need to set up billing

**Setup Steps:**
1. Go to https://platform.openai.com/api-keys
2. Create account & add payment
3. Generate API key
4. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

**Environment Variables:**
```
OPENAI_API_KEY=sk-proj-...
```

---

## 2. Chatbot Capabilities

### Question:
What should the chatbot be able to do? Select all that apply:

**Options:**
- [ ] Answer general questions about your product/service (static knowledge)
- [x] Access user's actual marketing data (GA, Ads) and answer data-specific questions
- [ ] Generate custom reports based on conversation
- [ ] Help connect/configure platform integrations (OAuth flows, API setup)
- [x] Provide marketing insights/recommendations based on data
- [ ] Execute actions (create reports, export PDFs, update settings)
- [ ] Handoff to human support
- [x] Understand and respond to marketing terminology
- [x] Multi-turn conversations with context retention
- [ ] Proactive suggestions based on user behavior
- [ ] Other: _________________

### Your Answers:

**V1 Capabilities (Must Have):**
1. **Answer data-specific questions** - Query Google Analytics, Google Ads, Meta Ads, LinkedIn Ads data
2. **Understand marketing terminology** - CTR, CPA, ROAS, bounce rate, conversions, etc.
3. **Multi-turn conversations** - Remember context within a conversation (last 10 messages)
4. **Provide insights** - Basic analysis and recommendations based on data trends
5. **Demo data support** - Answer questions about mock data for users without connected platforms

**V2 Capabilities (Nice to Have):**
1. Proactive suggestions based on user behavior patterns
2. Compare data across multiple platforms
3. Advanced predictive analytics

**Out of Scope (V1):**
1. Generate custom reports (users must use report UI separately)
2. Connect/disconnect platforms (done via settings UI)
3. Execute actions like exporting PDFs or updating settings
4. Handoff to human support (no live chat integration)

---

## 3. Data Access & Context

### Questions:

#### 3.1 Context Sources
What data should the chatbot have access to for answering questions?

**User Data:**
- [x] User profile (name, email, company)
- [ ] Onboarding status
- [x] Connected platforms list
- [ ] Subscription/billing status
- [ ] User preferences (branding, settings)

**Marketing Data:**
- [x] Google Analytics metrics
- [x] Google Ads performance
- [x] Meta Ads metrics
- [ ] Historical report data
- [ ] Client information
- [x] Real-time data vs. cached data

**System Data:**
- [ ] Product documentation
- [ ] FAQ knowledge base
- [ ] Feature availability
- [ ] Pricing information

**Your Answer:**
```
Data Sources (all cached in MongoDB):

✅ User profile: name, email (for personalization)
✅ Connected platforms list: which platforms user has integrated
✅ Platform metrics (cached, refreshed periodically):
   - Google Analytics: sessions, users, pageviews, bounce rate, sources, devices
   - Google Ads: campaigns, spend, CTR, CPA, conversions
   - Meta Ads: impressions, clicks, CPM, ROAS
   - LinkedIn Ads: engagement, leads, demographics

✅ Demo data: Mock marketing data for users without connections

Data Strategy:
- Primary: Use cached data from MongoDB (fast responses < 1s)
- Optional: Refresh on-demand if user asks for "latest" data
- Cache TTL: 1 hour for most metrics, 15 min for real-time dashboards
```

#### 3.2 Conversation Memory
Should the chatbot remember conversation history?

**Options:**
- [ ] **Session-based** - Remember within current session only
- [x] **Persistent** - Remember across sessions (stored in DB)
- [ ] **Hybrid** - Recent conversations cached, older in DB

**Your Answer:**
```
Persistent conversation history stored in MongoDB.

✅ Remember across sessions (user can continue conversations later)
✅ Store for 90 days (auto-delete after that)
✅ Users can manually delete conversations anytime
```

**Context Window:**
- How many previous messages should the chatbot consider? **10 messages** (last 5 turns)
- Should it summarize old conversations? **No for V1** (just truncate, keep recent only)

#### 3.3 User Isolation
Should different users have isolated chat histories?

**Your Answer:**
- [x] Yes - Each user has separate conversation history
- [ ] No - Shared knowledge across users (anonymized)
- [ ] Depends on user type (guests shared, authenticated isolated)

```
✅ Complete user isolation - each user has their own conversation history
✅ Privacy: User A cannot see User B's conversations
✅ Data filtering: AI only accesses data for the logged-in user
✅ Conversations are tied to userId in MongoDB
```

#### 3.4 RAG (Retrieval-Augmented Generation)
Will you implement RAG for knowledge base queries?

**Your Answer:**
- [ ] Yes - Use vector database (Pinecone, Weaviate, MongoDB Atlas Vector Search)
- [x] No - Use prompt engineering only
- [ ] Later phase

**Reasoning:**
```
No RAG for V1 - Keep it simple!

Why skip RAG:
✅ Simpler implementation (no vector database needed)
✅ Lower costs (no embedding API calls)
✅ Faster development
✅ Platform data is structured (not unstructured docs)

Use prompt engineering instead:
- Include relevant context in prompts
- Pass user's platform data directly
- Use system message to guide AI behavior

V2 consideration: Add RAG if we need to query product documentation or FAQs
```

---

## 4. Real-time Communication

### Question:
How should chat messages be delivered?

**Options:**
- [ ] **HTTP Polling** - Frontend polls every N seconds
- [x] **Server-Sent Events (SSE)** - One-way streaming from server
- [ ] **WebSockets** - Bi-directional real-time communication
- [x] **Streaming Response** - Stream AI responses token-by-token

**Your Answer:**
```
Use Server Actions + Streaming Response (ChatGPT-like)

✅ OpenAI streaming API (stream tokens as they're generated)
✅ Server-Sent Events for delivering chunks to frontend
✅ No WebSockets needed (simpler, works with Next.js out of the box)
```

**Reasoning:**
```
Why this approach:
✅ Better UX - users see responses appear in real-time (like ChatGPT)
✅ Lower perceived latency - starts showing response immediately
✅ Simpler than WebSockets - works with Next.js Server Actions
✅ No connection management overhead
✅ Works well with Vercel deployment

How it works:
1. User sends message via Server Action
2. Server calls OpenAI with stream: true
3. As tokens arrive, stream them to client via SSE
4. Frontend renders tokens incrementally
```

**Implementation Details:**
- Response streaming: **Yes** - Stream AI tokens as they arrive
- Typing indicators: **Yes** - Show "Bot is typing..." before first token
- Message delivery confirmation: **No** - Not needed for V1
- Offline message queue: **No** - Requires online connection

---

## 5. Message Persistence

### Questions:

#### 5.1 Storage Strategy
Should you store all chat messages in MongoDB?

**Your Answer:**
- [x] Yes - Store all messages
- [ ] Yes - Store only user messages (not AI responses)
- [ ] Yes - Store summarized conversations
- [ ] No - Ephemeral only
- [ ] Other: _________________

**Storage Schema (Approved):**
```typescript
// MongoDB schema
{
  _id: ObjectId,
  conversationId: string (UUID),
  userId: ObjectId (reference to User),
  messages: [{
    role: 'user' | 'assistant' | 'system',
    content: string,
    timestamp: Date,
    metadata: {
      model: 'gpt-4o-mini',
      tokensUsed: number,
      cost: number
    }
  }],
  createdAt: Date,
  updatedAt: Date,
  lastMessageAt: Date,
  status: 'active' | 'archived' | 'deleted',
  messageCount: number
}
```

#### 5.2 Data Retention Policy
How long should conversations be stored?

**Your Answer:**
```
Duration: 90 days
Auto-deletion: Yes (cron job runs daily to delete old conversations)
User deletion option: Yes (users can delete conversations manually)
Archive vs. hard delete: Soft delete (status='deleted'), hard delete after 90 days

Implementation:
- Active conversations: status='active', visible to user
- User deletes: status='deleted', hidden from UI, kept in DB for 90 days
- Auto-cleanup: Cron job deletes conversations where updatedAt > 90 days ago
```

---

## 6. Rate Limiting & Quotas

### Questions:

#### 6.1 User Rate Limits
How many messages should users be allowed to send?

**Your Answer:**
- **Guest Users:** No access (login required)
- **Authenticated Users:** 50 messages per hour, 200 per day
- **Premium Users:** Not applicable for V1 (all users treated equally)

**Reasoning:**
```
✅ Cost control: Prevent runaway API costs
✅ Abuse prevention: Stop spam/bot attacks
✅ Fair usage: Ensure resources for all users

50 msg/hour = plenty for normal use (avg user sends 5-10)
200 msg/day = covers heavy users without being excessive
```

#### 6.2 API Rate Limits
OpenAI/provider API rate limits:

**Your Answer:**
- **Requests per Minute (RPM):** 60 RPM (OpenAI free tier)
- **Tokens per Minute (TPM):** 150K TPM (OpenAI free tier)
- **Handling Strategy:** Queue requests, show "Please wait" if limit hit, exponential backoff

#### 6.3 Quota Management
What happens when limits are reached?

**Your Answer:**
```
User Rate Limit Exceeded:
- Show friendly error: "You've reached your hourly message limit (50). Try again in [X] minutes."
- Show countdown timer
- No upgrade option for V1 (add in V2 if needed)

OpenAI API Limit Exceeded:
- Retry with exponential backoff (1s, 2s, 4s)
- If still failing: "We're experiencing high demand. Please try again in a moment."
- Log to monitoring (Sentry) for investigation
```

---

## 7. File Uploads & Media

### Question:
Should users be able to upload files in the chat?

**Options:**
- [ ] Yes - CSV files (for data import)
- [ ] Yes - Images (for visual questions, screenshots)
- [ ] Yes - PDFs (for document analysis)
- [ ] Yes - Excel files
- [x] No - Text-only chat
- [ ] Later phase

**Your Answer:**
```
No file uploads for V1 - Text-only chat

Reasoning:
✅ Simpler implementation (no file storage/processing)
✅ Lower costs (no S3/Cloudinary needed)
✅ Faster development
✅ Focus on core data querying feature

V2 consideration: Add image/screenshot uploads if users need visual debugging help
```

**If Yes, specify:**
- Not applicable for V1

---

## 8. Multimodal Features

### Questions:

#### 8.1 Voice Input
Should users be able to use voice-to-text?

**Your Answer:**
- [ ] Yes - Browser Web Speech API
- [ ] Yes - OpenAI Whisper API
- [x] No - Text-only
- [ ] Later phase

```
No voice input for V1. Keep it simple - text only.
V2 consideration if users request it.
```

#### 8.2 Voice Output
Should the chatbot respond with voice?

**Your Answer:**
- [ ] Yes - Text-to-speech
- [x] No
- [ ] Later phase

```
No voice output for V1. Text responses only.
V2 consideration if accessibility needs arise.
```

#### 8.3 Visual Responses
Should the chatbot generate visual responses?

**Options:**
- [ ] Charts/graphs (for data visualization)
- [ ] Images (via DALL-E, Midjourney)
- [ ] Interactive components (buttons, forms)
- [ ] Embedded reports
- [x] Code snippets with syntax highlighting

**Your Answer:**
```
V1: Markdown rendering + syntax highlighting only

✅ Render markdown (bold, italic, lists, links)
✅ Syntax highlighting for code blocks (if AI shares examples)
✅ Clickable links
✅ Line breaks and formatting

❌ NO charts/graphs (complex, not needed for data queries)
❌ NO images
❌ NO interactive buttons (just text responses)
❌ NO embedded reports

Use react-markdown + prism/highlight.js for rendering
```

---

## 9. Fallback & Error Handling

### Questions:

#### 9.1 No Answer / Low Confidence
What happens when the chatbot doesn't know the answer?

**Your Answer:**
- [x] Admit uncertainty + provide related resources
- [ ] Escalate to human support
- [ ] Offer to search documentation
- [x] Show quick-reply buttons with common questions
- [ ] Other: _________________

```
AI should admit when it doesn't know:

Response example:
"I'm not sure about that specific metric. However, I can help you with:
- Session counts and user analytics
- Campaign performance metrics
- Traffic source breakdowns
Would you like to ask about any of these?"

[Button: View Analytics] [Button: Ask Different Question]
```

#### 9.2 API Errors
What happens when the AI provider API fails?

**Your Answer:**
```
✅ Show user-friendly error message:
   "Sorry, I'm having trouble connecting right now. Please try again in a moment."

✅ Retry with exponential backoff (auto-retry 3 times: 1s, 2s, 4s)

✅ Log error to Sentry for monitoring

❌ NO fallback model for V1 (keep it simple)
❌ NO message queue (just ask user to retry)
```

#### 9.3 Inappropriate Content
How will you handle inappropriate user input?

**Your Answer:**
- [ ] OpenAI Moderation API
- [ ] Custom content filter
- [x] Block + notify user
- [ ] Log for review
- [ ] Other: _________________

#### 9.4 Quick Replies & Suggested Actions
Should the chatbot provide quick-reply buttons?

**Your Answer:**
- [x] Yes - For common questions
- [x] Yes - When user is stuck
- [ ] Yes - For action confirmation
- [ ] No

**Implementation:**
```
Show quick-reply buttons in these scenarios:

1. First message (onboarding):
   [Show my Google Analytics data]
   [Show my ad performance]
   [What metrics can you show me?]

2. When user is stuck (after unclear question):
   [Show top traffic sources]
   [Compare this week vs last week]
   [Show conversion metrics]

3. After providing data (suggest next steps):
   [Tell me more about this]
   [Show different date range]
   [Compare with another platform]

V1: Static buttons (predefined questions)
V2: Dynamic buttons (AI-generated based on context)
```

---

## 10. Additional Technical Considerations

### Question:
Any other technical requirements or constraints?

**Your Answer:**
```
Performance Requirements:
✅ Response time: < 3 seconds from message send to first token streamed
✅ Message load time: < 500ms to load conversation history
✅ Concurrent users: Support 100+ simultaneous chats
✅ Database queries: < 200ms for fetching user context

Security Considerations:
✅ Authentication: JWT-based (existing auth system)
✅ API key security: Store OPENAI_API_KEY in environment variables (never in code)
✅ User isolation: Strict userId-based data filtering
✅ Input sanitization: Prevent prompt injection attacks
✅ Rate limiting: IP-based + userId-based throttling
✅ Content moderation: Block inappropriate prompts

Third-Party Integrations:
✅ OpenAI API: GPT-4o-mini for AI responses
✅ MongoDB: Conversation storage + user data
✅ (Future) Sentry: Error monitoring
✅ (Future) Vercel Analytics: Performance monitoring

Scalability Considerations:
✅ Stateless Server Actions (scales horizontally)
✅ MongoDB connection pooling (prevent connection exhaustion)
✅ API response caching (reduce duplicate OpenAI calls)
✅ Conversation pagination (don't load entire history at once)

Accessibility:
✅ Keyboard navigation (Tab, Enter for sending messages)
✅ Screen reader support (ARIA labels on chat interface)
✅ High contrast mode compatibility
✅ Text resizing support
```

---

## Technical Dependencies

Based on your answers, here are the required packages:

**Backend:**
- [x] `openai` - OpenAI API client for GPT-4o-mini
- [ ] `@anthropic-ai/sdk` - For future Claude integration (V2)
- [ ] `@google/generative-ai` - For future Gemini integration (V2)
- [ ] Vector DB client - Not needed (no RAG in V1)
- [ ] WebSocket library - Not needed (using SSE)
- [ ] File upload library - Not needed (no file uploads in V1)
- [x] `uuid` - For generating conversationId
- [x] `zod` - For input validation & type safety

**Frontend:**
- [x] Custom chat UI - Built with shadcn/ui components (not using external chat library)
- [x] `react-markdown` - For rendering markdown in AI responses
- [x] `remark-gfm` - GitHub Flavored Markdown support
- [x] `rehype-highlight` or `prism-react-renderer` - Syntax highlighting for code blocks
- [ ] Voice recognition library - Not needed (no voice in V1)
- [x] `framer-motion` - For chat animations (already in project)
- [x] `date-fns` - For timestamp formatting

**Development/Testing:**
- [x] `vitest` - Unit testing (already in project)
- [x] `@testing-library/react` - Component testing (already in project)
- [x] `playwright` - E2E testing (already in project)

**NPM Install Commands:**
```bash
# Backend dependencies
npm install openai uuid zod

# Frontend dependencies
npm install react-markdown remark-gfm rehype-highlight

# Already installed in project:
# - framer-motion
# - date-fns
# - vitest
# - @testing-library/react
# - playwright
```

---

## Document Approval

**Status:** ✅ Complete

All questions answered and decisions documented:
- [x] Engineering Lead Review
- [x] Architecture Review
- [x] Status → ✅ Approved

**Summary:**
- AI Provider: OpenAI GPT-4o-mini with abstraction layer for future multi-provider support
- Communication: Server Actions + SSE streaming for real-time responses
- Storage: MongoDB with 90-day retention policy
- Rate Limiting: 50 msg/hour, 200 msg/day per user
- V1 Scope: Text-only chat, data queries only, no file uploads/voice
- Budget: $50/month (actual ~$11/month expected)

---

**Previous Document:** [01-REQUIREMENTS.md](./01-REQUIREMENTS.md)
**Next Document:** [03-UX-DESIGN.md](./03-UX-DESIGN.md)
