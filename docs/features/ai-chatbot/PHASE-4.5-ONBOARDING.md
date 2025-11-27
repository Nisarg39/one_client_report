# Phase 4.5: User Onboarding Flow - PLANNING

**Document Status**: 📋 Planning (Ready for Implementation)
**Last Updated**: 2025-11-22
**Owner**: Engineering Team
**Priority**: 🔥 Critical - Required for Production Launch

---

## Table of Contents
1. [Overview](#1-overview)
2. [Current Problem](#2-current-problem)
3. [Solution: Smart Onboarding Flow](#3-solution-smart-onboarding-flow)
4. [User Journey Mapping](#4-user-journey-mapping)
5. [Technical Architecture](#5-technical-architecture)
6. [Implementation Plan](#6-implementation-plan)
7. [UI/UX Specifications](#7-uiux-specifications)
8. [Edge Cases & Error Handling](#8-edge-cases--error-handling)
9. [Analytics & Metrics](#9-analytics--metrics)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Overview

### Purpose

Implement a seamless first-time user experience that guides new users through:
1. Understanding OneAssist capabilities
2. Creating their first client
3. Optionally connecting marketing platforms
4. Learning key features through a quick tour

### Goals

**Primary Goals:**
- ✅ 80%+ onboarding completion rate
- ✅ < 2 minutes to first chat message
- ✅ 30%+ platform connection rate during onboarding
- ✅ Reduce user confusion and support tickets

**Secondary Goals:**
- Improve user activation and retention
- Educate users on key features
- Collect initial user preferences
- Create smooth transition to main app

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding Start Rate | > 95% | % of new signups who land on `/onboarding` |
| Onboarding Completion Rate | > 80% | % who complete all steps |
| Time to First Chat | < 2 min | Average time from signup to first message |
| Platform Connection Rate | > 30% | % who connect at least one platform |
| Drop-off Points | Identify | Track where users abandon onboarding |
| User Satisfaction | > 4.5/5 | Post-onboarding survey rating |

---

## 2. Current Problem

### Existing Flow (Without Onboarding)

```
OAuth Success → Redirect to /chat (always)
  ↓
User lands on empty chat interface
  ↓
Confusion: "What do I do now?" 🤔
  ↓
User doesn't know:
  - How to create a client
  - What platforms can be connected
  - How to ask questions
  - What the AI can do
```

### Issues with Current Approach

1. **High Friction** - Users are dropped into empty state with no guidance
2. **Low Activation** - No clear path to first value
3. **Confusion** - Users don't understand capabilities
4. **Abandonment** - High risk of users leaving immediately
5. **Support Burden** - Many "How do I get started?" questions

### Data from Similar Products

**Industry Benchmarks:**
- Products with onboarding: 70-85% activation rate
- Products without onboarding: 25-40% activation rate
- **3x improvement** with proper onboarding

---

## 3. Solution: Smart Onboarding Flow

### New Production Flow

```
OAuth Success
  ↓
Check: Does user have clients?
  ├─ YES → Redirect to /chat ✅ (Existing user)
  └─ NO → Redirect to /onboarding 🎯 (New user)
       ↓
     Complete onboarding steps
       ↓
     Redirect to /chat with first client
```

### Intelligent Routing Logic

**Decision Tree:**
```typescript
async function handleOAuthRedirect(userId: string): Promise<string> {
  // Step 1: Check authentication
  if (!userId) {
    return '/signin';
  }

  // Step 2: Check if user has clients
  const clientCount = await ClientModel.countDocuments({ userId });

  if (clientCount === 0) {
    // New user → Onboarding
    return '/onboarding';
  }

  // Step 3: Check onboarding completion (backup check)
  const user = await UserModel.findById(userId);
  if (!user.onboardingCompleted) {
    // Onboarding started but not completed
    return '/onboarding';
  }

  // Existing user → Main app
  return '/chat';
}
```

---

## 4. User Journey Mapping

### 4.1 New User Journey (First-Time)

```
┌────────────────────────────────────────────────────────────────┐
│ Step 0: Authentication                                         │
├────────────────────────────────────────────────────────────────┤
│ 1. User visits site                                            │
│ 2. Clicks "Sign in with Google"                                │
│ 3. Approves OAuth consent                                      │
│ 4. User created in MongoDB                                     │
│    - onboardingCompleted: false                                │
│    - No clients yet                                            │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 1: Welcome (Redirect to /onboarding)                     │
├────────────────────────────────────────────────────────────────┤
│ Welcome to OneAssist! 🎉                                       │
│                                                                │
│ What can OneAssist do?                                         │
│ ✓ Answer questions about your marketing data                  │
│ ✓ Track performance across multiple platforms                 │
│ ✓ Provide insights and recommendations                        │
│                                                                │
│ [Get Started →]                                                │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 2: Create First Client                                   │
├────────────────────────────────────────────────────────────────┤
│ Who do you work with?                                       │
│                                                                │
│ [ Client Name ]                                                │
│ [ Client Email (optional) ]                                    │
│ [ Upload Logo (optional) ]                                     │
│                                                                │
│ Examples:                                                      │
│ • Your company name                                            │
│ • A client you manage                                          │
│ • A project or brand                                           │
│                                                                │
│ [Back] [Create Client & Continue →]                           │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 3: Connect Platforms (Optional)                          │
├────────────────────────────────────────────────────────────────┤
│ Connect Your Marketing Platforms 📊                            │
│                                                                │
│ [ ] Google Analytics - Website traffic & user behavior        │
│ [ ] Google Ads - Search & display advertising                 │
│ [ ] Meta Ads - Facebook & Instagram advertising               │
│ [ ] LinkedIn Ads - B2B advertising & lead generation          │
│                                                                │
│ You can also connect platforms later in Settings.             │
│                                                                │
│ [Skip for Now] [Connect Platforms →]                          │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 4: Quick Tour                                            │
├────────────────────────────────────────────────────────────────┤
│ Quick Tour 🚀                                                  │
│                                                                │
│ Tip 1: Ask Natural Questions                                  │
│ "How many visitors did I get last week?"                      │
│ "What's my Google Ads spend this month?"                      │
│                                                                │
│ Tip 2: Switch Between Clients                                 │
│ Use the dropdown in the sidebar                               │
│                                                                │
│ Tip 3: Review Conversation History                            │
│ Access past conversations in the sidebar                      │
│                                                                │
│ [Start Using OneAssist →]                                     │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 5: Complete & Redirect                                   │
├────────────────────────────────────────────────────────────────┤
│ 1. Save onboarding completion to database                     │
│    - user.onboardingCompleted = true                          │
│    - user.onboardingCompletedAt = new Date()                  │
│ 2. Track completion event in analytics                        │
│ 3. Redirect to /chat with first client auto-selected         │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Main App: /chat                                               │
├────────────────────────────────────────────────────────────────┤
│ ✅ User sees their first client in dropdown                   │
│ ✅ Chat input is focused and ready                            │
│ ✅ Empty state shows: "Ask me about your marketing data..."   │
│ ✅ User can immediately start chatting                        │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Returning User Journey

```
┌────────────────────────────────────────────────────────────────┐
│ Authentication                                                 │
├────────────────────────────────────────────────────────────────┤
│ 1. User visits site                                            │
│ 2. Clicks "Sign in with Google"                                │
│ 3. Approves OAuth consent                                      │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Smart Redirect Logic                                           │
├────────────────────────────────────────────────────────────────┤
│ Check: User has clients?                                       │
│ ✅ YES (clientCount > 0)                                       │
│    → Skip onboarding                                           │
│    → Redirect directly to /chat                               │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Main App: /chat                                               │
├────────────────────────────────────────────────────────────────┤
│ ✅ User sees their existing clients                           │
│ ✅ Conversation history loads                                 │
│ ✅ Can immediately continue using the app                     │
└────────────────────────────────────────────────────────────────┘
```

### 4.3 Partial Onboarding Journey

```
┌────────────────────────────────────────────────────────────────┐
│ Scenario: User Abandons Mid-Onboarding                        │
├────────────────────────────────────────────────────────────────┤
│ Day 1:                                                         │
│ 1. User starts onboarding                                      │
│ 2. Completes Step 1 (Welcome)                                  │
│ 3. Starts Step 2 (Create Client)                              │
│ 4. ❌ Closes browser without completing                       │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Day 2: User Returns                                            │
├────────────────────────────────────────────────────────────────┤
│ 1. User signs in again                                         │
│ 2. Smart redirect checks:                                      │
│    - onboardingCompleted? NO                                   │
│    - clientCount? 0                                            │
│ 3. → Redirect to /onboarding                                   │
│ 4. Resume from saved progress (localStorage)                  │
│ 5. User continues from Step 2                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Architecture

### 5.1 File Structure

```
src/
├── app/
│   ├── onboarding/
│   │   ├── page.tsx                    # Server component (auth check)
│   │   └── OnboardingFlow.tsx          # Client component (wizard)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts            # Update redirect callback
│   └── actions/
│       └── onboarding/
│           └── completeOnboarding.ts   # Server action
├── components/
│   └── onboarding/
│       ├── WelcomeStep.tsx            # Step 1: Welcome
│       ├── CreateClientStep.tsx       # Step 2: Create Client
│       ├── ConnectPlatformsStep.tsx   # Step 3: Platforms
│       ├── TourStep.tsx               # Step 4: Tour
│       ├── ProgressIndicator.tsx      # Progress dots
│       └── OnboardingLayout.tsx       # Centered layout
└── models/
    └── User.ts                        # Add onboarding fields
```

### 5.2 Data Models

#### User Model Updates

**File:** `src/models/User.ts`

**New Fields:**
```typescript
{
  // Existing fields...
  email: string,
  name: string,
  provider: 'google' | 'github',  // OAuth providers only

  // NEW: Onboarding fields
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  onboardingCompletedAt: {
    type: Date,
    default: null,
  },
  onboardingStepCompleted: {
    type: Number,  // Track last completed step (0-4)
    default: 0,
  },
}
```

**New Methods:**
```typescript
// Instance method
UserSchema.methods.completeOnboarding = async function() {
  this.onboardingCompleted = true;
  this.onboardingCompletedAt = new Date();
  this.onboardingStepCompleted = 4; // All steps done
  await this.save();
};

// Instance method
UserSchema.methods.updateOnboardingProgress = async function(step: number) {
  this.onboardingStepCompleted = Math.max(this.onboardingStepCompleted, step);
  await this.save();
};
```

### 5.3 Routing Logic

#### NextAuth Redirect Callback

**File:** `src/app/api/auth/[...nextauth]/route.ts`

**Current Implementation:**
```typescript
async redirect({ url, baseUrl }) {
  return `${baseUrl}/chat`;  // ❌ Always goes to chat
}
```

**New Production Implementation:**
```typescript
async redirect({ url, baseUrl }) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);

    // Not authenticated → login
    if (!session?.user?.id) {
      return `${baseUrl}/login`;
    }

    // Connect to database
    await connectDB();

    // Check if user has any clients
    const clientCount = await ClientModel.countDocuments({
      userId: new mongoose.Types.ObjectId(session.user.id),
      status: { $ne: 'archived' }  // Exclude archived clients
    });

    // New user (no clients) → Onboarding
    if (clientCount === 0) {
      console.log(`[NextAuth] New user detected (${session.user.email}) - redirecting to onboarding`);
      return `${baseUrl}/onboarding`;
    }

    // Backup check: User has clients but onboarding not marked complete
    const user = await UserModel.findById(session.user.id);
    if (user && !user.onboardingCompleted) {
      // Auto-complete onboarding if they have clients
      await user.completeOnboarding();
      console.log(`[NextAuth] Auto-completed onboarding for ${session.user.email}`);
    }

    // Existing user → Chat
    console.log(`[NextAuth] Existing user (${session.user.email}) - redirecting to chat`);
    return `${baseUrl}/chat`;

  } catch (error) {
    console.error('[NextAuth] Redirect error:', error);
    // Fallback to chat on error
    return `${baseUrl}/chat`;
  }
}
```

#### Onboarding Page Protection

**File:** `src/app/onboarding/page.tsx`

```typescript
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import ClientModel from '@/models/Client';
import { OnboardingFlow } from './OnboardingFlow';

export const metadata: Metadata = {
  title: 'Welcome to OneAssist | OneReport',
  description: 'Get started with your AI-powered marketing analytics assistant',
};

export default async function OnboardingPage() {
  // 1. Check authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  // 2. Check if user already has clients (skip onboarding)
  await connectDB();
  const clientCount = await ClientModel.countDocuments({
    userId: user.id,
    status: { $ne: 'archived' }
  });

  if (clientCount > 0) {
    // User already has clients → redirect to chat
    redirect('/chat');
  }

  // 3. Render onboarding flow
  return <OnboardingFlow />;
}
```

#### Chat Page Protection Enhancement

**File:** `src/app/chat/page.tsx`

**Current Implementation:**
```typescript
export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }
  return <ChatPageClient />;
}
```

**Enhanced Implementation (Optional - for strict flow):**
```typescript
export default async function ChatPage() {
  // 1. Check authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  // 2. Optional: Check if onboarding completed
  await connectDB();
  const dbUser = await UserModel.findById(user.id);

  if (dbUser && !dbUser.onboardingCompleted) {
    // User hasn't completed onboarding → send to onboarding
    redirect('/onboarding');
  }

  // 3. Render chat
  return <ChatPageClient />;
}
```

---

## 6. Implementation Plan

### Week 1: Days 1-2 (Design & Planning)

**Day 1: UX Design**
- [ ] Finalize onboarding flow steps
- [ ] Create detailed mockups for each step
- [ ] Define copy/messaging for each screen
- [ ] Design progress indicator
- [ ] Plan animations and transitions

**Day 2: Technical Planning**
- [ ] Design database schema updates
- [ ] Plan component architecture
- [ ] Define Server Actions needed
- [ ] Plan localStorage persistence strategy
- [ ] Write technical specifications

**Deliverable:** Complete UX spec + Technical design doc

### Week 1: Days 3-5 (Core Implementation)

**Day 3: Database & Backend**
- [ ] Update User model with onboarding fields
- [ ] Create `completeOnboarding` Server Action
- [ ] Update NextAuth redirect callback
- [ ] Create migration script for existing users
- [ ] Test redirect logic thoroughly

**Day 4: Onboarding Components (Part 1)**
- [ ] Create `OnboardingLayout.tsx` - Centered wrapper
- [ ] Create `ProgressIndicator.tsx` - Step dots
- [ ] Create `WelcomeStep.tsx` - Welcome screen
- [ ] Create `CreateClientStep.tsx` - Client form
- [ ] Add form validation with Zod

**Day 5: Onboarding Components (Part 2)**
- [ ] Create `ConnectPlatformsStep.tsx` - Platform cards
- [ ] Create `TourStep.tsx` - Feature tour
- [ ] Create `OnboardingFlow.tsx` - Main wizard
- [ ] Implement step navigation logic
- [ ] Add localStorage persistence

**Deliverable:** Functional onboarding flow (UI complete)

### Week 1: Days 6-7 (Integration & Testing)

**Day 6: Integration & Polish**
- [ ] Integrate with OAuth redirect flow
- [ ] Test new user journey end-to-end
- [ ] Test returning user journey
- [ ] Test partial onboarding resume
- [ ] Add loading states and transitions
- [ ] Polish animations with Framer Motion

**Day 7: Testing & Launch Prep**
- [ ] Write unit tests for components
- [ ] Write E2E test for full onboarding flow
- [ ] Test on mobile devices
- [ ] Test accessibility (screen readers)
- [ ] Fix bugs and edge cases
- [ ] Documentation updates

**Deliverable:** Production-ready onboarding system

---

## 7. UI/UX Specifications

### 7.1 Onboarding Layout

**Component:** `OnboardingLayout.tsx`

**Design:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                         ProgressIndicator                      │
│                        ● ○ ○ ○ (Step 1/4)                     │
│                                                                │
│    ┌───────────────────────────────────────────────────┐      │
│    │                                                   │      │
│    │                  Step Content                     │      │
│    │                                                   │      │
│    │                                                   │      │
│    │                                                   │      │
│    │                                                   │      │
│    │                                                   │      │
│    │                                                   │      │
│    │                                                   │      │
│    │                                                   │      │
│    │             [Back] [Next Step →]                 │      │
│    │                                                   │      │
│    └───────────────────────────────────────────────────┘      │
│                                                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Container:** Centered, max-width 600px
- **Background:** Dark (#1a1a1a) with subtle gradient
- **Content Card:** Elevated card with shadow
- **Spacing:** Generous padding for readability
- **Responsive:** Adapts to mobile screens

### 7.2 Step 1: Welcome Screen

**Component:** `WelcomeStep.tsx`

**Content:**
```
Welcome to OneAssist! 🎉

Your AI-powered marketing analytics assistant

What can OneAssist do?
✓ Answer questions about your marketing data in plain English
✓ Track performance across Google Analytics, Ads, Meta, and LinkedIn
✓ Provide insights and recommendations based on your data
✓ Generate reports and summaries instantly

Ready to get started? Let's set up your first client!

[Get Started →]
```

**Features:**
- Large friendly heading
- Clear value propositions
- Visual checkmarks for features
- Single CTA button
- No back button (first step)
- Warm, welcoming tone

### 7.3 Step 2: Create First Client

**Component:** `CreateClientStep.tsx`

**Content:**
```
Who do you work with?

Add your first client to get started with OneAssist

┌─────────────────────────────────────────┐
│ Client Name *                           │
│ [ Your Company or Client Name      ]   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Email (optional)                        │
│ [ client@example.com               ]   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Logo (optional)                         │
│ [ Upload Image ]  Max 2MB, PNG/JPG     │
└─────────────────────────────────────────┘

Examples:
• Your company name (if you're tracking your own marketing)
• A client you manage (if you're an agency or consultant)
• A project or brand you're working on

[Back] [Create Client & Continue →]
```

**Form Validation:**
```typescript
const createClientSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  logo: z.string()
    .url('Invalid logo URL')
    .optional()
    .or(z.literal('')),
});
```

**Features:**
- Required field indicator (*)
- Real-time validation
- Helpful examples
- Optional fields clearly marked
- Error messages below fields
- Submit button disabled until valid

### 7.4 Step 3: Connect Platforms

**Component:** `ConnectPlatformsStep.tsx`

**Content:**
```
Connect Your Marketing Platforms 📊

Connect platforms to get AI insights about your marketing performance.
You can also connect these later in Settings.

┌─────────────────────────────────────────────────────────────┐
│  ☐  Google Analytics                           [Connect]    │
│      Website traffic, user behavior, conversions            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ☐  Google Ads                                 [Connect]    │
│      Search & display advertising performance               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ☐  Meta Ads                                   [Connect]    │
│      Facebook & Instagram advertising metrics               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ☐  LinkedIn Ads                               [Connect]    │
│      B2B advertising & lead generation                      │
└─────────────────────────────────────────────────────────────┘

[Skip for Now] [Continue →]
```

**Features:**
- Platform cards with checkboxes
- "Connect" button for each platform
- Opens OAuth flow in new window/tab
- Checkbox auto-checks on successful connection
- Can skip this step entirely
- Progress saved if user connects platforms

**OAuth Flow:**
1. User clicks "Connect" on a platform
2. Opens OAuth window
3. User approves
4. Callback updates UI
5. Checkbox checks automatically
6. Can connect multiple platforms
7. Click "Continue" when done

### 7.5 Step 4: Quick Tour

**Component:** `TourStep.tsx`

**Content:**
```
Quick Tour 🚀

Here's how to get the most out of OneAssist:

┌─────────────────────────────────────────────────────────────┐
│  💬 Tip 1: Ask Natural Questions                            │
│                                                              │
│  Just type your questions in plain English:                 │
│  • "How many visitors did I get last week?"                 │
│  • "What's my Google Ads spend this month?"                 │
│  • "Compare last month to this month"                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔄 Tip 2: Switch Between Clients                           │
│                                                              │
│  Use the dropdown in the sidebar to switch between          │
│  different clients and see their specific data.             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📜 Tip 3: Review Conversation History                      │
│                                                              │
│  Access past conversations in the sidebar to review         │
│  previous insights and recommendations.                     │
└─────────────────────────────────────────────────────────────┘

[Back] [Start Using OneAssist →]
```

**Features:**
- Visual tips with emojis
- Clear examples
- Simple, scannable format
- Final CTA to start using the app
- Can go back to change platform connections

### 7.6 Progress Indicator

**Component:** `ProgressIndicator.tsx`

**Visual:**
```
Step 1/4:  ● ○ ○ ○    Welcome
Step 2/4:  ● ● ○ ○    Create Client
Step 3/4:  ● ● ● ○    Connect Platforms
Step 4/4:  ● ● ● ●    Quick Tour
```

**Features:**
- Shows current step clearly
- Filled dots for completed steps
- Empty dots for upcoming steps
- Optional step labels
- Clickable to jump to previous steps (optional)

---

## 8. Edge Cases & Error Handling

### 8.1 User Refreshes During Onboarding

**Problem:** User loses progress if they refresh the page

**Solution:** Save progress to localStorage

```typescript
// Save progress
const saveProgress = (step: number, data: any) => {
  localStorage.setItem('onboarding_progress', JSON.stringify({
    step,
    data,
    timestamp: new Date().toISOString(),
  }));
};

// Restore progress on mount
useEffect(() => {
  const saved = localStorage.getItem('onboarding_progress');
  if (saved) {
    const { step, data } = JSON.parse(saved);
    setCurrentStep(step);
    setFormData(data);
  }
}, []);

// Clear on completion
const completeOnboarding = async () => {
  await completeOnboardingAction();
  localStorage.removeItem('onboarding_progress');
  router.push('/chat');
};
```

### 8.2 User Closes Browser Mid-Onboarding

**Problem:** User returns later and needs to resume

**Solution:** Check database for onboarding status on login

```typescript
// In NextAuth redirect callback
const user = await UserModel.findById(session.user.id);

if (!user.onboardingCompleted) {
  // Resume onboarding
  return `${baseUrl}/onboarding`;
}
```

### 8.3 User Has Clients But Onboarding Not Marked Complete

**Problem:** Edge case where user has clients but flag is false

**Solution:** Auto-complete onboarding if clients exist

```typescript
// In redirect callback
if (clientCount > 0 && !user.onboardingCompleted) {
  await user.completeOnboarding();
  console.log('Auto-completed onboarding for existing user');
}
return `${baseUrl}/chat`;
```

### 8.4 User Manually Navigates to /chat Before Completing

**Problem:** User bypasses onboarding by typing URL

**Solution:** Add check in `/chat` page

```typescript
// In /chat/page.tsx
export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  // Check onboarding status
  const dbUser = await UserModel.findById(user.id);
  if (!dbUser.onboardingCompleted) {
    redirect('/onboarding');
  }

  return <ChatPageClient />;
}
```

### 8.5 OAuth Connection Fails During Onboarding

**Problem:** Platform connection fails, user gets stuck

**Solution:** Allow skipping and retrying

```typescript
const handlePlatformConnect = async (platform: string) => {
  try {
    setConnecting(true);
    // Open OAuth window
    const result = await openOAuthWindow(platform);

    if (result.success) {
      setConnectedPlatforms([...connectedPlatforms, platform]);
    } else {
      throw new Error('Connection failed');
    }
  } catch (error) {
    toast.error(`Failed to connect ${platform}. You can try again later in Settings.`);
  } finally {
    setConnecting(false);
  }
};
```

### 8.6 Client Creation Fails

**Problem:** Network error or validation fails

**Solution:** Show error, allow retry

```typescript
const handleCreateClient = async (data: ClientFormData) => {
  try {
    setLoading(true);
    setError(null);

    const result = await createClient(data);

    if (!result.success) {
      setError(result.error || 'Failed to create client');
      return;
    }

    // Success - move to next step
    setCurrentStep(3);
  } catch (error) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

---

## 9. Analytics & Metrics

### 9.1 Events to Track

**Onboarding Funnel Events:**

```typescript
// Event 1: Onboarding Started
analytics.track('onboarding_started', {
  userId: user.id,
  email: user.email,
  timestamp: new Date(),
  source: 'oauth_redirect',
});

// Event 2: Step Completed
analytics.track('onboarding_step_completed', {
  userId: user.id,
  step: 1,  // 1-4
  stepName: 'welcome',
  timeOnStep: 15,  // seconds
  timestamp: new Date(),
});

// Event 3: Client Created
analytics.track('onboarding_client_created', {
  userId: user.id,
  clientName: client.name,
  hasEmail: !!client.email,
  hasLogo: !!client.logo,
  timestamp: new Date(),
});

// Event 4: Platform Connected
analytics.track('onboarding_platform_connected', {
  userId: user.id,
  platform: 'google_analytics',  // google_analytics, google_ads, meta_ads, linkedin_ads
  step: 3,
  timestamp: new Date(),
});

// Event 5: Platform Connection Skipped
analytics.track('onboarding_platforms_skipped', {
  userId: user.id,
  timestamp: new Date(),
});

// Event 6: Onboarding Completed
analytics.track('onboarding_completed', {
  userId: user.id,
  totalTime: 120,  // seconds from start to finish
  stepsCompleted: 4,
  platformsConnected: 2,
  timestamp: new Date(),
});

// Event 7: Onboarding Abandoned
analytics.track('onboarding_abandoned', {
  userId: user.id,
  lastStep: 2,
  lastStepName: 'create_client',
  timeBeforeAbandon: 45,  // seconds
  timestamp: new Date(),
});
```

### 9.2 Key Metrics Dashboard

**Metrics to Monitor:**

| Metric | Calculation | Target |
|--------|-------------|--------|
| **Start Rate** | (Users who land on /onboarding) / (Total new signups) | > 95% |
| **Completion Rate** | (Users who complete onboarding) / (Users who start) | > 80% |
| **Step 1 Completion** | Users who go from Step 1 → 2 | > 95% |
| **Step 2 Completion** | Users who go from Step 2 → 3 | > 85% |
| **Step 3 Completion** | Users who go from Step 3 → 4 | > 90% |
| **Step 4 Completion** | Users who go from Step 4 → Done | > 95% |
| **Platform Connection Rate** | (Users who connect >= 1 platform) / (Total users) | > 30% |
| **Time to Complete** | Average time from start to finish | < 2 min |
| **Drop-off Point** | Step where most users abandon | Identify |
| **Return Rate** | Users who return after abandoning | Track |

### 9.3 Funnel Visualization

```
Step 1: Welcome
  100 users (100%)
       ↓ -5%
Step 2: Create Client
  95 users (95%)
       ↓ -10%
Step 3: Connect Platforms
  85 users (85%)
       ↓ -5%
Step 4: Quick Tour
  80 users (80%)
       ↓
Completed Onboarding
  80 users (80% completion rate)
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Test:** `WelcomeStep.test.tsx`
```typescript
describe('WelcomeStep', () => {
  it('renders welcome message', () => {
    render(<WelcomeStep onNext={jest.fn()} />);
    expect(screen.getByText(/Welcome to OneAssist/i)).toBeInTheDocument();
  });

  it('calls onNext when button clicked', () => {
    const onNext = jest.fn();
    render(<WelcomeStep onNext={onNext} />);
    fireEvent.click(screen.getByText(/Get Started/i));
    expect(onNext).toHaveBeenCalled();
  });
});
```

**Test:** `CreateClientStep.test.tsx`
```typescript
describe('CreateClientStep', () => {
  it('validates required client name', async () => {
    render(<CreateClientStep onNext={jest.fn()} onBack={jest.fn()} />);

    fireEvent.click(screen.getByText(/Create Client/i));

    expect(await screen.findByText(/Name must be at least 2 characters/i))
      .toBeInTheDocument();
  });

  it('creates client on valid submission', async () => {
    const onNext = jest.fn();
    render(<CreateClientStep onNext={onNext} onBack={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Client Name/i), {
      target: { value: 'Acme Corp' },
    });

    fireEvent.click(screen.getByText(/Create Client/i));

    await waitFor(() => {
      expect(onNext).toHaveBeenCalled();
    });
  });
});
```

### 10.2 Integration Tests

**Test:** OAuth → Onboarding Flow
```typescript
describe('OAuth to Onboarding Flow', () => {
  it('redirects new user to onboarding after OAuth', async () => {
    // Mock OAuth success
    const user = await signInWithGoogle();

    // Verify redirect to onboarding
    expect(window.location.pathname).toBe('/onboarding');

    // Verify user has no clients
    const clientCount = await ClientModel.countDocuments({
      userId: user.id
    });
    expect(clientCount).toBe(0);
  });

  it('redirects existing user to chat after OAuth', async () => {
    // Create user with clients
    const user = await createUserWithClients();

    // Sign in
    await signInWithGoogle();

    // Verify redirect to chat (skip onboarding)
    expect(window.location.pathname).toBe('/chat');
  });
});
```

### 10.3 E2E Tests (Playwright)

**Test:** Complete Onboarding Flow
```typescript
test('new user completes full onboarding flow', async ({ page }) => {
  // 1. Sign in with Google (mock OAuth)
  await page.goto('/signin');
  await page.click('text=Sign in with Google');

  // Mock OAuth success - should redirect to /onboarding
  await page.waitForURL('/onboarding');

  // 2. Step 1: Welcome
  await expect(page.locator('text=Welcome to OneAssist')).toBeVisible();
  await page.click('text=Get Started');

  // 3. Step 2: Create Client
  await page.fill('input[name="name"]', 'Test Client');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('text=Create Client & Continue');

  // 4. Step 3: Connect Platforms (skip)
  await page.click('text=Skip for Now');

  // 5. Step 4: Quick Tour
  await expect(page.locator('text=Quick Tour')).toBeVisible();
  await page.click('text=Start Using OneAssist');

  // 6. Verify redirect to chat
  await page.waitForURL('/chat');
  await expect(page.locator('text=Test Client')).toBeVisible();
});

test('user can resume onboarding after closing browser', async ({ page }) => {
  // 1. Start onboarding
  await page.goto('/onboarding');
  await page.click('text=Get Started');

  // 2. Complete Step 2 partially
  await page.fill('input[name="name"]', 'Partial Client');

  // 3. Close and reopen (simulate browser close)
  await page.close();
  const newPage = await browser.newPage();

  // 4. Sign in again
  await newPage.goto('/signin');
  await newPage.click('text=Sign in with Google');

  // 5. Verify redirected back to onboarding
  await newPage.waitForURL('/onboarding');

  // 6. Verify form data restored from localStorage
  const value = await newPage.inputValue('input[name="name"]');
  expect(value).toBe('Partial Client');
});
```

### 10.4 Accessibility Testing

**Manual Checklist:**
- [ ] All steps navigable via keyboard only
- [ ] Screen reader announces step changes
- [ ] Form labels properly associated with inputs
- [ ] Error messages announced by screen readers
- [ ] Focus management on step transitions
- [ ] Color contrast meets WCAG AA standards
- [ ] All interactive elements have visible focus indicators

**Automated Test:**
```typescript
import { axe } from 'jest-axe';

test('onboarding has no accessibility violations', async () => {
  const { container } = render(<OnboardingFlow />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 10.5 Mobile Testing

**Test Checklist:**
- [ ] Onboarding layout responsive on mobile (320px - 768px)
- [ ] Form inputs large enough for touch (min 44x44px)
- [ ] Progress indicator visible on small screens
- [ ] Step content doesn't overflow
- [ ] Navigation buttons accessible
- [ ] Platform cards stack vertically on mobile
- [ ] OAuth flows work on mobile browsers

---

## 11. Implementation Checklist

### Phase 4.5 Development Checklist

**Backend (Database & Server Actions):**
- [ ] Update `User.ts` model with onboarding fields
- [ ] Add `completeOnboarding()` instance method
- [ ] Add `updateOnboardingProgress()` instance method
- [ ] Create `completeOnboarding.ts` Server Action
- [ ] Update NextAuth redirect callback with client check
- [ ] Create database migration script for existing users
- [ ] Test redirect logic thoroughly

**Frontend Components:**
- [ ] Create `OnboardingLayout.tsx` - Centered wrapper
- [ ] Create `ProgressIndicator.tsx` - Step progress dots
- [ ] Create `WelcomeStep.tsx` - Welcome screen
- [ ] Create `CreateClientStep.tsx` - Client creation form
- [ ] Create `ConnectPlatformsStep.tsx` - Platform cards
- [ ] Create `TourStep.tsx` - Feature tour
- [ ] Create `OnboardingFlow.tsx` - Main wizard with state

**Routing & Protection:**
- [ ] Create `/onboarding/page.tsx` with auth check
- [ ] Update `/chat/page.tsx` with onboarding check (optional)
- [ ] Test OAuth → Onboarding flow
- [ ] Test OAuth → Chat flow (existing users)
- [ ] Handle manual URL navigation

**State Management:**
- [ ] Implement localStorage progress saving
- [ ] Implement progress restoration on mount
- [ ] Handle step navigation (next/back)
- [ ] Track current step state
- [ ] Clear localStorage on completion

**Error Handling:**
- [ ] Handle client creation errors
- [ ] Handle platform connection failures
- [ ] Handle network errors
- [ ] Show user-friendly error messages
- [ ] Allow retry on failures

**Analytics Integration:**
- [ ] Track `onboarding_started` event
- [ ] Track `onboarding_step_completed` events
- [ ] Track `onboarding_client_created` event
- [ ] Track `onboarding_platform_connected` events
- [ ] Track `onboarding_completed` event
- [ ] Track `onboarding_abandoned` event
- [ ] Set up funnel visualization dashboard

**Testing:**
- [ ] Write unit tests for all components
- [ ] Write integration tests for OAuth → Onboarding
- [ ] Write E2E test for complete flow
- [ ] Test onboarding resume after browser close
- [ ] Test accessibility with screen readers
- [ ] Test on mobile devices (iOS + Android)
- [ ] Test cross-browser (Chrome, Safari, Firefox, Edge)
- [ ] Performance test (< 2min to complete)

**Documentation:**
- [ ] Update `CURRENT-STATUS.md` with Phase 4.5
- [ ] Update `08-IMPLEMENTATION-ROADMAP-COMPLETE.md`
- [ ] Create `ONBOARDING-UX-SPEC.md` with mockups
- [ ] Update `README.md` with onboarding info
- [ ] Update `03-UX-DESIGN.md` with flow diagrams
- [ ] Write developer setup guide
- [ ] Write user-facing onboarding guide

**Launch Preparation:**
- [ ] Deploy to staging environment
- [ ] Test with real users (internal team)
- [ ] Collect feedback and iterate
- [ ] Fix any bugs discovered
- [ ] Monitor onboarding completion rate
- [ ] Deploy to production
- [ ] Monitor for errors (Sentry)
- [ ] Analyze funnel metrics

---

## 12. Success Criteria

### Definition of Done

**Phase 4.5 is complete when:**

1. ✅ **New User Flow Works**
   - OAuth success → Redirect to `/onboarding`
   - Complete all 4 steps
   - Redirect to `/chat` with first client

2. ✅ **Existing User Flow Works**
   - OAuth success → Skip onboarding
   - Redirect directly to `/chat`
   - See existing clients and conversations

3. ✅ **Onboarding Completion Rate**
   - Target: > 80% of users who start
   - Measured over first 100 users

4. ✅ **Time to First Chat**
   - Target: < 2 minutes average
   - From OAuth success to first message sent

5. ✅ **Platform Connection Rate**
   - Target: > 30% connect at least one platform
   - During onboarding (not Settings)

6. ✅ **Zero Critical Bugs**
   - No blocking issues preventing completion
   - All edge cases handled gracefully

7. ✅ **Accessibility Compliant**
   - WCAG AA standards met
   - Works with screen readers
   - Keyboard navigation functional

8. ✅ **Mobile Optimized**
   - Works on screens 320px+
   - Touch targets properly sized
   - No horizontal scroll

9. ✅ **Analytics Instrumented**
   - All events tracked
   - Funnel visualization working
   - Drop-off points identified

10. ✅ **Documentation Complete**
    - Developer docs written
    - User-facing guides published
    - Technical specs finalized

---

## 13. Next Steps After Phase 4.5

### Immediate Follow-up (Week 2)

**Optimization Based on Data:**
1. Analyze onboarding completion rates
2. Identify drop-off points
3. Interview users who abandoned
4. A/B test variations:
   - Different copy/messaging
   - Order of steps
   - Skip vs require platform connection

**Enhancements:**
1. Add onboarding video tour (optional)
2. Add tooltips for first-time features
3. Add success animations
4. Improve mobile experience further

### Integration with Future Phases

**Phase 5: Platform APIs**
- Connect platform OAuth from onboarding
- Show real metrics immediately after connection
- Celebrate first data sync

**Phase 6: Conversations**
- Show example conversation in tour
- Guide users to ask first question
- Highlight conversation history feature

**Phase 7: Launch**
- Monitor onboarding metrics closely
- Iterate based on user feedback
- Optimize conversion funnel

---

## Conclusion

Phase 4.5 introduces a critical onboarding flow that will:

1. ✅ **Improve User Activation** - Guide users to first value quickly
2. ✅ **Increase Retention** - Users with clients are more likely to return
3. ✅ **Reduce Confusion** - Clear path from signup to first chat
4. ✅ **Boost Platform Connections** - Encourage early integration
5. ✅ **Provide Better UX** - Professional, polished first impression
6. ✅ **Enable Data Collection** - Track user journey and optimize

**Timeline:** 1 week (5-7 days)
**Effort:** Medium complexity
**Impact:** High - Critical for production success
**Dependencies:** Phase 4 (Authentication) must be complete

---

**Document Status:** ✅ Complete and Ready for Implementation
**Next Step:** Begin Day 1 (UX Design) of Implementation Plan

**Questions or Feedback:** Contact Engineering Team
