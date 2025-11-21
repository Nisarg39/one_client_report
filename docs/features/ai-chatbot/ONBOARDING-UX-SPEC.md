# User Onboarding UX Specification

**Document Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** Production Specification
**Owner:** Product & Design Team

---

## Table of Contents

1. [Overview](#overview)
2. [User Flow Diagrams](#user-flow-diagrams)
3. [Screen Specifications](#screen-specifications)
4. [Component Library](#component-library)
5. [Interaction Patterns](#interaction-patterns)
6. [Accessibility Requirements](#accessibility-requirements)
7. [Mobile Responsiveness](#mobile-responsiveness)
8. [Design System](#design-system)
9. [Animation & Transitions](#animation--transitions)
10. [Error & Loading States](#error--loading-states)

---

## Overview

### Purpose
This document provides comprehensive UX/UI specifications for the user onboarding flow, ensuring a consistent, accessible, and delightful first-time user experience.

### Design Principles
1. **Simplicity First**: Minimal cognitive load at each step
2. **Progressive Disclosure**: Show information when needed
3. **Clear Progress**: Always show where users are in the journey
4. **Forgiving Experience**: Easy to go back, skip, or abandon
5. **Accessible by Default**: WCAG AA compliance throughout

### User Goals
- New users: Understand product value → Create first client → Connect platform → Start chatting
- Returning users: Quick access to existing conversations
- All users: Feel confident and supported throughout the journey

---

## User Flow Diagrams

### Primary Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     OAUTH LOGIN SUCCESS                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │ Check Database │
                   │ Has Clients?   │
                   └────────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
            YES │                       │ NO
                │                       │
                ▼                       ▼
        ┌───────────────┐      ┌──────────────────┐
        │ Redirect to   │      │ Redirect to      │
        │ /chat         │      │ /onboarding      │
        └───────────────┘      └────────┬─────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ STEP 1: Welcome       │
                            │ - Hero message        │
                            │ - Value proposition   │
                            │ - CTA: Get Started    │
                            └───────────┬───────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ STEP 2: Create Client │
                            │ - Client name input   │
                            │ - Email (optional)    │
                            │ - Logo upload         │
                            │ - CTA: Continue       │
                            └───────────┬───────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ STEP 3: Platforms     │
                            │ - Platform cards      │
                            │ - Connect buttons     │
                            │ - Skip option         │
                            │ - CTA: Continue       │
                            └───────────┬───────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ STEP 4: Product Tour  │
                            │ - Feature highlights  │
                            │ - Quick tips          │
                            │ - CTA: Start Chatting │
                            └───────────┬───────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ Redirect to /chat     │
                            │ (with firstTimeUser   │
                            │  welcome message)     │
                            └───────────────────────┘
```

### Edge Case Flows

```
┌─────────────────────────────────────────────────────────────────┐
│                         EDGE CASES                              │
└─────────────────────────────────────────────────────────────────┘

1. Browser Refresh Mid-Onboarding
   ┌─────────────┐
   │ User on     │
   │ Step 2/3    │ ──► Refresh ──► Resume at same step
   │             │                 (localStorage preserved)
   └─────────────┘

2. Manual Navigation to /chat
   ┌─────────────┐
   │ User types  │
   │ /chat in    │ ──► Redirect ──► Back to /onboarding
   │ URL bar     │                  (until complete)
   └─────────────┘

3. Platform Connection Failure
   ┌─────────────┐
   │ OAuth fails │
   │ or timeout  │ ──► Show error ──► Retry or Skip option
   │             │
   └─────────────┘

4. Onboarding Abandonment
   ┌─────────────┐
   │ User leaves │
   │ before Step │ ──► Next visit ──► Resume from last step
   │ 4 complete  │
   └─────────────┘
```

---

## Screen Specifications

### Step 1: Welcome Screen

#### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│                         Header                             │
│                    [Logo] OneClient                        │
└────────────────────────────────────────────────────────────┘
│                                                            │
│                      [Progress Bar]                        │
│              ●───○───○───○  (1/4)                          │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │                [Hero Illustration]                   │ │
│  │           (Animated chat bubbles/stars)              │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│                  Welcome to OneClient! 👋                  │
│                                                            │
│          Your AI-powered client management assistant      │
│                                                            │
│  • Connect your marketing platforms                       │
│  • Get instant insights via chat                          │
│  • Manage multiple clients effortlessly                   │
│                                                            │
│                                                            │
│              ┌──────────────────────────┐                 │
│              │   Get Started →          │ [Primary CTA]   │
│              └──────────────────────────┘                 │
│                                                            │
│              ┌──────────────────────────┐                 │
│              │   Skip for now           │ [Text button]   │
│              └──────────────────────────┘                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Visual Specifications
- **Container**: Max-width 640px, centered, padding 24px
- **Hero Illustration**: Height 280px, fade-in animation on load
- **Heading**: 32px, font-weight 700, color: gray-900
- **Subheading**: 18px, font-weight 400, color: gray-600
- **Bullet Points**: 16px, color: gray-700, checkmark icons
- **Primary CTA**: Height 48px, full-width on mobile, auto width on desktop
- **Skip Button**: Text only, gray-600, hover: gray-900

#### Interactions
- CTA click → Navigate to Step 2
- Skip click → Show confirmation modal → Navigate to /chat (mark onboarding as skipped)
- Auto-focus on CTA button on mount

---

### Step 2: Create Client

#### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│                         Header                             │
│              ← Back        [Logo]         Skip →           │
└────────────────────────────────────────────────────────────┘
│                                                            │
│                      [Progress Bar]                        │
│              ●───●───○───○  (2/4)                          │
│                                                            │
│                  Create Your First Client                  │
│          Let's start by adding a client to manage          │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │     [Upload Logo Area]                               │ │
│  │     ┌─────────────────┐                              │ │
│  │     │                 │  Click to upload              │ │
│  │     │  [Camera Icon]  │  or drag & drop               │ │
│  │     │                 │  PNG, JPG (max 2MB)           │ │
│  │     └─────────────────┘                              │ │
│  │                                                      │ │
│  │     Client Name *                                    │ │
│  │     ┌─────────────────────────────────────────────┐  │ │
│  │     │ e.g., Acme Corporation                      │  │ │
│  │     └─────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │     Client Email (Optional)                          │ │
│  │     ┌─────────────────────────────────────────────┐  │ │
│  │     │ contact@acme.com                            │  │ │
│  │     └─────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│              ┌──────────────────────────┐                 │
│              │   Continue →             │ [Primary CTA]   │
│              └──────────────────────────┘                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Visual Specifications
- **Back/Skip Links**: 14px, gray-600, hover: gray-900
- **Progress Bar**: Height 4px, active: blue-600, inactive: gray-200
- **Heading**: 28px, font-weight 700, color: gray-900
- **Subheading**: 16px, font-weight 400, color: gray-600, margin-bottom: 32px
- **Upload Area**:
  - Border: 2px dashed gray-300
  - Border-radius: 8px
  - Padding: 48px 24px
  - Hover: border-color blue-400, background: blue-50
  - Active drag: border-color blue-600, background: blue-100
- **Input Fields**:
  - Height: 48px
  - Border: 1px solid gray-300
  - Border-radius: 6px
  - Focus: border-color blue-500, ring 2px blue-200
  - Font-size: 16px
  - Padding: 12px 16px
- **Labels**: 14px, font-weight 500, color: gray-700, margin-bottom: 8px
- **Required Indicator**: Red asterisk, inline with label
- **CTA Button**: Disabled state until client name is entered

#### Interactions
- Back link → Navigate to Step 1 (preserve form data in localStorage)
- Skip link → Show confirmation modal → Navigate to /chat
- Logo upload:
  - Click → Open file picker
  - Drag & drop → Upload file
  - Validation: PNG/JPG, max 2MB, show error if invalid
  - Preview uploaded image
- Client name input:
  - Auto-focus on mount
  - Real-time validation (min 2 characters)
  - Show error state if empty on blur
- Email input:
  - Optional field
  - Validate email format on blur
  - Show error if invalid format
- Continue button:
  - Disabled if client name empty or invalid
  - Click → Save to database → Navigate to Step 3
  - Show loading spinner on save

#### Form Validation
```typescript
interface ClientFormData {
  name: string;      // Required, min 2 chars
  email?: string;    // Optional, valid email format
  logo?: File;       // Optional, PNG/JPG, max 2MB
}

// Validation rules
- Client name:
  - Required
  - Min length: 2
  - Max length: 100
  - Pattern: Allow letters, numbers, spaces, basic punctuation

- Email:
  - Optional
  - Valid email format: /^\\S+@\\S+\\.\\S+$/

- Logo:
  - Optional
  - File types: image/png, image/jpeg
  - Max size: 2MB
  - Dimensions: Recommend square, min 200x200px
```

---

### Step 3: Connect Platforms

#### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│                         Header                             │
│              ← Back        [Logo]         Skip →           │
└────────────────────────────────────────────────────────────┘
│                                                            │
│                      [Progress Bar]                        │
│              ●───●───●───○  (3/4)                          │
│                                                            │
│               Connect Your Marketing Platforms             │
│       Connect platforms to enable AI-powered insights      │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  ┌────────────────┐  ┌────────────────┐             │ │
│  │  │ [GA Icon]      │  │ [Meta Icon]    │             │ │
│  │  │ Google         │  │ Meta Ads       │             │ │
│  │  │ Analytics      │  │                │             │ │
│  │  │                │  │                │             │ │
│  │  │ ○ Not connected│  │ ○ Not connected│             │ │
│  │  │ [Connect]      │  │ [Connect]      │             │ │
│  │  └────────────────┘  └────────────────┘             │ │
│  │                                                      │ │
│  │  ┌────────────────┐  ┌────────────────┐             │ │
│  │  │ [Google Icon]  │  │ [LinkedIn Icon]│             │ │
│  │  │ Google Ads     │  │ LinkedIn Ads   │             │ │
│  │  │                │  │                │             │ │
│  │  │                │  │                │             │ │
│  │  │ ○ Not connected│  │ ○ Not connected│             │ │
│  │  │ [Connect]      │  │ [Connect]      │             │ │
│  │  └────────────────┘  └────────────────┘             │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│          ℹ️  You can connect more platforms later         │
│                                                            │
│              ┌──────────────────────────┐                 │
│              │   Continue →             │ [Primary CTA]   │
│              └──────────────────────────┘                 │
│                                                            │
│              ┌──────────────────────────┐                 │
│              │   Skip this step         │ [Text button]   │
│              └──────────────────────────┘                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Visual Specifications
- **Platform Cards**:
  - Width: 280px (desktop), full-width (mobile)
  - Height: 200px
  - Border: 1px solid gray-200
  - Border-radius: 12px
  - Padding: 24px
  - Background: white
  - Hover: shadow-md, border-color: gray-300
  - Grid: 2 columns on desktop, 1 column on mobile
  - Gap: 16px
- **Platform Icons**: 48px × 48px, top of card
- **Platform Name**: 18px, font-weight 600, color: gray-900
- **Connection Status**:
  - Not connected: Gray dot + "Not connected" (gray-500)
  - Connected: Green dot + "Connected" (green-600)
  - Error: Red dot + "Connection failed" (red-600)
- **Connect Button**:
  - Size: 40px height
  - Full-width within card
  - Border: 1px solid blue-600
  - Background: white
  - Color: blue-600
  - Hover: background blue-50
  - Connected state: Green background, white text, checkmark icon
- **Info Message**: 14px, color: blue-700, background: blue-50, padding: 12px 16px, border-radius: 6px

#### Interactions
- Back link → Navigate to Step 2
- Skip link → Navigate to Step 4 (no platforms connected)
- Connect button click:
  1. Show loading spinner on button
  2. Open OAuth popup window (centered, 600×700px)
  3. Handle OAuth callback
  4. Success → Update card to "Connected" state, show checkmark animation
  5. Error → Show error state, display retry button
  6. Close popup automatically on success
- Continue button:
  - Enabled always (platforms optional)
  - Click → Navigate to Step 4
- Platform card hover → Lift effect (transform: translateY(-2px))

#### Platform Connection States
```typescript
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface PlatformCardState {
  id: string;
  name: string;
  icon: string;
  status: ConnectionStatus;
  error?: string;
}

// Initial state
const platforms: PlatformCardState[] = [
  { id: 'google-analytics', name: 'Google Analytics', icon: '/icons/ga.svg', status: 'disconnected' },
  { id: 'meta-ads', name: 'Meta Ads', icon: '/icons/meta.svg', status: 'disconnected' },
  { id: 'google-ads', name: 'Google Ads', icon: '/icons/google-ads.svg', status: 'disconnected' },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', icon: '/icons/linkedin.svg', status: 'disconnected' },
];
```

---

### Step 4: Product Tour

#### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│                         Header                             │
│              ← Back        [Logo]                          │
└────────────────────────────────────────────────────────────┘
│                                                            │
│                      [Progress Bar]                        │
│              ●───●───●───●  (4/4)                          │
│                                                            │
│                    You're All Set! 🎉                      │
│            Here's how to get the most out of OneClient     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │  [Icon: Chat Bubble]                         │   │ │
│  │  │                                              │   │ │
│  │  │  💬 Ask Questions Naturally                  │   │ │
│  │  │  Just type what you want to know about       │   │ │
│  │  │  your clients' performance                   │   │ │
│  │  │                                              │   │ │
│  │  │  Example: "How's my Meta campaign doing?"    │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │  [Icon: Lightning Bolt]                      │   │ │
│  │  │                                              │   │ │
│  │  │  ⚡ Get Instant Insights                     │   │ │
│  │  │  AI analyzes your data and provides          │   │ │
│  │  │  actionable insights in seconds              │   │ │
│  │  │                                              │   │ │
│  │  │  Try: "What's my best performing platform?"  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │  [Icon: Users]                               │   │ │
│  │  │                                              │   │ │
│  │  │  👥 Manage Multiple Clients                  │   │ │
│  │  │  Switch between clients seamlessly and       │   │ │
│  │  │  keep all conversations organized            │   │ │
│  │  │                                              │   │ │
│  │  │  Tip: Use the client selector in sidebar     │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│              ┌──────────────────────────┐                 │
│              │   Start Chatting →       │ [Primary CTA]   │
│              └──────────────────────────┘                 │
│                                                            │
│           [Keyboard Shortcut: Press Enter to continue]    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Visual Specifications
- **Completion Celebration**: Confetti animation on mount (3 seconds)
- **Heading**: 32px, font-weight 700, color: gray-900, celebration emoji
- **Feature Cards**:
  - Background: gradient from blue-50 to white
  - Border: 1px solid gray-200
  - Border-radius: 12px
  - Padding: 24px
  - Margin-bottom: 16px
  - Stagger fade-in animation (0.2s delay between cards)
- **Feature Icons**: 32px, color: blue-600
- **Feature Title**: 20px, font-weight 600, color: gray-900
- **Feature Description**: 16px, color: gray-600, line-height: 1.5
- **Example/Tip**: 14px, color: blue-700, background: blue-100, padding: 8px 12px, border-radius: 6px, margin-top: 12px
- **Keyboard Hint**: 12px, color: gray-500, italic

#### Interactions
- Back link → Navigate to Step 3
- Feature cards → Stagger fade-in animation on mount
- Confetti animation → Auto-play on mount, 3 seconds duration
- Start Chatting button:
  - Click → Mark onboarding as complete → Navigate to /chat
  - Auto-focus on mount
- Keyboard shortcuts:
  - Enter → Same as clicking "Start Chatting"
  - Escape → Same as clicking Back (if user wants to review)

---

## Component Library

### 1. ProgressIndicator

```typescript
interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  labels?: string[];
}

// Visual Design
- Container: Display flex, justify-center, padding: 24px 0
- Step circles: 32px diameter
- Active step: blue-600 filled, white number/checkmark
- Completed step: green-600 filled, white checkmark
- Inactive step: gray-200 filled, gray-500 number
- Connector lines: 2px height, gray-200 (inactive), blue-600 (active)
- Animation: Smooth fill transition (0.3s ease)
```

### 2. OnboardingHeader

```typescript
interface OnboardingHeaderProps {
  showBack?: boolean;
  showSkip?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
}

// Visual Design
- Height: 64px
- Background: white
- Border-bottom: 1px solid gray-200
- Logo: Height 32px, clickable (navigate to homepage)
- Back link: Left-aligned, 14px, gray-600
- Skip link: Right-aligned, 14px, gray-600
- Mobile: Stack vertically if needed
```

### 3. OnboardingCard

```typescript
interface OnboardingCardProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
  className?: string;
}

// Visual Design
- Background: white
- Border-radius: 16px
- Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
- Padding: 32px (desktop), 24px (mobile)
- Max-width: 640px
- Margin: 0 auto
```

### 4. PlatformCard

```typescript
interface PlatformCardProps {
  platform: {
    id: string;
    name: string;
    icon: string;
    status: ConnectionStatus;
  };
  onConnect: (platformId: string) => void;
  isConnecting?: boolean;
}

// Visual Design
- Width: 280px
- Height: 200px
- Border: 1px solid gray-200
- Border-radius: 12px
- Padding: 24px
- Hover: shadow-md, transform: translateY(-2px)
- Transition: all 0.2s ease
```

### 5. FeatureHighlightCard

```typescript
interface FeatureHighlightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example?: string;
  tip?: string;
  animationDelay?: number;
}

// Visual Design
- Background: linear-gradient(135deg, blue-50 0%, white 100%)
- Border: 1px solid gray-200
- Border-radius: 12px
- Padding: 24px
- Animation: fade-in from bottom, staggered
```

### 6. PrimaryButton

```typescript
interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

// Visual Design
- Height: 48px (md), 40px (sm), 56px (lg)
- Background: blue-600
- Color: white
- Border-radius: 8px
- Font-weight: 600
- Padding: 12px 24px
- Hover: background blue-700
- Active: background blue-800
- Disabled: background gray-300, color gray-500, cursor not-allowed
- Loading: Show spinner, disable pointer events
- Focus: ring 2px blue-300, outline none
```

### 7. FormInput

```typescript
interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

// Visual Design
- Label: 14px, font-weight 500, color: gray-700, margin-bottom: 8px
- Required indicator: Red asterisk
- Input height: 48px
- Border: 1px solid gray-300
- Border-radius: 6px
- Padding: 12px 16px
- Font-size: 16px
- Focus: border-color blue-500, ring 2px blue-200
- Error: border-color red-500, ring 2px red-200
- Error message: 14px, color: red-600, margin-top: 4px
- Help text: 14px, color: gray-500, margin-top: 4px
- Disabled: background gray-100, cursor not-allowed
```

### 8. FileUpload

```typescript
interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  preview?: string;
  error?: string;
}

// Visual Design
- Border: 2px dashed gray-300
- Border-radius: 8px
- Padding: 48px 24px
- Background: white
- Hover: border-color blue-400, background blue-50
- Drag active: border-color blue-600, background blue-100
- Icon: 48px, gray-400
- Text: 14px, color: gray-600
- Preview image: Border-radius 8px, max-width 100%
- Error: border-color red-500, show error message below
```

---

## Interaction Patterns

### Navigation Rules

1. **Forward Navigation**
   - Click "Continue" → Validate current step → Save progress → Navigate to next step
   - Enter key → Same as clicking "Continue" (if focused on form)
   - All data saved to localStorage on each step completion

2. **Backward Navigation**
   - Click "Back" → Navigate to previous step, preserve form data
   - Browser back button → Same as "Back" link
   - No data loss when going back

3. **Skip/Exit Navigation**
   - Click "Skip" on Step 1 → Show confirmation modal → Navigate to /chat
   - Click "Skip this step" on Step 3 → Navigate to Step 4 (platforms optional)
   - Manual URL change → Redirect back to current onboarding step

### Form Submission Flow

```typescript
// Step 2: Create Client
1. User fills in client name (required)
2. Optionally adds email and logo
3. Clicks "Continue"
4. Frontend validation:
   - Check required fields
   - Validate email format
   - Validate file size/type
5. If valid:
   - Show loading spinner on button
   - Call server action: createClient()
   - Save clientId to localStorage
   - Navigate to Step 3
6. If error:
   - Show error message
   - Keep user on current step
   - Allow retry
```

### Platform Connection Flow

```typescript
// Step 3: Connect Platforms
1. User clicks "Connect" on platform card
2. Update card status to "connecting"
3. Open OAuth popup:
   - Window.open() centered popup
   - Size: 600×700px
   - URL: /api/auth/[platform]/authorize
4. User completes OAuth in popup
5. Popup redirects to callback URL
6. Callback closes popup, sends message to parent
7. Parent window receives message:
   - Success → Update card to "connected"
   - Error → Show error state on card
8. Save connection status to database
9. User can connect multiple platforms
10. Click "Continue" → Navigate to Step 4
```

### Error Handling Patterns

1. **Network Errors**
   - Show toast notification: "Connection lost. Please try again."
   - Retry button on failed actions
   - Preserve form data during retry

2. **Validation Errors**
   - Inline error messages below inputs
   - Red border on invalid fields
   - Prevent form submission until valid

3. **OAuth Errors**
   - Show error on platform card
   - Provide "Retry" button
   - Allow user to skip and continue

4. **Server Errors**
   - Show generic error message: "Something went wrong. Please try again."
   - Log detailed error to console
   - Provide "Contact Support" link if persistent

---

## Accessibility Requirements

### WCAG AA Compliance

#### Color Contrast
- All text must meet WCAG AA standards:
  - Normal text (< 18px): 4.5:1 contrast ratio
  - Large text (≥ 18px): 3:1 contrast ratio
  - Interactive elements: 3:1 contrast ratio
- Do not rely solely on color to convey information
- Provide text alternatives for icons

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order follows logical flow (top to bottom, left to right)
- Focus indicators clearly visible (2px blue-500 ring)
- Escape key closes modals/popups
- Enter key submits forms
- Arrow keys navigate between form fields (optional enhancement)

#### Screen Reader Support
- Semantic HTML elements (header, nav, main, section, button, etc.)
- ARIA labels for all interactive elements
- ARIA live regions for dynamic content updates
- Alt text for all images (including decorative: alt="")
- Form labels properly associated with inputs
- Error messages announced to screen readers

#### Focus Management
- Auto-focus on primary CTA when step loads
- Trap focus inside modals
- Restore focus when closing modals
- Clear focus indicators (never remove outline without replacement)

### Accessibility Checklist

```markdown
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] All buttons have descriptive text or aria-label
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible on all interactive elements
- [ ] No flashing content (seizure risk)
- [ ] ARIA roles used appropriately
- [ ] Error messages announced to screen readers
- [ ] Progress indicator accessible to screen readers
- [ ] Skip links provided (skip to main content)
- [ ] Headings follow logical hierarchy (h1 → h2 → h3)
- [ ] Form validation errors clear and descriptive
- [ ] Modals closable with Escape key
- [ ] Loading states announced to screen readers
```

### ARIA Attributes

```html
<!-- Progress Indicator -->
<nav aria-label="Onboarding progress" role="navigation">
  <ol role="list">
    <li aria-current="step" aria-label="Step 1 of 4: Welcome">...</li>
    <li aria-label="Step 2 of 4: Create Client">...</li>
  </ol>
</nav>

<!-- Form Input -->
<div>
  <label for="client-name" id="client-name-label">
    Client Name <span aria-label="required">*</span>
  </label>
  <input
    id="client-name"
    aria-labelledby="client-name-label"
    aria-describedby="client-name-error"
    aria-invalid="false"
    aria-required="true"
  />
  <div id="client-name-error" role="alert" aria-live="polite">
    <!-- Error message appears here -->
  </div>
</div>

<!-- Platform Card -->
<article aria-label="Google Analytics platform">
  <h3>Google Analytics</h3>
  <p aria-live="polite">
    <span aria-label="Connection status">Not connected</span>
  </p>
  <button
    aria-label="Connect Google Analytics"
    aria-describedby="ga-description"
  >
    Connect
  </button>
</article>

<!-- Loading Button -->
<button
  aria-busy="true"
  aria-disabled="true"
>
  <span aria-live="polite">Loading...</span>
</button>
```

---

## Mobile Responsiveness

### Breakpoints

```css
/* Mobile First Approach */
/* Small mobile: < 375px */
/* Mobile: 375px - 767px (default) */
/* Tablet: 768px - 1023px */
/* Desktop: 1024px+ */

@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Responsive Layouts

#### Mobile (< 768px)
- Single column layout
- Full-width buttons
- Stack platform cards vertically
- Reduce padding: 16px (vs 24px desktop)
- Font sizes: Scale down 1-2px
- Progress indicator: Smaller circles (24px vs 32px)
- Touch targets: Minimum 44×44px

#### Tablet (768px - 1023px)
- 2-column grid for platform cards
- Moderate padding: 20px
- Progress indicator: Medium circles (28px)

#### Desktop (1024px+)
- Max-width containers: 640px
- 2-column grid for platform cards
- Full padding: 24-32px
- Optimal font sizes

### Mobile-Specific Adjustments

```typescript
// Step 1: Welcome Screen (Mobile)
- Hero illustration: Height 200px (vs 280px desktop)
- Heading: 24px (vs 32px desktop)
- Buttons: Full-width, stack vertically
- Padding: 16px (vs 24px desktop)

// Step 2: Create Client (Mobile)
- Logo upload area: Reduce padding to 32px 16px
- Input fields: Font-size 16px (prevent zoom on iOS)
- Back/Skip links: Increase touch target to 44px

// Step 3: Connect Platforms (Mobile)
- Platform cards: Full-width, single column
- Card height: Auto (vs fixed 200px)
- Grid gap: 12px (vs 16px desktop)

// Step 4: Product Tour (Mobile)
- Feature cards: Reduce padding to 20px
- Example text: Font-size 13px
- Confetti animation: Reduce particle count for performance
```

### Touch Interactions

- Minimum touch target: 44×44px
- Increase padding on mobile buttons: 14px 20px
- Swipe gestures:
  - Swipe left → Next step (optional enhancement)
  - Swipe right → Previous step (optional enhancement)
- Prevent zoom on input focus (font-size: 16px minimum)
- Use native form controls where possible

### Mobile Performance

- Lazy load images (hero illustrations, logos)
- Reduce animation complexity on mobile
- Use CSS animations over JavaScript when possible
- Optimize image file sizes (use WebP format)
- Prefetch next step assets while user fills form

---

## Design System

### Color Palette

```css
/* Primary Colors */
--blue-50: #eff6ff;
--blue-100: #dbeafe;
--blue-200: #bfdbfe;
--blue-300: #93c5fd;
--blue-400: #60a5fa;
--blue-500: #3b82f6;
--blue-600: #2563eb; /* Primary brand color */
--blue-700: #1d4ed8;
--blue-800: #1e40af;
--blue-900: #1e3a8a;

/* Grayscale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Semantic Colors */
--success-500: #10b981; /* Green */
--success-600: #059669;
--error-500: #ef4444;   /* Red */
--error-600: #dc2626;
--warning-500: #f59e0b; /* Amber */
--info-500: #3b82f6;    /* Blue */
```

### Typography

```css
/* Font Family */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2rem;      /* 32px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing Scale

```css
/* Consistent spacing using 4px base unit */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
```

---

## Animation & Transitions

### Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Transition Durations

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Common Animations

#### 1. Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 300ms ease-out forwards;
}
```

#### 2. Stagger Fade In (for feature cards)
```typescript
const StaggerFadeIn = ({ children, delay = 0 }) => (
  <div
    style={{
      animation: `fadeIn 300ms ease-out ${delay}ms forwards`,
      opacity: 0,
    }}
  >
    {children}
  </div>
);

// Usage: delay = index * 200ms
```

#### 3. Progress Bar Fill
```css
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
  }
}

.progress-bar {
  animation: progressFill 500ms ease-out forwards;
}
```

#### 4. Checkmark Success
```css
@keyframes checkmarkDraw {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.checkmark {
  stroke-dasharray: 100;
  animation: checkmarkDraw 400ms ease-out forwards;
}
```

#### 5. Confetti Celebration (Step 4)
```typescript
// Using canvas-confetti library
import confetti from 'canvas-confetti';

const celebrateCompletion = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2563eb', '#10b981', '#f59e0b'],
  });
};
```

#### 6. Button Loading Spinner
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### Reduced Motion

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Error & Loading States

### Form Validation Errors

#### Visual Design
```typescript
// Input Error State
<div className="form-field">
  <label htmlFor="client-name">Client Name *</label>
  <input
    id="client-name"
    className="border-red-500 ring-2 ring-red-200"
    aria-invalid="true"
    aria-describedby="client-name-error"
  />
  <p id="client-name-error" className="text-red-600 text-sm mt-1">
    <svg className="inline w-4 h-4 mr-1" /* Error icon */>
    Client name must be at least 2 characters
  </p>
</div>
```

#### Common Validation Messages
```typescript
const ValidationMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must be no more than ${max} characters`,
  invalidEmail: 'Please enter a valid email address',
  invalidFile: 'File must be PNG or JPG and under 2MB',
  networkError: 'Connection lost. Please check your internet and try again.',
  serverError: 'Something went wrong. Please try again or contact support.',
};
```

### Loading States

#### 1. Button Loading
```typescript
<button disabled={isLoading}>
  {isLoading ? (
    <>
      <svg className="animate-spin w-5 h-5 mr-2" /* Spinner icon */ />
      Creating client...
    </>
  ) : (
    'Continue →'
  )}
</button>
```

#### 2. Page Loading (Step Transition)
```typescript
// Skeleton loader while fetching data
<div className="animate-pulse">
  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
  <div className="h-48 bg-gray-200 rounded"></div>
</div>
```

#### 3. Platform Connection Loading
```typescript
<PlatformCard
  status="connecting"
  icon={<Spinner />}
  statusText="Connecting..."
  button={<button disabled>Connecting...</button>}
/>
```

### Empty States

#### No Clients Created Yet (shouldn't happen in onboarding)
```typescript
<EmptyState
  icon={<UserPlusIcon />}
  title="No clients yet"
  description="Create your first client to get started"
  action={
    <button>Create Client</button>
  }
/>
```

### Error Recovery

#### Network Error Toast
```typescript
<Toast
  type="error"
  title="Connection lost"
  message="Please check your internet connection and try again."
  action={
    <button onClick={retry}>Retry</button>
  }
  duration={0} // Persistent until dismissed
/>
```

#### OAuth Error on Platform Card
```typescript
<PlatformCard
  status="error"
  icon={<AlertCircle />}
  statusText="Connection failed"
  errorMessage="Authorization was denied"
  button={
    <button onClick={retryConnection}>
      Try Again
    </button>
  }
/>
```

#### Generic Error Boundary
```typescript
<ErrorBoundary
  fallback={
    <div className="text-center py-12">
      <h2>Something went wrong</h2>
      <p>We're sorry for the inconvenience.</p>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
      <a href="/support">Contact Support</a>
    </div>
  }
>
  {children}
</ErrorBoundary>
```

---

## Implementation Checklist

### Development Phase

#### Week 1: Core Components
- [ ] Create OnboardingLayout component
- [ ] Create ProgressIndicator component
- [ ] Create OnboardingHeader component
- [ ] Create OnboardingCard component
- [ ] Create PrimaryButton component
- [ ] Create FormInput component
- [ ] Create FileUpload component
- [ ] Set up design system CSS variables
- [ ] Implement routing logic (/onboarding)

#### Week 2: Individual Steps
- [ ] Build Step 1: Welcome screen
- [ ] Build Step 2: Create Client form
- [ ] Build Step 3: Platform cards
- [ ] Build Step 4: Product tour
- [ ] Implement localStorage persistence
- [ ] Add form validation
- [ ] Connect to backend APIs

#### Week 3: Polish & Accessibility
- [ ] Add all animations
- [ ] Implement keyboard navigation
- [ ] Add ARIA attributes
- [ ] Test screen reader compatibility
- [ ] Optimize for mobile
- [ ] Add error handling
- [ ] Implement loading states

#### Week 4: Testing & Launch
- [ ] Unit tests for all components
- [ ] Integration tests for flow
- [ ] E2E tests with Playwright
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Deploy to production

### Design QA Checklist

- [ ] All spacing follows 4px grid
- [ ] All colors from design system
- [ ] All typography matches spec
- [ ] All animations smooth (60fps)
- [ ] All interactive elements have hover states
- [ ] All interactive elements have focus states
- [ ] All buttons have loading states
- [ ] All forms have validation
- [ ] All images optimized
- [ ] Mobile responsive on all breakpoints
- [ ] Touch targets minimum 44px
- [ ] No layout shift on load

---

## Appendix

### Asset Requirements

#### Icons Needed
- Logo (SVG, multiple sizes)
- Platform icons: Google Analytics, Meta Ads, Google Ads, LinkedIn Ads
- Feature icons: Chat bubble, Lightning bolt, Users
- UI icons: Check, X, Arrow right, Arrow left, Upload, Spinner, Alert

#### Illustrations
- Welcome screen hero (animated SVG or Lottie)
- Empty states (if needed)
- Error states (if needed)

#### Image Specifications
- Logo: SVG, height 32px, transparent background
- Platform icons: 48×48px, PNG or SVG
- Hero illustration: 280px height, optimized SVG or WebP
- Max file size: 100KB per image

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+

### Performance Targets

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- Lighthouse Score: 90+

---

**End of UX Specification Document**

For implementation details, see [PHASE-4.5-ONBOARDING.md](./PHASE-4.5-ONBOARDING.md)
For API specifications, see [PHASE-5-PLATFORM-APIS.md](./PHASE-5-PLATFORM-APIS.md) (coming soon)
