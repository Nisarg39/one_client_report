/**
 * Chat Page Client Component
 *
 * Full-page chat interface with conversation history sidebar
 * This is a more comprehensive chat experience vs. the floating widget
 */

'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { CreateClientModal } from '@/components/chat/CreateClientModal';
import { PlatformConfigModal } from '@/components/chat/PlatformConfigModal';
import { useStreamingChat } from '@/lib/ai/useStreamingChat';
import { generateSuggestions } from '@/lib/ai/suggestions';
import type { Message, ClientClient } from '@/types/chat';
import { getClients } from '@/app/actions/clients/getClients';
import { createClient } from '@/app/actions/clients/createClient';
import {
  getConversations,
  type ConversationSummary,
} from '@/app/actions/conversations/getConversations';
import { getConversationById } from '@/app/actions/conversations/getConversationById';
import { deleteConversation } from '@/app/actions/conversations/deleteConversation';

export function ChatPageClient() {
  const {
    messages,
    addMessage,
    isTyping,
    setTyping,
    currentClientId,
    currentConversationId,
    clients,
    setCurrentClient,
    setClients,
    clearMessages,
  } = useChatStore();

  const { streamMessage } = useStreamingChat();

  const [isMounted, setIsMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPlatformConfigOpen, setIsPlatformConfigOpen] = useState(false);
  const [clientToConfig, setClientToConfig] = useState<ClientClient | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  // Get current client
  const currentClient = clients.find((c) => c.id === currentClientId) || null;

  // Handle hydration & load real clients from database
  useEffect(() => {
    setIsMounted(true);

    // Fetch real clients from database
    const fetchClients = async () => {
      try {
        const result = await getClients();

        if (result.success && result.clients) {
          // Map the API response to ClientClient format expected by the UI
          const mappedClients: ClientClient[] = result.clients.map((client) => ({
            id: client.id,
            userId: client.userId,
            name: client.name,
            email: client.email,
            logo: client.logo,
            platforms: client.platforms || {}, // Use platform connection data from database
            status: client.status as 'active' | 'inactive' | 'archived',
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
          }));

          setClients(mappedClients);

          // Auto-select first client if none selected
          if (!currentClientId && mappedClients.length > 0) {
            setCurrentClient(mappedClients[0].id);
          }
        } else {
          console.error('Failed to fetch clients:', result.error);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };

    fetchClients();
  }, []);

  // Load conversations when client changes
  useEffect(() => {
    if (!currentClientId) {
      setConversations([]);
      return;
    }

    const fetchConversations = async () => {
      try {
        const result = await getConversations(currentClientId);

        if (result.success && result.conversations) {
          setConversations(result.conversations);
        } else {
          console.error('Failed to fetch conversations:', result.error);
          setConversations([]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
      }
    };

    fetchConversations();
  }, [currentClientId]);

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

    // Get updated messages array including the user message
    const updatedMessages = [...messages, userMessage];

    // Stream AI response
    await streamMessage(
      currentConversationId,
      updatedMessages,
      currentClientId,
      {
        onToken: (token) => {
          // Token streaming happens in background
        },
        onComplete: async (fullResponse, conversationId) => {
          // Set conversationId in store if we received one (for new conversations)
          if (conversationId && conversationId !== currentConversationId) {
            useChatStore.setState({ currentConversationId: conversationId });
          }

          // Generate contextual quick reply suggestions
          const suggestions = generateSuggestions(
            currentClient,
            messages.length + 1, // +1 because we're adding the assistant message
            fullResponse
          );

          // Add complete assistant message with suggestions
          const assistantMessage: Message = {
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
            suggestions,
          };
          addMessage(assistantMessage);
          setTyping(false);

          // Refresh conversations list to show the updated conversation
          if (currentClientId) {
            try {
              const result = await getConversations(currentClientId);
              if (result.success && result.conversations) {
                setConversations(result.conversations);
              }
            } catch (error) {
              console.error('Error refreshing conversations:', error);
            }
          }
        },
        onError: (error) => {
          console.error('AI Error:', error);
          setTyping(false);

          // Add error message
          const errorMessage: Message = {
            role: 'assistant',
            content: error.includes('OPENAI_API_KEY')
              ? "⚠️ OpenAI API key is not configured. Please add your API key to `.env.local` to enable AI responses.\n\nGet your key from: https://platform.openai.com/api-keys"
              : "I'm sorry, I encountered an error. Please try again in a moment.",
            timestamp: new Date(),
          };
          addMessage(errorMessage);
        },
      }
    );
  };

  // Handle quick reply
  const handleQuickReply = (message: string) => {
    handleSendMessage(message);
  };

  // Handle client switching
  const handleClientChange = (clientId: string) => {
    setCurrentClient(clientId);
    // Messages will be cleared automatically by the store
  };

  // Handle creating new client
  const handleCreateClient = async (data: {
    name: string;
    email?: string;
    logo?: string;
  }) => {
    try {
      const result = await createClient(data);

      if (result.success && result.client) {
        // Map the created client to ClientClient format
        const newClient: ClientClient = {
          id: result.client.id,
          userId: result.client.userId,
          name: result.client.name,
          email: result.client.email,
          logo: result.client.logo,
          platforms: {},
          status: result.client.status as 'active' | 'inactive' | 'archived',
          createdAt: result.client.createdAt,
          updatedAt: result.client.updatedAt,
        };

        setClients([...clients, newClient]);
        setCurrentClient(newClient.id);
      } else {
        console.error('Failed to create client:', result.error);
      }
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  // Handle opening platform configuration
  const handleConfigurePlatforms = (client: ClientClient) => {
    setClientToConfig(client);
    setIsPlatformConfigOpen(true);
  };

  // Handle updating platforms for a client
  const handleUpdatePlatforms = async (clientId: string, platforms: any) => {
    // TODO: Implement full platform update logic
    // For now, update local state only (server update will be added in later phase)
    console.log('Platform update requested for client:', clientId, platforms);

    const updatedClients = clients.map((c) =>
      c.id === clientId
        ? { ...c, platforms, updatedAt: new Date().toISOString() }
        : c
    );
    setClients(updatedClients);

    // Note: Full implementation would iterate over platform changes
    // and call updateClientPlatforms for each platform that changed
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    // Clear current messages to start a new conversation
    clearMessages();
  };

  // Handle conversation selection (load messages from database)
  const handleConversationSelect = async (conversationId: string) => {
    if (!currentClientId) return;

    try {
      const result = await getConversationById(conversationId);

      if (result.success && result.conversation) {
        // Load the conversation messages into the chat
        const loadedMessages: Message[] = result.conversation.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          feedback: msg.feedback,
          messageId: msg.messageId,
        }));

        // Clear current messages and load the conversation history
        clearMessages();
        loadedMessages.forEach((msg) => addMessage(msg));

        // Update the current conversation ID in the store
        // The store will handle setting currentConversationId
        useChatStore.setState({ currentConversationId: conversationId });
      } else {
        console.error('Failed to load conversation:', result.error);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  // Handle conversation deletion
  const handleConversationDelete = async (conversationId: string) => {
    try {
      const result = await deleteConversation({ conversationId });

      if (result.success) {
        // Remove from local state
        setConversations((prev) =>
          prev.filter((conv) => conv.conversationId !== conversationId)
        );

        // If deleted conversation was the current one, clear messages
        if (conversationId === currentConversationId) {
          clearMessages();
        }
      } else {
        console.error('Failed to delete conversation:', result.error);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  if (!isMounted) {
    return null; // Avoid hydration issues
  }

  return (
    <div className="h-screen bg-[#1a1a1a] flex overflow-hidden">
      {/* Left Sidebar */}
      <ChatSidebar
        currentClient={currentClient}
        clients={clients}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onClientChange={handleClientChange}
        onCreateClient={() => setIsCreateModalOpen(true)}
        onConfigurePlatforms={handleConfigurePlatforms}
        onNewChat={handleNewChat}
        onConversationSelect={handleConversationSelect}
        onConversationDelete={handleConversationDelete}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-[#1a1a1a]">
        {/* Messages */}
        <div className="flex-1 min-h-0">
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

      {/* Create Client Modal */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClient}
      />

      {/* Platform Configuration Modal */}
      <PlatformConfigModal
        isOpen={isPlatformConfigOpen}
        onClose={() => {
          setIsPlatformConfigOpen(false);
          setClientToConfig(null);
        }}
        client={clientToConfig}
        onUpdatePlatforms={handleUpdatePlatforms}
      />
    </div>
  );
}
