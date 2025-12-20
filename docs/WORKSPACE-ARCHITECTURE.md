# Workspace Architecture & Pricing Model

**Last Updated**: December 18, 2025
**Status**: ✅ Implemented (Phase 1)
**Related Files**: User.ts, ChatSidebar.tsx, pricing-transparency.tsx, products/page.tsx

---

## Overview

OneAssist uses a **single workspace architecture** (Phase 1) with plans to support **multi-workspace for Agency/Enterprise plans** (Phase 2). This document explains the workspace model, pricing strategy, and implementation details.

---

## Architecture Evolution

### Phase 1: Single Workspace (CURRENT)

**What It Means:**
- Every user has exactly **1 workspace** (auto-created on signup)
- Workspace named: `"{User Name}'s Workspace"` (e.g., "John Smith's Workspace")
- **Unlimited campaigns/accounts** can be connected to that workspace
- All platform connections (Google Analytics, Google Ads, Meta Ads, LinkedIn Ads) belong to this single workspace
- User never manually creates a workspace - it's automatic

**User Experience:**
- Student/Free/Professional users: See their single workspace, no workspace selector
- Agency/Enterprise users: See their single workspace (multi-workspace UI hidden until Phase 2)
- All users can connect unlimited ad accounts and properties to their workspace

**Technical Implementation:**
- Auto-creation: `src/models/User.ts` → `upsertFromOAuth()` method (lines 397-424)
- Workspace selector: Hidden via `canManageMultipleWorkspaces` check in `ChatSidebar.tsx`
- Clients link: Hidden for Professional/Student/Free in dashboard sidebar

### Phase 2: Multi-Workspace for Agency+ (FUTURE)

**What It Means:**
- **Agency Plan**: 3-5 workspaces for organizing different client groups
- **Enterprise Plan**: Unlimited workspaces
- Each workspace = isolated group of campaigns
- Professional/Student/Free plans: Still limited to 1 workspace

**User Experience:**
- Agency users can create workspaces like: "E-commerce Clients", "SaaS Clients", "Local Businesses"
- Each workspace maintains campaign isolation
- Workspace selector UI becomes visible for Agency/Enterprise tiers
- Switch between workspaces to organize campaigns

**Technical Implementation:**
- No database model changes needed (current "Client" model already supports multiple per user)
- Add `maxWorkspaces` to User restrictions
- Show/hide "Create Workspace" button based on `usageTier`
- Enforce workspace count limits in API routes

---

## Pricing Model

### Current Pricing (Message-Based)

| Plan | Price | Workspaces | Campaigns | Messages/Day | Key Features |
|------|-------|-----------|-----------|--------------|--------------|
| **Student** | FREE | 1 | Unlimited (mock) | 50 | Educational mode, mock scenarios, tutoring agent, no expiry |
| **Professional** | ₹299/mo | 1 | Unlimited (real) | 150 | Real platform APIs, priority support, JSON export, 7-day trial |
| **Agency** | ₹999/mo | 1* | Unlimited (real) | 300 | Higher volume, team members (future), multi-workspace (future) |
| **Enterprise** | Custom | Unlimited* | Unlimited | Unlimited | White-glove service, SLA, custom features, dedicated infrastructure |

*Multi-workspace feature planned for Phase 2

### Pricing Differentiation

**Primary Differentiator**: Daily message limits
- Student: 50 messages/day (forever, no expiry)
- Professional: 150 messages/day (50 during trial)
- Agency: 300 messages/day (50 during trial)
- Enterprise: Unlimited messages

**Secondary Differentiators**:
- Real vs. mock data (Student uses mock, others use real APIs)
- Support level (email → email + chat → 24/7 phone)
- Team features (future: Agency gets 5 members, Enterprise unlimited)
- Workspace count (future: Agency 3-5, Enterprise unlimited)

### Why This Model Works

**Advantages**:
1. **Simpler UX**: No confusing workspace management for most users
2. **Clear upgrade path**: 50 → 150 → 300 → unlimited messages
3. **Flexible**: Unlimited campaigns in one workspace
4. **Scalable**: Can add multi-workspace for power users later
5. **Revenue stable**: Message limits drive upgrades, not artificial client limits

**Comparison to Competitors**:
- **AgencyAnalytics**: ₹1,000-1,650 per client/month → We charge ₹299-999 flat
- **DashThis**: ₹33-289/month → We offer more features at lower price
- **Traditional tools**: Charge ₹10,000-41,000/month for 10-25 clients → We're 70-90% cheaper

---

## Workspace Features by Tier

### All Tiers

✅ Features available to everyone:
- 1 auto-created workspace
- Unlimited conversations
- AI chatbot with context-aware responses
- Platform integrations (Google Analytics, Google Ads, Meta Ads, LinkedIn Ads)
- Chat history (retention varies by tier)

### Student Plan (FREE)

- **Data source**: Mock data only (`allowRealAPIs: false`)
- **Use case**: Learning marketing analytics
- **Special features**: Educational mode, tutoring agent, mock scenarios
- **Limitations**: 50 messages/day, no real platform connections
- **History**: 30-day chat history

### Professional Plan (₹299/mo)

- **Data source**: Real platform APIs
- **Use case**: Freelancers managing multiple campaigns
- **Special features**: Priority email support, JSON export
- **Trial**: 7 days (50 messages/day during trial)
- **History**: Forever chat history

### Agency Plan (₹999/mo)

- **Data source**: Real platform APIs
- **Use case**: Growing agencies with high volume needs
- **Special features**:
  - Dedicated account manager
  - Advanced reporting templates
  - 5 team members (future Phase 2)
  - Multi-workspace support (future Phase 2: 3-5 workspaces)
- **Trial**: 7 days (50 messages/day during trial)
- **History**: Forever chat history

### Enterprise Plan (Custom)

- **Data source**: Real APIs + custom integrations
- **Use case**: Large agencies & enterprises at scale
- **Special features**:
  - Unlimited workspaces (Phase 2)
  - Unlimited team members
  - GPT-4 Turbo AI model
  - Custom onboarding & training
  - SLA guarantees (99.9% uptime)
  - White-label custom domain
  - API access for integrations
  - Dedicated infrastructure
  - 24/7 priority support (phone, email, chat)
- **History**: Forever chat history

---

## Implementation Details

### Auto-Workspace Creation

**Location**: `src/models/User.ts` → `upsertFromOAuth()` method

**Trigger**: Automatically runs when new user signs up via OAuth (Google/GitHub)

**Code**:
```typescript
// ⭐ AUTO-CREATE DEFAULT WORKSPACE
try {
  const ClientModel = require('./Client').default;
  await ClientModel.create({
    userId: newUser._id,
    name: `${profile.name}'s Workspace`,
    email: profile.email,
    website: '',
    industry: '',
    platforms: {
      googleAnalytics: { connected: false },
      googleAds: { connected: false },
      metaAds: { connected: false },
      linkedInAds: { connected: false },
    },
    status: 'active',
    dataSource: 'real', // 'mock' for students
  });
  console.log(`✅ Auto-created workspace for new user: ${profile.email}`);
} catch (error) {
  console.error('❌ Failed to create default workspace:', error);
  // Don't fail user creation if workspace creation fails
}
```

**Behavior**:
- Creates Client document immediately after User creation
- Graceful failure handling (logs error but doesn't block signup)
- Workspace name based on user's display name
- Default to real data source (changed to 'mock' for education accounts)

### Tier-Based UI Visibility

**Location**: `src/components/chat/ChatSidebar.tsx`

**Workspace Selector Visibility**:
```typescript
// Get usageTier to determine if workspace selector should be shown
const usageTier = user?.usageTier;
const canManageMultipleWorkspaces = usageTier === 'agency' || usageTier === 'enterprise';

// Later in JSX:
{canManageMultipleWorkspaces && (
  <div>
    {/* Workspace selector dropdown */}
  </div>
)}
```

**Clients Dashboard Link Visibility**:
```typescript
{/* Clients - Only show for Agency/Enterprise plans */}
{canManageMultipleWorkspaces && (
  <button onClick={() => onDashboardSectionChange('clients')}>
    <Users className="w-4 h-4" />
    <span>Clients</span>
  </button>
)}
```

**Result**:
- Professional/Student/Free users: No workspace management UI
- Agency/Enterprise users: Workspace UI hidden (will be enabled in Phase 2)

### Data Fetchers Behavior

**Location**: `src/lib/platforms/*/fetchData.ts`

**Current Behavior** (Intentional):
- Meta Ads: Returns ALL ad accounts accessible by token
- Google Ads: Returns ALL customer accounts
- Google Analytics: Returns ALL properties

**Why This Is Correct**:
- Single workspace model means users WANT to see all campaigns
- AI can answer questions about any connected campaign
- User specifies campaigns by name in queries
- No need for account-level filtering (by design)

**Future** (Phase 2 - Multi-Workspace):
- Will add account-to-workspace mapping
- Each workspace will have specific accountId/propertyId
- Data fetchers will filter by workspace's mapped accounts
- Maintains campaign isolation across workspaces

---

## Pricing Display Updates

### Pricing Card Component

**File**: `src/components/features/pricing-transparency.tsx`

**Changes**:
```typescript
const plans = [
  {
    name: "Student",
    reports: "Unlimited campaigns • 50 messages/day", // Changed from "5 clients"
    features: [
      "Unlimited practice campaigns", // Changed from "5 practice client workspaces"
      // ...
    ],
  },
  {
    name: "Professional",
    reports: "Unlimited campaigns • 150 messages/day", // Changed from "10 clients"
    features: [
      "Unlimited real campaigns", // Changed from "10 client workspaces"
      // ...
    ],
  },
  // ... similar changes for Agency and Enterprise
];
```

### Products Page

**File**: `src/app/products/page.tsx`

**Changes**:
- "5 practice client workspaces" → "Unlimited practice campaigns"
- "10 client workspaces" → "Unlimited real campaigns"
- "25 client workspaces" → "Unlimited campaigns at scale"
- "Unlimited client workspaces" → "Unlimited campaigns"

---

## Migration Strategy

### Existing Users with Multiple Clients

**Option A: Merge into Primary Workspace** (Recommended)
1. Identify users with multiple clients
2. Select first client as primary workspace
3. Move all platform connections to primary
4. Archive/hide other clients
5. Email users: "We've simplified your workspace! All campaigns in one place."

**Option B: Let User Choose**
1. Detect multi-client users on login
2. Show modal: "Choose your primary workspace"
3. User selects which client becomes workspace
4. Merge connections into selected client

**Migration Script Example**:
```typescript
// scripts/migrateToSingleWorkspace.ts
async function migrateUser(userId) {
  const clients = await Client.find({ userId });

  if (clients.length === 1) return; // Already migrated

  const primaryClient = clients[0];

  // Move all connections to primary
  for (const client of clients.slice(1)) {
    await PlatformConnection.updateMany(
      { clientId: client._id },
      { clientId: primaryClient._id }
    );
    await client.remove();
  }

  // Rename to "My Workspace"
  primaryClient.name = "My Workspace";
  await primaryClient.save();
}
```

---

## Phase 2 Implementation Plan

### Code Changes Required

**1. Update User Model**

File: `src/models/User.ts`

```typescript
restrictions: {
  maxWorkspaces: 1,  // Professional
  maxWorkspaces: 5,  // Agency
  maxWorkspaces: 999999, // Enterprise
  maxMessagesPerDay: number,
  // ... rest
}
```

**2. Workspace Limit Enforcement**

File: `src/app/api/clients/create/route.ts`

```typescript
// Check workspace limit before creating
const currentWorkspaceCount = await Client.countDocuments({ userId });
if (currentWorkspaceCount >= user.restrictions.maxWorkspaces) {
  return {
    error: 'Workspace limit reached. Upgrade to Agency plan for multiple workspaces.'
  };
}
```

**3. Workspace Switcher UI**

File: `src/components/dashboard/WorkspaceSwitcher.tsx` (NEW)

```tsx
// Only show if user can create multiple workspaces
{user.restrictions.maxWorkspaces > 1 && (
  <Button onClick={createWorkspace}>
    + New Workspace
  </Button>
)}
```

**4. Update ChatSidebar Visibility**

File: `src/components/chat/ChatSidebar.tsx`

```typescript
// Change from hiding workspace selector to showing it for Agency+
const canManageMultipleWorkspaces =
  usageTier === 'agency' || usageTier === 'enterprise';

{canManageMultipleWorkspaces && (
  <div>
    {/* Workspace selector - NOW FUNCTIONAL */}
  </div>
)}
```

### No Database Changes Needed

✅ Current "Client" model already supports:
- Multiple clients per user
- Platform connections per client
- Chat history per client
- Isolated data fetching per client

**All we need to do**:
- Enforce workspace count limits
- Show/hide UI based on tier
- Update pricing to reflect workspace limits

---

## Benefits & Trade-offs

### ✅ Advantages

**For Users**:
1. Simple onboarding (no workspace creation step)
2. Unlimited campaigns in one place
3. Easy to compare across campaigns
4. Natural upgrade path (message limits)
5. No artificial client count restrictions

**For Business**:
1. Clearer value proposition
2. Easier to explain pricing
3. Simpler architecture (less code to maintain)
4. Better UX = higher conversion
5. Revenue from usage (messages) not artificial limits (clients)

**For Development**:
1. Faster implementation (fewer UI components)
2. Less complex state management
3. No immediate need for account selection UI
4. Backward compatible (can add multi-workspace later)

### ⚠️ Trade-offs

**Current Limitations**:
1. No per-client isolation (all campaigns visible together)
2. Can't auto-generate "Client A only" reports
3. User must organize campaigns via naming conventions
4. Team member access is all-or-nothing (can't restrict to specific clients)

**Acceptable Because**:
1. Target audience: Freelancers & small agencies (not large enterprises managing 100+ isolated clients)
2. AI can filter by campaign name when asked
3. User can compare across campaigns (often desired)
4. Future Phase 2 adds multi-workspace for power users

---

## Competitor Comparison

| Feature | OneAssist | AgencyAnalytics | DashThis | Looker Studio |
|---------|-----------|-----------------|----------|---------------|
| **Workspace Model** | Single (unlimited campaigns) | Per-client | Per-client | Manual setup |
| **Pricing** | Message limits (₹299-999) | Per-client (₹1000+) | Per-dashboard (₹33-289) | FREE |
| **Setup Time** | < 5 min (auto-created) | 1-2 hours | 30-60 min | 2-4 hours |
| **AI Insights** | ✅ Built-in | ❌ Not available | ❌ Not available | ❌ Manual |
| **Mobile** | ✅ Responsive | ⚠️ Limited | ⚠️ Limited | ❌ Desktop-focused |
| **Learning Curve** | Low (auto-setup) | High (complex) | Medium | Very High |

**Our Advantage**: 70-90% cheaper, simpler UX, AI-powered insights, mobile-first.

---

## Summary

**Current State (Phase 1)**:
- ✅ Single workspace per user (auto-created)
- ✅ Unlimited campaigns per workspace
- ✅ Message-based pricing (50/150/300/unlimited)
- ✅ Tier-based UI visibility (workspace selector hidden)
- ✅ Simple, fast onboarding

**Future State (Phase 2)**:
- ⏸️ Multi-workspace for Agency/Enterprise
- ⏸️ Workspace count limits by tier (1/1/3-5/unlimited)
- ⏸️ Campaign isolation across workspaces
- ⏸️ Team member access per workspace

**Key Insight**: We're solving the immediate UX problem (data isolation complexity) by embracing a unified workspace, while keeping the architecture flexible for future power user features.
