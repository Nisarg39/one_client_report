# Hybrid Mode Implementation Plan

**Status:** 🚧 In Progress
**Started:** December 2024
**Target Completion:** 7 weeks from start

---

## Overview

Transform OneReport into a hybrid platform supporting both **Business Mode** (real API data) and **Education Mode** (mock/simulated data) while reusing 90%+ of the existing codebase.

**Key Insight:** Students and educators will use the platform more frequently than business users, making education mode a better engagement model.

---

## Architecture Decision

### The Hybrid Approach

- ✅ **Same AI chatbot** for both modes
- ✅ **Same UI/UX** experience
- ✅ **Same multi-agent system**
- ✅ **Only difference:** Data source (real APIs vs mock generator)

### Why This Works

1. **Code Reuse:** 90%+ of existing functionality preserved
2. **Unified Experience:** No feature fragmentation
3. **Easy Switching:** Users can upgrade from education to business mode seamlessly
4. **Lower Costs:** Education mode uses mock data (no API costs)

---

## Implementation Phases

For detailed implementation steps, see the main plan at:
`/Users/nisarg/.claude/plans/async-stargazing-sketch.md`

### Phase 1: Database & Core Infrastructure (Weeks 1-2)
- [ ] User model: Add `accountType`, `usageTier`, `restrictions`
- [ ] Client model: Add `dataSource`, `mockScenario`
- [ ] New model: `MockDataScenario`
- [ ] Migration scripts for existing users
- [ ] Mock data generator service
- [ ] 5-10 scenario templates

### Phase 2: Data Layer Refactoring (Weeks 2-3)
- [ ] Unified data fetching service (`dataFetcher.ts`)
- [ ] Update `sendMessage.ts` to use unified fetcher
- [ ] Testing: Mock data generation
- [ ] Testing: Real API calls (regression prevention)

### Phase 3: AI Agent System Enhancement (Weeks 3-4)
- [ ] Remove force override in `orchestrator.ts`
- [ ] Implement keyword-based agent routing
- [ ] Update `systemPrompt.ts` for account-aware prompts
- [ ] Add mock data indicators to AI responses

### Phase 4: UI/UX Mode Differentiation (Weeks 4-5)
- [ ] Account type selector (onboarding)
- [ ] Mode-aware client creation modal
- [ ] Mock data indicator badges
- [ ] Conditional empty states
- [ ] Account settings page

### Phase 5: Usage Restrictions & Limits (Weeks 5-6)
- [ ] Enhanced rate limiting by tier
- [ ] Client creation limits
- [ ] AI model tier selection
- [ ] Usage tracking dashboard

### Phase 6: Testing & Polish (Weeks 6-7)
- [ ] E2E tests for both modes
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation completion

### Phase 7: Instructor Features (Future)
- [ ] Instructor dashboard
- [ ] Custom scenario creation
- [ ] Assignment management
- [ ] Student progress tracking

---

## Critical Files to Modify

### Database Models
1. **`/src/models/User.ts`**
   - Add: `accountType`, `educationMetadata`, `usageTier`, `restrictions`

2. **`/src/models/Client.ts`**
   - Add: `dataSource`, `mockScenario`, `educationMetadata`

3. **`/src/models/MockDataScenario.ts`** (NEW)
   - Store pre-built and instructor-created scenarios

### Data Layer
4. **`/src/lib/platforms/mock/generator.ts`** (NEW)
   - Generate realistic mock platform data

5. **`/src/lib/platforms/mock/scenarios.ts`** (NEW)
   - Pre-built scenario templates

6. **`/src/lib/platforms/dataFetcher.ts`** (NEW)
   - Unified service: switches between real APIs and mock data

7. **`/src/app/actions/chat/sendMessage.ts`**
   - Use unified data fetcher instead of direct API calls

### AI System
8. **`/src/lib/ai/agents/orchestrator.ts`**
   - Remove force override (lines 21-39)
   - Implement actual routing logic

9. **`/src/lib/ai/systemPrompt.ts`**
   - Add `accountType` parameter
   - Build education vs business prompts

10. **`/src/lib/ai/agents/types.ts`**
    - Add `accountType` and `userRestrictions` to `AgentContext`

### UI Components
11. **`/src/components/onboarding/AccountTypeSelector.tsx`** (NEW)
12. **`/src/components/chat/CreateClientModal.tsx`**
13. **`/src/components/chat/EmptyState.tsx`**
14. **`/src/app/settings/account/page.tsx`** (NEW)
15. **`/src/app/settings/platforms/page.tsx`**

---

## Database Migration Strategy

### Step 1: Add New Fields (Non-Breaking)
```typescript
// All existing users → Business mode
accountType: 'business'
usageTier: 'pro'
restrictions: {
  maxClients: 999999,
  maxMessagesPerDay: 10000,
  allowRealAPIs: true,
  aiModel: 'gpt-4-turbo'
}

// All existing clients → Real data
dataSource: 'real'
```

### Step 2: Deploy New Code
- Unified data fetcher recognizes `dataSource: 'real'`
- Existing functionality preserved

### Step 3: Enable Education Mode
- New signups can choose account type
- Existing users can stay in business mode or upgrade

---

## Mock Data Strategy

### Scenario Types

1. **Beginner:** E-commerce High Bounce Rate
   - Learning: Basic metric identification
   - Issue: 70%+ bounce rate on mobile
   - Goal: Analyze device breakdown

2. **Intermediate:** Google Ads CPC Crisis
   - Learning: Campaign optimization
   - Issue: High CPC on generic keywords ($8.50)
   - Goal: Calculate ROAS, recommend reallocations

3. **Advanced:** Multi-Channel Attribution
   - Learning: Cross-platform analysis
   - Issue: Complex conversion path
   - Goal: Attribution modeling

### Data Generation Principles

- **Realistic:** Based on real-world campaign data
- **Intentional Issues:** Embed specific problems for students to find
- **Randomized:** Add variance so each student gets slightly different data
- **Consistent:** Same structure as real API responses

---

## Account Types & Restrictions

| Feature | Business | Education | Instructor |
|---------|----------|-----------|------------|
| Data Source | Real APIs | Mock only | Both |
| Max Clients | Unlimited | 5 | 50 |
| Messages/Day | 10,000 | 100 | 500 |
| AI Model | GPT-4 Turbo | GPT-3.5 | GPT-4 |
| Platform OAuth | Yes | No | No |
| Create Scenarios | No | No | Yes |

---

## Success Metrics

### Technical Goals (Launch)
- ✅ Zero downtime for existing users
- ✅ Mock data generation < 500ms
- ✅ Agent routing accuracy > 90%
- ✅ UI mode differentiation clear to users

### Business Goals (3 Months)
- 🎯 50+ educational institutions
- 🎯 1,000+ student accounts
- 🎯 10+ scenario templates
- 🎯 70%+ daily active usage
- 🎯 NPS > 50

---

## Current Status

### ✅ Completed
- [x] Planning phase
- [x] Architecture design
- [x] Documentation structure

### 🚧 In Progress
- [ ] Phase 1: Database models

### ⏳ Upcoming
- [ ] Phase 2: Data layer
- [ ] Phase 3: AI system
- [ ] Phase 4: UI/UX
- [ ] Phase 5: Restrictions
- [ ] Phase 6: Testing

---

## Related Documentation

- [01-REQUIREMENTS.md](./01-REQUIREMENTS.md) - Original AI chatbot requirements
- [03-MOCK-DATA-GUIDE.md](./03-MOCK-DATA-GUIDE.md) - How to create scenarios (TBD)
- [04-ACCOUNT-TYPES.md](./04-ACCOUNT-TYPES.md) - Account type reference (TBD)
- [05-AGENT-ROUTING.md](./05-AGENT-ROUTING.md) - Agent routing logic (TBD)
- [06-DATA-ARCHITECTURE.md](./06-DATA-ARCHITECTURE.md) - Schema details (TBD)
- [07-TESTING-GUIDE.md](./07-TESTING-GUIDE.md) - Testing strategy (TBD)

---

**Last Updated:** December 2, 2024
**Next Review:** After Phase 1 completion
