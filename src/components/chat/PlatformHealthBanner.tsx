/**
 * Platform Health Banner
 *
 * Displays notification banner when platform connections have issues
 * Shows at top of chat interface with actionable buttons to fix
 */

'use client';

import { AlertCircle, RefreshCw, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlatformHealthIssue } from '@/types/chat';

export interface PlatformHealthBannerProps {
  issues: PlatformHealthIssue[];
  onRefresh: (connectionId: string, platformName: string) => void;
  onGoToSettings: () => void;
  onDismiss: (connectionId: string) => void;
  isRefreshing?: string | null;
}

export function PlatformHealthBanner({
  issues,
  onRefresh,
  onGoToSettings,
  onDismiss,
  isRefreshing,
}: PlatformHealthBannerProps) {
  if (issues.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-l-4 border-orange-500 px-4 py-3"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-orange-500 mb-2">
              Platform Connection {issues.length === 1 ? 'Issue' : 'Issues'}
            </h3>

            <div className="space-y-3">
              {issues.map((issue) => (
                <div key={issue.connectionId} className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-white">{issue.platformName}</span>
                      {' - '}
                      {issue.status === 'expired' ? (
                        <>Token expired{issue.expiresAt && <> ({formatExpiration(issue.expiresAt)})</>}</>
                      ) : (
                        <>Connection error: {issue.error || 'Unknown error'}</>
                      )}
                    </p>

                    {!issue.hasRefreshToken && (
                      <p className="text-xs text-gray-400 mt-1">
                        Requires re-authentication
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {issue.hasRefreshToken ? (
                      <button
                        onClick={() => onRefresh(issue.connectionId, issue.platformName)}
                        disabled={isRefreshing === issue.connectionId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing === issue.connectionId ? 'animate-spin' : ''}`} />
                        {isRefreshing === issue.connectionId ? 'Refreshing...' : 'Refresh Now'}
                      </button>
                    ) : (
                      <button
                        onClick={onGoToSettings}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Go to Settings
                      </button>
                    )}

                    <button
                      onClick={() => onDismiss(issue.connectionId)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Format expiration date relative to now
 */
function formatExpiration(expiresAt: Date): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    // Already expired
    const absMinutes = Math.abs(diffMinutes);
    const absHours = Math.abs(diffHours);
    const absDays = Math.abs(diffDays);

    if (absDays > 0) return `expired ${absDays} day${absDays === 1 ? '' : 's'} ago`;
    if (absHours > 0) return `expired ${absHours} hour${absHours === 1 ? '' : 's'} ago`;
    if (absMinutes > 0) return `expired ${absMinutes} minute${absMinutes === 1 ? '' : 's'} ago`;
    return 'just expired';
  } else {
    // Expires in the future
    if (diffDays > 0) return `expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    if (diffHours > 0) return `expires in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    if (diffMinutes > 0) return `expires in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
    return 'expires soon';
  }
}
