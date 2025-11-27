/**
 * Conversation Context Menu Component
 * Dropdown menu with conversation actions: Pin, Archive, Rename, Export, Delete
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  Edit3,
  Download,
  Trash2,
  FileJson,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import type { ExportFormat } from '@/types/chat';

export interface ConversationContextMenuProps {
  conversationId: string;
  isPinned?: boolean;
  isArchived?: boolean;
  onPin: (conversationId: string) => void;
  onArchive: (conversationId: string) => void;
  onUnarchive: (conversationId: string) => void;
  onRename: (conversationId: string) => void;
  onExport: (conversationId: string, format: ExportFormat) => void;
  onDelete: (conversationId: string) => void;
}

export function ConversationContextMenu({
  conversationId,
  isPinned = false,
  isArchived = false,
  onPin,
  onArchive,
  onUnarchive,
  onRename,
  onExport,
  onDelete,
}: ConversationContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showExportSubmenu, setShowExportSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowExportSubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
    setShowExportSubmenu(false);
  };

  const menuItems = [
    {
      icon: isPinned ? PinOff : Pin,
      label: isPinned ? 'Unpin' : 'Pin to top',
      onClick: () => handleAction(() => onPin(conversationId)),
      color: 'text-[#6CA3A2]',
    },
    {
      icon: isArchived ? ArchiveRestore : Archive,
      label: isArchived ? 'Unarchive' : 'Archive',
      onClick: () =>
        handleAction(() =>
          isArchived ? onUnarchive(conversationId) : onArchive(conversationId)
        ),
      color: 'text-[#c0c0c0]',
    },
    {
      icon: Edit3,
      label: 'Rename',
      onClick: () => handleAction(() => onRename(conversationId)),
      color: 'text-[#c0c0c0]',
    },
    {
      icon: Download,
      label: 'Export',
      onClick: () => setShowExportSubmenu(!showExportSubmenu),
      color: 'text-[#c0c0c0]',
      hasSubmenu: true,
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => handleAction(() => onDelete(conversationId)),
      color: 'text-red-400',
      divider: true,
    },
  ];

  const exportFormats: { format: ExportFormat; label: string; icon: typeof FileJson }[] = [
    { format: 'json', label: 'JSON', icon: FileJson },
    { format: 'csv', label: 'CSV', icon: FileSpreadsheet },
    { format: 'markdown', label: 'Markdown', icon: FileText },
  ];

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          setShowExportSubmenu(false);
        }}
        className="p-1.5 rounded-md bg-[#1a1a1a] shadow-[-2px_-2px_4px_rgba(60,60,60,0.3),2px_2px_4px_rgba(0,0,0,0.6)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(60,60,60,0.2)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7)] transition-all duration-200"
        title="More options"
      >
        <MoreVertical className="w-3.5 h-3.5 text-[#808080]" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] rounded-lg shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(60,60,60,0.2),0_8px_24px_rgba(0,0,0,0.9)] z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  {item.divider && (
                    <div className="my-1 border-t border-gray-800/50" />
                  )}
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[#252525] transition-colors"
                  >
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span
                      className={item.color}
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {item.label}
                    </span>
                    {item.hasSubmenu && (
                      <span className="ml-auto text-[#808080]">{'>'}</span>
                    )}
                  </button>

                  {/* Export Submenu */}
                  {item.hasSubmenu && showExportSubmenu && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#252525] mx-1 rounded-md overflow-hidden"
                    >
                      {exportFormats.map((format) => (
                        <button
                          key={format.format}
                          onClick={() =>
                            handleAction(() =>
                              onExport(conversationId, format.format)
                            )
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#c0c0c0] hover:bg-[#303030] transition-colors"
                        >
                          <format.icon className="w-3 h-3 text-[#808080]" />
                          <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                            {format.label}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
