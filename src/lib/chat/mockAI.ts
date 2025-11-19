/**
 * Mock AI Response Utility
 *
 * Simulates AI responses for UI development (Phase 1)
 * Allows testing chat UI without OpenAI API
 *
 * This will be replaced with real OpenAI integration in Phase 2 (Week 3)
 */

/**
 * Mock AI responses for common questions
 */
const MOCK_RESPONSES: Record<string, string> = {
  hello: "Hello! I'm **OneAssist**, your AI-powered marketing analytics assistant. I can help you understand your data from Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads.\n\nHow can I help you today?",

  help: "I can help you with:\n\n- 📊 **Analytics Questions** - Ask about your website traffic, conversions, and user behavior\n- 💰 **Advertising Performance** - Query your ad spend, clicks, and ROI across platforms\n- 📈 **Trends & Insights** - Understand patterns in your marketing data\n- 🔗 **Platform Connections** - Guide you through connecting your marketing accounts\n\nTry asking: *\"How many visitors did I get last week?\"* or *\"What's my Google Ads spend this month?\"*",

  visitors: "Based on your connected Google Analytics account, you had **12,547 visitors** last week. That's a **15% increase** compared to the previous week!\n\nHere's the breakdown:\n- **Monday**: 1,823 visitors\n- **Tuesday**: 1,945 visitors  \n- **Wednesday**: 2,104 visitors\n- **Thursday**: 1,876 visitors\n- **Friday**: 2,234 visitors\n- **Saturday**: 1,432 visitors\n- **Sunday**: 1,133 visitors\n\nWould you like me to analyze any specific traffic sources?",

  ads: "Your **Google Ads** performance for this month:\n\n💰 **Total Spend**: $2,450.00\n👆 **Clicks**: 3,892\n👁️ **Impressions**: 125,340\n📊 **CTR**: 3.1%\n💵 **CPC**: $0.63\n🎯 **Conversions**: 156\n\nYour best performing campaign is **\"Brand Search\"** with a **4.2% conversion rate**. The **\"Display Retargeting\"** campaign needs attention - it has a high CPC of $1.24.\n\nWould you like recommendations to optimize your campaigns?",

  default: "That's an interesting question! I can help you understand your marketing data from:\n\n- 📊 Google Analytics  \n- 🎯 Google Ads\n- 📱 Meta/Facebook Ads\n- 💼 LinkedIn Ads\n\nTo get started, you'll need to connect your platforms in **Settings → Integrations**.\n\n*Note: This is a mock response. Real AI responses will be available in Week 3!*",
};

/**
 * Get mock AI response based on user message
 *
 * @param userMessage - The user's question
 * @returns Mock AI response
 */
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Match keywords to responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return MOCK_RESPONSES.hello;
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return MOCK_RESPONSES.help;
  }

  if (lowerMessage.includes('visitor') || lowerMessage.includes('traffic') || lowerMessage.includes('users')) {
    return MOCK_RESPONSES.visitors;
  }

  if (lowerMessage.includes('ads') || lowerMessage.includes('spend') || lowerMessage.includes('clicks')) {
    return MOCK_RESPONSES.ads;
  }

  return MOCK_RESPONSES.default;
}

/**
 * Simulate streaming AI response
 *
 * Mimics how real OpenAI streaming works (token-by-token)
 * This helps test the streaming UI before OpenAI integration
 *
 * @param userMessage - The user's question
 * @param onToken - Callback for each token (word)
 * @param onDone - Callback when streaming is complete
 */
export async function mockAIStream(
  userMessage: string,
  onToken: (token: string) => void,
  onDone: () => void
): Promise<void> {
  const response = getMockResponse(userMessage);
  const words = response.split(' ');

  // Stream word by word (simulate token streaming)
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isLast = i === words.length - 1;

    // Add space between words (except last)
    const token = isLast ? word : word + ' ';

    // Wait a bit to simulate streaming delay
    await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 20));

    // Send token to callback
    onToken(token);
  }

  // Signal completion
  onDone();
}

/**
 * Simple mock AI response (non-streaming)
 *
 * For components that don't need streaming
 *
 * @param userMessage - The user's question
 * @returns Mock AI response
 */
export async function mockAIResponse(userMessage: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

  return getMockResponse(userMessage);
}
