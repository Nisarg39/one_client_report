/**
 * Create Client Modal
 *
 * Modal for creating a new client in multi-client mode
 * Collects client name, email (optional), and logo (optional)
 */

'use client';

import { useState } from 'react';
import { X, Building2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email?: string;
    logo?: string;
  }) => Promise<void>;
}

export function CreateClientModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateClientModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Client name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim() || undefined,
        logo: logo.trim() || undefined,
      });

      // Reset form
      setName('');
      setEmail('');
      setLogo('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setEmail('');
      setLogo('');
      setError('');
      onClose();
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6CA3A2]/20 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#6CA3A2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Create New Client
                    </h2>
                    <p className="text-xs text-gray-400">
                      Add a client to manage their marketing data
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
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Client Name */}
                <div>
                  <label
                    htmlFor="clientName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Client Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Acme Corp"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:border-transparent disabled:opacity-50"
                  />
                </div>

                {/* Client Email (Optional) */}
                <div>
                  <label
                    htmlFor="clientEmail"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    id="clientEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:border-transparent disabled:opacity-50"
                  />
                </div>

                {/* Client Logo URL (Optional) */}
                <div>
                  <label
                    htmlFor="clientLogo"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Logo URL <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="clientLogo"
                      type="url"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a URL to an image file (PNG, JPG, SVG)
                  </p>
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
                    disabled={isSubmitting || !name.trim()}
                    className="flex-1 px-4 py-2 bg-[#6CA3A2] hover:bg-[#5a9291] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Client'}
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
