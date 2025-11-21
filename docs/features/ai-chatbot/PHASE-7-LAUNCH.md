# Phase 7: Testing, Deployment & Launch

**Document Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** Implementation Roadmap
**Timeline:** 2-3 weeks
**Priority:** Critical

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Quality Assurance](#quality-assurance)
4. [Deployment Process](#deployment-process)
5. [Monitoring & Observability](#monitoring--observability)
6. [Launch Checklist](#launch-checklist)
7. [Post-Launch Plan](#post-launch-plan)
8. [Rollback Procedures](#rollback-procedures)
9. [Success Metrics](#success-metrics)

---

## Overview

### Purpose
Ensure the AI chatbot application is production-ready through comprehensive testing, staged deployment, and continuous monitoring.

### Goals
1. **Zero Critical Bugs**: No show-stoppers in production
2. **Performance Targets**: Meet all performance benchmarks
3. **Security Validated**: Pass security audit
4. **Smooth Deployment**: Zero-downtime deployment process
5. **Observable System**: Full visibility into production health

### Timeline

```
Week 1: Testing & QA
├── Day 1-2: Unit & Integration Tests
├── Day 3-4: E2E & Performance Testing
└── Day 5: Security Audit

Week 2: Staging Deployment & Testing
├── Day 1-2: Deploy to Staging
├── Day 3-4: User Acceptance Testing (UAT)
└── Day 5: Load Testing & Optimization

Week 3: Production Launch
├── Day 1: Pre-launch Checklist
├── Day 2: Production Deployment
├── Day 3-5: Post-launch Monitoring & Fixes
```

---

## Testing Strategy

### Test Pyramid

```
                    /\
                   /  \
                  / E2E \              ← 10% (Critical user flows)
                 /______\
                /        \
               / Integration\          ← 30% (API, DB, Services)
              /____________\
             /              \
            /   Unit Tests   \        ← 60% (Functions, Components)
           /__________________\
```

### Test Coverage Targets

| Layer | Coverage Target | Tools |
|-------|----------------|-------|
| Unit Tests | 80%+ | Vitest, React Testing Library |
| Integration Tests | 70%+ | Vitest, Supertest |
| E2E Tests | Critical paths | Playwright |
| Performance Tests | All key endpoints | Artillery, Lighthouse |
| Security Tests | OWASP Top 10 | npm audit, Snyk |

---

### Unit Tests

#### Component Tests

```typescript
// __tests__/components/chat/ChatInput.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatInput } from '@/components/chat/ChatInput';

describe('ChatInput', () => {
  it('should render input field and send button', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should call onSend when message is submitted', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText(/ask a question/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(onSend).toHaveBeenCalledWith('Test message');
    });
  });

  it('should not send empty messages', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    expect(onSend).not.toHaveBeenCalled();
  });

  it('should clear input after sending', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText(/ask a question/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should handle keyboard shortcuts (Cmd+Enter)', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText(/ask a question/i);

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', metaKey: true });

    await waitFor(() => {
      expect(onSend).toHaveBeenCalledWith('Test message');
    });
  });
});
```

#### Server Action Tests

```typescript
// __tests__/app/actions/chat/sendMessage.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from '@/app/actions/chat/sendMessage';
import ConversationModel from '@/models/Conversation';
import { generateCompletion } from '@/lib/ai/openai';

vi.mock('@/lib/auth/adapter', () => ({
  getCurrentUser: vi.fn(() => ({
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
  })),
}));

vi.mock('@/lib/ai/openai', () => ({
  generateCompletion: vi.fn(() => 'AI response'),
}));

vi.mock('@/models/Conversation');

describe('sendMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send message and return AI response', async () => {
    const mockConversation = {
      conversationId: 'conv123',
      addMessage: vi.fn(),
      save: vi.fn(),
    };

    (ConversationModel.findOne as any).mockResolvedValue(mockConversation);

    const result = await sendMessage({
      conversationId: 'conv123',
      message: 'How is my campaign performing?',
    });

    expect(result.success).toBe(true);
    expect(result.response).toBe('AI response');
    expect(mockConversation.addMessage).toHaveBeenCalledTimes(2); // User + AI
  });

  it('should return error if conversation not found', async () => {
    (ConversationModel.findOne as any).mockResolvedValue(null);

    const result = await sendMessage({
      conversationId: 'invalid',
      message: 'Test',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Conversation not found');
  });

  it('should handle AI errors gracefully', async () => {
    const mockConversation = {
      conversationId: 'conv123',
      addMessage: vi.fn(),
      save: vi.fn(),
    };

    (ConversationModel.findOne as any).mockResolvedValue(mockConversation);
    (generateCompletion as any).mockRejectedValue(new Error('AI service unavailable'));

    const result = await sendMessage({
      conversationId: 'conv123',
      message: 'Test',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('AI service unavailable');
  });
});
```

---

### Integration Tests

#### API Route Tests

```typescript
// __tests__/api/platforms/google-analytics/data.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { POST } from '@/app/api/platforms/google-analytics/data/route';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

describe('POST /api/platforms/google-analytics/data', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should fetch analytics data with valid credentials', async () => {
    const request = new Request(
      'http://localhost:3000/api/platforms/google-analytics/data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: 'client123',
          startDate: '2025-11-01',
          endDate: '2025-11-22',
          metrics: ['sessions', 'users'],
        }),
      }
    );

    const response = await POST(request, {
      params: { platformId: 'google-analytics' },
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it('should return 400 if clientId is missing', async () => {
    const request = new Request(
      'http://localhost:3000/api/platforms/google-analytics/data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: '2025-11-01',
          endDate: '2025-11-22',
          metrics: ['sessions'],
        }),
      }
    );

    const response = await POST(request, {
      params: { platformId: 'google-analytics' },
    });

    expect(response.status).toBe(400);
  });

  it('should respect rate limits', async () => {
    // Make multiple requests rapidly
    const requests = Array(70)
      .fill(null)
      .map(() =>
        POST(
          new Request('http://localhost:3000/api/platforms/google-analytics/data', {
            method: 'POST',
            body: JSON.stringify({
              clientId: 'client123',
              startDate: '2025-11-01',
              endDate: '2025-11-22',
              metrics: ['sessions'],
            }),
          }),
          { params: { platformId: 'google-analytics' } }
        )
      );

    const responses = await Promise.all(requests);

    // Some should be rate limited
    const rateLimited = responses.filter((r) => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

---

### E2E Tests

#### Critical User Flows

```typescript
// e2e/onboarding-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('should complete full onboarding journey', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.click('button:has-text("Sign in with Google")');

    // Mock OAuth success
    await page.waitForURL('/onboarding');

    // 2. Welcome Step
    await expect(page.locator('h1')).toContainText('Welcome to OneClient');
    await page.click('button:has-text("Get Started")');

    // 3. Create Client Step
    await expect(page.locator('h2')).toContainText('Create Your First Client');
    await page.fill('input[name="clientName"]', 'Test Client Inc.');
    await page.fill('input[name="clientEmail"]', 'test@client.com');
    await page.click('button:has-text("Continue")');

    // 4. Connect Platforms Step
    await expect(page.locator('h2')).toContainText('Connect Your Marketing Platforms');
    await page.click('button:has-text("Skip this step")');

    // 5. Product Tour Step
    await expect(page.locator('h2')).toContainText("You're All Set");
    await page.click('button:has-text("Start Chatting")');

    // 6. Verify redirect to chat
    await page.waitForURL('/chat');
    await expect(page.locator('h1')).toContainText('Test Client Inc.');
  });

  test('should allow skipping onboarding', async ({ page }) => {
    await page.goto('/onboarding');
    await page.click('button:has-text("Skip for now")');

    // Confirm skip
    await page.click('button:has-text("Yes, skip")');

    // Should redirect to chat with empty state
    await page.waitForURL('/chat');
    await expect(page.locator('text=Create your first client')).toBeVisible();
  });

  test('should preserve progress on browser refresh', async ({ page }) => {
    await page.goto('/onboarding');
    await page.click('button:has-text("Get Started")');

    // Fill in client info
    await page.fill('input[name="clientName"]', 'Test Client');

    // Refresh page
    await page.reload();

    // Should still be on step 2 with data preserved
    await expect(page.locator('input[name="clientName"]')).toHaveValue('Test Client');
  });
});
```

#### Chat Flow

```typescript
// e2e/chat-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and navigate to chat
    await page.goto('/login');
    // ... login flow
    await page.goto('/chat');
  });

  test('should send message and receive AI response', async ({ page }) => {
    const messageInput = page.locator('textarea[placeholder*="Ask a question"]');
    await messageInput.fill('How is my campaign performing?');
    await page.click('button[aria-label="Send message"]');

    // Wait for AI response
    await expect(page.locator('.message-assistant').last()).toBeVisible({
      timeout: 10000,
    });

    // Verify message appears in chat
    await expect(page.locator('text=How is my campaign performing?')).toBeVisible();
  });

  test('should create new conversation', async ({ page }) => {
    await page.click('button:has-text("New Chat")');

    // Should show empty state
    await expect(page.locator('text=Start a new conversation')).toBeVisible();

    // Input should be focused
    const input = page.locator('textarea[placeholder*="Ask a question"]');
    await expect(input).toBeFocused();
  });

  test('should switch between conversations', async ({ page }) => {
    // Send message in conversation 1
    await page.locator('textarea').fill('Test message 1');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.message-assistant');

    // Create new conversation
    await page.click('button:has-text("New Chat")');
    await page.locator('textarea').fill('Test message 2');
    await page.click('button[aria-label="Send message"]');

    // Click on first conversation in sidebar
    await page.click('.conversation-item:first-child');

    // Should see message from first conversation
    await expect(page.locator('text=Test message 1')).toBeVisible();
  });

  test('should show typing indicator while AI is responding', async ({ page }) => {
    await page.locator('textarea').fill('Test question');
    await page.click('button[aria-label="Send message"]');

    // Should show typing indicator
    await expect(page.locator('.typing-indicator')).toBeVisible();

    // Typing indicator should disappear when response arrives
    await expect(page.locator('.typing-indicator')).not.toBeVisible({ timeout: 10000 });
  });
});
```

---

### Performance Tests

#### Load Testing with Artillery

```yaml
# artillery.yml

config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5  # 5 users per second
      name: "Warm up"
    - duration: 300
      arrivalRate: 20  # 20 users per second
      name: "Sustained load"
    - duration: 120
      arrivalRate: 50  # 50 users per second
      name: "Spike test"
  payload:
    path: "test-users.csv"
    fields:
      - userId
      - clientId

scenarios:
  - name: "Send chat message"
    flow:
      - post:
          url: "/api/chat/send"
          json:
            conversationId: "{{ conversationId }}"
            message: "How is my campaign performing?"
          capture:
            - json: "$.response"
              as: "aiResponse"
      - think: 2  # Wait 2 seconds

  - name: "Fetch platform data"
    flow:
      - post:
          url: "/api/platforms/google-analytics/data"
          json:
            clientId: "{{ clientId }}"
            startDate: "2025-11-01"
            endDate: "2025-11-22"
            metrics: ["sessions", "users"]
      - think: 1

  - name: "Search conversations"
    flow:
      - post:
          url: "/api/conversations/search"
          json:
            query: "analytics"
            limit: 20
```

#### Run Performance Tests

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run artillery.yml --output report.json

# Generate HTML report
artillery report report.json --output report.html

# Performance targets:
# - p95 response time < 500ms
# - p99 response time < 1000ms
# - Error rate < 1%
# - Throughput: 100+ req/s
```

---

### Security Tests

#### Security Audit Checklist

```bash
# 1. Dependency vulnerabilities
npm audit
npm audit fix

# 2. Static code analysis with Snyk
npx snyk test
npx snyk code test

# 3. OWASP ZAP scan (after deployment to staging)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://staging.your-app.com

# 4. Check for secrets in code
npx secretlint '**/*'
```

#### Security Test Cases

```typescript
// __tests__/security/xss.test.ts

import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '@/lib/security/sanitize';

describe('XSS Protection', () => {
  it('should sanitize script tags', () => {
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain('<script>');
  });

  it('should sanitize event handlers', () => {
    const malicious = '<img src=x onerror=alert("XSS")>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain('onerror');
  });

  it('should allow safe HTML', () => {
    const safe = '<p>Hello <strong>world</strong></p>';
    const sanitized = sanitizeInput(safe);
    expect(sanitized).toBe(safe);
  });
});

// __tests__/security/sql-injection.test.ts

describe('SQL Injection Protection', () => {
  it('should use parameterized queries', async () => {
    // MongoDB uses BSON which is safe from SQL injection
    // But test query construction
    const maliciousInput = "'; DROP TABLE users; --";

    const result = await ConversationModel.findOne({
      conversationId: maliciousInput,
    });

    // Should not execute malicious query
    expect(result).toBeNull();
  });
});
```

---

## Quality Assurance

### QA Checklist

#### Functional Testing
- [ ] All user flows work end-to-end
- [ ] OAuth authentication successful for all providers
- [ ] Platform connections work (Google Analytics, Meta, etc.)
- [ ] Chat messages send and receive correctly
- [ ] Conversation history loads properly
- [ ] Search finds relevant conversations
- [ ] Export functions work for all formats
- [ ] Mobile responsive on all pages
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

#### Performance Testing
- [ ] Page load time < 2 seconds
- [ ] Chat response time < 3 seconds
- [ ] Platform data fetch < 5 seconds
- [ ] No memory leaks during extended use
- [ ] Lighthouse score > 90

#### Security Testing
- [ ] No XSS vulnerabilities
- [ ] CSRF protection enabled
- [ ] Input sanitization working
- [ ] Authentication required for all protected routes
- [ ] API keys encrypted at rest
- [ ] HTTPS enforced
- [ ] Security headers configured

#### Accessibility Testing
- [ ] WCAG AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## Deployment Process

### Environment Setup

```
Development → Staging → Production

Each environment has:
- Separate database
- Separate Redis instance
- Separate OAuth credentials
- Separate API keys
- Environment-specific secrets
```

### Deployment Checklist

#### Pre-Deployment

```bash
# 1. Run all tests
npm run test
npm run test:e2e

# 2. Build production bundle
npm run build

# 3. Check bundle size
npm run analyze

# 4. Run security audit
npm audit
npx snyk test

# 5. Update environment variables
# - Verify all production secrets
# - Update OAuth redirect URLs
# - Configure production database

# 6. Database migrations (if any)
npm run db:migrate

# 7. Create backup of production database
npm run db:backup
```

#### Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to staging
vercel --env=staging

# Run smoke tests on staging
npm run test:smoke -- --url https://staging.your-app.com

# Deploy to production
vercel --prod

# Tag release
git tag v1.0.0
git push origin v1.0.0
```

#### Post-Deployment

```bash
# 1. Verify deployment
curl https://your-app.com/api/health

# 2. Check logs
vercel logs

# 3. Monitor error rates
# - Check Sentry dashboard
# - Monitor Vercel Analytics

# 4. Run smoke tests
npm run test:smoke -- --url https://your-app.com

# 5. Notify team
# - Send deployment notification
# - Update status page
```

---

## Monitoring & Observability

### Monitoring Stack

```
Application Monitoring: Vercel Analytics + Sentry
Logs: Vercel Logs + Papertrail
Uptime Monitoring: UptimeRobot
Performance: Lighthouse CI
Error Tracking: Sentry
User Analytics: Mixpanel / PostHog
```

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { redis } from '@/lib/cache/redis';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.APP_VERSION || '1.0.0',
    services: {
      database: 'unknown',
      redis: 'unknown',
      ai: 'unknown',
    },
  };

  try {
    // Check database
    await connectDB();
    checks.services.database = 'healthy';
  } catch (error) {
    checks.services.database = 'unhealthy';
    checks.status = 'degraded';
  }

  try {
    // Check Redis
    await redis.ping();
    checks.services.redis = 'healthy';
  } catch (error) {
    checks.services.redis = 'unhealthy';
    checks.status = 'degraded';
  }

  try {
    // Check AI service
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    checks.services.ai = response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    checks.services.ai = 'unhealthy';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
```

### Error Tracking (Sentry)

```typescript
// src/lib/monitoring/sentry.ts

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,

  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException as Error;
      if (error.message.includes('ResizeObserver')) {
        return null;
      }
    }
    return event;
  },
});

// Track custom events
export function trackEvent(name: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    category: 'custom',
    message: name,
    level: 'info',
    data,
  });
}
```

---

## Launch Checklist

### T-1 Week

- [ ] All tests passing (unit, integration, E2E)
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Staging environment fully tested
- [ ] Database backups configured
- [ ] Monitoring dashboards set up
- [ ] Documentation complete
- [ ] Support team trained

### T-1 Day

- [ ] Final code freeze
- [ ] Production database migration planned
- [ ] Rollback plan documented
- [ ] On-call schedule confirmed
- [ ] Status page prepared
- [ ] Announcement emails drafted
- [ ] Social media posts ready

### Launch Day

- [ ] Deploy to production (9 AM local time)
- [ ] Run smoke tests
- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor response times (target: p95 < 500ms)
- [ ] Check user signups
- [ ] Verify OAuth flows
- [ ] Test platform connections
- [ ] Send announcement emails
- [ ] Monitor for 24 hours

### T+1 Day

- [ ] Review metrics
- [ ] Address any critical issues
- [ ] Gather user feedback
- [] Plan hotfixes if needed

---

## Post-Launch Plan

### Week 1: Stabilization

- Monitor error rates hourly
- Fix critical bugs immediately
- Respond to user feedback
- Optimize performance bottlenecks
- Daily standup meetings

### Week 2-4: Iteration

- Analyze usage patterns
- Identify feature gaps
- Plan incremental improvements
- Conduct user interviews
- Release minor updates

---

## Rollback Procedures

### When to Rollback

- Error rate > 5%
- Critical functionality broken
- Data integrity issues
- Security vulnerability discovered

### Rollback Steps

```bash
# 1. Revert to previous version
vercel rollback

# 2. Restore database if needed
npm run db:restore -- --backup latest

# 3. Clear Redis cache
npm run cache:clear

# 4. Notify users
# - Update status page
# - Send notification email

# 5. Post-mortem
# - Document what went wrong
# - Plan fixes
# - Schedule next deployment
```

---

## Success Metrics

### Technical Metrics

- **Uptime**: 99.9%+
- **Error Rate**: < 0.1%
- **p95 Response Time**: < 500ms
- **Test Coverage**: 80%+
- **Lighthouse Score**: 90+

### Business Metrics

- **User Signups**: 100+ in first week
- **Active Users**: 50+ daily
- **Conversations Created**: 500+ in first month
- **Platform Connections**: 200+ in first month
- **User Retention**: 70%+ week-over-week

### User Satisfaction

- **NPS Score**: 50+
- **Support Tickets**: < 5 per day
- **Critical Bugs**: 0
- **User Feedback**: Positive sentiment > 80%

---

**Next Document**: [PRODUCTION-DEPLOYMENT-GUIDE.md](./PRODUCTION-DEPLOYMENT-GUIDE.md) - Complete Production Setup
