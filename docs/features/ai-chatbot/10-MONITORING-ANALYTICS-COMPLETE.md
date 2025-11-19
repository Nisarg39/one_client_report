# AI Chatbot - Monitoring & Analytics (COMPLETE)

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19

---

## 1. Error Monitoring (Sentry)

### Setup

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.config.js
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
});
```

### Error Tracking

```typescript
// Capture chatbot-specific errors
try {
  await sendMessage(conversationId, message);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      component: 'chatbot',
      action: 'sendMessage',
    },
    extra: {
      conversationId,
      userId: user.id,
      messageLength: message.length,
    },
  });

  throw error;
}
```

### Alerts

**Set up Sentry alerts for:**
- AI API failures (OpenAI errors)
- Rate limit exceeded (>10 users/hour)
- Database connection failures
- High error rate (>5% of requests)

---

## 2. Usage Analytics

### Track Key Metrics

```typescript
// Track chatbot usage
interface ChatbotAnalytics {
  event: string;
  properties: {
    conversationId?: string;
    messageCount?: number;
    platform?: string;
    duration?: number;
  };
}

// Events to track
const EVENTS = {
  CHAT_OPENED: 'chatbot_opened',
  MESSAGE_SENT: 'chatbot_message_sent',
  AI_RESPONSE_RECEIVED: 'chatbot_ai_response',
  FEEDBACK_GIVEN: 'chatbot_feedback',
  CONVERSATION_DELETED: 'chatbot_conversation_deleted',
  RATE_LIMIT_HIT: 'chatbot_rate_limit',
  QUICK_REPLY_CLICKED: 'chatbot_quick_reply',
};

// Example tracking
function trackChatEvent(event: string, properties: object) {
  // Google Analytics 4
  gtag('event', event, properties);

  // Or custom analytics
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ event, properties }),
  });
}
```

### Metrics Dashboard

**Key Metrics to Monitor:**

```
User Engagement:
- Total conversations created
- Total messages sent (user + AI)
- Avg messages per conversation
- Daily/weekly/monthly active users (chatbot users)
- % of total users who tried chatbot

Performance:
- Avg response time (first token)
- Avg full response time
- Message send success rate
- AI API uptime

Quality:
- Positive feedback % (thumbs up)
- Negative feedback % (thumbs down)
- Conversations abandoned (< 2 messages)
- Avg conversation length

Cost:
- Total OpenAI API costs (daily/monthly)
- Cost per message
- Cost per user
- Tokens used
```

---

## 3. Cost Monitoring (OpenAI)

### Track API Costs

```typescript
// Save cost metadata with each message
interface MessageMetadata {
  model: string;
  tokensUsed: number;
  cost: number; // in USD
}

// Calculate cost
function calculateCost(tokens: number, model: string): number {
  const PRICING = {
    'gpt-4o-mini': 0.15 / 1_000_000, // $0.15 per 1M tokens
    'gpt-4o': 2.5 / 1_000_000, // $2.50 per 1M tokens
  };

  return tokens * PRICING[model];
}

// Track cumulative costs
await Conversation.updateOne(
  { conversationId },
  {
    $push: {
      messages: {
        role: 'assistant',
        content: response,
        metadata: {
          model: 'gpt-4o-mini',
          tokensUsed: tokens,
          cost: calculateCost(tokens, 'gpt-4o-mini'),
        },
      },
    },
  }
);
```

### Cost Alerts

```typescript
// Daily cost check (cron job)
async function checkDailyCosts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const conversations = await Conversation.find({
    createdAt: { $gte: today },
  });

  const totalCost = conversations.reduce((sum, conv) => {
    const convCost = conv.messages.reduce((msgSum, msg) => {
      return msgSum + (msg.metadata?.cost || 0);
    }, 0);
    return sum + convCost;
  }, 0);

  // Alert if exceeds $2/day (monthly: $60)
  if (totalCost > 2) {
    await sendAlert({
      title: 'High OpenAI Costs',
      message: `Daily cost: $${totalCost.toFixed(2)}`,
    });
  }
}
```

---

## 4. Performance Monitoring

### Vercel Analytics

```typescript
// Already built-in with Vercel deployment
// Tracks:
// - Page load times
// - API response times
// - Core Web Vitals (LCP, FID, CLS)
```

### Custom Performance Tracking

```typescript
// Track chat-specific performance
function trackPerformance(metric: string, duration: number) {
  // Send to analytics
  gtag('event', 'performance', {
    metric,
    duration,
    category: 'chatbot',
  });
}

// Example usage
const startTime = performance.now();
await sendMessage(conversationId, message);
const endTime = performance.now();

trackPerformance('ai_response_time', endTime - startTime);
```

---

## 5. User Behavior Analytics

### Funnel Analysis

```
Chatbot Funnel:
1. User opens chat widget → 100% (baseline)
2. User sends first message → Track conversion %
3. User receives AI response → Track success rate
4. User sends 2nd message → Track engagement %
5. User gives feedback → Track satisfaction %

Goal: Optimize each step to increase engagement
```

### Cohort Analysis

```typescript
// Track user cohorts
interface UserCohort {
  userId: string;
  firstChatDate: Date;
  totalConversations: number;
  totalMessages: number;
  lastActiveDate: Date;
  averageSessionLength: number;
}

// Analyze retention
async function calculateRetention(cohortDate: Date) {
  const users = await User.find({
    'chatbot.firstChatDate': {
      $gte: cohortDate,
      $lt: new Date(cohortDate.getTime() + 24 * 60 * 60 * 1000),
    },
  });

  const day7Active = users.filter((u) => {
    const daysSince = (Date.now() - u.chatbot.firstChatDate.getTime()) / (24 * 60 * 60 * 1000);
    return daysSince >= 7 && u.chatbot.lastActiveDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  });

  return {
    cohortSize: users.length,
    day7Retention: (day7Active.length / users.length) * 100,
  };
}
```

---

## 6. Privacy & Compliance

### Data Handling

```typescript
// GDPR-compliant data export
export async function exportUserData(userId: string) {
  const conversations = await Conversation.find({ userId });

  return {
    conversations: conversations.map((conv) => ({
      id: conv.conversationId,
      createdAt: conv.createdAt,
      messages: conv.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    })),
  };
}

// GDPR-compliant data deletion
export async function deleteUserData(userId: string) {
  await Conversation.deleteMany({ userId });
  await User.updateOne({ _id: userId }, { $unset: { chatbot: 1 } });
}
```

### Privacy Notices

```typescript
// Show privacy notice on first chat
const PRIVACY_NOTICE = `
Your conversations are stored for 90 days to improve the chatbot.
We don't share your data with third parties.
You can delete conversations anytime.

[Button: I Understand] [Link: Privacy Policy]
`;
```

---

## 7. Dashboard (Internal)

### Key Dashboard Panels

**1. Real-Time Activity**
- Active conversations (last 5 minutes)
- Messages sent (last hour)
- Current OpenAI API status

**2. Daily Summary**
- Total conversations today
- Total messages today
- Avg response time
- Cost today
- Error rate

**3. Weekly Trends**
- Chart: Messages per day
- Chart: Active users per day
- Chart: Costs per day
- Chart: Feedback ratio (positive/negative)

**4. Top Issues**
- Most common errors (from Sentry)
- Most negative feedback messages
- Slowest responses

---

## 8. Alerts & Notifications

### Set up alerts for:

```typescript
const ALERTS = {
  HIGH_ERROR_RATE: {
    condition: 'error_rate > 5%',
    channel: 'email + slack',
    priority: 'high',
  },
  HIGH_COST: {
    condition: 'daily_cost > $2',
    channel: 'email',
    priority: 'medium',
  },
  SLOW_RESPONSES: {
    condition: 'avg_response_time > 5s',
    channel: 'slack',
    priority: 'medium',
  },
  OPENAI_API_DOWN: {
    condition: 'api_success_rate < 90%',
    channel: 'email + slack',
    priority: 'critical',
  },
  RATE_LIMIT_ABUSE: {
    condition: 'rate_limit_hits > 10/hour',
    channel: 'slack',
    priority: 'low',
  },
};
```

---

## 9. A/B Testing (Future - V2)

**Potential Tests:**
- Different welcome messages
- Quick reply button placement
- AI response tone (formal vs casual)
- Markdown formatting styles
- Typing indicator duration

---

## Document Approval

**Status:** ✅ Complete

- [x] Error monitoring strategy defined (Sentry)
- [x] Usage analytics approach documented
- [x] Cost monitoring implemented
- [x] Performance tracking planned
- [x] Privacy & compliance addressed
- [x] Dashboard metrics defined
- [x] Alert system designed

---

## Summary

**Monitoring Stack:**
- Sentry (error tracking)
- Google Analytics 4 (usage analytics)
- Vercel Analytics (performance)
- Custom dashboard (internal metrics)

**Key Metrics:**
- Engagement: 40% users try chatbot
- Satisfaction: 75%+ positive feedback
- Performance: <3s response time
- Cost: <$50/month

---

**Previous Document:** [09-TESTING-STRATEGY.md](./09-TESTING-STRATEGY.md)
**Completion:** All 10 planning documents complete! ✅

---

## 🎉 Planning Phase Complete!

You've successfully completed all 10 planning documents. You now have a comprehensive roadmap for implementing your AI chatbot.

**Next Steps:**
1. Review all documents for final approval
2. Set up development environment (OpenAI API, dependencies)
3. Begin Phase 1: Core Chat UI
4. Follow the implementation roadmap

**Quick Reference:**
- [README.md](./README.md) - Overview & navigation
- [01-REQUIREMENTS.md](./01-REQUIREMENTS.md) - Purpose & scope
- [02-TECHNICAL-SPECS.md](./02-TECHNICAL-SPECS.md) - AI & technical decisions
- [03-UX-DESIGN.md](./03-UX-DESIGN.md) - UI/UX specifications
- [04-PLATFORM-INTEGRATIONS.md](./04-PLATFORM-INTEGRATIONS.md) - Data access approach
- [05-ARCHITECTURE-SUMMARY.md](./05-ARCHITECTURE-SUMMARY.md) - System design
- [06-DATABASE-SCHEMA-COMPLETE.md](./06-DATABASE-SCHEMA-COMPLETE.md) - MongoDB models
- [07-API-DESIGN-COMPLETE.md](./07-API-DESIGN-COMPLETE.md) - Server Actions
- [08-IMPLEMENTATION-ROADMAP-COMPLETE.md](./08-IMPLEMENTATION-ROADMAP-COMPLETE.md) - Timeline & phases
- [09-TESTING-STRATEGY-COMPLETE.md](./09-TESTING-STRATEGY-COMPLETE.md) - Testing approach
- [10-MONITORING-ANALYTICS-COMPLETE.md](./10-MONITORING-ANALYTICS-COMPLETE.md) - Monitoring & analytics

**Good luck with implementation! 🚀**
