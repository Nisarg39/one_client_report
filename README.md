# Client Report Generator

A simple, affordable client reporting tool that helps freelance marketers and small agencies generate professional marketing reports in 5 minutes instead of spending hours manually compiling data.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Aceternity UI** - Beautiful animated components
- **Framer Motion** - Animation library

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
├── app/              # Next.js app router pages
│   ├── api/         # API routes
│   └── page.tsx     # Home page
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── aceternity/  # Aceternity UI components
│   ├── features/    # Feature-specific components
│   └── layout/      # Layout components
├── lib/
│   ├── api/         # API client functions
│   ├── types/       # TypeScript type definitions
│   └── utils.ts     # Utility functions
└── hooks/           # Custom React hooks
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
