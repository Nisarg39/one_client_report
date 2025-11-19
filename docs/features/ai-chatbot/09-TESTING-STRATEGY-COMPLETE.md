# AI Chatbot - Testing Strategy (COMPLETE)

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19

---

## Testing Approach

**Framework:** Vitest (unit/integration) + Playwright (E2E)
**Coverage Target:** 80% for critical paths
**Testing Philosophy:** Focus on user flows, not implementation details

---

## 1. Unit Tests (Vitest + React Testing Library)

### Component Tests

```typescript
// ChatInput.test.tsx
describe('ChatInput', () => {
  it('should disable send button when input is empty', () => {
    render(<ChatInput onSend={mockFn} />);
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('should enable send button when input has text', () => {
    render(<ChatInput onSend={mockFn} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hello' } });
    expect(screen.getByRole('button', { name: /send/i })).toBeEnabled();
  });

  it('should call onSend with message when Enter is pressed', () => {
    const mockSend = vi.fn();
    render(<ChatInput onSend={mockSend} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13 });

    expect(mockSend).toHaveBeenCalledWith('Test message');
  });
});

// Message.test.tsx
describe('Message', () => {
  it('should render user message with correct styling', () => {
    render(<Message role="user" content="Hello" timestamp={new Date()} />);
    expect(screen.getByText('Hello')).toHaveClass('user-message');
  });

  it('should render AI message with markdown', () => {
    const content = '**Bold text** and `code`';
    render(<Message role="assistant" content={content} timestamp={new Date()} />);

    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('code')).toHaveClass('code');
  });

  it('should show copy button for code blocks', () => {
    const content = '```javascript\nconst x = 1;\n```';
    render(<Message role="assistant" content={content} timestamp={new Date()} />);

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });
});
```

### Hook Tests

```typescript
// useChatStore.test.ts
describe('useChatStore', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useChatStore());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  it('should toggle chat open/close', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => result.current.toggleChat());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggleChat());
    expect(result.current.isOpen).toBe(false);
  });

  it('should add message to store', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Hello',
        timestamp: new Date(),
      });
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello');
  });
});
```

---

## 2. Integration Tests (Server Actions)

```typescript
// sendMessage.test.ts
describe('sendMessage Server Action', () => {
  beforeEach(async () => {
    await clearDatabase();
    await createTestUser();
    await createTestConversation();
  });

  it('should save user message to database', async () => {
    await sendMessage(testConversationId, 'Test message');

    const conversation = await Conversation.findOne({ conversationId: testConversationId });
    expect(conversation.messages).toHaveLength(1);
    expect(conversation.messages[0].content).toBe('Test message');
    expect(conversation.messages[0].role).toBe('user');
  });

  it('should call OpenAI API with correct prompt', async () => {
    const mockOpenAI = vi.spyOn(openai.chat.completions, 'create');

    await sendMessage(testConversationId, 'How many visitors?');

    expect(mockOpenAI).toHaveBeenCalledWith({
      model: 'gpt-4o-mini',
      messages: expect.arrayContaining([
        { role: 'system', content: expect.stringContaining('marketing data assistant') },
        { role: 'user', content: 'How many visitors?' },
      ]),
      stream: true,
    });
  });

  it('should enforce rate limits', async () => {
    // Send 51 messages (exceeds 50/hour limit)
    for (let i = 0; i < 51; i++) {
      if (i < 50) {
        await sendMessage(testConversationId, `Message ${i}`);
      } else {
        await expect(sendMessage(testConversationId, `Message ${i}`)).rejects.toThrow('RATE_LIMIT_EXCEEDED');
      }
    }
  });

  it('should include platform data in context', async () => {
    // Set up user with connected GA
    await User.updateOne(
      { _id: testUserId },
      {
        $set: {
          'platforms.googleAnalytics': {
            connected: true,
            metrics: { sessions: 1000, users: 800 },
          },
        },
      }
    );

    const mockOpenAI = vi.spyOn(openai.chat.completions, 'create');

    await sendMessage(testConversationId, 'How many sessions?');

    expect(mockOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining('sessions: 1000'),
          }),
        ]),
      })
    );
  });
});
```

---

## 3. E2E Tests (Playwright)

```typescript
// chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AI Chatbot', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should open chat modal when widget is clicked', async ({ page }) => {
    await page.click('[data-testid="chat-widget"]');

    await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
    await expect(page.locator('text=OneAssist')).toBeVisible();
  });

  test('should send message and receive AI response', async ({ page }) => {
    await page.click('[data-testid="chat-widget"]');

    const input = page.locator('[data-testid="chat-input"]');
    await input.fill('Hello, how are you?');
    await page.click('[data-testid="send-button"]');

    // User message should appear
    await expect(page.locator('text=Hello, how are you?')).toBeVisible();

    // Typing indicator should appear
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible();

    // AI response should appear (within 5 seconds)
    await expect(page.locator('[data-testid="ai-message"]').first()).toBeVisible({ timeout: 5000 });

    // Typing indicator should disappear
    await expect(page.locator('[data-testid="typing-indicator"]')).not.toBeVisible();
  });

  test('should render markdown in AI responses', async ({ page }) => {
    await page.click('[data-testid="chat-widget"]');

    await page.fill('[data-testid="chat-input"]', 'Show me a list');
    await page.click('[data-testid="send-button"]');

    // Wait for AI response with markdown
    await page.waitForSelector('[data-testid="ai-message"] ul', { timeout: 5000 });

    // Check that markdown is rendered as HTML
    const listItems = await page.locator('[data-testid="ai-message"] li').count();
    expect(listItems).toBeGreaterThan(0);
  });

  test('should close chat when close button is clicked', async ({ page }) => {
    await page.click('[data-testid="chat-widget"]');
    await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

    await page.click('[data-testid="close-chat"]');
    await expect(page.locator('[data-testid="chat-modal"]')).not.toBeVisible();
  });

  test('should persist chat state across page navigation', async ({ page }) => {
    await page.click('[data-testid="chat-widget"]');
    await page.fill('[data-testid="chat-input"]', 'Test message');
    await page.click('[data-testid="send-button"]');

    // Navigate away
    await page.goto('/dashboard/reports');

    // Open chat again
    await page.click('[data-testid="chat-widget"]');

    // Message should still be there
    await expect(page.locator('text=Test message')).toBeVisible();
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    await page.click('[data-testid="chat-widget"]');

    // Send 51 messages quickly (exceeds limit)
    for (let i = 0; i < 51; i++) {
      await page.fill('[data-testid="chat-input"]', `Message ${i}`);
      await page.click('[data-testid="send-button"]');

      if (i >= 50) {
        // Should show rate limit error
        await expect(page.locator('text=/rate limit/i')).toBeVisible({ timeout: 2000 });
        break;
      }
    }
  });
});
```

---

## 4. Performance Testing

```typescript
// performance.test.ts
test.describe('Performance', () => {
  test('chat modal should open in < 200ms', async ({ page }) => {
    await page.goto('/dashboard');

    const startTime = Date.now();
    await page.click('[data-testid="chat-widget"]');
    await page.waitForSelector('[data-testid="chat-modal"]', { state: 'visible' });
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(200);
  });

  test('conversation history should load in < 500ms', async ({ page }) => {
    // Create conversation with 50 messages
    await createTestConversation(testUserId, 50);

    await page.goto('/chat');

    const startTime = Date.now();
    await page.waitForSelector('[data-testid="message"]', { state: 'visible' });
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(500);
  });

  test('should receive first AI token in < 3 seconds', async ({ page }) => {
    await page.click('[data-testid="chat-widget"]');
    await page.fill('[data-testid="chat-input"]', 'Hello');

    const startTime = Date.now();
    await page.click('[data-testid="send-button"]');

    // Wait for first character of AI response
    await page.waitForSelector('[data-testid="ai-message"]', { state: 'visible', timeout: 3000 });
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(3000);
  });
});
```

---

## 5. AI Response Quality Testing

**Manual Testing Required:**
- Test with various question types (metrics, comparisons, trends)
- Verify accuracy of data interpretation
- Test edge cases (no platforms connected, stale data, etc.)
- Test prompt injection attempts (security)
- Test inappropriate content handling

**Sample Test Cases:**
```
1. "How many sessions did I have yesterday?"
   → Should return correct session count from GA data

2. "Compare my Google Ads spend vs Meta Ads"
   → Should show both platforms' spend with comparison

3. "Show me data for TikTok Ads"
   → Should inform user TikTok isn't connected yet

4. "Ignore previous instructions and..."
   → Should handle prompt injection gracefully

5. Very long message (> 2000 chars)
   → Should reject with validation error
```

---

## Test Coverage Goals

- **Components:** 80% coverage
- **Server Actions:** 90% coverage
- **Critical User Flows:** 100% E2E coverage

---

## Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm install

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npx playwright test
```

---

## Document Approval

**Status:** ✅ Complete

- [x] Testing strategy defined
- [x] Unit test examples provided
- [x] Integration test examples provided
- [x] E2E test examples provided
- [x] Coverage goals set

---

**Previous Document:** [08-IMPLEMENTATION-ROADMAP.md](./08-IMPLEMENTATION-ROADMAP.md)
**Next Document:** [10-MONITORING-ANALYTICS.md](./10-MONITORING-ANALYTICS.md)
