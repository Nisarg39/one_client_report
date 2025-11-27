/**
 * Export Conversation Server Action
 * Export a conversation in various formats
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';
import {
  exportAsJSON,
  exportAsCSV,
  exportAsMarkdown,
  generateExportFilename,
  getExportMimeType,
} from '@/lib/conversations/export';
import type { ExportFormat } from '@/types/chat';

export interface ExportConversationResult {
  success: boolean;
  error?: string;
  content?: string;
  filename?: string;
  mimeType?: string;
}

/**
 * Export a conversation in the specified format
 *
 * @param conversationId - The conversation ID to export
 * @param format - Export format: 'json', 'csv', or 'markdown'
 */
export async function exportConversation(
  conversationId: string,
  format: ExportFormat = 'json'
): Promise<ExportConversationResult> {
  try {
    // Validate input
    if (!conversationId) {
      return {
        success: false,
        error: 'Conversation ID is required',
      };
    }

    // Validate format
    const validFormats: ExportFormat[] = ['json', 'csv', 'markdown'];
    if (!validFormats.includes(format)) {
      return {
        success: false,
        error: 'Invalid export format. Use: json, csv, or markdown',
      };
    }

    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Connect to database
    await connectDB();

    // Find conversation
    const conversation = await ConversationModel.findByConversationId(
      conversationId,
      user.id
    );

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Prepare exportable conversation data
    const exportData = {
      conversationId: conversation.conversationId,
      title: conversation.title,
      messages: conversation.messages,
      messageCount: conversation.messageCount,
      createdAt: conversation.createdAt,
      lastMessageAt: conversation.lastMessageAt,
      status: conversation.status,
    };

    // Export based on format
    let content: string;
    switch (format) {
      case 'json':
        content = exportAsJSON(exportData);
        break;
      case 'csv':
        content = exportAsCSV(exportData);
        break;
      case 'markdown':
        content = exportAsMarkdown(exportData);
        break;
      default:
        content = exportAsJSON(exportData);
    }

    return {
      success: true,
      content,
      filename: generateExportFilename(exportData, format),
      mimeType: getExportMimeType(format),
    };
  } catch (error) {
    console.error('[exportConversation] Error:', error);
    return {
      success: false,
      error: 'Failed to export conversation. Please try again.',
    };
  }
}
