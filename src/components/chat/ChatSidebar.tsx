/**
 * Chat Sidebar Component
 *
 * Left sidebar for chat interface containing:
 * - Client selector dropdown
 * - Platform indicators for selected client
 * - New chat button
 * - Chat history
 */

'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Settings,
  MessageSquarePlus,
  History,
  ChevronDown,
  Check,
  BarChart3,
  Target,
  Share2,
  Briefcase,
  MessageSquare,
  Trash2,
  LogOut,
  User,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClientClient } from '@/types/chat';
import type { ConversationSummary } from '@/app/actions/conversations/getConversations';

export interface ChatSidebarProps {
  currentClient: ClientClient | null;
  clients: ClientClient[];
  conversations: ConversationSummary[];
  currentConversationId: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onClientChange: (clientId: string) => void;
  onCreateClient: () => void;
  onConfigurePlatforms: (client: ClientClient) => void;
  onNewChat: () => void;
  onConversationSelect: (conversationId: string) => void;
  onConversationDelete: (conversationId: string) => void;
}

export function ChatSidebar({
  currentClient,
  clients,
  conversations,
  currentConversationId,
  user,
  onClientChange,
  onCreateClient,
  onConfigurePlatforms,
  onNewChat,
  onConversationSelect,
  onConversationDelete,
}: ChatSidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
  };

  // Count connected platforms for a client
  const getConnectedPlatformsCount = (client: ClientClient): number => {
    let count = 0;
    if (client.platforms.googleAnalytics?.connected) count++;
    if (client.platforms.googleAds?.connected) count++;
    if (client.platforms.metaAds?.connected) count++;
    if (client.platforms.linkedInAds?.connected) count++;
    return count;
  };

  const getPlatformIcon = (platform: string): LucideIcon => {
    switch (platform) {
      case 'googleAnalytics':
        return BarChart3;
      case 'googleAds':
        return Target;
      case 'metaAds':
        return Share2;
      case 'linkedInAds':
        return Briefcase;
      default:
        return Building2;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'googleAnalytics':
        return 'Google Analytics';
      case 'googleAds':
        return 'Google Ads';
      case 'metaAds':
        return 'Meta Ads';
      case 'linkedInAds':
        return 'LinkedIn Ads';
      default:
        return platform;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'googleAnalytics':
        return 'bg-orange-500';
      case 'googleAds':
        return 'bg-blue-500';
      case 'metaAds':
        return 'bg-blue-600';
      case 'linkedInAds':
        return 'bg-blue-700';
      default:
        return 'bg-[#6CA3A2]';
    }
  };

  const handleSelectClient = (clientId: string) => {
    onClientChange(clientId);
    setIsDropdownOpen(false);
  };

  // Get connected platforms for current client
  const connectedPlatforms = currentClient
    ? Object.entries(currentClient.platforms)
        .filter(([_, platform]) => platform?.connected)
        .map(([key]) => key)
    : [];

  return (
    <aside className="w-[22rem] bg-[#1a1a1a] flex flex-col h-full border-r border-gray-800/30 shadow-[8px_0_24px_rgba(0,0,0,0.9)]">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-800/50">
        <h2
          className="text-lg font-bold text-[#f5f5f5] mb-1"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          OneAssist
        </h2>
        <p
          className="text-xs text-[#c0c0c0]"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Marketing Analytics AI
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Client Selector Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-xs font-semibold text-[#c0c0c0] uppercase tracking-wider"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Current Client
              </h3>
              <button
                onClick={onCreateClient}
                className="p-1.5 rounded-lg bg-[#1a1a1a] shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] transition-all duration-200"
                title="Create new client"
              >
                <Plus className="w-4 h-4 text-[#6CA3A2]" />
              </button>
            </div>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#1a1a1a] rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)] transition-all duration-200"
              >
                {/* Client Icon */}
                <div className="flex-shrink-0">
                  {currentClient?.logo ? (
                    <img
                      src={currentClient.logo}
                      alt={currentClient.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#6CA3A2] rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Client Name */}
                <div className="flex-1 text-left min-w-0">
                  <p
                    className="text-sm font-medium text-[#f5f5f5] truncate"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {currentClient?.name || 'Select Client'}
                  </p>
                  {currentClient && (
                    <p
                      className="text-xs text-[#c0c0c0]"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {getConnectedPlatformsCount(currentClient)} platform
                      {getConnectedPlatformsCount(currentClient) !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Dropdown Icon */}
                <ChevronDown
                  className={`w-4 h-4 text-[#6CA3A2] transition-transform flex-shrink-0 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] rounded-xl shadow-[inset_4px_4px_12px_rgba(0,0,0,0.8),inset_-4px_-4px_12px_rgba(60,60,60,0.2),0_8px_24px_rgba(0,0,0,0.9)] z-20 max-h-[300px] overflow-y-auto"
                    >
                      {/* Client List */}
                      <div className="py-2">
                        {clients.length === 0 ? (
                          <div
                            className="px-4 py-8 text-center text-[#c0c0c0] text-sm"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            No clients yet. Create your first client to get started.
                          </div>
                        ) : (
                          clients.map((client) => (
                            <button
                              key={client.id}
                              onClick={() => handleSelectClient(client.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#252525] rounded-lg mx-1 transition-all duration-200 hover:shadow-[-2px_-2px_6px_rgba(60,60,60,0.3),2px_2px_6px_rgba(0,0,0,0.6)]"
                            >
                              {/* Client Icon */}
                              <div className="flex-shrink-0">
                                {client.logo ? (
                                  <img
                                    src={client.logo}
                                    alt={client.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-[#6CA3A2] rounded-full flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* Client Info */}
                              <div className="flex-1 text-left min-w-0">
                                <p
                                  className="text-sm font-medium text-[#f5f5f5] truncate"
                                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                                >
                                  {client.name}
                                </p>
                                <p
                                  className="text-xs text-[#c0c0c0]"
                                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                                >
                                  {getConnectedPlatformsCount(client)} platform
                                  {getConnectedPlatformsCount(client) !== 1 ? 's' : ''}
                                </p>
                              </div>

                              {/* Selected Check */}
                              {currentClient?.id === client.id && (
                                <Check className="w-4 h-4 text-[#6CA3A2] flex-shrink-0 drop-shadow-[0_2px_4px_rgba(108,163,162,0.5)]" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Connected Platforms Section */}
          {currentClient && connectedPlatforms.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="text-xs font-semibold text-[#c0c0c0] uppercase tracking-wider"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Connected Platforms
                </h3>
                <button
                  onClick={() => onConfigurePlatforms(currentClient)}
                  className="p-1.5 rounded-lg bg-[#1a1a1a] shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] transition-all duration-200"
                  title="Configure platforms"
                >
                  <Settings className="w-4 h-4 text-[#6CA3A2]" />
                </button>
              </div>

              <div className="space-y-2">
                {connectedPlatforms.map((platformKey) => {
                  const Icon = getPlatformIcon(platformKey);
                  const colorClass = getPlatformColor(platformKey);
                  return (
                    <div
                      key={platformKey}
                      className="flex items-center gap-3 px-3 py-2 bg-[#1a1a1a] rounded-lg shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(60,60,60,0.2)]"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span
                        className="text-sm text-[#c0c0c0]"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {getPlatformName(platformKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Platforms Message */}
          {currentClient && connectedPlatforms.length === 0 && (
            <div className="text-center py-4">
              <p
                className="text-xs text-[#c0c0c0] mb-2"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                No platforms connected
              </p>
              <button
                onClick={() => router.push('/settings/platforms')}
                className="text-xs text-[#6CA3A2] hover:text-[#5a9291] transition-colors font-medium"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Connect platforms →
              </button>
            </div>
          )}

          {/* Add More Platforms Link */}
          {currentClient && connectedPlatforms.length > 0 && connectedPlatforms.length < 4 && (
            <button
              onClick={() => router.push('/settings/platforms')}
              className="w-full text-center text-xs text-[#6CA3A2] hover:text-[#5a9291] transition-colors py-2"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              + Connect more platforms
            </button>
          )}

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            disabled={!currentClient}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold bg-gradient-to-br from-[#6CA3A2] to-[#5a9291] text-white shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(108,163,162,0.3)] hover:shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.4),inset_-8px_-8px_16px_rgba(108,163,162,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Chat History Section */}
          <div className="border-t border-gray-800/50 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-[#6CA3A2]" />
              <h3
                className="text-xs font-semibold text-[#c0c0c0] uppercase tracking-wider"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Chat History
              </h3>
            </div>

            {/* Conversation List */}
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <div
                  className="text-xs text-[#c0c0c0] text-center py-4"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  No chat history yet
                </div>
              ) : (
                conversations.map((conversation) => {
                  const isActive = conversation.conversationId === currentConversationId;
                  const date = new Date(conversation.lastMessageAt);
                  const now = new Date();
                  const diffMs = now.getTime() - date.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                  let timeLabel = '';
                  if (diffMins < 1) {
                    timeLabel = 'Just now';
                  } else if (diffMins < 60) {
                    timeLabel = `${diffMins}m ago`;
                  } else if (diffHours < 24) {
                    timeLabel = `${diffHours}h ago`;
                  } else if (diffDays === 1) {
                    timeLabel = 'Yesterday';
                  } else if (diffDays < 7) {
                    timeLabel = `${diffDays}d ago`;
                  } else {
                    timeLabel = date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }

                  return (
                    <div
                      key={conversation.conversationId}
                      className={`relative group flex items-start gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-[#252525] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.2)]'
                          : 'bg-[#1a1a1a] shadow-[-2px_-2px_6px_rgba(60,60,60,0.3),2px_2px_6px_rgba(0,0,0,0.6)] hover:shadow-[-1px_-1px_4px_rgba(60,60,60,0.3),1px_1px_4px_rgba(0,0,0,0.6)]'
                      }`}
                    >
                      {/* Conversation Content (clickable) */}
                      <button
                        onClick={() => onConversationSelect(conversation.conversationId)}
                        className="flex-1 flex items-start gap-2 text-left min-w-0"
                      >
                        <MessageSquare
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            isActive ? 'text-[#6CA3A2]' : 'text-[#808080]'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs truncate ${
                              isActive ? 'text-[#f5f5f5]' : 'text-[#c0c0c0]'
                            }`}
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            {conversation.summary}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-[10px] text-[#808080]"
                              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                            >
                              {timeLabel}
                            </span>
                            <span
                              className="text-[10px] text-[#808080]"
                              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                            >
                              •
                            </span>
                            <span
                              className="text-[10px] text-[#808080]"
                              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                            >
                              {conversation.messageCount} msg{conversation.messageCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Delete Button (hover to show) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onConversationDelete(conversation.conversationId);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-[#1a1a1a] shadow-[-2px_-2px_4px_rgba(60,60,60,0.3),2px_2px_4px_rgba(0,0,0,0.6)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(60,60,60,0.2)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7)] transition-all duration-200"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-t border-gray-800/50 bg-[#1a1a1a]">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1a1a] rounded-xl shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(60,60,60,0.2)]">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6CA3A2]/20"
                />
              ) : (
                <div className="w-10 h-10 bg-[#6CA3A2] rounded-full flex items-center justify-center ring-2 ring-[#6CA3A2]/20">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-[#f5f5f5] truncate"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {user.name || 'User'}
              </p>
              <p
                className="text-xs text-[#c0c0c0] truncate"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {user.email}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex-shrink-0 p-2 rounded-lg bg-[#1a1a1a] shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] transition-all duration-200 hover:bg-red-500/10"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
