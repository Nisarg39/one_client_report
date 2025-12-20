# User Onboarding & Authentication System Documentation

> **Complete implementation guide for user authentication, onboarding flow, and dashboard using NextAuth.js**
>
> **Last Updated**: November 4, 2025
> **Status**: Planning Phase - Not Started
> **Priority**: P0 - Critical for business model

---

## Table of Contents

1. [Overview](#overview)
2. [Current State](#current-state)
3. [Architecture with NextAuth.js](#architecture-with-nextauthjs)
4. [Implementation Phases](#implementation-phases)
5. [Task Breakdown](#task-breakdown)
6. [Folder Structure](#folder-structure)
7. [Database Models](#database-models)
8. [Dependencies](#dependencies)
9. [Testing Checklist](#testing-checklist)
10. [Future Enhancements](#future-enhancements)

---

## Overview

### Purpose

Implement a complete user authentication and onboarding system to convert landing page visitors into active users. Currently, the hero section CTAs ("Start Free Trial" and "View Live Demo") are non-functional placeholders with no backend connectivity.

### Goals

- ✅ Enable user registration with OAuth (Google, GitHub)
- ✅ Implement secure authentication using NextAuth.js
- ✅ Auto-create single workspace on signup
- ✅ Simplified onboarding with platform connections
- ✅ Build user dashboard and chat interface
- ✅ Single workspace architecture (unlimited campaigns per workspace)
- ✅ Tier-based feature gating (workspace selector for Agency/Enterprise only)

### Success Metrics

- Users can sign up in < 2 minutes
- Onboarding completion rate > 70%
- First report generated within 5 minutes of signup
- Session management secure and seamless

---

## Current State

### ✅ What Exists

**Landing Page** (Fully functional):
- Hero section with 2 CTAs
- Contact form (working, saves to MongoDB)
- Pricing section
- FAQ section
- Footer with final CTA

**Admin Panel** (`/admin`):
- Simple JWT password authentication
- Dashboard with contact management
- Protected by middleware
- MongoDB integration

**Backend Infrastructure**:
- MongoDB database connected
- Server Actions architecture
- Mongoose models (Contact)
- JWT session utilities (admin only)

### ❌ What's Missing (Critical Gaps)

**No User Authentication**:
- No user signup/login system
- No NextAuth.js configuration
- No user session management
- No OAuth providers configured

**No User Interface**:
- Hero CTAs have no href/onClick handlers
- No signup page (`/signup`)
- No login page (`/login`)
- No user dashboard (`/dashboard`)

**No User Backend**:
- No User model in MongoDB
- No user-related server actions
- No subscription tracking
- No platform connection logic

**No Onboarding Flow**:
- No onboarding wizard
- No first-time user experience
- No platform connection UI
- No report generation for users

---

## Architecture with NextAuth.js

### Why NextAuth.js?

NextAuth.js is chosen for user authentication (NOT for admin) because:

✅ **Industry Standard**: Battle-tested authentication library
✅ **OAuth Support**: Easy integration with Google, GitHub, etc.
✅ **Session Management**: Built-in JWT and database sessions
✅ **Security**: CSRF protection, secure cookies, encrypted JWT
✅ **Type Safety**: Full TypeScript support
✅ **Flexibility**: Credentials provider for email/password + OAuth
✅ **Scalability**: Can add more providers easily

### Authentication Separation Strategy

| Feature | Admin Panel | User System |
|---------|-------------|-------------|
| **Route** | `/admin/*` | `/dashboard/*`, `/onboarding/*` |
| **Auth Method** | Simple JWT with password | NextAuth.js |
| **Session Cookie** | `admin-session` | `next-auth.session-token` |
| **Database** | No user accounts | Users collection |
| **Use Case** | Internal management | Customer-facing |
| **Providers** | Password only | Email/Password + OAuth |

### NextAuth.js Configuration

**File**: `/src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/backend/config/mongodb-adapter";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          image: user.logo,
        };
      }
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/login",
    signUp: "/signup",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Session Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER VISITS HOMEPAGE                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│             CLICKS "START FREE TRIAL" BUTTON                 │
│            (Hero or Final CTA → /signup)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   SIGNUP PAGE (/signup)                      │
│                                                              │
│  Option A: Email/Password                                   │
│  - Enter email, password, name                              │
│  - Submit form → NextAuth CredentialsProvider               │
│                                                              │
│  Option B: Social OAuth                                     │
│  - Click "Continue with Google"                             │
│  - OAuth redirect → Google consent → Callback               │
│                                                              │
│  Option C: GitHub OAuth                                     │
│  - Click "Continue with GitHub"                             │
│  - OAuth redirect → GitHub consent → Callback               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           NEXTAUTH CREATES SESSION                           │
│  - Validates credentials                                     │
│  - Creates JWT token                                         │
│  - Sets httpOnly cookie: next-auth.session-token            │
│  - Stores session in database (if using db sessions)        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         REDIRECT TO ONBOARDING (/onboarding)                 │
│  - Middleware verifies session                               │
│  - If first time: Start onboarding wizard                   │
│  - If returning: Go to dashboard                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

> **🎯 Development Philosophy**: **Frontend-First Approach**
>
> We build the user interface and experience FIRST, then integrate backend functionality. This ensures:
> - Clear understanding of user journey before adding complexity
> - Faster iteration on design and UX
> - Backend requirements emerge naturally from frontend needs
> - Visual feedback guides technical decisions

---

### Phase 1: Routes & Page Structure Planning (1-2 Days)

**Duration**: 1-2 days
**Priority**: P0
**Status**: ⬜ Not Started

**Purpose**: Plan the complete user journey and page structure before writing any code.

**Deliverables**:
- ✅ Route structure defined (`/signup`, `/login`, `/onboarding`, `/dashboard`, etc.)
- ✅ Page purposes and goals documented
- ✅ User flow mapped (Hero CTA → Signup → Onboarding → Dashboard)
- ✅ Component hierarchy planned
- ✅ Folder structure defined for frontend components

**Key Questions to Answer**:
- What does each page show?
- What actions can users take?
- What data does each page need?
- How do pages connect to each other?
- What components are reusable?

---

### Phase 2: Frontend UI Implementation (Week 1)

**Duration**: 5-7 days
**Priority**: P0
**Status**: ⬜ Not Started

**Purpose**: Build the complete user interface with mock data. No backend integration yet - focus on UX, design, and user flow.

**Deliverables**:
- ✅ Auth pages UI (Signup, Login) with forms and OAuth buttons
- ✅ Onboarding wizard UI (4-step multi-step form)
- ✅ Dashboard shell UI (navigation, layout, mock data)
- ✅ Settings page UI skeleton
- ✅ Hero CTAs wired to navigate to signup
- ✅ All components design-system compliant
- ✅ Responsive on all devices
- ✅ Loading states and error UI patterns

**Why Frontend First?**
- See and test the user experience immediately
- Iterate on design without backend complexity
- Identify what backend features are actually needed
- Get stakeholder feedback on flow before heavy development
- Frontend requirements drive backend architecture

---

### Phase 3: Backend Integration (Week 2)

**Duration**: 5-7 days
**Priority**: P0
**Status**: ⬜ Not Started

**Purpose**: NOW we add backend functionality to make the UI functional. We know exactly what we need because the frontend is already built.

**Deliverables**:
- ✅ NextAuth.js configured with MongoDB adapter
- ✅ User model created in MongoDB
- ✅ Signup/login forms connected to NextAuth
- ✅ Session management working (JWT cookies)
- ✅ Protected routes with middleware
- ✅ OAuth providers (Google, GitHub) integrated
- ✅ Server actions for user operations
- ✅ Data persistence working

**Integration Points** (Frontend → Backend):
- Signup form → `signupUser()` server action → User model
- Login form → NextAuth CredentialsProvider → Session
- OAuth buttons → NextAuth providers → Auto-create user
- Dashboard → Server-side session check → User data
- Onboarding → Save progress → User model update

---

### Phase 4: Advanced Features & Polish (Week 3-4)

**Duration**: 7-10 days
**Priority**: P1
**Status**: ⬜ Not Started

**Purpose**: Add advanced functionality like platform integrations, report generation, AI insights, and billing.

**Deliverables**:
- ✅ Google Analytics integration (API connection)
- ✅ First report generation (PDF with jsPDF)
- ✅ AI insights (OpenAI integration)
- ✅ Stripe billing integration
- ✅ Advanced settings (white-labeling, custom domain)
- ✅ Client management CRUD
- ✅ Interactive demo mode
- ✅ Performance optimization
- ✅ Final testing and bug fixes

---

## Task Breakdown

> **📋 Task Organization**: Tasks are organized by implementation phase (frontend-first). Each task group includes estimated time and clear deliverables.

---

### PHASE 1: ROUTES & PAGE STRUCTURE PLANNING

**Total Tasks**: 8 tasks
**Estimated Time**: 1-2 days
**Goal**: Plan the complete user journey and technical architecture before building anything.

---

#### **Task Group 1.1: Route Structure Definition**

**Estimated Time**: 2 hours

- [ ] **Task 1.1.1**: Define all user-facing routes
  **Routes to Plan**:
  ```
  /signup              - User registration page
  /login               - User login page
  /onboarding          - 4-step onboarding wizard
  /dashboard           - Main user dashboard (default after login)
  /dashboard/reports   - Reports list and management
  /dashboard/clients   - Clients management
  /dashboard/settings  - User settings
  /dashboard/billing   - Subscription and billing
  /demo                - Interactive demo (view live demo CTA)
  ```
  **Deliverable**: Routes documented with purpose for each
  **Status**: ⬜ Not Started

- [ ] **Task 1.1.2**: Map user flow and navigation
  **Flow to Document**:
  ```
  Hero "Start Free Trial" → /signup → /onboarding → /dashboard
  Hero "View Live Demo" → /demo
  /login → /dashboard (if onboarding complete)
  /login → /onboarding (if onboarding incomplete)
  ```
  **Deliverable**: User flow diagram (can be text-based or visual)
  **Status**: ⬜ Not Started

---

#### **Task Group 1.2: Page Purpose & Data Requirements**

**Estimated Time**: 2 hours

- [ ] **Task 1.2.1**: Document each page's purpose and content
  **For Each Route, Define**:
  - What does the user see?
  - What actions can they take?
  - What's the success outcome?
  - What data do we show? (mock data for now)

  **Example for /signup**:
  - User sees: Signup form, OAuth buttons, link to login
  - Actions: Fill form, click OAuth, navigate to login
  - Success: User account created, redirected to /onboarding
  - Data: Form inputs (name, email, password)

  **Deliverable**: Page specifications document
  **Status**: ⬜ Not Started

- [ ] **Task 1.2.2**: Identify data needed for each page (use mock data initially)
  **Data Requirements**:
  - `/dashboard`: User info, reports count, recent activity (mock initially)
  - `/dashboard/reports`: List of reports (mock array)
  - `/onboarding`: Form state, current step, validation errors

  **Deliverable**: Data requirements per page
  **Status**: ⬜ Not Started

---

#### **Task Group 1.3: Component Architecture Planning**

**Estimated Time**: 3 hours

- [ ] **Task 1.3.1**: Plan reusable component hierarchy
  **Components to Design**:
  ```
  Auth Components:
  - SignupForm
  - LoginForm
  - OAuthButtons (Google, GitHub)
  - AuthLayout (minimal layout for auth pages)

  Onboarding Components:
  - OnboardingWizard (parent)
  - StepIndicator (progress bar)
  - Step1_Welcome
  - Step2_PlatformConnection
  - Step3_Branding
  - Step4_FirstReport

  Dashboard Components:
  - DashboardLayout (sidebar + main content)
  - Sidebar
  - TopHeader
  - ReportsTable
  - ClientsTable
  - SettingsForm
  ```
  **Deliverable**: Component tree diagram
  **Status**: ⬜ Not Started

- [ ] **Task 1.3.2**: Define folder structure for components
  **Proposed Structure**:
  ```
  src/components/
  ├── auth/
  │   ├── SignupForm.tsx
  │   ├── LoginForm.tsx
  │   └── OAuthButtons.tsx
  ├── onboarding/
  │   ├── OnboardingWizard.tsx
  │   ├── StepIndicator.tsx
  │   └── steps/
  │       ├── Step1_Welcome.tsx
  │       ├── Step2_Platform.tsx
  │       ├── Step3_Branding.tsx
  │       └── Step4_Report.tsx
  ├── dashboard/
  │   ├── DashboardLayout.tsx
  │   ├── Sidebar.tsx
  │   ├── TopHeader.tsx
  │   └── ReportsTable.tsx
  └── shared/
      ├── Button.tsx
      ├── Input.tsx
      ├── Card.tsx
      └── LoadingSpinner.tsx
  ```
  **Deliverable**: Folder structure documented
  **Status**: ⬜ Not Started

- [ ] **Task 1.3.3**: Identify design system components to use
  **From shadcn/ui**:
  - Button, Input, Card, Form, Dialog, Tabs, Select

  **Custom components needed**:
  - Neumorphic buttons/cards matching design system
  - Multi-step form wrapper
  - Dashboard sidebar

  **Deliverable**: Component requirements list
  **Status**: ⬜ Not Started

- [ ] **Task 1.3.4**: Define component props and interfaces (TypeScript)
  **Example**:
  ```typescript
  interface SignupFormProps {
    onSubmit: (data: SignupFormData) => void;
    isLoading: boolean;
    errors?: Record<string, string>;
  }

  interface OnboardingWizardProps {
    initialStep?: number;
    onComplete: () => void;
  }
  ```
  **Deliverable**: TypeScript interfaces for all components
  **Status**: ⬜ Not Started

---

### PHASE 2: FRONTEND UI IMPLEMENTATION

**Total Tasks**: 45 tasks
**Estimated Time**: 5-7 days
**Goal**: Build complete UI with design-system compliance. Use mock data, no backend integration yet.

---

#### **Task Group 2.1: Hero CTA Wiring**

**Estimated Time**: 30 minutes

- [ ] **Task 2.1.1**: Wire up "Start Free Trial" button to navigate to /signup
  **File**: `/src/components/features/hero-section-skeuomorphic.tsx`
  ```typescript
  import { useRouter } from 'next/navigation';

  const router = useRouter();

  <button onClick={() => router.push('/signup')}>
    Start Free Trial
  </button>
  ```
  **Status**: ⬜ Not Started

- [ ] **Task 2.1.2**: Wire up "View Live Demo" button to navigate to /demo
  **File**: Same as above
  **Status**: ⬜ Not Started

- [ ] **Task 2.1.3**: Wire up final CTA section buttons
  **File**: `/src/components/features/final-cta.tsx`
  **Status**: ⬜ Not Started

---

#### **Task Group 2.2: Auth Layout & Signup Page UI**

**Estimated Time**: 4 hours

- [ ] **Task 2.2.1**: Create auth layout (minimal, no navbar)
  **File**: `/src/app/(auth)/layout.tsx`
  ```typescript
  export default function AuthLayout({ children }: { children: React.Node }) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        {children}
      </div>
    );
  }
  ```
  **Status**: ⬜ Not Started

---

> **⚠️ NOTE**: The detailed task breakdown below is currently organized backend-first and will be restructured.
>
> **For now, follow this order**:
> 1. **Phase 1** (above): Plan routes, pages, and components
> 2. **Phase 2**: Build all frontend UI using the phase deliverables as guide
> 3. **Phase 3**: Then integrate backend (tasks below can be used as reference)
> 4. **Phase 4**: Add advanced features
>
> Detailed frontend-first task breakdown coming in next documentation update.

---

### PHASE 3: BACKEND INTEGRATION (Reference Tasks)

#### **Task Group 3.1: Dependencies & Environment Setup**

**Estimated Time**: 1 hour

- [ ] **Task 1.1.1**: Install NextAuth.js
  ```bash
  npm install next-auth @auth/mongodb-adapter
  npm install bcryptjs @types/bcryptjs
  ```
  **Status**: ⬜ Not Started
  **File Changes**: `package.json`

- [ ] **Task 1.1.2**: Add environment variables to `.env.local`
  ```bash
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your_nextauth_secret_here_min_32_chars
  GOOGLE_CLIENT_ID=your_google_oauth_client_id
  GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
  GITHUB_CLIENT_ID=your_github_oauth_client_id
  GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
  ```
  **Status**: ⬜ Not Started
  **File Changes**: `.env.local`, `.env.example`

- [ ] **Task 1.1.3**: Generate NEXTAUTH_SECRET
  ```bash
  openssl rand -base64 32
  ```
  **Status**: ⬜ Not Started

---

#### **Task Group 1.2: MongoDB Adapter Configuration**

**Estimated Time**: 1 hour

- [ ] **Task 1.2.1**: Create MongoDB adapter client
  **File**: `/src/backend/config/mongodb-adapter.ts`
  ```typescript
  import { MongoClient } from "mongodb";

  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;
  const options = {};

  let client: MongoClient;
  let clientPromise: Promise<MongoClient>;

  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  export default clientPromise;
  ```
  **Status**: ⬜ Not Started
  **File Changes**: Create new file

- [ ] **Task 1.2.2**: Test MongoDB adapter connection
  **Status**: ⬜ Not Started

---

#### **Task Group 1.3: User Model Creation**

**Estimated Time**: 2 hours

- [ ] **Task 1.3.1**: Create User model schema
  **File**: `/src/backend/models/user.ts`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Full NextAuth.js compatibility
  - Include fields: fullName, email, password (optional for OAuth), emailVerified
  - Include subscription fields: plan, status, trialEndsAt
  - Include onboarding fields: onboardingCompleted, onboardingStep
  - Include branding fields: logo, primaryColor
  - Pre-save hook to hash password with bcrypt
  - Method to compare passwords
  - Proper indexes on email and createdAt

- [ ] **Task 1.3.2**: Add TypeScript types for User
  **File**: `/src/backend/types/index.ts` (extend existing)
  **Status**: ⬜ Not Started

- [ ] **Task 1.3.3**: Test User model creation in MongoDB
  **Status**: ⬜ Not Started

---

#### **Task Group 1.4: NextAuth.js API Route**

**Estimated Time**: 3 hours

- [ ] **Task 1.4.1**: Create NextAuth API route
  **File**: `/src/app/api/auth/[...nextauth]/route.ts`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Configure CredentialsProvider for email/password
  - Configure GoogleProvider for OAuth
  - Configure GitHubProvider for OAuth
  - Setup MongoDB adapter
  - Configure session strategy (JWT)
  - Add custom pages (signIn, signUp, error)
  - Implement callbacks (jwt, session)
  - Add proper error handling

- [ ] **Task 1.4.2**: Create NextAuth types
  **File**: `/src/types/next-auth.d.ts`
  ```typescript
  import NextAuth, { DefaultSession } from "next-auth";

  declare module "next-auth" {
    interface Session {
      user: {
        id: string;
      } & DefaultSession["user"];
    }
  }
  ```
  **Status**: ⬜ Not Started
  **File Changes**: Create new file

- [ ] **Task 1.4.3**: Test NextAuth API route
  **Testing**: Visit `/api/auth/signin` to verify NextAuth is working
  **Status**: ⬜ Not Started

---

#### **Task Group 1.5: Signup Page**

**Estimated Time**: 4 hours

- [ ] **Task 1.5.1**: Create auth layout (no navbar)
  **File**: `/src/app/(auth)/layout.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Minimal layout without navbar/footer
  - Centered content
  - Dark background (#1a1a1a)
  - Responsive

- [ ] **Task 1.5.2**: Create signup page
  **File**: `/src/app/(auth)/signup/page.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Use neumorphic design system
  - Include form for email, password, full name
  - Add social login buttons (Google, GitHub)
  - Link to login page
  - Trust signals (no credit card, 14-day trial)

- [ ] **Task 1.5.3**: Create SignupForm component
  **File**: `/src/components/auth/SignupForm.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Form validation with Zod
  - Password strength indicator
  - Show/hide password toggle
  - Loading state during submission
  - Error message display
  - Success redirect to /onboarding

- [ ] **Task 1.5.4**: Create signup server action
  **File**: `/src/backend/server_actions/authActions.ts`
  **Function**: `signupUser()`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Validate email uniqueness
  - Hash password with bcrypt (12 rounds)
  - Create user in MongoDB
  - Return success/error response
  - Trigger NextAuth signIn after creation

- [ ] **Task 1.5.5**: Add OAuth button components
  **File**: `/src/components/auth/OAuthButtons.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - "Continue with Google" button
  - "Continue with GitHub" button
  - Use signIn("google") and signIn("github") from NextAuth

- [ ] **Task 1.5.6**: Test signup flow end-to-end
  **Testing**:
  - Email/password signup
  - Google OAuth signup
  - GitHub OAuth signup
  - Error handling (duplicate email, weak password)
  - Redirect to onboarding after success
  **Status**: ⬜ Not Started

---

#### **Task Group 1.6: Login Page**

**Estimated Time**: 3 hours

- [ ] **Task 1.6.1**: Create login page
  **File**: `/src/app/(auth)/login/page.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Use neumorphic design
  - Email and password fields
  - Social login buttons
  - "Forgot password?" link
  - "Don't have account? Sign up" link

- [ ] **Task 1.6.2**: Create LoginForm component
  **File**: `/src/components/auth/LoginForm.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Form validation
  - Show/hide password
  - Loading state
  - Error messages
  - Remember me checkbox
  - Call signIn() from NextAuth

- [ ] **Task 1.6.3**: Test login flow
  **Testing**:
  - Email/password login
  - Google OAuth login
  - GitHub OAuth login
  - Error handling (wrong password, user not found)
  - Redirect to dashboard if onboarding complete
  - Redirect to onboarding if not complete
  **Status**: ⬜ Not Started

---

#### **Task Group 1.7: Update Hero CTAs**

**Estimated Time**: 1 hour

- [ ] **Task 1.7.1**: Update hero section buttons
  **File**: `/src/components/features/hero-section-skeuomorphic.tsx`
  **Lines**: 89-117
  **Status**: ⬜ Not Started
  **Changes**:
  ```typescript
  import { useRouter } from 'next/navigation';

  const router = useRouter();

  // Start Free Trial button
  <button onClick={() => router.push('/signup')}>
    Start Free Trial
  </button>

  // View Live Demo button
  <button onClick={() => router.push('/demo')}>
    View Live Demo
  </button>
  ```

- [ ] **Task 1.7.2**: Update final CTA section buttons
  **File**: `/src/components/features/final-cta.tsx`
  **Lines**: 99-122
  **Status**: ⬜ Not Started
  **Changes**: Same as Task 1.7.1

- [ ] **Task 1.7.3**: Test CTA navigation
  **Testing**: Click both CTAs, verify redirect to /signup or /demo
  **Status**: ⬜ Not Started

---

#### **Task Group 1.8: Middleware Updates**

**Estimated Time**: 2 hours

- [ ] **Task 1.8.1**: Install middleware dependencies
  ```bash
  npm install next-auth/middleware
  ```
  **Status**: ⬜ Not Started

- [ ] **Task 1.8.2**: Update middleware to protect user routes
  **File**: `/src/middleware.ts`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Keep existing admin protection logic
  - Add protection for user routes: /dashboard/*, /onboarding/*, /reports/*, /clients/*
  - Use `withAuth` from NextAuth
  - Redirect unauthenticated users to /login
  - Allow access to /signup, /login, /demo without auth

- [ ] **Task 1.8.3**: Test middleware protection
  **Testing**:
  - Try accessing /dashboard without login → should redirect to /login
  - Login → then access /dashboard → should work
  - Admin routes still protected independently
  **Status**: ⬜ Not Started

---

#### **Task Group 1.9: Session Hooks & Utilities**

**Estimated Time**: 2 hours

- [ ] **Task 1.9.1**: Create useSession hook wrapper
  **File**: `/src/hooks/useAuth.ts`
  **Status**: ⬜ Not Started
  **Purpose**: Wrapper around NextAuth's useSession with custom logic

- [ ] **Task 1.9.2**: Create server-side session helper
  **File**: `/src/backend/utils/auth.ts`
  **Status**: ⬜ Not Started
  **Functions**:
  - `getServerSession()` - Get session in server components/actions
  - `requireAuth()` - Throw error if not authenticated
  - `getCurrentUser()` - Get full user object from database

- [ ] **Task 1.9.3**: Test session utilities
  **Status**: ⬜ Not Started

---

#### **Task Group 1.10: Password Reset Flow**

**Estimated Time**: 4 hours

- [ ] **Task 1.10.1**: Create forgot password page
  **File**: `/src/app/(auth)/forgot-password/page.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Email input form
  - Submit → send reset email
  - Success message

- [ ] **Task 1.10.2**: Create reset password page
  **File**: `/src/app/(auth)/reset-password/page.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Accept token from URL query param
  - New password input (with confirmation)
  - Submit → update password in DB
  - Redirect to login after success

- [ ] **Task 1.10.3**: Add password reset server actions
  **File**: `/src/backend/server_actions/authActions.ts`
  **Functions**:
  - `requestPasswordReset(email)` - Generate token, send email
  - `resetPassword(token, newPassword)` - Validate token, update password
  **Status**: ⬜ Not Started

- [ ] **Task 1.10.4**: Setup email sending
  **File**: `/src/backend/utils/email.ts`
  **Status**: ⬜ Not Started
  **Options**: Use Resend, SendGrid, or Nodemailer with Gmail SMTP

- [ ] **Task 1.10.5**: Test password reset flow
  **Testing**:
  - Request reset → receive email
  - Click link → reset password
  - Login with new password
  **Status**: ⬜ Not Started

---

#### **Phase 1 Completion Checklist**

- [ ] All dependencies installed
- [ ] NextAuth.js configured and working
- [ ] User model created in MongoDB
- [ ] Signup page functional (email/password + OAuth)
- [ ] Login page functional
- [ ] Hero CTAs redirect to /signup
- [ ] Middleware protects user routes
- [ ] Password reset flow working
- [ ] All tests passing
- [ ] Documentation updated

**Phase 1 Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

### PHASE 2: ONBOARDING WIZARD

#### **Task Group 2.1: Onboarding Layout**

**Estimated Time**: 2 hours

- [ ] **Task 2.1.1**: Create onboarding layout
  **File**: `/src/app/(onboarding)/layout.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Progress indicator at top (Step 1/4, 2/4, etc.)
  - Centered card layout
  - Skip button (saves progress, redirects to dashboard)
  - Logout button

- [ ] **Task 2.1.2**: Create ProgressIndicator component
  **File**: `/src/components/onboarding/ProgressIndicator.tsx`
  **Status**: ⬜ Not Started

---

#### **Task Group 2.2: Welcome Step**

**Estimated Time**: 2 hours

- [ ] **Task 2.2.1**: Create welcome step page
  **File**: `/src/app/(onboarding)/onboarding/page.tsx`
  **Status**: ⬜ Not Started
  **Content**:
  - Welcome message with user's name
  - Overview of 3 steps ahead
  - "Get Started" button → next step
  - "Skip for now" button → dashboard

- [ ] **Task 2.2.2**: Create WelcomeStep component
  **File**: `/src/components/onboarding/WelcomeStep.tsx`
  **Status**: ⬜ Not Started

---

#### **Task Group 2.3: Platform Connection Step**

**Estimated Time**: 8 hours

- [ ] **Task 2.3.1**: Create platform connection page
  **File**: `/src/app/(onboarding)/onboarding/connect/page.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 2.3.2**: Create Platform model
  **File**: `/src/backend/models/platform.ts`
  **Status**: ⬜ Not Started
  **Fields**:
  - userId (ref to User)
  - platformType (google_analytics, google_ads, meta_ads, etc.)
  - accessToken (encrypted)
  - refreshToken (encrypted)
  - tokenExpiresAt
  - platformAccountId
  - status (active, expired, error)

- [ ] **Task 2.3.3**: Setup Google OAuth for Analytics
  **Status**: ⬜ Not Started
  **Steps**:
  - Create project in Google Cloud Console
  - Enable Google Analytics API
  - Create OAuth 2.0 credentials
  - Add authorized redirect URIs
  - Save client ID and secret to .env

- [ ] **Task 2.3.4**: Create OAuth callback handler
  **File**: `/src/app/api/oauth/google/callback/route.ts`
  **Status**: ⬜ Not Started
  **Purpose**: Handle OAuth redirect, exchange code for tokens, save to DB

- [ ] **Task 2.3.5**: Create platform connection server actions
  **File**: `/src/backend/server_actions/platformActions.ts`
  **Functions**:
  - `connectGoogleAnalytics()`
  - `disconnectPlatform(platformId)`
  - `getUserPlatforms()`
  **Status**: ⬜ Not Started

- [ ] **Task 2.3.6**: Create ConnectPlatformStep component
  **File**: `/src/components/onboarding/ConnectPlatformStep.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - List of platforms (Google Analytics, Google Ads, Meta, LinkedIn, TikTok)
  - For MVP: Only Google Analytics is functional
  - "Connect" button triggers OAuth flow
  - Show connected status
  - "Continue" button → next step
  - "Skip" button → dashboard

- [ ] **Task 2.3.7**: Test Google Analytics connection
  **Testing**:
  - Click "Connect Google Analytics"
  - Complete OAuth flow
  - Verify tokens saved in database
  - Verify connection status shows "Connected"
  **Status**: ⬜ Not Started

---

#### **Task Group 2.4: First Report Generation Step**

**Estimated Time**: 10 hours

- [ ] **Task 2.4.1**: Create first report page
  **File**: `/src/app/(onboarding)/onboarding/first-report/page.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 2.4.2**: Create Client model
  **File**: `/src/backend/models/client.ts`
  **Status**: ⬜ Not Started
  **Fields**:
  - userId
  - name
  - companyName
  - email
  - connectedPlatforms (array of Platform refs)
  - status (active, inactive)

- [ ] **Task 2.4.3**: Create Report model
  **File**: `/src/backend/models/report.ts`
  **Status**: ⬜ Not Started
  **Fields**:
  - userId
  - clientId
  - title
  - dateRange (startDate, endDate)
  - template (executive, detailed, social)
  - data (JSON - flexible structure)
  - insights (AI-generated text)
  - pdfUrl
  - status (draft, generated, sent)

- [ ] **Task 2.4.4**: Setup OpenAI for AI insights
  **Status**: ⬜ Not Started
  **Steps**:
  ```bash
  npm install openai
  ```
  - Add OPENAI_API_KEY to .env
  - Create AI utility functions

- [ ] **Task 2.4.5**: Create AI insights generator
  **File**: `/src/backend/utils/ai.ts`
  **Function**: `generateInsights(reportData)`
  **Status**: ⬜ Not Started
  **Purpose**: Call OpenAI API to generate human-readable insights

- [ ] **Task 2.4.6**: Setup PDF generation
  **Status**: ⬜ Not Started
  **Options**: jsPDF, PDFKit, or @pdfme/generator
  ```bash
  npm install jspdf
  ```

- [ ] **Task 2.4.7**: Create PDF generator
  **File**: `/src/backend/utils/pdf.ts`
  **Function**: `generateReportPDF(reportData, insights)`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Use neumorphic design
  - Include logo and branding
  - Charts and metrics
  - AI insights section
  - Professional formatting

- [ ] **Task 2.4.8**: Create report generation server actions
  **File**: `/src/backend/server_actions/reportActions.ts`
  **Functions**:
  - `createReport(data)` - Create draft report
  - `generateReport(reportId)` - Fetch data, run AI, generate PDF
  - `getReport(reportId)` - Get report details
  - `getUserReports()` - List all user's reports
  **Status**: ⬜ Not Started

- [ ] **Task 2.4.9**: Create FirstReportStep component
  **File**: `/src/components/onboarding/FirstReportStep.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - Form: Client name, date range, template selector
  - "Generate Report" button
  - Loading state (show AI processing animation)
  - Preview report after generation
  - Download PDF button
  - Email report button (optional)
  - "Continue" button → next step

- [ ] **Task 2.4.10**: Test report generation
  **Testing**:
  - Fill form and generate report
  - Verify data fetched from Google Analytics
  - Verify AI insights are relevant
  - Verify PDF downloads correctly
  - Check report saved in database
  **Status**: ⬜ Not Started

---

#### **Task Group 2.5: Branding Customization Step**

**Estimated Time**: 4 hours

- [ ] **Task 2.5.1**: Create branding step page
  **File**: `/src/app/(onboarding)/onboarding/branding/page.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 2.5.2**: Create logo upload handler
  **File**: `/src/app/api/upload/logo/route.ts`
  **Status**: ⬜ Not Started
  **Options**:
  - Store in /public/uploads/logos/
  - OR use Cloudinary/AWS S3
  - OR use Uploadthing (recommended for Next.js)

- [ ] **Task 2.5.3**: Setup file upload (Uploadthing)
  **Status**: ⬜ Not Started
  ```bash
  npm install uploadthing @uploadthing/react
  ```

- [ ] **Task 2.5.4**: Create branding update server actions
  **File**: `/src/backend/server_actions/userActions.ts`
  **Function**: `updateUserBranding(logo, primaryColor)`
  **Status**: ⬜ Not Started

- [ ] **Task 2.5.5**: Create BrandingStep component
  **File**: `/src/components/onboarding/BrandingStep.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - Logo upload with preview
  - Color picker for primary color
  - Live preview of report header with branding
  - "Save & Continue" button → dashboard
  - "Skip" button → dashboard with default branding

- [ ] **Task 2.5.6**: Update User model to save branding
  **Status**: ⬜ Not Started

- [ ] **Task 2.5.7**: Test branding customization
  **Testing**:
  - Upload logo
  - Change primary color
  - Preview updates in real-time
  - Save and verify in database
  - Generate new report with custom branding
  **Status**: ⬜ Not Started

---

#### **Task Group 2.6: Onboarding Completion**

**Estimated Time**: 2 hours

- [ ] **Task 2.6.1**: Mark onboarding as complete in User model
  **Function**: `completeOnboarding()`
  **Status**: ⬜ Not Started

- [ ] **Task 2.6.2**: Redirect to dashboard after last step
  **Status**: ⬜ Not Started

- [ ] **Task 2.6.3**: Handle "Skip" button in each step
  **Status**: ⬜ Not Started
  **Behavior**: Save current step, redirect to dashboard, allow resume later

- [ ] **Task 2.6.4**: Test complete onboarding flow
  **Testing**: Go through all 4 steps from start to finish
  **Status**: ⬜ Not Started

---

#### **Phase 2 Completion Checklist**

- [ ] Onboarding layout with progress indicator
- [ ] Welcome step functional
- [ ] Platform connection (Google Analytics) working
- [ ] First report generated successfully
- [ ] AI insights integrated
- [ ] PDF generation working
- [ ] Branding customization functional
- [ ] Onboarding completion tracked in DB
- [ ] Skip functionality working
- [ ] All tests passing

**Phase 2 Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

### PHASE 3: USER DASHBOARD

#### **Task Group 3.1: Dashboard Layout**

**Estimated Time**: 4 hours

- [ ] **Task 3.1.1**: Create user layout
  **File**: `/src/app/(user)/layout.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - Sidebar navigation
  - Top header with user menu
  - Main content area
  - Responsive (collapse sidebar on mobile)

- [ ] **Task 3.1.2**: Create Sidebar component
  **File**: `/src/components/dashboard/Sidebar.tsx`
  **Status**: ⬜ Not Started
  **Navigation Items**:
  - Dashboard (home icon)
  - Reports (file icon)
  - Clients (users icon)
  - Platforms (link icon)
  - Settings (gear icon)
  - Billing (credit card icon)
  - Logout

- [ ] **Task 3.1.3**: Create Header component
  **File**: `/src/components/dashboard/Header.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - User avatar dropdown
  - Notifications (future)
  - Quick actions

- [ ] **Task 3.1.4**: Test dashboard layout
  **Status**: ⬜ Not Started

---

#### **Task Group 3.2: Dashboard Home Page**

**Estimated Time**: 4 hours

- [ ] **Task 3.2.1**: Create dashboard home page
  **File**: `/src/app/(user)/dashboard/page.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.2.2**: Create StatsCards component
  **File**: `/src/components/dashboard/StatsCards.tsx`
  **Status**: ⬜ Not Started
  **Cards**:
  - Total Clients
  - Reports Generated (this month)
  - Trial Days Remaining (or subscription status)
  - Connected Platforms

- [ ] **Task 3.2.3**: Create RecentReports component
  **File**: `/src/components/dashboard/RecentReports.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - List last 5 reports
  - Quick actions: View, Download, Email

- [ ] **Task 3.2.4**: Create dashboard server actions
  **File**: `/src/backend/server_actions/dashboardActions.ts`
  **Functions**:
  - `getDashboardStats()` - Return counts for stats cards
  - `getRecentActivity()` - Get recent reports/clients
  **Status**: ⬜ Not Started

- [ ] **Task 3.2.5**: Test dashboard home page
  **Status**: ⬜ Not Started

---

#### **Task Group 3.3: Reports Section**

**Estimated Time**: 8 hours

- [ ] **Task 3.3.1**: Create reports list page
  **File**: `/src/app/(user)/reports/page.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - Data table with reports
  - Filters: Client, Date range, Status
  - Search by title
  - Sort by date (newest first)
  - Pagination (10 per page)
  - Actions: View, Download, Email, Delete

- [ ] **Task 3.3.2**: Create new report page
  **File**: `/src/app/(user)/reports/new/page.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.3.3**: Create report detail page
  **File**: `/src/app/(user)/reports/[id]/page.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - Show full report preview
  - Edit button
  - Download PDF
  - Email to client
  - Regenerate with new data

- [ ] **Task 3.3.4**: Create ReportBuilder component
  **File**: `/src/components/reports/ReportBuilder.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.3.5**: Create ReportPreview component
  **File**: `/src/components/reports/ReportPreview.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.3.6**: Test reports section
  **Status**: ⬜ Not Started

---

#### **Task Group 3.4: Clients Section**

**Estimated Time**: 6 hours

- [ ] **Task 3.4.1**: Create clients list page
  **File**: `/src/app/(user)/clients/page.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - Grid/list view toggle
  - Search by name
  - Sort options
  - "Add Client" button

- [ ] **Task 3.4.2**: Create client detail page
  **File**: `/src/app/(user)/clients/[id]/page.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - Client information
  - Connected platforms
  - Reports for this client
  - Edit/Delete buttons

- [ ] **Task 3.4.3**: Create client server actions
  **File**: `/src/backend/server_actions/clientActions.ts`
  **Functions**:
  - `createClient(data)`
  - `updateClient(id, data)`
  - `deleteClient(id)`
  - `getUserClients()`
  - `getClient(id)`
  **Status**: ⬜ Not Started

- [ ] **Task 3.4.4**: Create ClientForm component
  **File**: `/src/components/clients/ClientForm.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.4.5**: Test clients section
  **Status**: ⬜ Not Started

---

#### **Task Group 3.5: Platforms Section**

**Estimated Time**: 4 hours

- [ ] **Task 3.5.1**: Create platforms page
  **File**: `/src/app/(user)/platforms/page.tsx`
  **Status**: ⬜ Not Started
  **Features**:
  - List all connected platforms
  - Connection status (active, expired, error)
  - Last synced timestamp
  - Reconnect button (if expired)
  - Disconnect button
  - Add new platform button

- [ ] **Task 3.5.2**: Create PlatformCard component
  **File**: `/src/components/platforms/PlatformCard.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.5.3**: Add platform management actions
  **File**: `/src/backend/server_actions/platformActions.ts` (extend)
  **Functions**:
  - `refreshPlatformToken(platformId)`
  - `syncPlatformData(platformId)`
  **Status**: ⬜ Not Started

- [ ] **Task 3.5.4**: Test platforms section
  **Status**: ⬜ Not Started

---

#### **Task Group 3.6: Settings Section**

**Estimated Time**: 6 hours

- [ ] **Task 3.6.1**: Create settings page
  **File**: `/src/app/(user)/settings/page.tsx`
  **Status**: ⬜ Not Started
  **Tabs**:
  - Profile
  - Password
  - Branding
  - Notifications (future)

- [ ] **Task 3.6.2**: Create ProfileForm component
  **File**: `/src/components/settings/ProfileForm.tsx`
  **Status**: ⬜ Not Started
  **Fields**:
  - Full Name
  - Email (read-only)
  - Company Name
  - Role (freelancer, agency, in-house)

- [ ] **Task 3.6.3**: Create PasswordForm component
  **File**: `/src/components/settings/PasswordForm.tsx`
  **Status**: ⬜ Not Started
  **Fields**:
  - Current Password
  - New Password
  - Confirm New Password

- [ ] **Task 3.6.4**: Create BrandingForm component
  **File**: `/src/components/settings/BrandingForm.tsx`
  **Status**: ⬜ Not Started
  **Fields**:
  - Logo upload
  - Primary color picker
  - Preview

- [ ] **Task 3.6.5**: Create user settings server actions
  **File**: `/src/backend/server_actions/userActions.ts` (extend)
  **Functions**:
  - `updateProfile(data)`
  - `changePassword(currentPassword, newPassword)`
  - `updateBranding(logo, color)`
  **Status**: ⬜ Not Started

- [ ] **Task 3.6.6**: Test settings section
  **Status**: ⬜ Not Started

---

#### **Task Group 3.7: Billing Section**

**Estimated Time**: 8 hours

- [ ] **Task 3.7.1**: Create billing page
  **File**: `/src/app/(user)/billing/page.tsx`
  **Status**: ⬜ Not Started
  **Sections**:
  - Current plan card
  - Usage stats
  - Plan comparison
  - Payment method
  - Billing history

- [ ] **Task 3.7.2**: Setup Stripe
  **Status**: ⬜ Not Started
  ```bash
  npm install stripe @stripe/stripe-js
  ```
  - Create Stripe account
  - Add STRIPE_SECRET_KEY to .env
  - Add STRIPE_PUBLISHABLE_KEY to .env
  - Create products and prices in Stripe dashboard

- [ ] **Task 3.7.3**: Create Stripe checkout API route
  **File**: `/src/app/api/stripe/checkout/route.ts`
  **Status**: ⬜ Not Started
  **Purpose**: Create checkout session for plan upgrades

- [ ] **Task 3.7.4**: Create Stripe webhook handler
  **File**: `/src/app/api/stripe/webhook/route.ts`
  **Status**: ⬜ Not Started
  **Events to handle**:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`

- [ ] **Task 3.7.5**: Create SubscriptionCard component
  **File**: `/src/components/billing/SubscriptionCard.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.7.6**: Create PlanComparison component
  **File**: `/src/components/billing/PlanComparison.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 3.7.7**: Create billing server actions
  **File**: `/src/backend/server_actions/billingActions.ts`
  **Functions**:
  - `createCheckoutSession(plan)`
  - `cancelSubscription()`
  - `getBillingHistory()`
  **Status**: ⬜ Not Started

- [ ] **Task 3.7.8**: Test billing section
  **Testing**: Use Stripe test mode
  **Status**: ⬜ Not Started

---

#### **Phase 3 Completion Checklist**

- [ ] Dashboard layout complete
- [ ] Dashboard home page with stats
- [ ] Reports section functional
- [ ] Clients management working
- [ ] Platforms section operational
- [ ] Settings page complete
- [ ] Billing integration with Stripe
- [ ] All CRUD operations tested
- [ ] Mobile responsive

**Phase 3 Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

### PHASE 4: DEMO & POLISH

#### **Task Group 4.1: Demo Page**

**Estimated Time**: 6 hours

- [ ] **Task 4.1.1**: Create demo page
  **File**: `/src/app/demo/page.tsx`
  **Status**: ⬜ Not Started
  **Requirements**:
  - No authentication required
  - Pre-populated sample data
  - Working report builder
  - Limited to 1 sample report generation
  - Watermarked "SAMPLE REPORT"

- [ ] **Task 4.1.2**: Create sample data generator
  **File**: `/src/lib/sampleData.ts`
  **Status**: ⬜ Not Started
  **Purpose**: Generate realistic sample analytics data

- [ ] **Task 4.1.3**: Create DemoReportBuilder component
  **File**: `/src/components/demo/DemoReportBuilder.tsx`
  **Status**: ⬜ Not Started

- [ ] **Task 4.1.4**: Add CTA after demo
  **Status**: ⬜ Not Started
  **Message**: "Create your own reports - Start Free Trial"

- [ ] **Task 4.1.5**: Test demo experience
  **Status**: ⬜ Not Started

---

#### **Task Group 4.2: Polish & Improvements**

**Estimated Time**: 6 hours

- [ ] **Task 4.2.1**: Add loading states everywhere
  **Status**: ⬜ Not Started
  **Components**: All forms, data fetching, report generation

- [ ] **Task 4.2.2**: Improve error messages
  **Status**: ⬜ Not Started
  **Standard**: User-friendly, actionable error messages

- [ ] **Task 4.2.3**: Add success notifications
  **Status**: ⬜ Not Started
  **Options**: Use sonner or react-hot-toast

- [ ] **Task 4.2.4**: Mobile responsiveness review
  **Status**: ⬜ Not Started
  **Test**: All pages on mobile devices

- [ ] **Task 4.2.5**: Cross-browser testing
  **Status**: ⬜ Not Started
  **Browsers**: Chrome, Firefox, Safari, Edge

- [ ] **Task 4.2.6**: Performance optimization
  **Status**: ⬜ Not Started
  **Tasks**:
  - Image optimization
  - Code splitting
  - Lazy loading
  - API response caching

---

#### **Task Group 4.3: Bug Fixes**

**Estimated Time**: 4 hours

- [ ] **Task 4.3.1**: Fix critical bugs
  **Status**: ⬜ Not Started

- [ ] **Task 4.3.2**: Fix UI/UX issues
  **Status**: ⬜ Not Started

- [ ] **Task 4.3.3**: Fix mobile-specific issues
  **Status**: ⬜ Not Started

---

#### **Task Group 4.4: Final Testing**

**Estimated Time**: 4 hours

- [ ] **Task 4.4.1**: End-to-end user journey testing
  **Flow**: Homepage → Signup → Onboarding → Dashboard → Generate Report
  **Status**: ⬜ Not Started

- [ ] **Task 4.4.2**: Edge case testing
  **Status**: ⬜ Not Started
  **Cases**:
  - Network failures
  - Invalid inputs
  - Session expiry
  - Concurrent requests

- [ ] **Task 4.4.3**: Security review
  **Status**: ⬜ Not Started
  **Check**:
  - No exposed secrets
  - Proper input validation
  - SQL injection prevention (MongoDB)
  - XSS prevention
  - CSRF protection

---

#### **Phase 4 Completion Checklist**

- [ ] Demo page functional
- [ ] Loading states added
- [ ] Error handling improved
- [ ] Success notifications working
- [ ] Mobile responsive verified
- [ ] Cross-browser tested
- [ ] All critical bugs fixed
- [ ] End-to-end testing complete
- [ ] Security review passed
- [ ] Ready for beta launch

**Phase 4 Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

## Folder Structure

### Complete File Structure for User Onboarding

```
src/
├── app/
│   ├── (auth)/                            # Auth routes group
│   │   ├── layout.tsx                    # ⬜ Minimal layout (no navbar)
│   │   ├── signup/
│   │   │   └── page.tsx                  # ⬜ Signup page
│   │   ├── login/
│   │   │   └── page.tsx                  # ⬜ Login page
│   │   ├── forgot-password/
│   │   │   └── page.tsx                  # ⬜ Forgot password
│   │   └── reset-password/
│   │       └── page.tsx                  # ⬜ Reset password
│   │
│   ├── (onboarding)/                      # Onboarding routes group
│   │   ├── layout.tsx                    # ⬜ Onboarding layout with progress
│   │   └── onboarding/
│   │       ├── page.tsx                  # ⬜ Step 1: Welcome
│   │       ├── connect/
│   │       │   └── page.tsx              # ⬜ Step 2: Connect platform
│   │       ├── first-report/
│   │       │   └── page.tsx              # ⬜ Step 3: Generate report
│   │       └── branding/
│   │           └── page.tsx              # ⬜ Step 4: Branding
│   │
│   ├── (user)/                            # User dashboard routes
│   │   ├── layout.tsx                    # ⬜ Dashboard layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # ⬜ Dashboard home
│   │   ├── reports/
│   │   │   ├── page.tsx                  # ⬜ Reports list
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # ⬜ Create new report
│   │   │   └── [id]/
│   │   │       └── page.tsx              # ⬜ Report detail
│   │   ├── clients/
│   │   │   ├── page.tsx                  # ⬜ Clients list
│   │   │   └── [id]/
│   │   │       └── page.tsx              # ⬜ Client detail
│   │   ├── platforms/
│   │   │   └── page.tsx                  # ⬜ Connected platforms
│   │   ├── settings/
│   │   │   └── page.tsx                  # ⬜ User settings
│   │   └── billing/
│   │       └── page.tsx                  # ⬜ Subscription & billing
│   │
│   ├── demo/
│   │   └── page.tsx                      # ⬜ Interactive demo
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts              # ⬜ NextAuth API route
│   │   ├── oauth/
│   │   │   └── google/
│   │   │       └── callback/
│   │   │           └── route.ts          # ⬜ Google OAuth callback
│   │   ├── stripe/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts              # ⬜ Stripe checkout session
│   │   │   └── webhook/
│   │   │       └── route.ts              # ⬜ Stripe webhook handler
│   │   └── upload/
│   │       └── logo/
│   │           └── route.ts              # ⬜ Logo upload handler
│   │
│   └── page.tsx                           # ✅ Homepage (existing)
│
├── backend/
│   ├── config/
│   │   ├── database.ts                   # ✅ Existing MongoDB connection
│   │   └── mongodb-adapter.ts            # ⬜ NEW: MongoDB adapter for NextAuth
│   │
│   ├── models/
│   │   ├── user.ts                       # ⬜ NEW: User model
│   │   ├── platform.ts                   # ⬜ NEW: Connected platforms
│   │   ├── client.ts                     # ⬜ NEW: Client model
│   │   ├── report.ts                     # ⬜ NEW: Report model
│   │   └── contactus.ts                  # ✅ Existing
│   │
│   ├── server_actions/
│   │   ├── authActions.ts                # ⬜ NEW: User auth (signup)
│   │   ├── userActions.ts                # ⬜ NEW: User profile management
│   │   ├── platformActions.ts            # ⬜ NEW: Platform connections
│   │   ├── clientActions.ts              # ⬜ NEW: Client CRUD
│   │   ├── reportActions.ts              # ⬜ NEW: Report generation
│   │   ├── dashboardActions.ts           # ⬜ NEW: Dashboard stats
│   │   ├── billingActions.ts             # ⬜ NEW: Billing/subscription
│   │   ├── adminActions.ts               # ✅ Existing
│   │   └── guestActions.ts               # ✅ Existing
│   │
│   └── utils/
│       ├── auth.ts                       # ⬜ NEW: NextAuth helpers
│       ├── email.ts                      # ⬜ NEW: Email sending
│       ├── pdf.ts                        # ⬜ NEW: PDF generation
│       ├── ai.ts                         # ⬜ NEW: OpenAI integration
│       └── session.ts                    # ✅ Existing (admin JWT)
│
├── components/
│   ├── auth/
│   │   ├── SignupForm.tsx                # ⬜ NEW
│   │   ├── LoginForm.tsx                 # ⬜ NEW
│   │   ├── OAuthButtons.tsx              # ⬜ NEW
│   │   ├── ResetPasswordForm.tsx         # ⬜ NEW
│   │   └── ForgotPasswordForm.tsx        # ⬜ NEW
│   │
│   ├── onboarding/
│   │   ├── ProgressIndicator.tsx         # ⬜ NEW
│   │   ├── WelcomeStep.tsx               # ⬜ NEW
│   │   ├── ConnectPlatformStep.tsx       # ⬜ NEW
│   │   ├── FirstReportStep.tsx           # ⬜ NEW
│   │   └── BrandingStep.tsx              # ⬜ NEW
│   │
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx           # ⬜ NEW
│   │   ├── Sidebar.tsx                   # ⬜ NEW
│   │   ├── Header.tsx                    # ⬜ NEW
│   │   ├── StatsCards.tsx                # ⬜ NEW
│   │   └── RecentReports.tsx             # ⬜ NEW
│   │
│   ├── reports/
│   │   ├── ReportList.tsx                # ⬜ NEW
│   │   ├── ReportBuilder.tsx             # ⬜ NEW
│   │   ├── ReportPreview.tsx             # ⬜ NEW
│   │   └── ReportCard.tsx                # ⬜ NEW
│   │
│   ├── clients/
│   │   ├── ClientList.tsx                # ⬜ NEW
│   │   ├── ClientForm.tsx                # ⬜ NEW
│   │   └── ClientCard.tsx                # ⬜ NEW
│   │
│   ├── platforms/
│   │   ├── PlatformCard.tsx              # ⬜ NEW
│   │   └── ConnectPlatformModal.tsx      # ⬜ NEW
│   │
│   ├── settings/
│   │   ├── ProfileForm.tsx               # ⬜ NEW
│   │   ├── PasswordForm.tsx              # ⬜ NEW
│   │   └── BrandingForm.tsx              # ⬜ NEW
│   │
│   ├── billing/
│   │   ├── SubscriptionCard.tsx          # ⬜ NEW
│   │   ├── PlanComparison.tsx            # ⬜ NEW
│   │   └── PaymentMethod.tsx             # ⬜ NEW
│   │
│   ├── demo/
│   │   └── DemoReportBuilder.tsx         # ⬜ NEW
│   │
│   └── features/                         # ✅ Existing components
│       ├── hero-section-skeuomorphic.tsx # ✏️ UPDATE: Add onClick handlers
│       └── final-cta.tsx                 # ✏️ UPDATE: Add onClick handlers
│
├── hooks/
│   └── useAuth.ts                        # ⬜ NEW: NextAuth session hook wrapper
│
├── lib/
│   └── sampleData.ts                     # ⬜ NEW: Sample data for demo
│
├── types/
│   └── next-auth.d.ts                    # ⬜ NEW: NextAuth type declarations
│
└── middleware.ts                         # ✏️ EXTEND: Add user route protection

.env.local (ADD):
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**Legend:**
- ✅ Already exists
- ⬜ Need to create
- ✏️ Need to modify

---

## Database Models

### User Model Schema

```typescript
{
  // NextAuth fields
  _id: ObjectId,
  name: String,
  email: String (unique),
  emailVerified: Date | null,
  image: String | null,

  // Custom fields
  password: String (hashed, optional for OAuth),
  fullName: String,
  companyName: String,
  role: Enum ['freelancer', 'agency', 'in-house', 'other'],

  // Subscription
  subscriptionPlan: Enum ['starter', 'professional', 'agency', 'enterprise'],
  subscriptionStatus: Enum ['trial', 'active', 'cancelled', 'expired'],
  trialEndsAt: Date,
  stripeCustomerId: String,
  stripeSubscriptionId: String,

  // Onboarding
  onboardingCompleted: Boolean,
  onboardingStep: Number (0-4),

  // Branding
  logo: String (URL),
  primaryColor: String,

  // Metadata
  reportsGenerated: Number,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Platform Model Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  platformType: Enum ['google_analytics', 'google_ads', 'meta_ads', 'linkedin_ads', 'tiktok_ads'],
  platformName: String,

  // OAuth tokens (encrypted)
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,

  // Platform-specific
  platformAccountId: String,

  // Status
  status: Enum ['active', 'expired', 'error'],
  lastSyncedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

### Client Model Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  companyName: String,
  email: String,
  connectedPlatforms: [ObjectId] (ref: Platform),
  defaultReportTemplate: Enum ['executive', 'detailed', 'social'],
  status: Enum ['active', 'inactive'],
  createdAt: Date,
  updatedAt: Date
}
```

### Report Model Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  clientId: ObjectId (ref: Client),
  title: String,

  // Date range
  dateRange: {
    startDate: Date,
    endDate: Date
  },

  // Template
  template: Enum ['executive', 'detailed', 'social'],

  // Data (flexible JSON)
  data: Mixed,

  // AI insights
  insights: String,

  // PDF
  pdfUrl: String,

  // Status
  status: Enum ['draft', 'generated', 'sent'],

  createdAt: Date,
  updatedAt: Date
}
```

---

## Dependencies

### Required npm Packages

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.20",
    "@auth/mongodb-adapter": "^3.4.2",
    "bcryptjs": "^2.4.3",
    "mongodb": "^6.9.0",
    "openai": "^4.63.0",
    "stripe": "^16.12.0",
    "@stripe/stripe-js": "^4.7.0",
    "jspdf": "^2.5.2",
    "uploadthing": "^7.0.2",
    "@uploadthing/react": "^7.0.2",
    "sonner": "^1.5.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### Installation Command

```bash
npm install next-auth@beta @auth/mongodb-adapter bcryptjs mongodb openai stripe @stripe/stripe-js jspdf uploadthing @uploadthing/react sonner zod

npm install -D @types/bcryptjs
```

---

## Testing Checklist

### Phase 1: Authentication

- [ ] User can sign up with email/password
- [ ] User can sign up with Google OAuth
- [ ] User can sign up with GitHub OAuth
- [ ] Duplicate email shows error
- [ ] Weak password shows error
- [ ] User can log in with correct credentials
- [ ] Wrong password shows error
- [ ] User not found shows error
- [ ] Session persists after page refresh
- [ ] User can log out
- [ ] Middleware protects /dashboard routes
- [ ] Middleware allows /signup, /login without auth
- [ ] Admin routes still protected separately
- [ ] Password reset email received
- [ ] Password reset link works
- [ ] Hero CTAs redirect to /signup
- [ ] Final CTA buttons redirect to /signup

### Phase 2: Onboarding

- [ ] User redirected to /onboarding after signup
- [ ] Progress indicator shows correct step
- [ ] Welcome step displays user name
- [ ] "Get Started" button advances to next step
- [ ] "Skip" button goes to dashboard
- [ ] Platform connection shows available platforms
- [ ] Google Analytics OAuth flow completes
- [ ] Platform connection saved in database
- [ ] First report form validation works
- [ ] Report generation fetches real data
- [ ] AI insights generated correctly
- [ ] PDF downloads successfully
- [ ] Branding step allows logo upload
- [ ] Color picker updates preview
- [ ] Branding saved to user profile
- [ ] Onboarding completion updates user.onboardingCompleted
- [ ] User redirected to dashboard after completion

### Phase 3: Dashboard

- [ ] Dashboard layout renders correctly
- [ ] Sidebar navigation works
- [ ] Stats cards show correct counts
- [ ] Recent reports display
- [ ] Reports list page loads
- [ ] Filter and search work on reports
- [ ] New report creation works
- [ ] Report detail page shows correct data
- [ ] Client list page loads
- [ ] Add new client form works
- [ ] Edit client works
- [ ] Delete client works
- [ ] Platforms page shows all connections
- [ ] Reconnect expired platform works
- [ ] Settings page loads all tabs
- [ ] Profile update works
- [ ] Password change works
- [ ] Branding update works
- [ ] Billing page shows subscription
- [ ] Stripe checkout works (test mode)
- [ ] Upgrade plan works
- [ ] Cancel subscription works

### Phase 4: Demo & Polish

- [ ] Demo page accessible without login
- [ ] Sample report generates correctly
- [ ] Demo report has watermark
- [ ] CTA after demo redirects to signup
- [ ] All loading states display
- [ ] All error messages user-friendly
- [ ] Success notifications appear
- [ ] Mobile layout responsive
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] No console errors
- [ ] No exposed secrets in client code

---

## Future Enhancements

### Post-MVP Features (Priority Order)

1. **Email Notifications** (P1)
   - Welcome email after signup
   - Report generated notification
   - Trial expiring reminder
   - Subscription renewal reminder

2. **CSV Export** (P1)
   - Export client list
   - Export report list
   - Export usage analytics

3. **More OAuth Providers** (P1)
   - Microsoft OAuth
   - LinkedIn OAuth
   - Facebook OAuth

4. **Additional Platforms** (P2)
   - Google Ads integration
   - Meta Ads integration
   - LinkedIn Ads integration
   - TikTok Ads integration
   - Twitter (X) integration

5. **Advanced Reporting** (P2)
   - Custom report templates
   - Schedule automated reports
   - Email reports to clients automatically
   - White-label custom domain

6. **Team Features** (P2)
   - Multi-user accounts
   - Role-based permissions
   - Team member invitations
   - Activity audit log

7. **Analytics** (P2)
   - User behavior tracking
   - Conversion funnel analysis
   - Feature usage metrics
   - A/B testing framework

8. **API Access** (P3)
   - REST API for integrations
   - API key management
   - Webhook endpoints
   - Developer documentation

---

## Related Documentation

- [Main README](./README.md) - Project overview
- [Admin Panel Documentation](./ADMIN-PANEL.md) - Admin system architecture
- [Fullstack Agent Guide](./agents/FULLSTACK-AGENT.md) - Backend patterns
- [Design System](./design-system/NEUMORPHIC_DESIGN_SYSTEM.md) - UI standards
- [SEO Strategy](./seo/01-IMPLEMENTATION-PLAN.md) - SEO implementation

---

## Notes & Decisions

### Why NextAuth.js?

NextAuth.js is chosen over custom JWT (used in admin) because:
1. **Scalability**: Easier to add OAuth providers
2. **Security**: Battle-tested, handles edge cases
3. **Type Safety**: Full TypeScript support
4. **Session Management**: Built-in database sessions or JWT
5. **Community**: Large ecosystem, frequent updates
6. **Future-Proof**: Can scale to enterprise auth needs

### Admin vs User Auth Separation

- **Admin**: Simple JWT password auth (keeps existing system)
- **Users**: NextAuth.js with OAuth support (new system)
- **Reason**: Different use cases, different requirements
- **Cookies**: `admin-session` vs `next-auth.session-token`

### Trial Strategy

- 14 days free trial (no credit card required)
- After trial: Prompt to upgrade
- Grace period: 3 days after trial expires
- Then: Downgrade to read-only mode (can't generate new reports)

---

**Last Updated**: November 4, 2025
**Next Update**: After Phase 1 completion
