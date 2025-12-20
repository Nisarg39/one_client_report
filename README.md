# OneAssist - Marketing Analytics Platform

A simple, affordable marketing analytics platform that helps freelancers, small businesses, and agencies centralize campaign data from multiple platforms (Google Analytics, Google Ads, Meta Ads, LinkedIn Ads) in a single workspace with AI-powered insights.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **MongoDB** - Database with Mongoose ORM
- **NextAuth.js** - OAuth authentication (Google, GitHub)
- **OpenAI API** - AI-powered chat insights
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Framer Motion** - Animation library

## Key Features

- **Single Workspace**: Auto-created workspace per user for simplified campaign management
- **Multi-Platform Integration**: Connect Google Analytics, Google Ads, Meta Ads, LinkedIn Ads
- **AI Chatbot**: Streaming chat interface with context-aware campaign insights
- **Tier-Based Pricing**: Student (FREE), Professional (₹299/mo), Agency (₹999/mo), Enterprise (Custom)
- **Educational Mode**: Mock data scenarios and tutoring agent for students
- **Real-Time Metrics**: Dashboard with aggregated campaign performance data

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   │   ├── chat/          # Chat-related actions
│   │   └── subscription/  # Subscription management
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── platforms/     # Platform OAuth callbacks
│   │   └── payu/          # Payment gateway
│   ├── chat/              # Chat page
│   ├── dashboard/         # Dashboard page
│   └── subscribe/         # Subscription pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── chat/              # Chat UI components
│   ├── dashboard/         # Dashboard components
│   ├── features/          # Marketing/landing page components
│   ├── payment/           # Payment components
│   └── subscription/      # Subscription management
├── lib/
│   ├── ai/                # AI chatbot logic, agents, system prompts
│   ├── platforms/         # Platform data fetchers (GA, Google Ads, Meta, LinkedIn)
│   ├── auth/              # NextAuth configuration
│   ├── payu/              # Payment gateway integration
│   └── utils/             # Utility functions (trial limits, subscription limits)
├── models/                # Mongoose models (User, Client, Conversation, Subscription)
├── types/                 # TypeScript type definitions
└── scripts/               # Utility scripts, migrations, testing
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Documentation

### Product Documentation
- [Product Requirements Document (PRD)](./docs/PRD.md) - Comprehensive product requirements and market analysis
- [Color Palette](./docs/COLOR_PALETTE.md) - Custom dark theme color scheme and usage guidelines

### Analytics & Tracking
- [Google Tag Manager Setup](./docs/GOOGLE-TAG-MANAGER-SETUP.md) - Complete guide for configuring GTM and Google Analytics

### Design System
- [Design System Overview](./docs/design/README.md) - Complete design system documentation
- [Design Principles](./docs/design/01-DESIGN_PRINCIPLES.md) - Core design philosophy and values
- [Color System](./docs/design/02-COLOR_SYSTEM.md) - Color palette, usage, and accessibility
- [Typography](./docs/design/03-TYPOGRAPHY.md) - Font system, hierarchy, and text styles
- [Spacing & Layout](./docs/design/04-SPACING_LAYOUT.md) - Grid system, spacing scale, and layout patterns
- [Components](./docs/design/05-COMPONENTS.md) - Component guidelines and usage examples
- [Animations](./docs/design/06-ANIMATIONS.md) - Motion principles and animation guidelines
- [Accessibility](./docs/design/07-ACCESSIBILITY.md) - WCAG compliance and inclusive design

### Agent Configurations
- [Agents Overview](./docs/agents/README.md) - AI agent configurations for development
- [UI/UX Agent](./docs/agents/UI-UX-AGENT.md) - ✅ UI/UX development with shadcn/ui & Aceternity UI
- [Backend Agent](./docs/agents/BACKEND-AGENT.md) - 🚧 API routes and server-side logic
- [Integration Agent](./docs/agents/INTEGRATION-AGENT.md) - 🚧 Third-party API integrations
- [AI Agent](./docs/agents/AI-AGENT.md) - 🚧 AI-powered insights generation
- [Testing Agent](./docs/agents/TESTING-AGENT.md) - 🚧 Testing strategy and implementation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# one_client_report
