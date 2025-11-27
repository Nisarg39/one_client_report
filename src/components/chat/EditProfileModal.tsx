/**
 * Edit Profile Modal
 *
 * Phase 6.6: Modal for editing user profile
 * Allows updating name and notification preferences
 */

'use client';

import { useState, useEffect } from 'react';
import { X, User, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NotificationPreferences } from '@/app/actions/user/updateUserProfile';

export interface EditProfileModalProps {
  isOpen: boolean;
  user: {
    name: string;
    email: string;
    notificationPreferences?: NotificationPreferences;
  } | null;
  onClose: () => void;
  onSubmit: (data: {
    inAppEnabled: boolean;
  }) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  user,
  onClose,
  onSubmit,
}: EditProfileModalProps) {
  const [name, setName] = useState('');
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-populate form when user changes
  useEffect(() => {
    if (user) {
      setName(user.name);

      if (user.notificationPreferences) {
        setInAppEnabled(user.notificationPreferences.inApp.enabled);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsSubmitting(true);

    try {
      await onSubmit({
        inAppEnabled,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError('');
      onClose();
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6CA3A2]/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#6CA3A2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Edit Profile
                    </h2>
                    <p className="text-xs text-gray-400">
                      Update your name and notification preferences
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Section - Display Only */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#6CA3A2]" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </label>
                      <div className="px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white">
                        {name || 'Not set'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                      </label>
                      <div className="px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white">
                        {user?.email || 'Not set'}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Name and email are managed by your OAuth provider and cannot be changed here
                  </p>
                </div>

                {/* Notification Preferences */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#6CA3A2]" />
                    Notification Preferences
                  </h3>

                  <div className="space-y-4">
                    {/* Email Notifications - Coming Soon */}
                    <div className="p-3 bg-[#252525] rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-white">
                              Email Notifications
                            </p>
                            <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-400 font-medium">
                              Coming Soon
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            Receive updates via email
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Email notification system is currently under development. You'll be able to configure email alerts for new messages, platform updates, and weekly reports once this feature is ready.
                      </p>
                    </div>

                    {/* In-App Notifications */}
                    <div className="flex items-center justify-between p-3 bg-[#252525] rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">
                          In-App Notifications
                        </p>
                        <p className="text-xs text-gray-400">
                          Show notifications within the app
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inAppEnabled}
                          onChange={(e) => setInAppEnabled(e.target.checked)}
                          disabled={isSubmitting}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6CA3A2] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6CA3A2]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[#6CA3A2] hover:bg-[#5a9493] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
