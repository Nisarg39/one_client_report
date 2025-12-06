# One Client Report - Marketing Analytics Platform

## Project Overview
A Next.js-based marketing analytics platform that aggregates data from multiple advertising platforms (Google Analytics, Google Ads, LinkedIn Ads, Meta Ads) and provides AI-powered insights through a chatbot interface. Built for marketing agencies and businesses to centralize their campaign performance data.

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
1. **Platform Integrations**: OAuth-based connections to major ad platforms
2. **AI Chatbot**: Streaming chat interface with context-aware responses
3. **Hybrid Mode**: Can operate with real platform data OR mock data for testing
4. **Mock Data System**: Comprehensive test scenarios for development
5. **Dashboard**: Aggregated metrics and visualizations

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

## Current Development Focus
- AI chatbot enhancement with agent system
- Hybrid mode for testing with/without real platform connections
- Mock data scenarios for comprehensive testing
- Account type handling for different platform configurations

## Known Issues & Gotchas
- OAuth tokens need refresh handling
- Mock data must match real platform response format
- Hybrid mode requires session configuration
- Database scripts need explicit tsx execution
