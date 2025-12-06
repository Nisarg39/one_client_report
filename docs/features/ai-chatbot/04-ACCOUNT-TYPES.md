# Account Types & Usage Tiers

**Last Updated:** December 2, 2024

---

## Overview

OneReport supports three account types, each with different usage tiers and restrictions. This document defines the behavior and limitations for each account type.

---

## Account Types

### 1. Business Account

**Purpose:** Professional marketers, agencies, and freelancers analyzing real client data

**Characteristics:**
- Access to real platform API connections (Google Analytics, Google Ads, Meta Ads, LinkedIn Ads)
- OAuth-based platform authentication
- Full multi-agent AI system access
- Can export reports and schedule deliveries
- Professional pricing tier

**Use Cases:**
- Freelance marketer managing 5-10 clients
- Marketing agency with 50+ clients
- In-house marketing team tracking campaigns

---

### 2. Education Account (Student)

**Purpose:** Students learning marketing analytics through practice case studies

**Characteristics:**
- Mock data only (no real API connections)
- Pre-built scenario templates
- Guided learning with AI feedback
- Limited workspace count
- Student pricing (discounted or free)

**Use Cases:**
- University student in marketing analytics course
- Self-learner practicing data analysis
- Bootcamp participant

---

### 3. Instructor Account

**Purpose:** Educators creating assignments and tracking student progress

**Characteristics:**
- Can create custom case study scenarios
- Access to both mock and real data (for demonstration)
- Assign scenarios to students
- View student progress and submissions
- Grade student analyses
- Higher workspace and message limits

**Use Cases:**
- University professor teaching marketing analytics
- Bootcamp instructor creating curriculum
- Corporate trainer running workshops

---

## Usage Tiers

### Student Tier (FREE Forever)
- **Account Types:** Education (student)
- **Pricing:** ₹0 (FREE)
- **Max Workspaces:** 5 clients
- **Messages per Day:** 50
- **Trial:** No trial expiry (free forever)
- **AI Model:** GPT-3.5 Turbo
- **Platform Connections:** None (mock data only)
- **Agents:** All 5 agents available
- **Export/Reports:** View only, no export
- **Chat History:** 30 days

### Professional Tier
- **Account Types:** Business
- **Pricing:** ₹299/month
- **Max Workspaces:** 10 clients
- **Messages per Day:** 150 (50/day during trial)
- **Trial:** 7-day free trial
- **AI Model:** GPT-3.5 Turbo
- **Platform Connections:** Real platform APIs
- **Agents:** All 5 agents
- **Export/Reports:** PDF export
- **Chat History:** 1 year

### Agency Tier
- **Account Types:** Business
- **Pricing:** ₹999/month
- **Max Workspaces:** 25 clients
- **Messages per Day:** 300 (50/day during trial)
- **Trial:** 7-day free trial
- **AI Model:** GPT-3.5 Turbo
- **Platform Connections:** Real platform APIs
- **Agents:** All 5 agents
- **Export/Reports:** PDF export, API access
- **Chat History:** Forever

### Enterprise Tier
- **Account Types:** Business, Instructor
- **Pricing:** Custom (starting ₹25,000+/month)
- **Max Workspaces:** Unlimited
- **Messages per Day:** Unlimited
- **Trial:** No trial (custom onboarding)
- **AI Model:** GPT-4 Turbo
- **Platform Connections:** Unlimited + custom integrations
- **Agents:** All agents + custom agent development
- **Export/Reports:** Full export, white-label reports, API access
- **Chat History:** Forever

---

## Detailed Restrictions Matrix

| Feature | Student (Free) | Professional | Agency | Enterprise |
|---------|----------------|--------------|--------|------------|
| **Pricing** | ₹0 (FREE) | ₹299/mo | ₹999/mo | Custom (₹25K+) |
| **Core Access** |
| Max Workspaces | 5 | 10 | 25 | Unlimited |
| Messages/Day | 50 (forever) | 150 (50 during trial) | 300 (50 during trial) | Unlimited |
| Trial Period | None (free forever) | 7 days | 7 days | None (custom) |
| Conversations | Unlimited | Unlimited | Unlimited | Unlimited |
| AI Model | GPT-3.5 Turbo | GPT-3.5 Turbo | GPT-3.5 Turbo | GPT-4 Turbo |
| **Data Sources** |
| Real APIs | ❌ | ✅ | ✅ | ✅ |
| Mock Data | ✅ | ✅ | ✅ | ✅ |
| Custom Scenarios | ❌ | ❌ | ❌ | ✅ |
| **Platform Integrations** |
| Google Analytics | ❌ | ✅ | ✅ | ✅ |
| Google Ads | ❌ | ✅ | ✅ | ✅ |
| Meta Ads | ❌ | ✅ | ✅ | ✅ |
| LinkedIn Ads | ❌ | ✅ | ✅ | ✅ |
| **AI Agents** |
| Traffic Intelligence | ✅ | ✅ | ✅ | ✅ |
| Ad Performance | ✅ | ✅ | ✅ | ✅ |
| Budget Optimization | ✅ | ✅ | ✅ | ✅ |
| Conversion Funnel | ✅ | ✅ | ✅ | ✅ |
| Anomaly Detection | ✅ | ✅ | ✅ | ✅ |
| **Features** |
| Chat History | 30 days | 1 year | Forever | Forever |
| Export Reports | ❌ | PDF | PDF | PDF + API |
| Schedule Reports | ❌ | ❌ | ✅ | ✅ |
| White Label | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| **Education Features** |
| View Scenarios | ✅ | ❌ | ❌ | ✅ |
| Create Scenarios | ❌ | ❌ | ❌ | ✅ |
| Assign to Students | ❌ | ❌ | ❌ | ✅ |
| Grade Submissions | ❌ | ❌ | ❌ | ✅ |
| Progress Tracking | Self only | ❌ | ❌ | All students |

---

## User Model Fields

### Account Type Field
```typescript
accountType: 'business' | 'education' | 'instructor'
```

**Default:** Set during onboarding
**Mutable:** Can upgrade education → business, requires verification

### Usage Tier Field
```typescript
usageTier: 'free' | 'pro' | 'enterprise' | 'student'
```

**Default:**
- `education` → `free` or `student`
- `business` → `pro`
- `instructor` → `enterprise`

**Mutable:** Can upgrade anytime

### Restrictions Object
```typescript
restrictions: {
  maxClients: number;            // Workspace limit
  maxMessagesPerDay: number;     // Daily message quota
  maxConversations: number;      // Total conversation history
  allowRealAPIs: boolean;        // Can connect real platforms
  allowedAgents: string[];       // Empty = all, or specific IDs
  aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo'
}
```

**Examples:**

**Student (Free Forever):**
```typescript
{
  maxClients: 5,
  maxMessagesPerDay: 50,
  maxConversations: 999999, // Unlimited conversations
  allowRealAPIs: false,
  allowedAgents: [],  // All agents
  aiModel: 'gpt-3.5-turbo'
}
```

**Professional:**
```typescript
{
  maxClients: 10,
  maxMessagesPerDay: 150,  // 150 messages/day (trial logic enforces 50/day during trial)
  maxConversations: 999999,
  allowRealAPIs: true,
  allowedAgents: [],
  aiModel: 'gpt-3.5-turbo'
}
```

**Agency:**
```typescript
{
  maxClients: 25,
  maxMessagesPerDay: 300,  // 300 messages/day (trial logic enforces 50/day during trial)
  maxConversations: 999999,
  allowRealAPIs: true,
  allowedAgents: [],
  aiModel: 'gpt-3.5-turbo'
}
```

**Enterprise:**
```typescript
{
  maxClients: 999999,  // Unlimited
  maxMessagesPerDay: 999999,  // Unlimited
  maxConversations: 999999,
  allowRealAPIs: true,
  allowedAgents: [],
  aiModel: 'gpt-4-turbo'
}
```

---

## Education-Specific Metadata

For `education` and `instructor` account types:

```typescript
educationMetadata?: {
  institution?: string;        // "Stanford University"
  studentId?: string;          // "STU-2024-001"
  enrollmentCode?: string;     // "MKTG-301-FALL2024"
  instructorId?: ObjectId;     // Reference to instructor
  expiresAt?: Date;           // Semester end date
}
```

**Use Cases:**

**Student enrolled in course:**
```typescript
{
  institution: "Stanford University",
  studentId: "STU-2024-12345",
  enrollmentCode: "MKTG-301-FALL2024",
  instructorId: ObjectId("..."),
  expiresAt: new Date("2025-05-15")  // End of semester
}
```

**Self-learning student:**
```typescript
{
  // All fields optional - no institution enrollment
}
```

**Instructor:**
```typescript
{
  institution: "Stanford University",
  // No studentId, no instructorId, no expiresAt
}
```

---

## Account Type Transitions

### Allowed Upgrades

1. **Education (Free) → Business (Pro)**
   - Requires: Payment method
   - Action: Migrate existing mock clients to optional real data
   - Preserves: Chat history, conversations

2. **Education (Free) → Education (Pro)**
   - Requires: Payment or institutional subscription
   - Action: Increase limits, unlock advanced scenarios
   - Preserves: Everything

3. **Business (Pro) → Business (Enterprise)**
   - Requires: Payment upgrade
   - Action: Unlock white-label, API access
   - Preserves: Everything

4. **Instructor (Free Trial) → Instructor (Enterprise)**
   - Requires: Institutional contract
   - Action: Unlimited access
   - Preserves: Custom scenarios, student assignments

### Not Allowed

- ❌ Business → Education (data regression)
- ❌ Instructor → Student (role change)
- ❌ Downgrades that delete data

---

## Enforcement Points

### 1. Client Creation
**File:** `src/app/actions/clients/createClient.ts`

```typescript
// Check limit before creating
if (existingClients.length >= user.restrictions.maxClients) {
  throw new Error(`Limit reached: ${user.restrictions.maxClients} workspaces`);
}

// Set data source based on account type
const dataSource = user.restrictions.allowRealAPIs ? 'real' : 'mock';
```

### 2. Message Sending
**File:** `src/app/actions/chat/sendMessage.ts`

```typescript
// Check daily quota
const todayCount = await getUserMessageCount(userId, today);
if (todayCount >= user.restrictions.maxMessagesPerDay) {
  throw new RateLimitError(`Daily limit: ${user.restrictions.maxMessagesPerDay}`);
}
```

### 3. Platform Connections
**File:** `src/app/settings/platforms/page.tsx`

```typescript
if (!user.restrictions.allowRealAPIs) {
  return <EducationModeNotice />;
}
```

### 4. AI Model Selection
**File:** `src/lib/ai/provider.ts`

```typescript
const model = user.restrictions.aiModel || 'gpt-4-turbo';
```

---

## Pricing Strategy (Current)

### Education Pricing
- **Student (Free Forever):** Individual students (5 workspaces, 50 msg/day, no trial expiry)
- **Institutional:** Custom pricing for bulk student accounts

### Business Pricing
- **Professional:** ₹299/month (10 clients, 150 messages/day, GPT-3.5 Turbo)
- **Agency:** ₹999/month (25 clients, 300 messages/day, GPT-3.5 Turbo)
- **Enterprise:** Custom pricing starting ₹25,000/month (unlimited)

### Instructor Pricing
- **Enterprise:** Custom pricing (unlimited students, custom scenarios, grading tools)

---

## Migration Plan

### Existing Users (All → Business Pro)

```typescript
await UserModel.updateMany(
  { accountType: { $exists: false } },
  {
    $set: {
      accountType: 'business',
      usageTier: 'pro',
      restrictions: {
        maxClients: 999999,
        maxMessagesPerDay: 10000,
        maxConversations: 999999,
        allowRealAPIs: true,
        allowedAgents: [],
        aiModel: 'gpt-4-turbo'
      }
    }
  }
);
```

**Rationale:**
- Grandfathered unlimited access
- No breaking changes
- Can downgrade voluntarily later

---

## Related Files

- [02-HYBRID-MODE-IMPLEMENTATION.md](./02-HYBRID-MODE-IMPLEMENTATION.md) - Main plan
- [06-DATA-ARCHITECTURE.md](./06-DATA-ARCHITECTURE.md) - Database schema
- `/src/models/User.ts` - User model implementation
- `/src/lib/auth/restrictions.ts` - Enforcement logic (TBD)

---

**Status:** ✅ Specification Complete
**Implementation:** ⏳ Pending Phase 1
