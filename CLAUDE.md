# OneAssist - Marketing Analytics Platform

## Project Overview
A Next.js-based marketing analytics platform that aggregates data from multiple advertising platforms (Google Analytics, Google Ads, LinkedIn Ads, Meta Ads) and provides AI-powered insights through a chatbot interface. Built for freelancers, small businesses, and marketing agencies to centralize their campaign performance data in a single unified workspace.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Prisma ORM
- **AI**: OpenAI API (streaming chat interface)
- **Platform Integrations**: Google Analytics, Google Ads, LinkedIn Ads, Meta Ads
- **Authentication**: NextAuth.js with OAuth providers

## Development Setup
- Node.js version: 18+
- Package manager: npm
- Environment variables: See `.env.example`
- Development: `npm run dev`
- Build: `npm run build`
- Database scripts: `npx tsx scripts/[script-name].ts`

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   │   └── chat/          # Chat-related actions
│   ├── api/               # API routes
│   └── (routes)/          # Page routes
├── components/            # React components
│   └── chat/              # Chat UI components
├── lib/                   # Shared utilities
│   ├── ai/               # AI chatbot logic, agents, system prompts
│   ├── platforms/        # Platform data fetchers (GA, Google Ads, etc.)
│   └── db.ts             # Database connection
├── models/               # Prisma models & database schemas
├── types/                # TypeScript type definitions
└── scripts/              # Utility scripts, migrations, testing
```

## Key Features
1. **Single Workspace Architecture**: Auto-created workspace per user for simplified campaign management
2. **Platform Integrations**: OAuth-based connections to major ad platforms (Google Analytics, Google Ads, Meta Ads, LinkedIn Ads)
3. **AI Chatbot**: Streaming chat interface with context-aware responses across all connected campaigns
4. **Hybrid Mode**: Can operate with real platform data OR mock data for educational/testing purposes
5. **Mock Data System**: Comprehensive test scenarios for development and student learning
6. **Dashboard**: Aggregated metrics and visualizations
7. **Tier-Based Access**: Usage-based pricing (Student/Free, Professional, Agency, Enterprise) with different message limits and features

## Architecture Patterns
- **Server Actions**: Heavy use of Next.js server actions for data mutations
- **Streaming**: AI responses stream using React Server Components
- **Data Fetching**: Platform-specific fetchers in `src/lib/platforms/`
- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Mock System**: Scenario-based mock data for testing without API calls

## Coding Standards
- TypeScript strict mode enabled
- React Server Components by default
- Server Actions for mutations
- File naming: kebab-case for files, PascalCase for React components
- Async/await for all async operations
- Error handling at API boundaries

## Common Workflows
- **Local dev**: `npm run dev` (runs on localhost:3000)
- **Database scripts**: `npx tsx scripts/[script-name].ts`
- **Testing hybrid mode**: Use mock data scenarios
- **Platform integration**: OAuth flow through `/api/auth/[provider]`

## Important Conventions
- **Date handling**: Use DateRange type for filtering
- **Platform data**: Fetchers return normalized MetricData format
- **AI context**: System prompts in `src/lib/ai/systemPrompt.ts`
- **Mock data**: Scenarios in `src/lib/platforms/mock/`
- **Database**: Prisma client accessed via `src/lib/db.ts`

## Workspace & User Management

### Single Workspace Model (Current - Phase 1)
- **One workspace per user**: Automatically created on signup as `"{User Name}'s Workspace"`
- **Unlimited campaigns**: Users can connect multiple ad accounts/properties to their single workspace
- **Pricing differentiation**: Based on daily message limits, not workspace/client count
  - Student/Free: 50 messages/day
  - Professional: 150 messages/day
  - Agency: 300 messages/day
  - Enterprise: Unlimited messages

### Multi-Workspace (Future - Phase 2 for Agency+)
- **Agency Plan**: 3-5 workspaces for organizing different client groups
- **Enterprise Plan**: Unlimited workspaces
- Current "Client" model in code will support multiple workspaces
- Workspace selector UI shown only for Agency/Enterprise tiers (`usageTier === 'agency' || usageTier === 'enterprise'`)

## Usage Tiers

| Tier | Workspaces | Campaigns | Messages/Day | Real APIs | Features |
|------|-----------|-----------|--------------|-----------|----------|
| **Student/Free** | 1 | Unlimited (mock) | 50 | ❌ | Educational mode, mock scenarios, tutoring agent |
| **Professional** | 1 | Unlimited (real) | 150 | ✅ | Real platform APIs, priority support, JSON export |
| **Agency** | 1* | Unlimited (real) | 300 | ✅ | Higher volume, team members (future), multi-workspace (future) |
| **Enterprise** | Unlimited* | Unlimited (real) | Unlimited | ✅ | White-glove service, SLA, custom features |

*Multi-workspace feature planned for Phase 2

## Current Development Focus
- Single workspace architecture with auto-creation on signup
- Tier-based feature gating (workspace selector, clients dashboard)
- AI chatbot enhancement for multi-campaign workspace handling
- Hybrid mode for testing with/without real platform connections
- Mock data scenarios for comprehensive testing and education

## Important Implementation Details

### Auto-Workspace Creation
- **Location**: `src/models/User.ts` - `upsertFromOAuth()` method (lines 397-424)
- **Trigger**: Automatically runs when new user signs up via Google/GitHub OAuth
- **Behavior**: Creates a Client document with `name: "{User Name}'s Workspace"`
- **Failure handling**: Graceful - logs error but doesn't fail user creation

### Tier-Based UI Visibility
- **Workspace Selector** (`src/components/chat/ChatSidebar.tsx`):
  - Hidden for Student/Free/Professional users
  - Shown only for Agency/Enterprise users (`canManageMultipleWorkspaces`)
- **Clients Dashboard Link** (`src/components/chat/ChatSidebar.tsx`):
  - Hidden for Student/Free/Professional users
  - Shown only for Agency/Enterprise users in dashboard sidebar

### Pricing Display
- **Pricing Card**: `src/components/features/pricing-transparency.tsx`
  - Student: "Unlimited campaigns • 50 messages/day"
  - Professional: "Unlimited campaigns • 150 messages/day"
  - Agency: "Unlimited campaigns • 300 messages/day"
  - Enterprise: "Unlimited campaigns • Unlimited messages"
- **Products Page**: `src/app/products/page.tsx`
  - Updated feature lists to reflect campaign-based model

### Data Fetchers Behavior
- **Current behavior**: Return ALL accounts/properties from OAuth token
- **This is intentional**: Single workspace model means users see all their campaigns
- **Files affected**:
  - `src/lib/platforms/meta-ads/fetchData.ts`
  - `src/lib/platforms/google-ads/fetchData.ts`
  - `src/lib/platforms/googleAnalytics/fetchData.ts`

## Known Issues & Gotchas
- OAuth tokens need refresh handling
- Mock data must match real platform response format
- Hybrid mode requires session configuration
- Database scripts need explicit tsx execution
- **Multi-workspace UI**: Currently hidden for non-Agency/Enterprise users - will be enabled in Phase 2
