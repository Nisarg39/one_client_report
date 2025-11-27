/**
 * Dashboard Settings Section
 *
 * Phase 6.5: App settings (placeholder for future features)
 * Phase 6.6: Enabled notifications, export data, and delete account features
 */

'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Download,
  Trash2,
  Moon,
  Zap,
  Users,
  Key,
  AlertTriangle,
} from 'lucide-react';

export interface DashboardSettingsProps {
  onEditProfile?: () => void;
  onExportData?: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
}

export function DashboardSettings({
  onEditProfile,
  onExportData,
  onDeleteAccount,
}: DashboardSettingsProps) {
  // Phase 6.6: State for loading and delete confirmation
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = async () => {
    if (!onExportData) return;

    setIsExporting(true);
    try {
      await onExportData();
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteAccount) return;

    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-[#f5f5f5] mb-1"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          Settings
        </h1>
        <p
          className="text-[#c0c0c0]"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Manage your application preferences and data.
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Moon className="w-5 h-5 text-purple-400" />
          </div>
          <h3
            className="text-lg font-semibold text-[#f5f5f5]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Appearance
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#252525] rounded-xl">
            <div>
              <p
                className="text-sm font-medium text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Dark Mode
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Always enabled for best experience
              </p>
            </div>
            <div className="px-3 py-1.5 bg-[#6CA3A2]/20 text-[#6CA3A2] text-xs font-medium rounded-full">
              Always On
            </div>
          </div>
        </div>
      </div>

      {/* Phase 6.6: Notifications */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <h3
            className="text-lg font-semibold text-[#f5f5f5]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Notifications
          </h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#252525] rounded-xl">
          <div>
            <p
              className="text-sm font-medium text-[#f5f5f5]"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Manage Notification Preferences
            </p>
            <p
              className="text-xs text-[#808080]"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Configure email and in-app notifications
            </p>
          </div>
          {onEditProfile ? (
            <button
              onClick={onEditProfile}
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all duration-200"
            >
              Configure
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2.5 text-sm font-medium text-[#808080] bg-[#1a1a1a] rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] cursor-not-allowed opacity-50"
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Download className="w-5 h-5 text-green-400" />
          </div>
          <h3
            className="text-lg font-semibold text-[#f5f5f5]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Data Management
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#252525] rounded-xl">
            <div>
              <p
                className="text-sm font-medium text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Export All Data
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Download all your data as JSON (GDPR compliant)
              </p>
            </div>
            {onExportData ? (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-500 rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2.5 text-sm font-medium text-[#808080] bg-[#1a1a1a] rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] cursor-not-allowed opacity-50"
              >
                Coming Soon
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-gradient-to-br from-[#6CA3A2]/10 to-[#6CA3A2]/5 rounded-2xl p-6 border border-[#6CA3A2]/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#6CA3A2]/20 rounded-lg">
            <Zap className="w-5 h-5 text-[#6CA3A2]" />
          </div>
          <h3
            className="text-lg font-semibold text-[#f5f5f5]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Coming Soon
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/50 rounded-xl">
            <Settings className="w-5 h-5 text-[#808080]" />
            <div>
              <p
                className="text-sm font-medium text-[#c0c0c0]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Custom AI Instructions
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Personalize AI responses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/50 rounded-xl">
            <Key className="w-5 h-5 text-[#808080]" />
            <div>
              <p
                className="text-sm font-medium text-[#c0c0c0]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                API Access
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Integrate with your tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/50 rounded-xl">
            <Users className="w-5 h-5 text-[#808080]" />
            <div>
              <p
                className="text-sm font-medium text-[#c0c0c0]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Team Collaboration
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Share access with teammates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/50 rounded-xl">
            <Bell className="w-5 h-5 text-[#808080]" />
            <div>
              <p
                className="text-sm font-medium text-[#c0c0c0]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Weekly Reports
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Automated email summaries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 6.6: Danger Zone */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)] border border-red-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <h3
            className="text-lg font-semibold text-red-400"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Danger Zone
          </h3>
        </div>

        {showDeleteConfirm ? (
          <div className="p-4 bg-red-500/10 rounded-xl border-2 border-red-500/30">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400 mb-2">
                  Are you absolutely sure?
                </p>
                <p className="text-xs text-[#c0c0c0] mb-3">
                  This action <strong>cannot be undone</strong>. This will permanently delete your account and remove all of your data including:
                </p>
                <ul className="text-xs text-[#c0c0c0] list-disc list-inside space-y-1 mb-4">
                  <li>All clients and their settings</li>
                  <li>All conversations and messages</li>
                  <li>All platform connections</li>
                  <li>Your user profile and preferences</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-[#c0c0c0] bg-[#2a2a2a] rounded-xl shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4)] transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              {onDeleteAccount ? (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-red-400 bg-[#1a1a1a] rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] cursor-not-allowed opacity-50"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10">
            <div>
              <p
                className="text-sm font-medium text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Delete Account
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Permanently delete your account and all data
              </p>
            </div>
            {onDeleteAccount ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 text-sm font-medium text-red-400 bg-[#1a1a1a] rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:bg-red-500/10 hover:text-red-300 hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all duration-200"
              >
                Delete Account
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2.5 text-sm font-medium text-red-400 bg-[#1a1a1a] rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] cursor-not-allowed opacity-50"
              >
                Coming Soon
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
