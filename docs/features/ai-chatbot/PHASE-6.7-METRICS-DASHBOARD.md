# Phase 6.7: Metrics Dashboard Implementation Plan

**Status**: Planning Complete - Awaiting Approval
**Created**: 2025-11-28
**Target Release**: Phase 6.7
**Priority**: High

---

## Table of Contents

1. [Overview](#overview)
2. [Motivation & User Value](#motivation--user-value)
3. [Architecture & Design](#architecture--design)
4. [Data Flow Strategy](#data-flow-strategy)
5. [Component Specifications](#component-specifications)
6. [State Management](#state-management)
7. [Edge Cases & Error Handling](#edge-cases--error-handling)
8. [Mobile Responsive Strategy](#mobile-responsive-strategy)
9. [Neomorphic Design Specifications](#neomorphic-design-specifications)
10. [Implementation Phases](#implementation-phases)
11. [Testing Strategy](#testing-strategy)
12. [Performance Considerations](#performance-considerations)
13. [Success Criteria](#success-criteria)

---

## Overview

### Feature Description

A collapsible metrics dashboard panel integrated into the `/chat` route that displays real-time platform metrics alongside the AI chatbot. This allows users to verify AI responses against raw data and explore platform metrics interactively.

### Key Requirements

- **Zero Duplicate API Calls**: Reuse platform data already fetched for AI context
- **Multi-Platform Support**: Google Analytics, Google Ads, Meta Ads, LinkedIn Ads
- **Responsive Design**: Desktop (resizable panel) and mobile (bottom sheet)
- **Neomorphic UI**: Match existing design system
- **Real-time Sync**: Update when new messages fetch fresh data
- **Toggleable**: Collapsible/expandable without losing state
- **Accessible**: Keyboard navigation, screen reader support

---

## Motivation & User Value

### Problem Statement

Currently, users interacting with the AI chatbot:
1. Cannot easily verify AI claims about metrics
2. Need to switch to separate platform dashboards to see raw data
3. May not trust AI responses without visual confirmation
4. Have no way to explore data interactively during conversation

### User Benefits

1. **Trust & Verification**: See actual metrics alongside AI interpretations
2. **Context Awareness**: Understand which data the AI is referencing
3. **Data Exploration**: Interact with metrics while asking questions
4. **Efficiency**: No need to switch between multiple dashboards
5. **Learning**: Better understand platform metrics through AI explanations + visual data

### Success Metrics

- User engagement: % of chat sessions with metrics panel opened
- Verification behavior: Click-through rates on specific metrics
- Session duration: Time spent in chat with panel visible
- User feedback: NPS score improvement for chat feature
- Error reduction: Fewer user corrections to AI responses

---

## Architecture & Design

### Layout Modes

#### Mode 1: Split View (Desktop Default)
```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────┬────────────────────────────┬────────────────────┤
│          │                            │                    │
│ Sidebar  │    Chat Messages           │   Metrics Panel    │
│ (22rem)  │    (40-70% width)          │   (30-50% width)   │
│          │                            │   [Resizable]      │
│          │                            │                    │
│          ├────────────────────────────┤                    │
│          │ Message Input              │                    │
└──────────┴────────────────────────────┴────────────────────┘
```

#### Mode 2: Collapsed View
```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────┬─────────────────────────────────────────────┬───┤
│          │                                             │ [▶]│
│ Sidebar  │    Chat Messages (Full Width)               │   │
│          │                                             │   │
│          ├─────────────────────────────────────────────┤   │
│          │ Message Input                               │   │
└──────────┴─────────────────────────────────────────────┴───┘
```

#### Mode 3: Overlay View (Mobile)
```
┌─────────────────────────────────────────────┐
│ Chat Header                          [☰]    │
├─────────────────────────────────────────────┤
│                                             │
│    Chat Messages                            │
│                                             │
├─────────────────────────────────────────────┤
│ Message Input                               │
└─────────────────────────────────────────────┘
                     ↓ [Swipe up]
┌─────────────────────────────────────────────┐
│ ──────── (drag handle) ────────             │
├─────────────────────────────────────────────┤
│ [Google Analytics] [Meta Ads] [...]         │
├─────────────────────────────────────────────┤
│                                             │
│   Metrics Content (Bottom Sheet)            │
│                                             │
└─────────────────────────────────────────────┘
```

### Panel Features

1. **Platform Tabs**: Switch between connected platforms
2. **Date Range Sync**: Mirrors chat sidebar date range selection
3. **Metric Cards**: Key metrics with trends (sparklines)
4. **Raw Data Section**: Expandable accordion with tables
5. **Resize Handle**: Drag to adjust panel width (desktop)
6. **Collapse Button**: Hide panel without losing scroll position
7. **Refresh Indicator**: Shows when data is stale (>5 min)
8. **Loading States**: Skeleton loaders for async operations
9. **Error States**: Graceful fallbacks for API failures

---

## Data Flow Strategy

### Critical Constraint: Zero Duplicate API Calls

All platform data must be reused from existing fetch operations in `sendMessage.ts`.

### Current Data Flow

```
User sends message
    ↓
sendMessage.ts (Server Action)
    ↓
fetchAllGoogleAnalyticsProperties() ──→ 5-min cache
fetchMetaAdsData()                  ──→ No cache
fetchLinkedInAdsData()              ──→ No cache
fetchGoogleAdsData()                ──→ No cache
    ↓
buildPlatformDataContext() ──→ AI System Prompt
    ↓
Stream AI response via SSE
    ↓
Client receives: conversationId, message chunks, tokens, platformHealthIssues
```

### Proposed Enhanced Data Flow

```
User sends message
    ↓
sendMessage.ts (Server Action)
    ↓
Fetch platform data (SAME AS BEFORE)
    ↓
NEW: Emit platform data in SSE stream
    |
    ├─→ buildPlatformDataContext() ──→ AI
    └─→ writer.write('data: {"type":"platformData","data":{...}}')
    ↓
Stream AI response + platform data
    ↓
Client receives:
    - conversationId
    - message chunks
    - tokens
    - platformHealthIssues
    - NEW: platformData (full metrics)
    ↓
useStreamingChat hook captures platformData
    ↓
useChatStore.setPlatformData() ──→ Zustand Store
    ↓
MetricsDashboardPanel reads from store
```

### Implementation Details

#### Changes Required in sendMessage.ts

**Location**: Lines 111-279 (after platform data fetching)

```typescript
// After fetching all platform data
const platformDataPayload = {
  timestamp: Date.now(),
  dateRange: { startDate, endDate },
  platforms: {
    googleAnalytics: gaData,
    metaAds: metaData,
    linkedInAds: linkedInData,
    googleAds: googleAdsData,
  },
};

// Emit platform data to client BEFORE starting AI stream
writer.write(
  `data: ${JSON.stringify({
    type: 'platformData',
    data: platformDataPayload,
  })}\n\n`
);
```

#### Changes Required in useStreamingChat.ts

**New Callback Parameter**:

```typescript
interface UseStreamingChatOptions {
  // ... existing options
  onPlatformData?: (data: PlatformDataPayload) => void; // NEW
}
```

**Event Handling** (in SSE processing loop):

```typescript
if (event.type === 'platformData') {
  options.onPlatformData?.(event.data);
}
```

#### Changes Required in ChatPageClient.tsx

**Platform Data Handler**:

```typescript
const handlePlatformData = useCallback((data: PlatformDataPayload) => {
  setCachedPlatformData(data);
}, []);

const { sendMessage, isLoading } = useStreamingChat({
  // ... existing options
  onPlatformData: handlePlatformData, // NEW
});
```

---

## Component Specifications

### Component Hierarchy

```
MetricsDashboardPanel
├── PanelHeader
│   ├── PlatformTabs
│   │   └── PlatformTab (foreach platform)
│   ├── DateRangeDisplay
│   └── CollapseButton
├── PanelContent
│   ├── MetricsOverview
│   │   ├── MetricsGrid
│   │   │   └── MetricCard (foreach metric)
│   │   │       ├── MetricLabel
│   │   │       ├── MetricValue
│   │   │       ├── MetricChange (trend)
│   │   │       └── MiniSparkline (optional)
│   │   └── RefreshIndicator
│   ├── DimensionalDataSection
│   │   ├── SectionHeader
│   │   └── RawDataAccordion (foreach dimension)
│   │       ├── AccordionTrigger
│   │       └── AccordionContent
│   │           └── DataTable
│   │               ├── TableHeader
│   │               └── TableRow (foreach row)
│   └── LoadingState / ErrorState / EmptyState
└── ResizeHandle (desktop only)
```

### 1. MetricsDashboardPanel (Container)

**File**: `src/components/chat/MetricsDashboardPanel.tsx`

**Props**:
```typescript
interface MetricsDashboardPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  width?: number; // Desktop only (px)
  onWidthChange?: (width: number) => void; // Desktop only
}
```

**State**:
```typescript
const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('google-analytics');
const [isResizing, setIsResizing] = useState(false);
```

**Key Features**:
- Framer Motion slide-in animation (slide from right on desktop, slide from bottom on mobile)
- Handles resize logic (desktop)
- Manages platform tab selection
- Syncs with date range from useChatStore

**Styling**:
```typescript
// Desktop
className: "fixed right-0 top-16 bottom-0 bg-[#1a1a1a] border-l border-[#333]"
style: { width: `${width}px` }

// Mobile
className: "fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#333] rounded-t-3xl"
style: { maxHeight: '70vh' }
```

---

### 2. PlatformTabs

**File**: `src/components/chat/PlatformTabs.tsx`

**Props**:
```typescript
interface PlatformTabsProps {
  platforms: ConnectedPlatform[];
  selectedPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
}
```

**Behavior**:
- Horizontal scrollable tabs
- Active tab indicator (animated underline with #6CA3A2 accent)
- Disabled state for platforms with no data
- Platform icon + name

**Styling** (Neomorphic tabs):
```typescript
// Active tab
className: "px-4 py-2 rounded-lg bg-[#1a1a1a]"
boxShadow: "inset -3px -3px 8px rgba(60,60,60,0.4), inset 3px 3px 8px rgba(0,0,0,0.8)"
borderBottom: "2px solid #6CA3A2"

// Inactive tab
className: "px-4 py-2 rounded-lg bg-[#1a1a1a]"
boxShadow: "-6px -6px 16px rgba(60,60,60,0.4), 6px 6px 16px rgba(0,0,0,0.8)"
```

---

### 3. MetricCard

**File**: `src/components/chat/MetricCard.tsx`

**Props**:
```typescript
interface MetricCardProps {
  label: string;
  value: number | string;
  previousValue?: number; // For trend calculation
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  icon?: React.ReactNode;
  trendData?: number[]; // For sparkline
}
```

**Layout**:
```
┌──────────────────────────────────┐
│ 👥 Users                         │
│                                  │
│ 12,345          ↗ +12.3%        │
│ ────────────── (sparkline)       │
└──────────────────────────────────┘
```

**Trend Logic**:
```typescript
const percentChange = previousValue
  ? ((value - previousValue) / previousValue) * 100
  : null;
const trendColor = percentChange > 0 ? '#4ade80' : percentChange < 0 ? '#ef4444' : '#6CA3A2';
```

**Styling**:
```typescript
className: "p-4 rounded-xl bg-[#1a1a1a]"
boxShadow: "-6px -6px 16px rgba(60,60,60,0.4), 6px 6px 16px rgba(0,0,0,0.8)"
textShadow: "0 1px 2px rgba(0,0,0,0.5)"
```

---

### 4. RawDataAccordion

**File**: `src/components/chat/RawDataAccordion.tsx`

**Props**:
```typescript
interface RawDataAccordionProps {
  title: string;
  data: Array<Record<string, any>>;
  columns: Array<{ key: string; label: string; format?: string }>;
  defaultOpen?: boolean;
}
```

**Behavior**:
- Accordion expand/collapse with smooth animation
- Table with sortable columns
- Sticky header on scroll
- Max 10 rows shown, "View all" button expands

**Example Data Sections**:
1. Top Campaigns (source, medium, campaign, sessions, users)
2. Top Events (event name, count)
3. Landing Pages (page, sessions, bounce rate)
4. Exit Pages (page, sessions, exits)
5. Top Cities (city, country, sessions)
6. Top Regions (region, country, sessions)

**Styling**:
```typescript
// Accordion trigger
className: "flex items-center justify-between w-full p-3 rounded-lg bg-[#1a1a1a]"
boxShadow: "-4px -4px 10px rgba(60,60,60,0.4), 4px 4px 10px rgba(0,0,0,0.8)"

// Table
className: "w-full text-sm"
th: "px-3 py-2 text-left text-[#999] font-medium border-b border-[#333]"
td: "px-3 py-2 text-[#e0e0e0] border-b border-[#2a2a2a]"
```

---

### 5. ResizeHandle (Desktop Only)

**File**: `src/components/chat/ResizeHandle.tsx`

**Props**:
```typescript
interface ResizeHandleProps {
  onResize: (deltaX: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
}
```

**Behavior**:
- Vertical divider between chat and metrics panel
- Drag to resize (constrain between 300px - 800px)
- Cursor changes to `col-resize` on hover
- Double-click to reset to default width (400px)

**Implementation**:
```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  e.preventDefault();
  onResizeStart();

  const startX = e.clientX;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = startX - moveEvent.clientX; // Inverted (resize from right)
    onResize(deltaX);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    onResizeEnd();
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
```

**Styling**:
```typescript
className: "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#6CA3A2] transition-colors"
```

---

### 6. MobileBottomSheet

**File**: `src/components/chat/MobileBottomSheet.tsx`

**Props**:
```typescript
interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // e.g., [0.3, 0.7, 1.0] of viewport height
}
```

**Behavior**:
- Drag handle at top (visual affordance)
- Swipe up/down to change snap points
- Swipe down quickly to dismiss
- Background overlay (semi-transparent)
- Prevents body scroll when open

**Framer Motion Config**:
```typescript
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: isOpen ? 0 : '100%' }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.2}
  onDragEnd={(e, info) => {
    if (info.velocity.y > 500) onClose();
  }}
>
```

---

## State Management

### Zustand Store Extensions (useChatStore)

**Location**: `src/stores/useChatStore.ts`

**New State**:
```typescript
interface ChatState {
  // ... existing state

  // NEW: Metrics dashboard state
  metricsDashboard: {
    isVisible: boolean;
    selectedPlatform: PlatformType | null;
    width: number; // Desktop panel width
    mode: 'split' | 'collapsed' | 'overlay';
  };

  // NEW: Cached platform data
  platformData: PlatformDataPayload | null;
  platformDataTimestamp: number | null;

  // NEW: Actions
  toggleMetricsDashboard: () => void;
  setMetricsDashboardVisible: (visible: boolean) => void;
  setMetricsDashboardPlatform: (platform: PlatformType) => void;
  setMetricsDashboardWidth: (width: number) => void;
  setPlatformData: (data: PlatformDataPayload) => void;
}
```

**Implementation**:
```typescript
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // ... existing state

      metricsDashboard: {
        isVisible: false,
        selectedPlatform: null,
        width: 400, // Default width
        mode: 'collapsed',
      },

      platformData: null,
      platformDataTimestamp: null,

      toggleMetricsDashboard: () =>
        set((state) => ({
          metricsDashboard: {
            ...state.metricsDashboard,
            isVisible: !state.metricsDashboard.isVisible,
            mode: !state.metricsDashboard.isVisible ? 'split' : 'collapsed',
          },
        })),

      setMetricsDashboardVisible: (visible) =>
        set((state) => ({
          metricsDashboard: {
            ...state.metricsDashboard,
            isVisible: visible,
            mode: visible ? 'split' : 'collapsed',
          },
        })),

      setMetricsDashboardPlatform: (platform) =>
        set((state) => ({
          metricsDashboard: {
            ...state.metricsDashboard,
            selectedPlatform: platform,
          },
        })),

      setMetricsDashboardWidth: (width) =>
        set((state) => ({
          metricsDashboard: {
            ...state.metricsDashboard,
            width: Math.max(300, Math.min(800, width)), // Constrain
          },
        })),

      setPlatformData: (data) =>
        set({
          platformData: data,
          platformDataTimestamp: Date.now(),
        }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        // ... existing persisted state
        metricsDashboard: state.metricsDashboard, // Persist panel state
        // Don't persist platformData (always fetch fresh)
      }),
    }
  )
);
```

### Local Component State

Each component manages its own UI state:
- **MetricsDashboardPanel**: `isResizing`, `localWidth` (during drag)
- **RawDataAccordion**: `isOpen`, `showAll` (expanded rows)
- **PlatformTabs**: `scrollPosition` (for mobile horizontal scroll)
- **MobileBottomSheet**: `snapPointIndex`, `dragOffset`

---

## Edge Cases & Error Handling

### 1. No Platform Data Available

**Scenario**: User opens metrics panel before sending first message

**UI State**:
```tsx
<EmptyState
  icon={<ChartIcon />}
  title="No metrics data yet"
  description="Send a message to load platform metrics"
  action={<Button onClick={onClose}>Got it</Button>}
/>
```

**Behavior**: Panel can open but shows empty state, not error.

---

### 2. Stale Data (Cache Expiry)

**Scenario**: Platform data is >5 minutes old

**Detection**:
```typescript
const isStale = platformDataTimestamp && (Date.now() - platformDataTimestamp > 5 * 60 * 1000);
```

**UI Indicator**:
```tsx
{isStale && (
  <RefreshBanner>
    <ClockIcon /> Data may be outdated. Send a new message to refresh.
  </RefreshBanner>
)}
```

**Styling**: Yellow/amber warning banner at top of metrics panel

---

### 3. Platform Data Fetch Failed

**Scenario**: API error during `fetchAllGoogleAnalyticsProperties()`

**Data Received**: Partial data with error field
```typescript
{
  platforms: {
    googleAnalytics: { error: 'OAuth token expired' },
    metaAds: { data: {...} },
  }
}
```

**UI State**:
```tsx
<ErrorCard platform="Google Analytics">
  <AlertIcon /> Failed to load data
  <details>OAuth token expired</details>
  <Button onClick={handleReconnect}>Reconnect</Button>
</ErrorCard>
```

**Behavior**: Show errors per platform, don't block entire panel.

---

### 4. Token Expired During Session

**Scenario**: OAuth token expires while user is chatting

**Detection**: Platform health check in `sendMessage.ts` detects expired token

**Existing Handling**:
- `platformHealthIssues` array already emitted in stream
- Banner already shown in ChatPageClient

**Metrics Panel Enhancement**:
```tsx
{platformHealthIssues.map(issue => (
  <ErrorBanner key={issue.platform}>
    {issue.message}
    <Button onClick={() => reconnectPlatform(issue.platform)}>
      Fix Now
    </Button>
  </ErrorBanner>
))}
```

**Action**: Provide inline reconnection button in metrics panel.

---

### 5. No Connected Platforms

**Scenario**: User has no platforms connected yet (during onboarding)

**Detection**:
```typescript
const connectedPlatforms = client?.platforms.filter(p => p.isConnected) || [];
if (connectedPlatforms.length === 0) {
  return <NoPlatformsState />;
}
```

**UI State**:
```tsx
<NoPlatformsState>
  <PlatformIcon />
  <h3>No platforms connected</h3>
  <p>Connect a platform to see metrics here</p>
  <Button onClick={() => router.push('/onboarding')}>
    Connect Platform
  </Button>
</NoPlatformsState>
```

---

### 6. Mobile Keyboard Open

**Scenario**: User opens metrics panel while typing (mobile)

**Issue**: Keyboard obscures bottom sheet

**Solution**:
```typescript
useEffect(() => {
  const handleResize = () => {
    // Detect keyboard open (viewport height decreased)
    const isKeyboardOpen = window.visualViewport.height < window.innerHeight;
    setKeyboardVisible(isKeyboardOpen);
  };

  window.visualViewport?.addEventListener('resize', handleResize);
  return () => window.visualViewport?.removeEventListener('resize', handleResize);
}, []);

// Don't allow opening bottom sheet when keyboard is visible
const handleToggle = () => {
  if (keyboardVisible) {
    // Blur input first, wait for keyboard to close
    document.activeElement?.blur();
    setTimeout(() => setIsOpen(true), 300);
  } else {
    setIsOpen(true);
  }
};
```

---

### 7. Rapid Platform Switching

**Scenario**: User clicks multiple platform tabs quickly

**Issue**: Race conditions, flickering content

**Solution**:
```typescript
const [isTransitioning, setIsTransitioning] = useState(false);

const handlePlatformChange = async (newPlatform: PlatformType) => {
  if (isTransitioning) return; // Debounce

  setIsTransitioning(true);
  setSelectedPlatform(newPlatform);

  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 200));
  setIsTransitioning(false);
};
```

---

### 8. Large Dataset Rendering

**Scenario**: Property has 100+ campaigns, cities, etc.

**Issue**: Performance degradation with large tables

**Solution**:
```typescript
// Virtual scrolling for tables with >50 rows
import { useVirtualizer } from '@tanstack/react-virtual';

// Or simpler: Pagination
const [currentPage, setCurrentPage] = useState(0);
const pageSize = 10;
const visibleData = data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
```

**Default Behavior**: Show top 10 rows, "Load more" button.

---

### 9. Panel Resize Boundary Violations

**Scenario**: User drags resize handle beyond constraints

**Constraints**:
- Min width: 300px (metrics panel unusable below this)
- Max width: 800px (chat needs minimum 400px)
- Available space: `window.innerWidth - SIDEBAR_WIDTH - 400`

**Solution**:
```typescript
const handleResize = (deltaX: number) => {
  const newWidth = Math.max(
    300,
    Math.min(
      800,
      window.innerWidth - SIDEBAR_WIDTH - 400,
      currentWidth + deltaX
    )
  );
  setWidth(newWidth);
};
```

---

### 10. Loading State Race Conditions

**Scenario**: User sends new message while previous stream is still processing

**Existing Protection**: `isLoading` state in `useStreamingChat` prevents duplicate sends

**Metrics Panel Behavior**:
```tsx
{isLoading && (
  <LoadingOverlay>
    <Spinner />
    Fetching latest data...
  </LoadingOverlay>
)}
```

**Show loading state over existing data, don't clear it.**

---

## Mobile Responsive Strategy

### Breakpoints

```typescript
const MOBILE_BREAKPOINT = 768; // Below this = mobile mode
const TABLET_BREAKPOINT = 1024; // 768-1024 = tablet (hybrid)
```

### Responsive Behavior

| Feature | Desktop (>1024px) | Tablet (768-1024px) | Mobile (<768px) |
|---------|-------------------|---------------------|-----------------|
| Panel Type | Resizable right panel | Fixed right panel (300px) | Bottom sheet |
| Resize Handle | ✅ Yes | ❌ No | ❌ No |
| Animation | Slide from right | Slide from right | Slide from bottom |
| Tabs | Horizontal with arrows | Horizontal scrollable | Horizontal scrollable |
| Metric Cards | 2-column grid | 2-column grid | 1-column stack |
| Tables | Full width | Horizontal scroll | Horizontal scroll |
| Toggle Button | Top-right corner | Top-right corner | Floating button (bottom-right) |
| Collapse Gesture | Click button | Click button | Swipe down |

### Mobile-Specific Components

#### Floating Toggle Button

```tsx
<motion.button
  className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-[#6CA3A2] shadow-lg"
  whileTap={{ scale: 0.95 }}
  onClick={toggleMetricsDashboard}
>
  <ChartBarIcon className="w-6 h-6 text-white" />
</motion.button>
```

Position: Above message input, below any keyboard.

#### Drag Handle (Mobile Bottom Sheet)

```tsx
<div className="flex justify-center py-2">
  <div className="w-10 h-1 rounded-full bg-[#666]" />
</div>
```

Visual affordance for swipe gesture.

### Touch Gestures

1. **Swipe Up**: Open bottom sheet (from collapsed state)
2. **Swipe Down**: Close bottom sheet (from any snap point)
3. **Drag Handle**: Adjust snap point (30%, 70%, 100% of viewport)
4. **Tap Outside**: Close bottom sheet (with backdrop)
5. **Two-Finger Scroll**: Scroll table content (prevent panel close)

### Responsive Layout Hook

```typescript
export const useResponsiveLayout = () => {
  const [layout, setLayout] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) setLayout('mobile');
      else if (width < TABLET_BREAKPOINT) setLayout('tablet');
      else setLayout('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return layout;
};
```

---

## Neomorphic Design Specifications

### Design Tokens

```typescript
export const NEOMORPHIC_TOKENS = {
  // Base colors
  background: '#1a1a1a',
  surface: '#1a1a1a',

  // Accent
  accent: '#6CA3A2',
  accentHover: '#5a8f8e',

  // Text
  textPrimary: '#e0e0e0',
  textSecondary: '#999',
  textTertiary: '#666',

  // Borders
  border: '#333',
  borderLight: '#444',

  // Shadows (Raised elements)
  shadowHighlight: 'rgba(60, 60, 60, 0.4)',
  shadowDark: 'rgba(0, 0, 0, 0.8)',
  shadowRaised: '-6px -6px 16px rgba(60, 60, 60, 0.4), 6px 6px 16px rgba(0, 0, 0, 0.8)',

  // Shadows (Inset/pressed elements)
  shadowInset: 'inset -3px -3px 8px rgba(60, 60, 60, 0.4), inset 3px 3px 8px rgba(0, 0, 0, 0.8)',

  // Text shadow
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',

  // Status colors
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#ef4444',
  info: '#6CA3A2',
};
```

### Component Patterns

#### Raised Card (Default)
```css
background: #1a1a1a;
box-shadow: -6px -6px 16px rgba(60, 60, 60, 0.4), 6px 6px 16px rgba(0, 0, 0, 0.8);
border-radius: 12px;
```

#### Pressed/Inset Card (Active state)
```css
background: #1a1a1a;
box-shadow: inset -3px -3px 8px rgba(60, 60, 60, 0.4), inset 3px 3px 8px rgba(0, 0, 0, 0.8);
border-radius: 12px;
```

#### Subtle Card (Low emphasis)
```css
background: #1a1a1a;
box-shadow: -4px -4px 10px rgba(60, 60, 60, 0.4), 4px 4px 10px rgba(0, 0, 0, 0.8);
border-radius: 12px;
```

#### Interactive Button (Hover/Active states)
```css
/* Default */
box-shadow: -6px -6px 16px rgba(60, 60, 60, 0.4), 6px 6px 16px rgba(0, 0, 0, 0.8);

/* Hover */
box-shadow: -8px -8px 20px rgba(60, 60, 60, 0.5), 8px 8px 20px rgba(0, 0, 0, 0.9);

/* Active */
box-shadow: inset -3px -3px 8px rgba(60, 60, 60, 0.4), inset 3px 3px 8px rgba(0, 0, 0, 0.8);
```

#### Accent Button (Primary actions)
```css
background: linear-gradient(135deg, #6CA3A2 0%, #5a8f8e 100%);
box-shadow: -6px -6px 16px rgba(60, 60, 60, 0.4), 6px 6px 16px rgba(0, 0, 0, 0.8);
color: white;
```

### Typography Scale

```typescript
export const TYPOGRAPHY = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  h4: 'text-lg font-medium',
  body: 'text-base',
  small: 'text-sm',
  xs: 'text-xs',

  // All text has shadow
  shadow: 'text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5)',
};
```

### Spacing Scale (Tailwind)

```typescript
export const SPACING = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};
```

### Border Radius

```typescript
export const RADIUS = {
  sm: '0.5rem',   // 8px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  full: '9999px', // Circular
};
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Set up basic panel structure and data flow

**Tasks**:
1. ✅ Create base component structure
   - `MetricsDashboardPanel.tsx` (container)
   - `PanelHeader.tsx`
   - `PanelContent.tsx`
   - Basic show/hide logic

2. ✅ Extend Zustand store
   - Add `metricsDashboard` state
   - Add actions (toggle, setWidth, setPlatform)
   - Persist panel preferences

3. ✅ Implement data flow
   - Modify `sendMessage.ts` to emit platform data in SSE
   - Extend `useStreamingChat` to capture platform data
   - Store in Zustand on receive

4. ✅ Integrate into ChatPageClient
   - Add toggle button in header
   - Render `MetricsDashboardPanel` (conditional)
   - Handle layout shifts (adjust chat width)

5. ✅ Basic desktop layout
   - Fixed 400px panel (no resize yet)
   - Slide-in animation (Framer Motion)
   - Collapse button

**Deliverables**:
- Panel can open/close ✅
- Platform data flows to panel ✅
- Empty state shows when no data ✅
- Basic neomorphic styling applied ✅

**Success Criteria**:
- Panel toggles without breaking chat layout
- Platform data updates when new message sent
- No duplicate API calls (verify in Network tab)

---

### Phase 2: Core Metrics Display (Week 1-2)

**Goal**: Display key metrics with trend indicators

**Tasks**:
1. ✅ Create `PlatformTabs.tsx`
   - Render connected platforms
   - Highlight selected platform
   - Handle platform switching

2. ✅ Create `MetricCard.tsx`
   - Display single metric (label, value, trend)
   - Support multiple formats (number, currency, %, duration)
   - Add trend arrow and percentage change
   - Apply neomorphic styling

3. ✅ Create `MetricsGrid.tsx`
   - Responsive grid layout (2 cols desktop, 1 col mobile)
   - Map platform data to metric cards
   - Handle missing metrics gracefully

4. ✅ Implement metric formatters
   - Number: `12,345`
   - Currency: `$1,234.56`
   - Percentage: `12.3%`
   - Duration: `3m 24s`

5. ✅ Add loading skeletons
   - Shimmer effect for metric cards
   - Show while data is streaming

**Deliverables**:
- All GA4 metrics displayed in cards ✅
- Trends calculated from previous period ✅
- Platform tabs switch between GA/Meta/LinkedIn/Google Ads ✅
- Smooth loading states ✅

**Success Criteria**:
- All 6 enhanced GA metrics visible (campaigns, events, landing pages, exit pages, cities, regions)
- Trend percentages accurate (compare to previous period)
- No layout shifts during loading

---

### Phase 3: Dimensional Data Tables (Week 2)

**Goal**: Show detailed breakdowns with interactive tables

**Tasks**:
1. ✅ Create `RawDataAccordion.tsx`
   - Expand/collapse sections
   - Smooth animations (Framer Motion)
   - Sticky header on scroll

2. ✅ Create `DataTable.tsx`
   - Render tabular data
   - Format columns based on type
   - Horizontal scroll on mobile
   - Zebra striping (subtle)

3. ✅ Implement sortable columns
   - Click header to sort (asc/desc)
   - Visual indicator (arrow icon)
   - Default sort by primary metric (sessions)

4. ✅ Add pagination/load more
   - Show top 10 rows by default
   - "Load more" button (expand to 25, 50, all)
   - Don't use infinite scroll (UX preference)

5. ✅ Map GA4 dimensional data
   - Top Campaigns (source, medium, campaign, sessions, users)
   - Top Events (event name, count)
   - Landing Pages (page, sessions, bounce rate)
   - Exit Pages (page, sessions, exits)
   - Top Cities (city, country, sessions)
   - Top Regions (region, country, sessions)

**Deliverables**:
- 6 accordion sections for GA4 dimensions ✅
- Tables with sorting and pagination ✅
- Mobile-friendly horizontal scroll ✅
- Clean neomorphic table styling ✅

**Success Criteria**:
- All GA4 dimensional data accessible
- Tables render <100ms for 50 rows
- Sorting works correctly (numeric vs alphabetic)

---

### Phase 4: Resize & Responsiveness (Week 2-3)

**Goal**: Desktop resize handle + mobile bottom sheet

**Tasks**:
1. ✅ Create `ResizeHandle.tsx` (desktop)
   - Vertical drag handle
   - Constrain width (300-800px)
   - Cursor feedback (`col-resize`)
   - Double-click to reset

2. ✅ Implement resize logic
   - Track mouse position during drag
   - Update panel width in real-time
   - Persist width to Zustand
   - Adjust chat content width dynamically

3. ✅ Create `MobileBottomSheet.tsx`
   - Framer Motion drag gesture
   - 3 snap points (30%, 70%, 100%)
   - Swipe down to dismiss
   - Backdrop overlay (semi-transparent)

4. ✅ Add `useResponsiveLayout` hook
   - Detect screen size (desktop/tablet/mobile)
   - Switch panel mode automatically
   - Handle orientation change

5. ✅ Mobile-specific UI
   - Floating toggle button (bottom-right)
   - Drag handle visual
   - Prevent body scroll when open
   - Close on backdrop tap

**Deliverables**:
- Desktop panel resizable ✅
- Mobile bottom sheet with gestures ✅
- Smooth transitions between modes ✅
- No layout jank on resize ✅

**Success Criteria**:
- Resize feels smooth (no lag)
- Mobile gestures intuitive (QA with users)
- Panel width/state persists across sessions

---

### Phase 5: Edge Cases & Polish (Week 3)

**Goal**: Handle all error states and edge cases

**Tasks**:
1. ✅ Implement all error states
   - No platform data (empty state)
   - API fetch failed (error card per platform)
   - Token expired (inline reconnect button)
   - No connected platforms (CTA to onboarding)

2. ✅ Add stale data indicator
   - Detect if data >5 minutes old
   - Show warning banner with refresh CTA
   - Explain why data may be outdated

3. ✅ Optimize large dataset rendering
   - Virtual scrolling for 100+ row tables
   - Lazy load accordion content (only render when open)
   - Memoize metric calculations

4. ✅ Add `RefreshIndicator` component
   - Show last updated timestamp
   - Pulse animation when data is fresh (<1 min)
   - Subtle icon for stale data

5. ✅ Keyboard accessibility
   - Tab navigation through metrics
   - Enter to toggle accordions
   - Esc to close panel
   - Focus trap when panel open (mobile)

6. ✅ Loading states
   - Skeleton loaders for metrics grid
   - Spinner overlay during data fetch
   - Smooth transitions (no flash of content)

**Deliverables**:
- All 10 edge cases handled ✅
- Graceful error messages ✅
- Performance optimized for large datasets ✅
- Accessible via keyboard ✅

**Success Criteria**:
- No console errors or warnings
- WCAG 2.1 AA compliance
- 60fps animations on mid-range devices

---

### Phase 6: Multi-Platform Support (Week 3-4)

**Goal**: Extend beyond GA to all platforms

**Tasks**:
1. ✅ Map Meta Ads data structure
   - Campaigns (name, spend, impressions, clicks, CTR)
   - Ad Sets (name, spend, results, CPC)
   - Ads (name, spend, impressions, CTR)
   - Key metrics (spend, ROAS, CPA, CTR)

2. ✅ Map LinkedIn Ads data structure
   - Campaigns (name, spend, impressions, clicks)
   - Demographics (job title, seniority, company size)
   - Key metrics (spend, CTR, CPC, conversions)

3. ✅ Map Google Ads data structure
   - Campaigns (name, spend, impressions, clicks, conversions)
   - Keywords (search terms, CPC, quality score)
   - Key metrics (spend, ROAS, conversion rate, CPC)

4. ✅ Create platform-specific metric cards
   - Different metrics for each platform
   - Conditional rendering based on platform type
   - Platform-specific icons and colors

5. ✅ Unify data display logic
   - Abstract `MetricCard` to support any metric
   - Generic `DataTable` for any dimensional data
   - Consistent styling across platforms

**Deliverables**:
- GA, Meta, LinkedIn, Google Ads all supported ✅
- Platform-specific metrics displayed correctly ✅
- Switching platforms seamless ✅

**Success Criteria**:
- All 4 platforms render metrics
- No missing data for any platform
- Switching platforms <100ms

---

### Phase 7: Final Polish & Testing (Week 4)

**Goal**: Production-ready feature with full test coverage

**Tasks**:
1. ✅ Unit tests
   - Test all components in isolation
   - Mock platform data
   - Test edge cases (no data, errors, etc.)

2. ✅ Integration tests
   - Test data flow (sendMessage → SSE → Zustand → Panel)
   - Test platform switching
   - Test resize behavior

3. ✅ E2E tests (Playwright)
   - User opens panel
   - User resizes panel (desktop)
   - User switches platforms
   - User expands accordion, sorts table
   - User closes panel (panel state persists)

4. ✅ Accessibility audit
   - Run axe-core
   - Manual keyboard navigation test
   - Screen reader test (VoiceOver/NVDA)

5. ✅ Performance testing
   - Lighthouse score >90
   - No layout shifts (CLS < 0.1)
   - Fast render times (<200ms)

6. ✅ Cross-browser testing
   - Chrome, Firefox, Safari, Edge
   - iOS Safari, Chrome Mobile
   - Test on 3 screen sizes (mobile, tablet, desktop)

7. ✅ Documentation
   - Add usage instructions to README
   - Document component API
   - Add troubleshooting guide

**Deliverables**:
- Test coverage >80% ✅
- No critical bugs ✅
- Documentation complete ✅
- Ready for production ✅

**Success Criteria**:
- All tests passing
- No console warnings in production
- Positive user feedback from beta testing

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Coverage Target**: >80%

**Test Files**:
1. `MetricsDashboardPanel.test.tsx`
   - Renders correctly with platform data
   - Toggles visibility
   - Handles empty state
   - Handles error state

2. `MetricCard.test.tsx`
   - Displays metric value
   - Formats numbers, currency, percentages correctly
   - Shows trend indicator (up/down arrow)
   - Calculates percentage change

3. `PlatformTabs.test.tsx`
   - Renders all connected platforms
   - Highlights active platform
   - Calls onSelectPlatform callback
   - Disables platforms with no data

4. `RawDataAccordion.test.tsx`
   - Expands and collapses
   - Renders table data
   - Sorts columns correctly
   - Shows/hides "Load more" button

5. `ResizeHandle.test.tsx`
   - Handles mouse drag events
   - Constrains width to min/max
   - Resets width on double-click

6. `useChatStore.test.ts`
   - Updates metrics dashboard state
   - Persists panel preferences
   - Stores platform data correctly

**Example Test**:
```typescript
describe('MetricCard', () => {
  it('should display formatted number with trend', () => {
    render(
      <MetricCard
        label="Sessions"
        value={12345}
        previousValue={10000}
        format="number"
      />
    );

    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('12,345')).toBeInTheDocument();
    expect(screen.getByText('↗ +23.5%')).toBeInTheDocument();
  });

  it('should handle missing previous value', () => {
    render(
      <MetricCard label="Users" value={5000} format="number" />
    );

    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });
});
```

---

### Integration Tests (Jest + MSW)

**Focus**: Data flow between components

**Test Scenarios**:
1. **SSE Data Flow**
   - Mock SSE stream from `sendMessage`
   - Verify `useStreamingChat` captures platform data
   - Verify Zustand store updated
   - Verify panel displays data

2. **Platform Switching**
   - Mock multiple platforms in store
   - Switch to Meta Ads
   - Verify metrics update
   - Verify tables show Meta data

3. **Date Range Sync**
   - Change date range in ChatSidebar
   - Send new message
   - Verify panel shows updated date range
   - Verify metrics reflect new range

4. **Cache Expiry**
   - Mock platform data with old timestamp
   - Verify stale indicator shows
   - Send new message
   - Verify indicator disappears

**Example Test**:
```typescript
describe('Metrics Panel Integration', () => {
  it('should update when new platform data received', async () => {
    const { result } = renderHook(() => useChatStore());

    // Simulate SSE event with platform data
    act(() => {
      result.current.setPlatformData({
        timestamp: Date.now(),
        platforms: {
          googleAnalytics: mockGAData,
        },
      });
    });

    // Render panel
    render(<MetricsDashboardPanel isVisible={true} onToggle={jest.fn()} />);

    // Verify metrics displayed
    await waitFor(() => {
      expect(screen.getByText('12,345')).toBeInTheDocument(); // Sessions
      expect(screen.getByText('5,678')).toBeInTheDocument(); // Users
    });
  });
});
```

---

### E2E Tests (Playwright)

**Coverage**: Critical user flows

**Test Files**:
1. `metrics-panel-basic.spec.ts`
   ```typescript
   test('user can open and close metrics panel', async ({ page }) => {
     await page.goto('/chat');

     // Panel hidden by default
     await expect(page.locator('[data-testid="metrics-panel"]')).not.toBeVisible();

     // Click toggle button
     await page.click('[data-testid="metrics-toggle"]');

     // Panel visible
     await expect(page.locator('[data-testid="metrics-panel"]')).toBeVisible();

     // Click collapse button
     await page.click('[data-testid="metrics-collapse"]');

     // Panel hidden again
     await expect(page.locator('[data-testid="metrics-panel"]')).not.toBeVisible();
   });
   ```

2. `metrics-panel-resize.spec.ts`
   ```typescript
   test('user can resize panel on desktop', async ({ page }) => {
     await page.setViewportSize({ width: 1920, height: 1080 });
     await page.goto('/chat');
     await page.click('[data-testid="metrics-toggle"]');

     const handle = page.locator('[data-testid="resize-handle"]');
     const box = await handle.boundingBox();

     // Drag left to increase width
     await page.mouse.move(box.x, box.y);
     await page.mouse.down();
     await page.mouse.move(box.x - 200, box.y);
     await page.mouse.up();

     // Verify panel width increased
     const panel = page.locator('[data-testid="metrics-panel"]');
     const panelBox = await panel.boundingBox();
     expect(panelBox.width).toBeGreaterThan(400);
   });
   ```

3. `metrics-panel-platform-switch.spec.ts`
   ```typescript
   test('user can switch between platforms', async ({ page }) => {
     await page.goto('/chat');
     await page.click('[data-testid="metrics-toggle"]');

     // Default: Google Analytics
     await expect(page.getByText('Sessions')).toBeVisible();

     // Switch to Meta Ads
     await page.click('[data-testid="platform-tab-meta-ads"]');

     // Meta metrics visible
     await expect(page.getByText('Ad Spend')).toBeVisible();
     await expect(page.getByText('ROAS')).toBeVisible();
   });
   ```

4. `metrics-panel-mobile.spec.ts`
   ```typescript
   test('user can interact with bottom sheet on mobile', async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto('/chat');

     // Tap floating button
     await page.click('[data-testid="metrics-toggle-mobile"]');

     // Bottom sheet visible
     await expect(page.locator('[data-testid="bottom-sheet"]')).toBeVisible();

     // Swipe down to close
     const sheet = page.locator('[data-testid="bottom-sheet"]');
     const box = await sheet.boundingBox();
     await page.mouse.move(box.x + box.width / 2, box.y + 50);
     await page.mouse.down();
     await page.mouse.move(box.x + box.width / 2, box.y + 300, { steps: 10 });
     await page.mouse.up();

     // Sheet dismissed
     await expect(sheet).not.toBeVisible();
   });
   ```

---

### Accessibility Testing

**Tools**:
- axe-core (automated)
- Manual keyboard navigation
- Screen reader testing (VoiceOver, NVDA)

**Checklist**:
- [ ] All interactive elements focusable
- [ ] Focus order logical (tab through metrics → tables → buttons)
- [ ] Focus indicator visible (outline or highlight)
- [ ] Keyboard shortcuts documented
  - `Tab` / `Shift+Tab`: Navigate
  - `Enter` / `Space`: Activate buttons
  - `Escape`: Close panel
  - `Arrow keys`: Navigate table rows (optional)
- [ ] ARIA labels on icon buttons
  - Collapse button: `aria-label="Close metrics panel"`
  - Resize handle: `aria-label="Resize panel"`
  - Platform tabs: `aria-label="Switch to Google Analytics"`
- [ ] ARIA roles for tables
  - `<table role="table">`
  - `<thead role="rowgroup">`
  - `<th role="columnheader">`
- [ ] Screen reader announcements
  - Panel opened: "Metrics panel opened"
  - Platform switched: "Now showing Meta Ads metrics"
  - Data updated: "Metrics updated"
- [ ] Color contrast >4.5:1 for text
- [ ] No reliance on color alone (use icons + text)
- [ ] Focus not lost when panel opens/closes

**Example Improvement**:
```tsx
<button
  onClick={toggleMetricsDashboard}
  aria-label="Toggle metrics panel"
  aria-expanded={isVisible}
>
  <ChartBarIcon aria-hidden="true" />
</button>
```

---

### Performance Testing

**Metrics**:
- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Time to Interactive (TTI)**: <3.5s
- **Total Blocking Time (TBT)**: <300ms

**Optimization Strategies**:
1. **Code Splitting**
   ```typescript
   const MetricsDashboardPanel = lazy(() =>
     import('@/components/chat/MetricsDashboardPanel')
   );
   ```

2. **Memoization**
   ```typescript
   const MetricCard = memo(({ label, value, format }: MetricCardProps) => {
     // Component logic
   });

   const formattedValue = useMemo(() => {
     return formatMetric(value, format);
   }, [value, format]);
   ```

3. **Virtual Scrolling** (for large tables)
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual';

   const rowVirtualizer = useVirtualizer({
     count: data.length,
     getScrollElement: () => parentRef.current,
     estimateSize: () => 48, // Row height
   });
   ```

4. **Debounce Resize Events**
   ```typescript
   const debouncedResize = useMemo(
     () => debounce((width: number) => setWidth(width), 16), // 60fps
     []
   );
   ```

5. **Request Animation Frame**
   ```typescript
   const handleResize = (deltaX: number) => {
     requestAnimationFrame(() => {
       const newWidth = calculateNewWidth(deltaX);
       setWidth(newWidth);
     });
   };
   ```

**Performance Budget**:
- Bundle size increase: <50KB gzipped
- JavaScript execution: <200ms for panel render
- Memory usage: <10MB additional heap

---

## Performance Considerations

### Bundle Size Optimization

**Current Chat Bundle**: ~350KB gzipped
**Target Increase**: <50KB gzipped
**Total Target**: <400KB gzipped

**Strategies**:
1. **Code Splitting**: Lazy load `MetricsDashboardPanel`
2. **Tree Shaking**: Only import used Framer Motion components
3. **Icon Optimization**: Use SVG sprites instead of individual icons
4. **CSS-in-JS**: Consider CSS modules for static styles (reduce runtime cost)

**Bundle Analysis**:
```bash
npm run build
npx @next/bundle-analyzer
```

---

### Runtime Performance

**Target**: 60fps animations, <200ms panel render

**Critical Paths**:
1. **Panel Toggle**: Open/close animation must be smooth
   - Use `transform` and `opacity` (GPU-accelerated)
   - Avoid animating `width`, `height`, `left`, `right` (layout thrashing)

2. **Resize Drag**: No lag during resize
   - Use `requestAnimationFrame` for updates
   - Throttle resize events (16ms = 60fps)

3. **Platform Switch**: Instant tab change
   - Pre-render hidden tabs (trade memory for speed)
   - Or use CSS `display: none` with cached React trees

4. **Table Rendering**: <100ms for 50 rows
   - Virtual scrolling for 100+ rows
   - Memoize row components

**React DevTools Profiler**:
- Measure component render times
- Identify unnecessary re-renders
- Optimize with `memo`, `useMemo`, `useCallback`

---

### Memory Management

**Target**: <10MB additional heap for panel

**Strategies**:
1. **Cleanup on Unmount**: Remove event listeners, clear timers
   ```typescript
   useEffect(() => {
     const handleResize = () => { /* ... */ };
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);
   ```

2. **Limit Cached Data**: Only keep last 3 platform data payloads
   ```typescript
   const platformDataHistory = useRef<PlatformDataPayload[]>([]);

   const cachePlatformData = (data: PlatformDataPayload) => {
     platformDataHistory.current = [
       data,
       ...platformDataHistory.current.slice(0, 2),
     ];
   };
   ```

3. **Unload Heavy Components**: Unmount tables when accordion closed
   ```typescript
   <AnimatePresence>
     {isOpen && <DataTable data={data} />}
   </AnimatePresence>
   ```

4. **Weak References for Charts**: Use WeakMap for sparkline data
   ```typescript
   const sparklineCache = new WeakMap<MetricData, number[]>();
   ```

---

### Network Optimization

**Critical**: Zero duplicate API calls

**Verification**:
```typescript
// In sendMessage.ts, add timing logs
console.time('fetch-ga-data');
const gaData = await fetchAllGoogleAnalyticsProperties(...);
console.timeEnd('fetch-ga-data');

// Verify in browser DevTools:
// - Only ONE request per platform per message
// - Cache header used for GA (5-min TTL)
```

**Edge Case**: User rapidly switches platforms
- **Problem**: Could trigger multiple tab switches while data is loading
- **Solution**: Disable tabs during loading state
  ```tsx
  <PlatformTab
    disabled={isLoading || !platform.hasData}
    onClick={() => !isLoading && selectPlatform(platform)}
  />
  ```

---

## Success Criteria

### User Experience

- [ ] Panel opens/closes smoothly (<300ms animation)
- [ ] No layout shifts when panel appears
- [ ] All metrics visible without scrolling (desktop)
- [ ] Tables readable on mobile (horizontal scroll works)
- [ ] Resize handle feels responsive (no lag)
- [ ] Platform tabs switch instantly
- [ ] Loading states clear and non-intrusive
- [ ] Error messages actionable (e.g., "Reconnect" button)

### Technical

- [ ] Zero duplicate API calls (verified in Network tab)
- [ ] Platform data cached correctly (5-min TTL for GA)
- [ ] Panel state persists across page reloads
- [ ] No console errors or warnings
- [ ] TypeScript types correct (no `any` types)
- [ ] All edge cases handled gracefully
- [ ] Test coverage >80%
- [ ] Lighthouse score >90

### Accessibility

- [ ] WCAG 2.1 AA compliant
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader announces panel state changes
- [ ] Color contrast >4.5:1
- [ ] No focus traps (can escape panel with Esc)

### Performance

- [ ] Bundle size increase <50KB gzipped
- [ ] Panel render time <200ms
- [ ] Animations 60fps on mid-range devices
- [ ] No memory leaks (test with Chrome DevTools)
- [ ] CLS <0.1 (no layout shift)

### Business

- [ ] >50% of users open metrics panel in first session
- [ ] Average session duration increases by >20%
- [ ] User feedback positive (NPS >40)
- [ ] Feature adoption >70% within 2 weeks

---

## Open Questions (To be resolved before implementation)

1. **Default Panel State**: Should panel be open by default for new users?
   - **Recommendation**: Closed by default, show tooltip on first visit ("View metrics here")

2. **Sparklines**: Include mini trend charts in metric cards?
   - **Recommendation**: Yes, but only for time-series metrics (sessions, users, revenue)
   - Use lightweight charting library (e.g., `react-sparklines` or custom SVG)

3. **Export Data**: Should users be able to export table data (CSV)?
   - **Recommendation**: Phase 2 feature (not included in initial release)
   - Add "Export" button in accordion header

4. **Comparison Mode**: Compare two date ranges side-by-side?
   - **Recommendation**: Phase 2 feature
   - Complex UI, defer until v1 validated

5. **Real-time Updates**: Auto-refresh data every 5 minutes?
   - **Recommendation**: No auto-refresh (too disruptive)
   - User must send new message to refresh (aligns with chat paradigm)

6. **Offline Support**: Show stale data when offline?
   - **Recommendation**: Yes, show last cached data with clear "Offline" banner

7. **Multi-property Selection**: Allow selecting multiple GA properties?
   - **Recommendation**: No, show aggregated data for all properties (current behavior)
   - Advanced filtering is Phase 2 feature

---

## Risk Assessment

### High Risk

1. **Performance Impact**: Rendering large tables could slow down chat
   - **Mitigation**: Virtual scrolling, lazy loading, code splitting

2. **Layout Complexity**: Resizable panel could break responsive design
   - **Mitigation**: Extensive testing on multiple screen sizes, constrain min/max widths

3. **Data Synchronization**: Platform data could get out of sync with AI context
   - **Mitigation**: Emit platform data in same SSE stream as AI response (atomic operation)

### Medium Risk

4. **Mobile UX**: Bottom sheet gestures might conflict with chat scroll
   - **Mitigation**: Careful gesture detection, prevent propagation when sheet is active

5. **Cache Invalidation**: Stale data indicator might confuse users
   - **Mitigation**: Clear messaging ("Data is 6 minutes old. Send a message to refresh.")

6. **Multi-platform Differences**: Each platform has different metrics structure
   - **Mitigation**: Abstract data layer, generic components that adapt to any schema

### Low Risk

7. **Browser Compatibility**: Framer Motion animations might not work in older browsers
   - **Mitigation**: Target modern browsers (last 2 versions), provide fallback (no animation)

8. **Accessibility Regressions**: New interactions could break keyboard navigation
   - **Mitigation**: Thorough accessibility testing, ARIA labels, focus management

---

## Future Enhancements (Post-V1)

1. **Export to CSV/Excel**: Download table data
2. **Comparison Mode**: Compare two date ranges
3. **Custom Metrics**: User-defined calculated metrics
4. **Alerts**: Set thresholds, get notified when metrics change
5. **Annotations**: Add notes to specific dates (e.g., "Campaign launched")
6. **Saved Views**: Bookmark specific metric combinations
7. **Sharing**: Generate shareable link to metrics snapshot
8. **Drill-down**: Click metric to see detailed breakdown
9. **Charts**: Line/bar charts for trends (beyond sparklines)
10. **AI Insights**: Highlight anomalies detected by AI

---

## Approval Checklist

Before implementation begins, confirm:

- [ ] User has reviewed this plan
- [ ] All design decisions approved
- [ ] Component hierarchy makes sense
- [ ] Data flow strategy validated (no duplicate API calls)
- [ ] Edge cases are comprehensive
- [ ] Mobile strategy is acceptable
- [ ] Implementation timeline is realistic (4 weeks)
- [ ] Testing strategy is sufficient
- [ ] Success criteria are measurable

**User Approval Required**: Please review and confirm approval to proceed with Phase 1.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-28
**Authors**: Claude Code
**Next Review**: After Phase 1 completion
