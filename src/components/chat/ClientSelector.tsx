/**
 * Client Selector Component
 *
 * Dropdown for selecting/switching between clients in multi-client mode
 * Shows client name, logo, and connected platforms count
 *
 * Location: Chat header (top of chat interface)
 */

'use client';

import { useState } from 'react';
import { Check, ChevronDown, Building2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClientClient } from '@/types/chat';

export interface ClientSelectorProps {
  currentClient: ClientClient | null;
  clients: ClientClient[];
  onClientChange: (clientId: string) => void;
  onCreateClient: () => void;
}

export function ClientSelector({
  currentClient,
  clients,
  onClientChange,
  onCreateClient,
}: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Count connected platforms for a client
  const getConnectedPlatformsCount = (client: ClientClient): number => {
    let count = 0;
    if (client.platforms.googleAnalytics?.connected) count++;
    if (client.platforms.googleAds?.connected) count++;
    if (client.platforms.metaAds?.connected) count++;
    if (client.platforms.linkedInAds?.connected) count++;
    return count;
  };

  const handleSelectClient = (clientId: string) => {
    onClientChange(clientId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] rounded-lg border border-gray-700 transition-colors min-w-[200px]"
      >
        {/* Client Icon/Logo */}
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
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-white">
            {currentClient?.name || 'Select Client'}
          </p>
          {currentClient && (
            <p className="text-xs text-gray-400">
              {getConnectedPlatformsCount(currentClient)} platform
              {getConnectedPlatformsCount(currentClient) !== 1 ? 's' : ''} connected
            </p>
          )}
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-2xl z-50 max-h-[400px] overflow-y-auto"
            >
              {/* Client List */}
              <div className="py-2">
                {clients.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No clients yet. Create your first client to get started.
                  </div>
                ) : (
                  clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleSelectClient(client.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#333333] transition-colors"
                    >
                      {/* Client Icon/Logo */}
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
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white">
                          {client.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getConnectedPlatformsCount(client)} platform
                          {getConnectedPlatformsCount(client) !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Selected Check */}
                      {currentClient?.id === client.id && (
                        <Check className="w-4 h-4 text-[#6CA3A2]" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Create New Client Button */}
              <div className="border-t border-gray-700 py-2">
                <button
                  onClick={() => {
                    onCreateClient();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#333333] transition-colors text-[#6CA3A2]"
                >
                  <div className="w-8 h-8 bg-[#6CA3A2]/20 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Create New Client</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
