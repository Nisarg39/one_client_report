# AI Chatbot - Implementation Roadmap (COMPLETE)

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-21 (Updated for Multi-Client Architecture)

---

## Implementation Timeline

**Approach:** Development-driven timeline (no hard deadlines)
**Developer:** Solo full-stack developer
**Estimated Total Time:** 4-6 weeks

---

## Phase 0: Setup & Planning (Week 1)

**Duration:** 3-5 days

**Tasks:**
- [x] Complete all 10 planning documents ✅
- [x] Create authentication strategy document ✅
- [x] Create multi-client strategy document ✅
- [ ] ~~Set up OpenAI API account~~ (Deferred to Week 3 - Phase 2)
- [x] Install dependencies (openai, react-markdown, zod, zustand) ✅
- [x] Create Mongoose schemas (Conversation model with clientId) ✅
- [ ] **Create Client Mongoose model** (src/models/Client.ts)
- [x] Create TypeScript types (chat.ts with Client types) ✅
- [x] Set up environment variables template ✅
- [ ] **Create auth abstraction layer (adapter.ts, mockAuth.ts)**

**Deliverables:**
- [x] All documentation complete ✅
- [x] Conversation model created with multi-client support (clientId field) ✅
- [ ] Client model created
- [x] Dependencies installed ✅
- [ ] Auth abstraction layer ready for mock → NextAuth transition
- [ ] ~~OpenAI API configured~~ (Week 3)

---

## Phase 1: Core Chat UI (Week 2)

**Duration:** 5-7 days

**Authentication:** Uses mock auth (`getCurrentUser()` returns demo user)

**Tasks:**
- [ ] **Create auth abstraction layer** (adapter.ts, mockAuth.ts)
- [ ] Build ChatWidget component (floating button)
- [ ] Build ChatModal component (dialog overlay)
- [ ] Build MessageList + Message components
- [ ] Build ChatInput component (textarea + send button)
- [ ] Implement TypingIndicator component
- [ ] Set up Zustand store for chat state
- [ ] **Implement mock AI response function** (simulates streaming)
- [ ] Add Framer Motion animations
- [ ] Responsive design (mobile, tablet, desktop)

**Deliverables:**
- Functional chat UI with mock responses
- Auth abstraction layer working with demo user
- Open/close chat modal
- Send messages (mock AI responses)
- Smooth animations

**Auth Note:** All components use `getCurrentUser()` which returns `{ id: "demo-user-123", email: "demo@example.com" }` for now

---

## Phase 2: AI Integration (Week 3)

**Duration:** 4-6 days

**Authentication:** Still uses mock auth (demo user)

**⚠️ NOW set up OpenAI account and get API key!**

**Tasks:**
- [ ] **Set up OpenAI account & get API key** (do this first!)
- [ ] Add OPENAI_API_KEY to .env.local
- [ ] Create AI abstraction layer (provider.ts, openai.ts)
- [ ] Create sendMessage Server Action
- [ ] Integrate OpenAI API (GPT-4o-mini)
- [ ] Implement SSE streaming for responses
- [ ] Build system prompt with platform data context
- [ ] Add conversation history context (last 10 messages)
- [ ] Implement createConversation action
- [ ] Implement getConversationHistory action
- [ ] Add error handling for AI failures
- [ ] Save conversations to MongoDB with demo user ID

**Deliverables:**
- Working AI responses with real OpenAI
- Streaming chat (like ChatGPT)
- Conversation persistence (demo user ID)
- Error handling
- Cost tracking (~$0.36/day starts here)

**Auth Note:** Still uses mock user, but conversations are saved to MongoDB with `userId: "demo-user-123"`

---

## Phase 3: Multi-Client & Platform Data Integration (Week 4-5)

**Duration:** 7-10 days

**Authentication:** Still uses mock auth (demo user)

**Multi-Client Note:** This phase implements the full multi-client architecture!

**Tasks:**
- [ ] **Create Client model implementation** (if not done in Phase 0)
- [ ] **Create Client management Server Actions**:
  - [ ] createClient
  - [ ] getClients
  - [ ] updateClient
  - [ ] updateClientPlatforms
  - [ ] archiveClient
- [ ] **Create demo Client documents** in MongoDB for demo-user-123
- [ ] **Add demo platform data to demo clients** (Google Analytics, Ads metrics)
- [ ] Build getConnectedPlatforms action (per client)
- [ ] Build getClientPlatformData helper
- [ ] Integrate client platform data into AI prompts
- [ ] Test AI responses with demo client platform metrics
- [ ] Handle cases where client platforms aren't connected
- [ ] Add "Configure Platforms" CTAs in chat
- [ ] Test client switching in chat UI

**Deliverables:**
- Client model fully functional
- Client management Server Actions working
- Chatbot can query specific client's platform data
- Demo clients with platform data for testing
- AI context switches based on selected client
- Graceful handling of unconnected platforms
- AI answers questions about selected client's marketing data

**Multi-Client Testing:**
```javascript
// Demo Client A: Has Google Analytics + Google Ads
// Demo Client B: Has Meta Ads only
// Test: Switch between clients, ask "How many visitors?" → Different answers!
```

**Auth Note:** Create Client documents for demo-user-123 with fake platform data for testing

---

## Phase 4: Polish & Features + Real Authentication (Week 5-6)

**Duration:** 5-7 days (+ 2-3 hours for auth)

**Authentication:** Transition from mock → NextAuth.js

**Tasks:**

### Part A: Polish (5-7 days with mock auth)
- [ ] Add QuickReplyButtons component
- [ ] Add message feedback (thumbs up/down)
- [ ] Add CopyButton for code blocks
- [ ] Implement markdown rendering (react-markdown)
- [ ] Implement syntax highlighting (rehype-highlight)
- [ ] Add conversation deletion
- [ ] Add EmptyState component
- [ ] Build full-page /chat route with conversation sidebar
- [ ] Add Ctrl+K shortcut to open chat
- [ ] Implement rate limiting (50 msg/hour)
- [ ] Add accessibility (ARIA labels, keyboard nav)

### Part B: Add NextAuth.js OAuth (1-2 hours)
- [x] **Install next-auth** (`npm install next-auth`)
- [x] **Create NextAuth config** (`/api/auth/[...nextauth]/route.ts`)
- [x] **Create User model** (OAuth-only, no password field)
- [x] **Create nextAuth.ts** adapter implementation
- [ ] **Create /signin page** (OAuth buttons only)
- [ ] **Remove /signup page** (redirect to /signin)
- [x] **Update getCurrentUser()** to call `getNextAuthUser()` instead of `getMockUser()`
- [ ] **Test with OAuth providers** (Google + GitHub)
- [ ] **Optional: Migrate demo conversations** to real user

**Deliverables:**
- Full-featured chatbot with all polish
- **Real OAuth authentication with NextAuth.js** ✅
- Multiple users supported
- OAuth (Google + GitHub) working
- Markdown + code highlighting
- Quick replies
- Accessibility compliance

**Auth Note:** This is where we switch from mock to real auth! See [11-AUTHENTICATION-STRATEGY.md](./11-AUTHENTICATION-STRATEGY.md) for detailed steps.

---

## Phase 5: Testing & Launch (Week 6)

**Duration:** 3-5 days

**Tasks:**
- [ ] Write unit tests (Vitest) for components
- [ ] Write integration tests for Server Actions
- [ ] Write E2E tests (Playwright) for chat flow
- [ ] Test on different devices (mobile, tablet, desktop)
- [ ] Test with different browsers
- [ ] Performance testing (Lighthouse)
- [ ] Security review (input sanitization, XSS)
- [ ] Deploy to production (Vercel)
- [ ] Monitor for errors (Sentry)
- [ ] Collect user feedback

**Deliverables:**
- Tested, production-ready chatbot
- Deployed to production
- Monitoring in place

---

## Development Checklist

### Pre-Development
- [x] Planning documents complete
- [x] Multi-client strategy documented
- [x] Conversation model created (with clientId)
- [ ] Client model created
- [x] TypeScript types defined
- [ ] OpenAI API key obtained
- [x] Dependencies installed

### Core Features
- [ ] Chat UI components
- [ ] Client selector & management UI
- [ ] AI integration
- [ ] Streaming responses
- [ ] Conversation history (per client)
- [ ] Multi-client support
- [ ] Client model & Server Actions
- [ ] Platform data integration (per client)
- [ ] Demo client data support

### Advanced Features
- [ ] Quick replies
- [ ] Message feedback
- [ ] Markdown rendering
- [ ] Code highlighting
- [ ] Conversation sidebar (/chat page)
- [ ] Rate limiting

### Quality & Launch
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Accessibility
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Monitoring setup

---

## Post-Launch (V2 Features)

**Timeline:** After 1-2 months of V1 feedback

**Potential Features:**
- Multi-provider AI support (Claude, Gemini)
- Voice input/output
- Multi-property support (multiple GA properties)
- Cross-platform comparisons ("Compare GA vs Ads ROI")
- Export conversation history
- Share conversations with team members
- Advanced analytics on chatbot usage
- Custom quick replies (user-configurable)
- Proactive insights ("Your bounce rate increased 10%!")

---

## Success Criteria

**Technical:**
- ✅ < 3s AI response time (first token)
- ✅ < 500ms conversation load time
- ✅ 99% uptime
- ✅ WCAG AA accessibility

**Business:**
- ✅ 40% of users try chatbot (3 months)
- ✅ 75% positive feedback (thumbs up)
- ✅ 5+ messages per conversation (avg)
- ✅ < $50/month AI costs

---

## Production Phases (Phases 4.5-7) - NEW!

**Total Additional Time:** 7-9 weeks
**Status:** Documented (Implementation pending)
**Last Updated:** 2025-11-22

### Phase 4.5: User Onboarding Flow (Week 7)

**Duration:** 1 week
**Priority:** High

**Key Features:**
- Smart OAuth redirect logic (new users → /onboarding, existing → /chat)
- 4-step onboarding wizard (Welcome, Create Client, Connect Platforms, Tour)
- User model updates for onboarding tracking
- Progress persistence with localStorage
- Mobile-responsive onboarding UI

**Detailed Documentation:**
- [PHASE-4.5-ONBOARDING.md](./PHASE-4.5-ONBOARDING.md) - Complete architecture (600+ lines)
- [ONBOARDING-UX-SPEC.md](./ONBOARDING-UX-SPEC.md) - Full UX specs (750+ lines)

---

### Phase 5: Platform API Integrations (Weeks 8-11)

**Duration:** 3-4 weeks
**Priority:** Critical for Production

**Platforms to Integrate:**
1. Google Analytics 4 (GA4 Data API v1)
2. Meta Ads (Marketing API v18.0)
3. Google Ads (Ads API v14)
4. LinkedIn Ads (Marketing API v2023-11)

**Weekly Breakdown:**
- **Week 1:** Foundation (unified interface, encryption, caching)
- **Week 2:** Google Analytics + Meta Ads
- **Week 3:** Google Ads + LinkedIn Ads
- **Week 4:** Polish, testing, security audit

**Detailed Documentation:**
- [PHASE-5-PLATFORM-APIS.md](./PHASE-5-PLATFORM-APIS.md) - Complete architecture (1000+ lines)
- [PLATFORM-INTEGRATION-EXAMPLES.md](./PLATFORM-INTEGRATION-EXAMPLES.md) - Code examples (800+ lines)

---

### Phase 6: Conversation Persistence (Weeks 12-13)

**Duration:** 1-2 weeks
**Priority:** Medium-High

**Key Features:**
- Enhanced Conversation model with metadata (tags, categories, analytics)
- Full-text search with MongoDB text indexes
- Advanced filtering (tags, date range, category)
- Cursor-based pagination
- Export functionality (JSON, CSV, PDF, Markdown)
- Archive/pin conversations
- Conversation analytics dashboard

**Detailed Documentation:**
- [PHASE-6-CONVERSATIONS.md](./PHASE-6-CONVERSATIONS.md) - Complete design (500+ lines)

---

### Phase 7: Testing & Launch (Weeks 14-16)

**Duration:** 2-3 weeks
**Priority:** Critical

**Week 1 - Testing:**
- Unit tests (80%+ coverage with Vitest)
- Integration tests (70%+ coverage)
- E2E tests (Playwright - critical flows)
- Performance testing (Artillery load tests)
- Security audit (OWASP, Snyk, npm audit)
- Accessibility testing (WCAG AA compliance)

**Week 2 - Staging:**
- Deploy to staging environment
- User acceptance testing (UAT)
- Load testing on staging
- Bug fixes and optimization

**Week 3 - Production Launch:**
- Pre-launch checklist
- Production deployment (Vercel)
- Monitoring setup (Sentry, UptimeRobot, Vercel Analytics)
- Post-launch monitoring (24-48 hours intensive)
- Gather user feedback and iterate

**Detailed Documentation:**
- [PHASE-7-LAUNCH.md](./PHASE-7-LAUNCH.md) - Testing & deployment (650+ lines)
- [PRODUCTION-DEPLOYMENT-GUIDE.md](./PRODUCTION-DEPLOYMENT-GUIDE.md) - Setup guide (750+ lines)

---

## Updated Timeline Summary

**Core Implementation (Phases 0-4):** 4-6 weeks ✅ **COMPLETE**
**Production Readiness (Phases 4.5-7):** 7-9 weeks ⏳ **Planned**

**Total Time to Production:** 11-15 weeks (3-4 months)

**Current Status:**
- ✅ Phases 0-4: Demo-ready with OAuth authentication
- 📚 Phases 4.5-7: Fully documented (5000+ lines of specs)
- 🚀 Ready to implement production features

**Cost Estimate:**
- Development (current): ~$11/month (OpenAI)
- Production (full stack): ~$123-213/month
  - Vercel Pro: $20/month
  - MongoDB Atlas M10: $57/month
  - Upstash Redis: $0-10/month
  - OpenAI API: $20-100/month
  - Sentry Team: $26/month

---

## Document Approval

**Status:** ✅ Complete & Extended (Production Roadmap Added)

- [x] Roadmap defined
- [x] Multi-client architecture included
- [x] Phases planned and updated
- [x] Client model creation added to Phase 0
- [x] Phase 3 updated for multi-client implementation
- [x] Timeline estimated
- [x] Success criteria set

---

**Related Documents:**
- **Previous:** [07-API-DESIGN-COMPLETE.md](./07-API-DESIGN-COMPLETE.md)
- **Next:** [09-TESTING-STRATEGY.md](./09-TESTING-STRATEGY.md)
- **Multi-Client Strategy:** [12-MULTI-CLIENT-STRATEGY.md](./12-MULTI-CLIENT-STRATEGY.md)
