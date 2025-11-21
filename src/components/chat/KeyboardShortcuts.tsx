/**
 * Keyboard Shortcuts Component
 *
 * Global keyboard shortcuts for the chat interface
 * - Ctrl/Cmd + K: Open chat page or focus chat input
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useChatStore } from '@/stores/useChatStore';

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const { openChat } = useChatStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const isKKey = event.key === 'k' || event.key === 'K';

      if (isCtrlOrCmd && isKKey) {
        // Prevent default browser behavior (e.g., Chrome's search bar)
        event.preventDefault();

        // If already on chat page, focus the input
        if (pathname === '/chat') {
          const chatInput = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
          if (chatInput) {
            chatInput.focus();
          }
        } else {
          // Navigate to chat page
          router.push('/chat');
        }
      }

      // Optional: ESC to close chat modal (if using ChatWidget)
      if (event.key === 'Escape') {
        const closeButton = document.querySelector('[aria-label="Close chat"]') as HTMLButtonElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, pathname, openChat]);

  // This component doesn't render anything
  return null;
}
