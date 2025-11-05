# Phase 1: Routes & Page Structure Planning

> **Created**: November 5, 2025
> **Status**: In Progress
> **Purpose**: Complete planning before any code is written

---

## Table of Contents

1. [Route Structure Definition](#route-structure-definition)
2. [User Flow Mapping](#user-flow-mapping)
3. [Page Specifications](#page-specifications)
4. [Component Architecture](#component-architecture)
5. [TypeScript Interfaces](#typescript-interfaces)

---

## Route Structure Definition

### All User-Facing Routes

```
📁 OneReport Routes
│
├── 🏠 Public Routes (No Auth Required)
│   ├── /                          - Homepage (existing, complete)
│   ├── /signup                    - User registration page
│   ├── /login                     - User login page
│   └── /demo                      - Interactive demo (View Live Demo CTA)
│
├── 🔐 Protected Routes (Auth Required, Onboarding Not Complete)
│   └── /onboarding                - 4-step onboarding wizard
│
├── 🎯 Protected Routes (Auth Required, Onboarding Complete)
│   ├── /dashboard                 - Main dashboard (default landing)
│   ├── /dashboard/reports         - Reports list and management
│   ├── /dashboard/clients         - Clients management
│   ├── /dashboard/settings        - User account settings
│   └── /dashboard/billing         - Subscription and billing
│
└── 🔒 Admin Routes (Separate Auth)
    └── /admin/*                   - Admin panel (already complete)
```

### Route Purposes

| Route | Purpose | User State Required | Redirect If |
|-------|---------|---------------------|-------------|
| `/signup` | Create new account | Not logged in | If logged in → `/dashboard` |
| `/login` | Login to account | Not logged in | If logged in → `/dashboard` |
| `/onboarding` | Complete setup wizard | Logged in, onboarding incomplete | If complete → `/dashboard` |
| `/dashboard` | Main user hub | Logged in, onboarding complete | If incomplete → `/onboarding` |
| `/dashboard/reports` | Manage reports | Logged in, onboarding complete | If incomplete → `/onboarding` |
| `/dashboard/clients` | Manage clients | Logged in, onboarding complete | If incomplete → `/onboarding` |
| `/dashboard/settings` | Account settings | Logged in, onboarding complete | If incomplete → `/onboarding` |
| `/dashboard/billing` | Manage subscription | Logged in, onboarding complete | If incomplete → `/onboarding` |
| `/demo` | Interactive demo | Anyone | None |

---

## User Flow Mapping

### Primary User Journey (New User Signup)

```
┌──────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                          │
│  User sees: Hero, features, pricing, CTA buttons            │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
                    USER CLICKS:
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
"Start Free Trial"                "View Live Demo"
        │                                   │
        ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│  /signup        │                 │  /demo          │
│                 │                 │                 │
│  Fill form OR   │                 │  Interactive    │
│  OAuth signup   │                 │  mock report    │
└─────────────────┘                 └─────────────────┘
        │                                   │
        ▼                                   │
 Account created                            │
        │                                   │
        ▼                                   ▼
┌─────────────────┐                 Returns to /
│  /onboarding    │                 or clicks "Start Free Trial"
│                 │
│  Step 1: Welcome
│  Step 2: Connect Platform (Google Analytics)
│  Step 3: Branding Customization
│  Step 4: First Report Preview
└─────────────────┘
        │
        ▼
Onboarding Complete
        │
        ▼
┌─────────────────┐
│  /dashboard     │
│                 │
│  Main hub with  │
│  reports, stats │
└─────────────────┘
        │
        ├──→ /dashboard/reports (create/view reports)
        ├──→ /dashboard/clients (manage clients)
        ├──→ /dashboard/settings (account settings)
        └──→ /dashboard/billing (manage subscription)
```

### Returning User Journey

```
User visits /
    │
    ▼
Clicks "Login" (in navbar or footer)
    │
    ▼
/login page
    │
    ▼
Enters credentials OR OAuth
    │
    ├──→ If onboarding incomplete → /onboarding
    │
    └──→ If onboarding complete → /dashboard
```

### Demo Journey (Non-Signup)

```
User visits /
    │
    ▼
Clicks "View Live Demo"
    │
    ▼
/demo page
    │
    ├──→ Explore interactive demo
    ├──→ See mock report
    └──→ CTA to "Start Free Trial" → /signup
```

---

## Page Specifications

### Page 1: `/signup`

**What User Sees:**
- Centered signup form on dark background (#1a1a1a)
- OneReport logo at top
- Form with 3 fields: Name, Email, Password
- "Sign Up" button (neumorphic design)
- Divider: "or continue with"
- 2 OAuth buttons: Google, GitHub (neumorphic)
- Link: "Already have an account? Log in"

**Actions User Can Take:**
1. Fill out signup form (name, email, password)
2. Click "Sign Up" button
3. Click "Continue with Google" (OAuth)
4. Click "Continue with GitHub" (OAuth)
5. Click "Log in" link → navigate to `/login`

**Success Outcome:**
- User account created
- Redirect to `/onboarding`

**Data Needed (Mock for Phase 2):**
```typescript
// Form inputs
{
  name: string,      // e.g., "John Doe"
  email: string,     // e.g., "john@example.com"
  password: string   // e.g., "********"
}

// Validation errors (if any)
{
  name?: string,     // e.g., "Name is required"
  email?: string,    // e.g., "Invalid email"
  password?: string  // e.g., "Password must be 8+ characters"
}

// Form state
{
  isLoading: boolean,
  submitStatus: 'idle' | 'success' | 'error'
}
```

**Validation Rules:**
- Name: Required, min 2 characters
- Email: Required, valid email format
- Password: Required, min 8 characters

---

### Page 2: `/login`

**What User Sees:**
- Centered login form on dark background
- OneReport logo at top
- Form with 2 fields: Email, Password
- "Log In" button (neumorphic design)
- Link: "Forgot password?"
- Divider: "or continue with"
- 2 OAuth buttons: Google, GitHub
- Link: "Don't have an account? Sign up"

**Actions User Can Take:**
1. Fill out login form (email, password)
2. Click "Log In" button
3. Click "Forgot password?" → navigate to `/forgot-password`
4. Click OAuth buttons
5. Click "Sign up" link → navigate to `/signup`

**Success Outcome:**
- User authenticated
- Redirect to `/dashboard` (if onboarding complete)
- OR redirect to `/onboarding` (if onboarding incomplete)

**Data Needed (Mock for Phase 2):**
```typescript
// Form inputs
{
  email: string,
  password: string
}

// Errors
{
  email?: string,
  password?: string,
  general?: string  // e.g., "Invalid credentials"
}

// State
{
  isLoading: boolean
}
```

---

### Page 3: `/onboarding`

**What User Sees:**
- Full-screen onboarding wizard
- Progress indicator at top (Step 1 of 4, Step 2 of 4, etc.)
- Different content per step
- "Next" / "Back" buttons
- "Skip" option (except last step)

**4 Steps:**

#### Step 1: Welcome
- Welcome message: "Welcome to OneReport, [Name]!"
- Brief explanation of what's next
- Visual graphic/illustration
- "Get Started" button

#### Step 2: Connect Platform
- Heading: "Connect Your Analytics"
- Explanation: "Connect Google Analytics to start generating reports"
- Google Analytics connect button (OAuth)
- Form to enter property ID (optional for mock)
- "Skip for now" link

#### Step 3: Branding Customization
- Heading: "Customize Your Reports"
- Logo upload area (drag & drop or click)
- Color picker for primary color (default: #6CA3A2 teal)
- Color picker for secondary color (default: #FF8C42 orange)
- Preview of branded report
- "Skip for now" link

#### Step 4: First Report Preview
- Heading: "Your First Report is Ready!"
- Mock report preview (shows what their reports will look like)
- "View Full Report" button (shows modal with mock PDF)
- "Go to Dashboard" button (final step)

**Actions User Can Take:**
- Navigate: Next, Back, Skip
- Step 2: Connect Google Analytics (OAuth flow)
- Step 3: Upload logo, pick colors
- Step 4: Preview report, go to dashboard

**Success Outcome:**
- Onboarding marked as complete
- User data saved (platform connection, branding)
- Redirect to `/dashboard`

**Data Needed (Mock for Phase 2):**
```typescript
{
  currentStep: number,              // 1-4
  totalSteps: number,               // 4
  user: {
    name: string,                   // "John Doe"
    email: string                   // "john@example.com"
  },
  platformConnected: boolean,       // false initially
  branding: {
    logo: string | null,            // null or data URL
    primaryColor: string,           // "#6CA3A2"
    secondaryColor: string          // "#FF8C42"
  },
  mockReport: {
    clientName: string,             // "Demo Client"
    dateRange: string,              // "Oct 1-31, 2024"
    metrics: {
      sessions: number,             // 12,543
      users: number,                // 8,921
      pageViews: number,            // 45,678
      bounceRate: string            // "42.3%"
    }
  }
}
```

---

### Page 4: `/dashboard`

**What User Sees:**
- Left sidebar with navigation
- Top header with user info, notifications, logout
- Main content area with:
  - Welcome message: "Welcome back, [Name]!"
  - Stats cards (4 cards):
    - Total Reports (e.g., "12")
    - Active Clients (e.g., "5")
    - Reports This Month (e.g., "8")
    - Subscription Status (e.g., "14 days left in trial")
  - Recent reports table (5 most recent)
  - Quick actions: "Create New Report", "Add Client"

**Actions User Can Take:**
1. Navigate via sidebar (Reports, Clients, Settings, Billing)
2. Click "Create New Report" → modal or navigate to `/dashboard/reports/new`
3. Click "Add Client" → modal or navigate to `/dashboard/clients/new`
4. Click on a report in table → navigate to report detail
5. Logout

**Data Needed (Mock for Phase 2):**
```typescript
{
  user: {
    name: string,                    // "John Doe"
    email: string,
    logo: string | null,
    subscription: {
      plan: string,                  // "free"
      status: string,                // "trialing"
      trialDaysLeft: number          // 14
    }
  },
  stats: {
    totalReports: number,            // 12
    activeClients: number,           // 5
    reportsThisMonth: number         // 8
  },
  recentReports: Array<{
    id: string,
    clientName: string,              // "Acme Corp"
    dateRange: string,               // "Oct 1-31"
    createdAt: string,               // "2 days ago"
    status: 'draft' | 'completed'
  }>
}
```

---

### Page 5: `/dashboard/reports`

**What User Sees:**
- Sidebar + header (same as dashboard)
- Page heading: "Reports"
- Filter/search bar
- Table with all reports (paginated)
- "Create New Report" button (top right)

**Table Columns:**
- Client Name
- Date Range
- Created Date
- Status (Draft/Completed)
- Actions (View, Download, Delete)

**Actions User Can Take:**
1. Search/filter reports
2. Click "Create New Report" → modal or new page
3. Click "View" → open report detail
4. Click "Download" → download PDF
5. Click "Delete" → confirm modal, then delete

**Data Needed (Mock for Phase 2):**
```typescript
{
  reports: Array<{
    id: string,
    clientName: string,
    dateRange: string,
    createdAt: string,
    status: 'draft' | 'completed',
    downloadUrl: string | null
  }>,
  pagination: {
    page: number,
    totalPages: number,
    totalReports: number
  },
  filters: {
    search: string,
    status: 'all' | 'draft' | 'completed'
  }
}
```

---

### Page 6: `/dashboard/clients`

**What User Sees:**
- Sidebar + header
- Page heading: "Clients"
- Search bar
- Table/grid of clients
- "Add Client" button

**Table/Card Columns:**
- Client Name
- Industry (optional)
- Reports Count
- Last Report Date
- Actions (Edit, Delete)

**Actions User Can Take:**
1. Search clients
2. Click "Add Client" → modal with form
3. Click client → navigate to client detail
4. Edit client info
5. Delete client

**Data Needed (Mock for Phase 2):**
```typescript
{
  clients: Array<{
    id: string,
    name: string,                // "Acme Corp"
    industry: string | null,     // "E-commerce"
    reportsCount: number,        // 3
    lastReportDate: string | null, // "2024-11-01"
    logo: string | null
  }>,
  totalClients: number
}
```

---

### Page 7: `/dashboard/settings`

**What User Sees:**
- Sidebar + header
- Page heading: "Settings"
- Tabs: Profile, Branding, Security, Notifications
- Form fields based on active tab

**Profile Tab:**
- Name (editable)
- Email (editable)
- "Save Changes" button

**Branding Tab:**
- Logo upload
- Primary color picker
- Secondary color picker
- Preview of branded report
- "Save Changes" button

**Security Tab:**
- Current password
- New password
- Confirm new password
- "Change Password" button

**Notifications Tab:**
- Toggle switches for email preferences
- "Save Preferences" button

**Data Needed (Mock for Phase 2):**
```typescript
{
  user: {
    name: string,
    email: string,
    logo: string | null,
    primaryColor: string,
    secondaryColor: string,
    notifications: {
      reportReady: boolean,
      weeklyDigest: boolean,
      trialReminder: boolean
    }
  },
  activeTab: 'profile' | 'branding' | 'security' | 'notifications'
}
```

---

### Page 8: `/dashboard/billing`

**What User Sees:**
- Sidebar + header
- Page heading: "Billing"
- Current plan card (showing trial status or active plan)
- Plan comparison table (Free, Starter, Pro, Agency, Enterprise)
- Billing history table (if not on trial)
- Payment method section (if not on trial)

**Actions User Can Take:**
1. View current subscription
2. Upgrade/change plan → Stripe checkout (in Phase 4)
3. View billing history
4. Update payment method
5. Cancel subscription

**Data Needed (Mock for Phase 2):**
```typescript
{
  subscription: {
    plan: 'free' | 'starter' | 'professional' | 'agency' | 'enterprise',
    status: 'trialing' | 'active' | 'cancelled',
    trialEndsAt: string | null,          // "2024-11-18"
    currentPeriodEnd: string | null,     // "2024-12-01"
    cancelAtPeriodEnd: boolean
  },
  plans: Array<{
    id: string,
    name: string,                        // "Starter"
    price: number,                       // 29
    interval: 'month' | 'year',
    features: string[],                  // ["25 reports/month", ...]
    reportsLimit: number,
    clientsLimit: number
  }>,
  billingHistory: Array<{
    id: string,
    date: string,
    amount: number,
    status: 'paid' | 'pending' | 'failed',
    invoiceUrl: string
  }>
}
```

---

### Page 9: `/demo`

**What User Sees:**
- Full-screen demo (no sidebar)
- Top navigation: OneReport logo, "Start Free Trial" button
- Interactive demo controls (left side):
  - Client selector dropdown (mock clients)
  - Date range picker
  - "Generate Report" button
- Main area: Mock report preview
- Bottom: "Like what you see? Start your free trial" CTA

**Actions User Can Take:**
1. Select different mock client
2. Change date range
3. Click "Generate Report" → shows animated loading → displays new mock report
4. Click "Start Free Trial" → navigate to `/signup`

**Data Needed (Mock for Phase 2):**
```typescript
{
  selectedClient: string,              // "Acme Corp"
  mockClients: Array<{
    id: string,
    name: string,
    industry: string
  }>,
  dateRange: {
    start: string,
    end: string
  },
  mockReport: {
    clientName: string,
    dateRange: string,
    metrics: {
      sessions: number,
      users: number,
      pageViews: number,
      bounceRate: string,
      avgSessionDuration: string,
      topPages: Array<{
        url: string,
        views: number,
        bounceRate: string
      }>
    },
    insights: string[],                // AI-generated insights (mocked)
    charts: {
      sessionsOverTime: Array<{ date: string, value: number }>,
      topChannels: Array<{ channel: string, percentage: number }>
    }
  },
  isGenerating: boolean
}
```

---

## Component Architecture

### Component Hierarchy Tree

```
📦 OneReport Components
│
├── 🔐 Auth Components (/src/components/auth/)
│   ├── SignupForm.tsx              - Email/password signup form
│   ├── LoginForm.tsx               - Email/password login form
│   ├── OAuthButtons.tsx            - Google + GitHub OAuth buttons
│   └── AuthLayout.tsx              - Minimal layout for auth pages
│
├── 🎯 Onboarding Components (/src/components/onboarding/)
│   ├── OnboardingWizard.tsx        - Parent component managing state
│   ├── StepIndicator.tsx           - Progress bar (Step X of 4)
│   └── steps/
│       ├── Step1Welcome.tsx        - Welcome screen
│       ├── Step2Platform.tsx       - Platform connection
│       ├── Step3Branding.tsx       - Branding customization
│       └── Step4Report.tsx         - First report preview
│
├── 📊 Dashboard Components (/src/components/dashboard/)
│   ├── DashboardLayout.tsx         - Sidebar + header wrapper
│   ├── Sidebar.tsx                 - Navigation sidebar
│   ├── TopHeader.tsx               - Header with user menu
│   ├── StatsCard.tsx               - Reusable stat card
│   ├── ReportsTable.tsx            - Reports list table
│   ├── ClientsGrid.tsx             - Clients grid/list
│   ├── SettingsTabs.tsx            - Settings tab navigation
│   ├── BillingPlanCard.tsx         - Current plan display
│   └── PlanComparison.tsx          - Pricing table
│
├── 🎮 Demo Components (/src/components/demo/)
│   ├── DemoLayout.tsx              - Demo page wrapper
│   ├── DemoControls.tsx            - Client selector, date picker
│   └── MockReportPreview.tsx       - Report visualization
│
├── 🧩 Shared/Reusable Components (/src/components/shared/)
│   ├── Button.tsx                  - Neumorphic button (primary, secondary, ghost)
│   ├── Input.tsx                   - Form input with validation
│   ├── Card.tsx                    - Neumorphic card container
│   ├── Modal.tsx                   - Modal dialog
│   ├── LoadingSpinner.tsx          - Loading animation
│   ├── LoadingSkeleton.tsx         - Content skeleton loader
│   ├── Toast.tsx                   - Toast notifications
│   ├── ColorPicker.tsx             - Color selection input
│   ├── FileUpload.tsx              - Drag & drop file upload
│   └── EmptyState.tsx              - Empty table/list state
│
└── 📄 Form Components (/src/components/forms/)
    ├── FormField.tsx               - Wrapper for label + input + error
    ├── FormError.tsx               - Error message display
    └── FormButton.tsx              - Form submit button with loading state
```

### Component Folder Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── SignupForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── OAuthButtons.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx
│   │   ├── StepIndicator.tsx
│   │   └── steps/
│   │       ├── Step1Welcome.tsx
│   │       ├── Step2Platform.tsx
│   │       ├── Step3Branding.tsx
│   │       └── Step4Report.tsx
│   │
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopHeader.tsx
│   │   ├── StatsCard.tsx
│   │   ├── ReportsTable.tsx
│   │   ├── ClientsGrid.tsx
│   │   ├── SettingsTabs.tsx
│   │   ├── BillingPlanCard.tsx
│   │   └── PlanComparison.tsx
│   │
│   ├── demo/
│   │   ├── DemoLayout.tsx
│   │   ├── DemoControls.tsx
│   │   └── MockReportPreview.tsx
│   │
│   ├── shared/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── FileUpload.tsx
│   │   └── EmptyState.tsx
│   │
│   └── forms/
│       ├── FormField.tsx
│       ├── FormError.tsx
│       └── FormButton.tsx
│
└── app/
    ├── (auth)/                     - Route group (no navbar)
    │   ├── layout.tsx
    │   ├── signup/
    │   │   └── page.tsx
    │   └── login/
    │       └── page.tsx
    │
    ├── onboarding/
    │   └── page.tsx
    │
    ├── dashboard/
    │   ├── layout.tsx              - Dashboard layout (sidebar + header)
    │   ├── page.tsx                - Dashboard home
    │   ├── reports/
    │   │   └── page.tsx
    │   ├── clients/
    │   │   └── page.tsx
    │   ├── settings/
    │   │   └── page.tsx
    │   └── billing/
    │       └── page.tsx
    │
    └── demo/
        └── page.tsx
```

---

## TypeScript Interfaces

### Auth Components

```typescript
// SignupForm Props
interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  isLoading: boolean;
  errors?: ValidationErrors;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

// LoginForm Props
interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  errors?: ValidationErrors;
}

interface LoginFormData {
  email: string;
  password: string;
}

// OAuthButtons Props
interface OAuthButtonsProps {
  onGoogleClick: () => void;
  onGitHubClick: () => void;
  isLoading?: boolean;
}

// Validation Errors
interface ValidationErrors {
  [key: string]: string;  // e.g., { email: "Invalid email" }
}
```

### Onboarding Components

```typescript
// OnboardingWizard Props
interface OnboardingWizardProps {
  initialStep?: number;
  onComplete: () => void;
}

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  platformConnected: boolean;
  branding: BrandingData;
}

interface BrandingData {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
}

// StepIndicator Props
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];  // ["Welcome", "Platform", "Branding", "Report"]
}

// Step Components
interface Step1WelcomeProps {
  userName: string;
  onNext: () => void;
}

interface Step2PlatformProps {
  onConnect: () => void;
  onSkip: () => void;
  onBack: () => void;
  isConnecting: boolean;
}

interface Step3BrandingProps {
  branding: BrandingData;
  onBrandingChange: (branding: BrandingData) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

interface Step4ReportProps {
  mockReport: MockReport;
  onFinish: () => void;
  onBack: () => void;
}

interface MockReport {
  clientName: string;
  dateRange: string;
  metrics: ReportMetrics;
}

interface ReportMetrics {
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: string;
}
```

### Dashboard Components

```typescript
// DashboardLayout Props
interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserData;
}

interface UserData {
  name: string;
  email: string;
  logo: string | null;
  subscription: SubscriptionData;
}

interface SubscriptionData {
  plan: 'free' | 'starter' | 'professional' | 'agency' | 'enterprise';
  status: 'trialing' | 'active' | 'cancelled';
  trialDaysLeft?: number;
}

// Sidebar Props
interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

// TopHeader Props
interface TopHeaderProps {
  user: UserData;
  onLogout: () => void;
}

// StatsCard Props
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

// ReportsTable Props
interface ReportsTableProps {
  reports: Report[];
  onView: (reportId: string) => void;
  onDownload: (reportId: string) => void;
  onDelete: (reportId: string) => void;
  isLoading?: boolean;
}

interface Report {
  id: string;
  clientName: string;
  dateRange: string;
  createdAt: string;
  status: 'draft' | 'completed';
  downloadUrl: string | null;
}

// ClientsGrid Props
interface ClientsGridProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
  onEdit: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  isLoading?: boolean;
}

interface Client {
  id: string;
  name: string;
  industry: string | null;
  reportsCount: number;
  lastReportDate: string | null;
  logo: string | null;
}
```

### Shared Components

```typescript
// Button Props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

// Input Props
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'url';
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// Card Props
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'flat';
}

// Modal Props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// LoadingSpinner Props
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// Toast Props
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

// ColorPicker Props
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

// FileUpload Props
interface FileUploadProps {
  accept: string;  // e.g., "image/*"
  maxSize: number; // in bytes
  onUpload: (file: File) => void;
  preview?: string | null;
  error?: string;
}

// EmptyState Props
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

### Demo Components

```typescript
// DemoControls Props
interface DemoControlsProps {
  clients: MockClient[];
  selectedClient: string;
  dateRange: DateRange;
  onClientChange: (clientId: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

interface MockClient {
  id: string;
  name: string;
  industry: string;
}

interface DateRange {
  start: string;
  end: string;
}

// MockReportPreview Props
interface MockReportPreviewProps {
  report: DemoReport;
  isLoading: boolean;
}

interface DemoReport {
  clientName: string;
  dateRange: string;
  metrics: ReportMetrics;
  insights: string[];
  charts: {
    sessionsOverTime: ChartData[];
    topChannels: ChannelData[];
  };
}

interface ChartData {
  date: string;
  value: number;
}

interface ChannelData {
  channel: string;
  percentage: number;
}
```

---

## Design System Components to Use

### From shadcn/ui (Already Installed)

We'll use these shadcn/ui components as base components:

- ✅ **Button** - Extend with neumorphic styles
- ✅ **Input** - Extend with validation and neumorphic styles
- ✅ **Card** - Extend with neumorphic dual shadows
- ✅ **Form** - Use for form handling
- ✅ **Dialog** - Use for modals
- ✅ **Tabs** - Use in settings page
- ✅ **Select** - Use for dropdowns
- ✅ **Checkbox** - Use in forms
- ✅ **Label** - Use in form fields
- ✅ **Separator** - Use for dividers
- ✅ **Avatar** - Use for user profile

### Custom Neumorphic Components (Need to Create)

These need custom implementation matching our design system:

- 🔨 **NeumorphicButton** - Dual shadow system
- 🔨 **NeumorphicCard** - Raised/inset variants
- 🔨 **NeumorphicInput** - Inset shadow style
- 🔨 **NeumorphicSelect** - Dropdown with neumorphic style
- 🔨 **LoadingSkeleton** - Neumorphic loading state
- 🔨 **ColorPicker** - Custom color selection
- 🔨 **FileUpload** - Drag & drop with neumorphic style

### Design System Colors (Reference)

```typescript
const colors = {
  // Base
  dark: '#1a1a1a',
  light: '#f5f5f5',

  // Accent
  teal: '#6CA3A2',
  orange: '#FF8C42',

  // Shadows (Neumorphic)
  lightShadow: '#ffffff20',
  darkShadow: '#00000060',

  // Semantic
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6'
};
```

---

## Phase 1 Planning Complete ✅

**Next Steps:**
1. Review this planning document
2. Get approval on routes, flows, and component structure
3. Move to **Phase 2: Frontend UI Implementation**
4. Start building pages with mock data based on this plan

**Phase 2 Will Build:**
- All pages listed above
- All components in hierarchy
- Mock data for every page
- Complete navigation flow
- Responsive design
- Design system compliance

**NO Backend Integration Until Phase 3!**
