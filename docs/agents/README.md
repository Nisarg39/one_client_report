# Agent Configurations

This folder contains specialized agent configurations for developing the Client Report Generator. Each agent has specific instructions and context to maintain consistency and quality.

## Available Agents

### 1. [UI/UX Agent](./UI-UX-AGENT.md)
**Purpose**: Design and implement user interface components
**Responsibilities**:
- Create new UI components using shadcn/ui and Aceternity UI
- Follow design system guidelines
- Ensure accessibility compliance
- Maintain visual consistency

### 2. [Backend Agent](./BACKEND-AGENT.md) *(Coming Soon)*
**Purpose**: Develop API routes and server-side logic
**Responsibilities**:
- Create Next.js API routes
- Integrate with third-party APIs
- Handle data processing
- Implement authentication

### 3. [Integration Agent](./INTEGRATION-AGENT.md) *(Coming Soon)*
**Purpose**: Connect with marketing platforms
**Responsibilities**:
- Integrate Google Analytics, Google Ads, Meta APIs
- Handle OAuth flows
- Process and normalize data
- Manage API rate limits

### 4. [AI Agent](./AI-AGENT.md) *(Coming Soon)*
**Purpose**: Implement AI-powered insights
**Responsibilities**:
- Generate report insights using OpenAI API
- Process marketing data for analysis
- Create natural language summaries
- Provide recommendations

### 5. [Testing Agent](./TESTING-AGENT.md) *(Coming Soon)*
**Purpose**: Write and maintain tests
**Responsibilities**:
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright
- Accessibility testing

---

## How to Use Agents

### For AI Assistants (Claude, ChatGPT, etc.)

When starting a development task:

1. **Identify the appropriate agent** based on the task type
2. **Read the agent configuration** thoroughly
3. **Follow all guidelines** specified in the agent document
4. **Reference design system docs** as instructed
5. **Maintain consistency** with existing patterns

### Example Usage

```markdown
I need help creating a new dashboard page.

Please act as the UI/UX Agent and follow the configuration in
docs/agents/UI-UX-AGENT.md to:
1. Design the dashboard layout
2. Use appropriate shadcn/ui components
3. Follow the design system guidelines
4. Ensure accessibility compliance
```

---

## Agent Development Principles

All agents must follow these core principles:

### 1. **Consistency First**
- Always reference existing patterns before creating new ones
- Use established components from shadcn/ui and Aceternity UI
- Follow the design system documentation

### 2. **Documentation Driven**
- Read relevant documentation before starting
- Document new patterns created
- Update design system if needed

### 3. **Quality Standards**
- Write TypeScript with proper types
- Ensure accessibility (WCAG 2.1 AA)
- Maintain performance standards
- Follow code style guidelines

### 4. **Incremental Development**
- Start with simple implementations
- Test thoroughly
- Iterate based on feedback
- Don't over-engineer

---

## Required Reading for All Agents

Before starting any development task, agents should review:

1. **[PRD](../PRD.md)** - Product context and requirements
2. **[Design Principles](../design/01-DESIGN_PRINCIPLES.md)** - Core design values
3. **[Color System](../design/02-COLOR_SYSTEM.md)** - Color usage guidelines
4. **[Typography](../design/03-TYPOGRAPHY.md)** - Text styling standards
5. **[Spacing & Layout](../design/04-SPACING_LAYOUT.md)** - Layout patterns
6. **[Components](../design/05-COMPONENTS.md)** - Component usage
7. **[Accessibility](../design/07-ACCESSIBILITY.md)** - A11y requirements

---

## Agent Configuration Structure

Each agent document includes:

- **Role & Responsibilities**: What this agent does
- **Required Knowledge**: Documentation to review
- **Tools & Libraries**: What to use
- **Guidelines & Rules**: How to work
- **Common Patterns**: Examples to follow
- **Checklist**: Validation before completion

---

## Contributing

When adding new agent configurations:

1. Follow the same structure as existing agents
2. Be specific about responsibilities
3. Include practical examples
4. Reference design system documentation
5. Provide checklists for quality assurance

---

## Quick Reference

| Task Type | Agent | Key Docs |
|-----------|-------|----------|
| UI Component | UI/UX | Design System, Components |
| API Route | Backend | PRD, API Docs |
| Third-party Integration | Integration | PRD, Integration Specs |
| AI Features | AI | PRD, AI Guidelines |
| Testing | Testing | Testing Standards |

---

## Version Control

- **Current Version**: 1.0
- **Last Updated**: 2025-10-30
- **Maintained By**: Development Team

---

## Support

For questions about agent configurations:
1. Review the agent documentation
2. Check design system docs
3. Refer to existing code examples
4. Consult with team lead
