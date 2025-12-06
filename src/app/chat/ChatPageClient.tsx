/**
 * Chat Page Client Component
 *
 * Full-page chat interface with conversation history sidebar
 * This is a more comprehensive chat experience vs. the floating widget
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/useChatStore';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { CreateClientModal } from '@/components/chat/CreateClientModal';
import { PlatformConfigModal } from '@/components/chat/PlatformConfigModal';
import { DeleteConfirmDialog } from '@/components/chat/DeleteConfirmDialog';
import { EditProfileModal } from '@/components/chat/EditProfileModal';
import { EditClientModal } from '@/components/chat/EditClientModal';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { PlatformHealthBanner } from '@/components/chat/PlatformHealthBanner';
import { MetricsDashboardPanel } from '@/components/chat/MetricsDashboardPanel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChartBar, AlertCircle, ArrowRight, X } from 'lucide-react';
import { useStreamingChat } from '@/lib/ai/useStreamingChat';
import { generateSuggestions } from '@/lib/ai/suggestions';
import type { Message, ClientClient, ConversationFilter, ExportFormat, ViewMode, DashboardSection, PlatformHealthIssue } from '@/types/chat';
import { refreshPlatformConnection } from '@/app/actions/platforms/refreshPlatformConnection';
import { getClients } from '@/app/actions/clients/getClients';
import { createClient } from '@/app/actions/clients/createClient';
import { archiveClient } from '@/app/actions/clients/archiveClient';
import {
  getConversations,
  type ConversationSummary,
} from '@/app/actions/conversations/getConversations';
import { getConversationById } from '@/app/actions/conversations/getConversationById';
import { deleteConversation } from '@/app/actions/conversations/deleteConversation';
// Phase 6: Conversation management imports
import { searchConversations } from '@/app/actions/conversations/searchConversations';
import { pinConversation, unpinConversation } from '@/app/actions/conversations/pinConversation';
import { archiveConversation, unarchiveConversation } from '@/app/actions/conversations/archiveConversation';
import { renameConversation } from '@/app/actions/conversations/renameConversation';
import { exportConversation } from '@/app/actions/conversations/exportConversation';
import { getConversationsByStatus } from '@/app/actions/conversations/getConversationsByStatus';
// Phase 6.6: User and client management imports
import { updateUserProfile, type NotificationPreferences } from '@/app/actions/user/updateUserProfile';
import { exportUserData } from '@/app/actions/user/exportUserData';
import { deleteAccount } from '@/app/actions/user/deleteAccount';
import { updateClient } from '@/app/actions/clients/updateClient';

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
    dateRangeFilter,
    // Phase 6.7: Metrics Dashboard
    metricsDashboard,
    toggleMetricsDashboard,
    setPlatformData,
  } = useChatStore();

  const { streamMessage } = useStreamingChat();
  const { data: session } = useSession();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPlatformConfigOpen, setIsPlatformConfigOpen] = useState(false);
  const [clientToConfig, setClientToConfig] = useState<ClientClient | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  // Phase 6: Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [conversationFilter, setConversationFilter] = useState<ConversationFilter>('active');
  const [isSearching, setIsSearching] = useState(false);
  // Pagination state
  const [conversationPage, setConversationPage] = useState(0);
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    conversationId: string | null;
  }>({ isOpen: false, conversationId: null });
  // Phase 6.5: View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>('overview');
  // Platform health notifications
  const [platformHealthIssues, setPlatformHealthIssues] = useState<PlatformHealthIssue[]>([]);
  const [dismissedIssues, setDismissedIssues] = useState<Set<string>>(new Set());
  const [refreshingPlatform, setRefreshingPlatform] = useState<string | null>(null);
  // Phase 6.6: Modal state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientClient | null>(null);
  // Pricing redirect dialog state
  const [pricingRedirectDialog, setPricingRedirectDialog] = useState<{
    isOpen: boolean;
    message: string;
    redirectUrl: string;
    reason?: 'trial_expired' | 'daily_limit_reached';
    daysRemaining?: number;
    messagesUsed?: number;
    messagesLimit?: number;
  }>({
    isOpen: false,
    message: '',
    redirectUrl: '',
  });

  // Get current client
  const currentClient = clients.find((c) => c.id === currentClientId) || null;

  // Phase 6.6: Calculate user stats
  const userStats = {
    totalClients: clients.length,
    totalConversations: conversations.length,
    totalMessages: conversations.reduce((sum, conv) => sum + (conv.messageCount || 0), 0),
  };

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
            dataSource: client.dataSource, // Include dataSource for Practice badge
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

  // Load conversations when client changes, filter changes, or search clears
  useEffect(() => {
    if (!currentClientId) {
      setConversations([]);
      setHasMoreConversations(false);
      return;
    }

    // Don't fetch if we're actively searching (search handler will update)
    if (searchQuery.trim().length >= 2) {
      return;
    }

    const fetchConversations = async () => {
      try {
        // Reset to first page when filter/client changes
        setConversationPage(0);

        // Use filter-based fetch with pagination
        const result = await getConversationsByStatus(conversationFilter, currentClientId, 0);

        if (result.success && result.conversations) {
          setConversations(result.conversations);
          setHasMoreConversations(result.hasMore || false);
        } else {
          console.error('Failed to fetch conversations:', result.error);
          setConversations([]);
          setHasMoreConversations(false);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
        setHasMoreConversations(false);
      }
    };

    fetchConversations();
  }, [currentClientId, conversationFilter, searchQuery]);

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
        onPlatformStatus: (issues: PlatformHealthIssue[]) => {
          // Received platform health issues from stream
          setPlatformHealthIssues(issues);
        },
        onPlatformData: (data) => {
          // Phase 6.7: Received platform data for metrics dashboard
          setPlatformData(data);
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
        onError: (error, redirect, errorData) => {
          setTyping(false);

          // Check if redirect is needed (trial expired or limit reached)
          // These are expected business logic errors, not technical errors
          if (redirect) {
            // Show error message in chat
            const errorMessage: Message = {
              role: 'assistant',
              content: error,
              timestamp: new Date(),
            };
            addMessage(errorMessage);

            // Show confirmation dialog instead of auto-redirecting
            setPricingRedirectDialog({
              isOpen: true,
              message: error,
              redirectUrl: redirect,
              reason: errorData?.reason,
              daysRemaining: errorData?.daysRemaining,
              messagesUsed: errorData?.messagesUsed,
              messagesLimit: errorData?.messagesLimit,
            });
            return;
          }

          // Only log actual technical errors (not business logic errors)
          console.error('AI Error:', error);

          // Regular error handling
          const errorMessage: Message = {
            role: 'assistant',
            content: error.includes('OPENAI_API_KEY')
              ? "⚠️ OpenAI API key is not configured. Please add your API key to `.env.local` to enable AI responses.\n\nGet your key from: https://platform.openai.com/api-keys"
              : "I'm sorry, I encountered an error. Please try again in a moment.",
            timestamp: new Date(),
          };
          addMessage(errorMessage);
        },
      },
      dateRangeFilter ? { startDate: dateRangeFilter.startDate, endDate: dateRangeFilter.endDate } : undefined
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
    scenarioId?: string;
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
          dataSource: data.scenarioId ? 'mock' : 'real', // Add dataSource based on scenarioId
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

  // Handle deleting (archiving) a client
  const handleClientDelete = async (clientId: string) => {
    try {
      const result = await archiveClient({ clientId });

      if (result.success) {
        // Remove from local state
        const updatedClients = clients.filter((c) => c.id !== clientId);
        setClients(updatedClients);

        // If this was the current client, switch to another or clear
        if (currentClientId === clientId) {
          if (updatedClients.length > 0) {
            setCurrentClient(updatedClients[0].id);
          } else {
            setCurrentClient('');
          }
        }
      } else {
        console.error('Failed to delete client:', result.error);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
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

  // Handle conversation deletion request (shows confirmation dialog)
  const handleConversationDeleteRequest = (conversationId: string) => {
    setDeleteDialog({ isOpen: true, conversationId });
  };

  // Handle confirmed conversation deletion
  const handleConversationDeleteConfirm = async () => {
    const conversationId = deleteDialog.conversationId;
    if (!conversationId) return;

    // Close dialog first
    setDeleteDialog({ isOpen: false, conversationId: null });

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

  // Handle cancel delete
  const handleConversationDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, conversationId: null });
  };

  // Phase 6: Search conversations
  const handleSearch = useCallback(async (query: string) => {
    if (!currentClientId) return;

    setSearchQuery(query);
    setIsSearching(true);

    try {
      const result = await searchConversations(query, currentClientId);

      if (result.success && result.conversations) {
        setConversations(result.conversations);
      } else {
        console.error('Search failed:', result.error);
      }
    } catch (error) {
      console.error('Error searching conversations:', error);
    } finally {
      setIsSearching(false);
    }
  }, [currentClientId]);

  // Phase 6: Clear search
  const handleClearSearch = useCallback(async () => {
    setSearchQuery('');
    setIsSearching(false);

    // Refetch with current filter
    if (currentClientId) {
      try {
        const result = await getConversationsByStatus(conversationFilter, currentClientId);
        if (result.success && result.conversations) {
          setConversations(result.conversations);
        }
      } catch (error) {
        console.error('Error refetching conversations:', error);
      }
    }
  }, [currentClientId, conversationFilter]);

  // Phase 6: Filter change
  const handleFilterChange = useCallback((filter: ConversationFilter) => {
    setConversationFilter(filter);
    setSearchQuery(''); // Clear search when changing filter
  }, []);

  // Phase 6: Load more conversations (pagination)
  const handleLoadMoreConversations = useCallback(async () => {
    if (!currentClientId || isLoadingMore || !hasMoreConversations) return;

    setIsLoadingMore(true);
    const nextPage = conversationPage + 1;

    try {
      const result = await getConversationsByStatus(conversationFilter, currentClientId, nextPage);

      if (result.success && result.conversations) {
        // Append new conversations to existing list
        setConversations((prev) => [...prev, ...result.conversations!]);
        setConversationPage(nextPage);
        setHasMoreConversations(result.hasMore || false);
      } else {
        console.error('Failed to load more conversations:', result.error);
      }
    } catch (error) {
      console.error('Error loading more conversations:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentClientId, conversationFilter, conversationPage, isLoadingMore, hasMoreConversations]);

  // Phase 6: Pin conversation
  const handleConversationPin = useCallback(async (conversationId: string) => {
    try {
      const conversation = conversations.find(c => c.conversationId === conversationId);
      const action = conversation?.isPinned ? unpinConversation : pinConversation;

      const result = await action(conversationId);

      if (result.success) {
        // Update local state
        setConversations((prev) =>
          prev.map((conv) =>
            conv.conversationId === conversationId
              ? { ...conv, isPinned: !conv.isPinned }
              : conv
          ).sort((a, b) => {
            // Sort pinned first, then by date
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
          })
        );
      } else {
        console.error('Failed to pin/unpin conversation:', result.error);
      }
    } catch (error) {
      console.error('Error pinning conversation:', error);
    }
  }, [conversations]);

  // Phase 6: Archive conversation
  const handleConversationArchive = useCallback(async (conversationId: string) => {
    try {
      const result = await archiveConversation(conversationId);

      if (result.success) {
        // Remove from list if viewing active, keep if viewing all/archived
        if (conversationFilter === 'active') {
          setConversations((prev) =>
            prev.filter((conv) => conv.conversationId !== conversationId)
          );
        } else {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.conversationId === conversationId
                ? { ...conv, status: 'archived' as const }
                : conv
            )
          );
        }
      } else {
        console.error('Failed to archive conversation:', result.error);
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
    }
  }, [conversationFilter]);

  // Phase 6: Unarchive conversation
  const handleConversationUnarchive = useCallback(async (conversationId: string) => {
    try {
      const result = await unarchiveConversation(conversationId);

      if (result.success) {
        // Remove from list if viewing archived, keep if viewing all/active
        if (conversationFilter === 'archived') {
          setConversations((prev) =>
            prev.filter((conv) => conv.conversationId !== conversationId)
          );
        } else {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.conversationId === conversationId
                ? { ...conv, status: 'active' as const }
                : conv
            )
          );
        }
      } else {
        console.error('Failed to unarchive conversation:', result.error);
      }
    } catch (error) {
      console.error('Error unarchiving conversation:', error);
    }
  }, [conversationFilter]);

  // Phase 6: Rename conversation
  const handleConversationRename = useCallback(async (conversationId: string, newTitle: string) => {
    try {
      const result = await renameConversation(conversationId, newTitle);

      if (result.success) {
        // Update local state
        setConversations((prev) =>
          prev.map((conv) =>
            conv.conversationId === conversationId
              ? { ...conv, title: newTitle, summary: newTitle }
              : conv
          )
        );
      } else {
        console.error('Failed to rename conversation:', result.error);
      }
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  }, []);

  // Phase 6: Export conversation
  const handleConversationExport = useCallback(async (conversationId: string, format: ExportFormat) => {
    try {
      const result = await exportConversation(conversationId, format);

      if (result.success && result.content) {
        // Create and download file
        const blob = new Blob([result.content], {
          type: result.mimeType || (format === 'json'
            ? 'application/json'
            : format === 'csv'
              ? 'text/csv'
              : 'text/markdown')
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || `conversation.${format === 'markdown' ? 'md' : format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export conversation:', result.error);
      }
    } catch (error) {
      console.error('Error exporting conversation:', error);
    }
  }, []);

  // Handle platform refresh
  const handlePlatformRefresh = useCallback(async (connectionId: string, platformName: string) => {
    setRefreshingPlatform(connectionId);

    try {
      const result = await refreshPlatformConnection({ connectionId });

      if (result.success) {
        // Remove from issues list
        setPlatformHealthIssues(prev => prev.filter(i => i.connectionId !== connectionId));
        setDismissedIssues(prev => {
          const newSet = new Set(prev);
          newSet.delete(connectionId);
          return newSet;
        });
      } else {
        console.error('Refresh failed:', result.error);
      }
    } catch (error) {
      console.error('Error refreshing platform:', error);
    } finally {
      setRefreshingPlatform(null);
    }
  }, []);

  // Handle dismissing a platform issue
  const handleDismissIssue = useCallback((connectionId: string) => {
    setDismissedIssues(prev => new Set(prev).add(connectionId));
  }, []);

  // Phase 6.6: Profile and settings handlers
  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = async (data: {
    inAppEnabled: boolean;
  }) => {
    try {
      // Only update in-app notification preferences
      // Email preferences are coming soon - backend not yet implemented
      const result = await updateUserProfile({
        notificationPreferences: {
          email: {
            enabled: false,
            newMessages: false,
            platformUpdates: false,
            weeklyReports: false,
            frequency: 'instant' as const,
          },
          inApp: {
            enabled: data.inAppEnabled,
          },
        },
      });

      if (result.success) {
        // Success - modal will close automatically
        // Next-auth session will be updated on next request
        console.log('Profile updated successfully');
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error; // Re-throw so modal can show error
    }
  };

  const handleExportData = async () => {
    try {
      const result = await exportUserData();

      if (result.success && result.data) {
        // Create JSON blob and trigger download
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-export-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error('Export failed:', result.error);
        alert(result.error || 'Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount();

      if (result.success) {
        // Sign out and redirect to home
        const { signOut } = await import('next-auth/react');
        await signOut({ callbackUrl: '/' });
      } else {
        console.error('Delete account failed:', result.error);
        alert(result.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleClientEdit = (client: ClientClient) => {
    setEditingClient(client);
    setShowEditClient(true);
  };

  const handleSaveClient = async (
    clientId: string,
    data: { name: string; email?: string; logo?: string }
  ) => {
    try {
      const result = await updateClient({ clientId, ...data });

      if (result.success && result.client) {
        // Update local state
        const updatedClients = clients.map((c) =>
          c.id === clientId
            ? {
                ...c,
                name: result.client!.name,
                email: result.client!.email,
                logo: result.client!.logo,
                updatedAt: result.client!.updatedAt,
              }
            : c
        );
        setClients(updatedClients);
        setShowEditClient(false);
        setEditingClient(null);
      } else {
        throw new Error(result.error || 'Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      throw error; // Re-throw so modal can show error
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
        user={session?.user}
        // Phase 6.5: View mode props
        viewMode={viewMode}
        dashboardSection={dashboardSection}
        onViewModeChange={setViewMode}
        onDashboardSectionChange={setDashboardSection}
        // Phase 6: Search & Filter props
        searchQuery={searchQuery}
        conversationFilter={conversationFilter}
        isSearching={isSearching}
        // Pagination props
        hasMoreConversations={hasMoreConversations}
        isLoadingMore={isLoadingMore}
        // Phase 6.5: Date range filter props
        hasMessages={messages.length > 0}
        onClientChange={handleClientChange}
        onCreateClient={() => setIsCreateModalOpen(true)}
        onConfigurePlatforms={handleConfigurePlatforms}
        onNewChat={handleNewChat}
        onConversationSelect={handleConversationSelect}
        onConversationDelete={handleConversationDeleteRequest}
        // Phase 6: New callbacks
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onFilterChange={handleFilterChange}
        onLoadMore={handleLoadMoreConversations}
        onConversationPin={handleConversationPin}
        onConversationArchive={handleConversationArchive}
        onConversationUnarchive={handleConversationUnarchive}
        onConversationRename={handleConversationRename}
        onConversationExport={handleConversationExport}
      />

      {/* Main Content Area */}
      <main
        className="flex-1 flex flex-col bg-[#1a1a1a] transition-all duration-300"
        style={{
          marginRight: metricsDashboard.isVisible ? `${metricsDashboard.width}px` : '0px',
        }}
      >
        {viewMode === 'chat' ? (
          <>
            {/* Phase 6.7: Metrics Toggle Button */}
            <button
              onClick={toggleMetricsDashboard}
              className="fixed top-4 right-4 z-30 p-3 rounded-xl bg-[#6CA3A2] text-white shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              title="Toggle metrics panel"
            >
              <ChartBar className="w-5 h-5" />
            </button>

            {/* Platform Health Banner */}
            {platformHealthIssues.filter(i => !dismissedIssues.has(i.connectionId)).length > 0 && (
              <PlatformHealthBanner
                issues={platformHealthIssues.filter(i => !dismissedIssues.has(i.connectionId))}
                onRefresh={handlePlatformRefresh}
                onGoToSettings={() => router.push('/settings/platforms')}
                onDismiss={handleDismissIssue}
                isRefreshing={refreshingPlatform}
              />
            )}

            {/* Messages */}
            <div className="flex-1 min-h-0">
              <MessageList
                messages={messages}
                isTyping={isTyping}
                onQuickReply={handleQuickReply}
                accountType={(session?.user as any)?.accountType}
              />
            </div>

            {/* Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isTyping}
              placeholder="Ask me about your marketing data..."
            />
          </>
        ) : (
          /* Phase 6.5: Dashboard View */
          <DashboardView
            section={dashboardSection}
            clients={clients}
            currentClient={currentClient}
            totalConversations={conversations.length}
            user={session?.user}
            userStats={userStats}
            onSectionChange={setDashboardSection}
            onClientCreate={() => setIsCreateModalOpen(true)}
            onClientSelect={handleClientChange}
            onClientDelete={handleClientDelete}
            onClientEdit={handleClientEdit}
            onConfigurePlatforms={handleConfigurePlatforms}
            onEditProfile={handleEditProfile}
            onExportData={handleExportData}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>

      {/* Create Client Modal */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClient}
        accountType={(session?.user as any)?.accountType}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onConfirm={handleConversationDeleteConfirm}
        onCancel={handleConversationDeleteCancel}
      />

      {/* Phase 6.6: Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        user={session?.user ? {
          name: session.user.name || '',
          email: session.user.email || '',
          notificationPreferences: (session.user as any).notificationPreferences,
        } : null}
        onClose={() => setShowEditProfile(false)}
        onSubmit={handleSaveProfile}
      />

      {/* Phase 6.6: Edit Client Modal */}
      <EditClientModal
        isOpen={showEditClient}
        client={editingClient}
        onClose={() => {
          setShowEditClient(false);
          setEditingClient(null);
        }}
        onSubmit={handleSaveClient}
      />

      {/* Phase 6.7: Metrics Dashboard Panel */}
      <MetricsDashboardPanel
        isVisible={metricsDashboard.isVisible}
        onToggle={toggleMetricsDashboard}
      />

      {/* Pricing Redirect Confirmation Dialog */}
      <Dialog
        open={pricingRedirectDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPricingRedirectDialog({
              isOpen: false,
              message: '',
              redirectUrl: '',
            });
          }
        }}
      >
        <DialogContent className="bg-[#1a1a1a] border-gray-800 rounded-2xl shadow-[-10px_-10px_30px_rgba(0,0,0,0.8),10px_10px_30px_rgba(0,0,0,0.4)] max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] rounded-full flex items-center justify-center shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)]">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-xl font-semibold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {pricingRedirectDialog.reason === 'trial_expired'
                  ? 'Trial Period Ended'
                  : 'Daily Limit Reached'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-[#c0c0c0] mt-2">
              {pricingRedirectDialog.message}
            </DialogDescription>
          </DialogHeader>

          {pricingRedirectDialog.reason === 'daily_limit_reached' && (
            <div className="bg-[#6CA3A2]/10 border border-[#6CA3A2]/30 rounded-xl px-4 py-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#c0c0c0]">Messages used today:</span>
                <span className="text-[#f5f5f5] font-medium">
                  {pricingRedirectDialog.messagesUsed} / {pricingRedirectDialog.messagesLimit}
                </span>
              </div>
            </div>
          )}

          {pricingRedirectDialog.reason === 'trial_expired' && pricingRedirectDialog.daysRemaining !== undefined && (
            <div className="bg-[#6CA3A2]/10 border border-[#6CA3A2]/30 rounded-xl px-4 py-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#c0c0c0]">Trial period:</span>
                <span className="text-[#f5f5f5] font-medium">
                  {pricingRedirectDialog.daysRemaining === 0 ? 'Expired' : `${pricingRedirectDialog.daysRemaining} days remaining`}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setPricingRedirectDialog({
                  isOpen: false,
                  message: '',
                  redirectUrl: '',
                });
              }}
              className="flex-1 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-[#f5f5f5] rounded-2xl transition-colors shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)]"
            >
              Stay Here
            </button>
            <button
              onClick={() => {
                setPricingRedirectDialog({
                  isOpen: false,
                  message: '',
                  redirectUrl: '',
                });
                
                // Navigate to homepage with pricing hash
                // Browser will automatically scroll to #pricing element on page load
                window.location.href = pricingRedirectDialog.redirectUrl;
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] text-white rounded-2xl transition-all font-medium shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] flex items-center justify-center gap-2"
            >
              View Pricing
              <ArrowRight className="w-4 h-4" />
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
