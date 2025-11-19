/**
 * Chat Page Client Component
 *
 * Full-page chat interface with conversation history sidebar
 * This is a more comprehensive chat experience vs. the floating widget
 */

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/stores/useChatStore';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { mockAIStream } from '@/lib/chat/mockAI';
import type { Message } from '@/types/chat';

export function ChatPageClient() {
  const { messages, addMessage, isTyping, setTyping } = useChatStore();
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Start typing indicator
    setTyping(true);

    // Simulate AI response with streaming
    let assistantContent = '';

    try {
      await mockAIStream(
        content,
        // onToken callback
        (token) => {
          assistantContent += token;
        },
        // onDone callback
        () => {
          // Add complete assistant message
          const assistantMessage: Message = {
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date(),
          };
          addMessage(assistantMessage);
          setTyping(false);
        }
      );
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setTyping(false);

      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content:
          "I'm sorry, I encountered an error. Please try again in a moment.",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    }
  };

  // Handle quick reply
  const handleQuickReply = (message: string) => {
    handleSendMessage(message);
  };

  if (!isMounted) {
    return null; // Avoid hydration issues
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button */}
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>

            {/* Center: Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6CA3A2] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">OneAssist</h1>
                <p className="text-xs text-gray-400">Marketing Analytics AI</p>
              </div>
            </div>

            {/* Right: Placeholder */}
            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar - Conversation History (Phase 4) */}
        {/* <aside className="w-64 border-r border-gray-800 bg-[#0a0a0a]">
          Conversation history will go here in Phase 4
        </aside> */}

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-[#1a1a1a]">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList
              messages={messages}
              isTyping={isTyping}
              onQuickReply={handleQuickReply}
            />
          </div>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            placeholder="Ask me about your marketing data..."
          />
        </main>
      </div>
    </div>
  );
}
