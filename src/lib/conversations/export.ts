/**
 * Conversation Export Service
 * Export conversations in various formats: JSON, CSV, Markdown
 */

import type { Message } from '@/types/chat';

export interface ExportableConversation {
  conversationId: string;
  title?: string;
  messages: Message[];
  messageCount: number;
  createdAt: string | Date;
  lastMessageAt: string | Date;
  status: string;
}

export interface ExportMetadata {
  exportedAt: string;
  format: 'json' | 'csv' | 'markdown';
  conversationId: string;
  messageCount: number;
}

/**
 * Export conversation as JSON
 * Pretty-printed with metadata
 */
export function exportAsJSON(conversation: ExportableConversation): string {
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      format: 'json' as const,
      conversationId: conversation.conversationId,
      messageCount: conversation.messageCount,
    },
    conversation: {
      id: conversation.conversationId,
      title: conversation.title || 'Untitled Conversation',
      status: conversation.status,
      createdAt: conversation.createdAt,
      lastMessageAt: conversation.lastMessageAt,
      messages: conversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    },
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export conversation as CSV
 * Columns: timestamp, role, content
 */
export function exportAsCSV(conversation: ExportableConversation): string {
  const header = 'Timestamp,Role,Content';

  const rows = conversation.messages.map((msg) => {
    // Escape content for CSV (double quotes and commas)
    const escapedContent = `"${msg.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    const timestamp =
      msg.timestamp instanceof Date
        ? msg.timestamp.toISOString()
        : new Date(msg.timestamp).toISOString();

    return `${timestamp},${msg.role},${escapedContent}`;
  });

  return [header, ...rows].join('\n');
}

/**
 * Export conversation as Markdown
 * Formatted document with headers and conversation flow
 */
export function exportAsMarkdown(conversation: ExportableConversation): string {
  const title = conversation.title || 'Untitled Conversation';
  const createdAt =
    conversation.createdAt instanceof Date
      ? conversation.createdAt.toISOString()
      : conversation.createdAt;
  const exportedAt = new Date().toISOString();

  const lines: string[] = [
    `# ${title}`,
    '',
    '## Metadata',
    '',
    `- **Conversation ID:** ${conversation.conversationId}`,
    `- **Created:** ${new Date(createdAt).toLocaleString()}`,
    `- **Message Count:** ${conversation.messageCount}`,
    `- **Status:** ${conversation.status}`,
    `- **Exported:** ${new Date(exportedAt).toLocaleString()}`,
    '',
    '---',
    '',
    '## Conversation',
    '',
  ];

  for (const msg of conversation.messages) {
    const timestamp =
      msg.timestamp instanceof Date
        ? msg.timestamp
        : new Date(msg.timestamp);
    const timeString = timestamp.toLocaleString();

    // Role header with icon
    let roleHeader: string;
    switch (msg.role) {
      case 'user':
        roleHeader = '### User';
        break;
      case 'assistant':
        roleHeader = '### Assistant';
        break;
      case 'system':
        roleHeader = '### System';
        break;
      default:
        roleHeader = `### ${msg.role}`;
    }

    lines.push(roleHeader);
    lines.push(`*${timeString}*`);
    lines.push('');
    lines.push(msg.content);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Get file extension for export format
 */
export function getExportFileExtension(format: 'json' | 'csv' | 'markdown'): string {
  switch (format) {
    case 'json':
      return 'json';
    case 'csv':
      return 'csv';
    case 'markdown':
      return 'md';
    default:
      return 'txt';
  }
}

/**
 * Get MIME type for export format
 */
export function getExportMimeType(format: 'json' | 'csv' | 'markdown'): string {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    case 'markdown':
      return 'text/markdown';
    default:
      return 'text/plain';
  }
}

/**
 * Generate filename for export
 */
export function generateExportFilename(
  conversation: ExportableConversation,
  format: 'json' | 'csv' | 'markdown'
): string {
  const title = conversation.title || 'conversation';
  // Sanitize title for filename
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  const date = new Date().toISOString().split('T')[0];
  const extension = getExportFileExtension(format);

  return `${sanitizedTitle}-${date}.${extension}`;
}
