/**
 * Chat Page
 *
 * Full-page chat interface (alternative to floating widget)
 * Route: /chat
 */

import { Metadata } from 'next';
import { ChatPageClient } from './ChatPageClient';

export const metadata: Metadata = {
  title: 'OneAssist - AI Chat | OneReport',
  description: 'Ask OneAssist about your marketing analytics data. Get instant insights from Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads.',
};

export default function ChatPage() {
  return <ChatPageClient />;
}
