/**
 * Chat Widget Component
 *
 * Floating chat button (bottom-right corner)
 * Opens the chat modal when clicked
 *
 * Usage: Add to your layout or page
 * ```tsx
 * import { ChatWidget } from '@/components/chat/ChatWidget';
 *
 * export default function Layout() {
 *   return (
 *     <>
 *       {children}
 *       <ChatWidget />
 *     </>
 *   );
 * }
 * ```
 */

'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/useChatStore';
import { ChatModal } from './ChatModal';

export function ChatWidget() {
  const { isOpen, openChat } = useChatStore();

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openChat}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#6CA3A2] to-[#5a9291] rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-[0_0_30px_rgba(108,163,162,0.5)] transition-shadow"
          aria-label="Open chat"
        >
          <MessageCircle className="w-7 h-7 text-white" />

          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-[#6CA3A2] animate-ping opacity-20" />
        </motion.button>
      )}

      {/* Chat Modal */}
      <ChatModal />
    </>
  );
}
