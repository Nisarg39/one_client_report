/**
 * Delete Confirmation Dialog Component
 * Modal dialog for confirming conversation deletion
 */

'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  title = 'Delete Conversation',
  message = 'Are you sure you want to delete this conversation? This action cannot be undone.',
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50"
            onKeyDown={handleKeyDown}
          >
            <div className="bg-[#1a1a1a] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.9)] p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#f5f5f5]"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-lg hover:bg-[#252525] transition-colors"
                >
                  <X className="w-5 h-5 text-[#808080]" />
                </button>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p
                  className="text-sm text-[#c0c0c0]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-[#c0c0c0] bg-[#1a1a1a] rounded-lg shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] transition-all duration-200"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(239,68,68,0.2)] transition-all duration-200 flex items-center gap-2"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
