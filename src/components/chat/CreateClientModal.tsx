/**
 * Create Client Modal
 *
 * Modal for creating a new client in multi-client mode
 * Collects client name, email (optional), and logo (optional)
 */

'use client';

import { useState } from 'react';
import { X, Building2, Upload, GraduationCap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScenarioSelector } from './ScenarioSelector';

export interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email?: string;
    logo?: string;
    scenarioId?: string;
  }) => Promise<void>;
  accountType?: 'business' | 'education' | 'instructor';
}

export function CreateClientModal({
  isOpen,
  onClose,
  onSubmit,
  accountType = 'business',
}: CreateClientModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [scenarioId, setScenarioId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEducationMode = accountType === 'education';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    // For education mode, scenario selection is required
    if (isEducationMode && !scenarioId) {
      setError('Please select a practice scenario');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        email: isEducationMode ? undefined : (email.trim() || undefined),
        logo: isEducationMode ? undefined : (logo.trim() || undefined),
        scenarioId: isEducationMode ? scenarioId : undefined,
      });

      // Reset form
      setName('');
      setEmail('');
      setLogo('');
      setScenarioId('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setEmail('');
      setLogo('');
      setScenarioId('');
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
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] flex items-center justify-center shadow-[-4px_-4px_10px_rgba(60,60,60,0.4),4px_4px_10px_rgba(0,0,0,0.8)]">
                    {isEducationMode ? (
                      <GraduationCap className="w-6 h-6 text-white" />
                    ) : (
                      <Building2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#f5f5f5]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {isEducationMode ? 'Create Practice Workspace' : 'Create New Client'}
                    </h2>
                    <p className="text-xs text-[#c0c0c0]">
                      {isEducationMode
                        ? 'Choose a case study scenario to practice with'
                        : 'Add a client to manage their marketing data'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] transition-all disabled:opacity-50 shadow-[-2px_-2px_6px_rgba(60,60,60,0.3),2px_2px_6px_rgba(0,0,0,0.6)] hover:shadow-[-1px_-1px_4px_rgba(60,60,60,0.3),1px_1px_4px_rgba(0,0,0,0.6)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(60,60,60,0.2)]"
                >
                  <X className="w-5 h-5 text-[#c0c0c0]" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {isEducationMode ? (
                  <>
                    {/* Workspace Name */}
                    <div>
                      <label
                        htmlFor="workspaceName"
                        className="block text-sm font-medium text-[#c0c0c0] mb-2"
                      >
                        Workspace Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="workspaceName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., My First Analysis"
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:outline-none focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#666]"
                      />
                    </div>

                    {/* Scenario Selector */}
                    <ScenarioSelector onSelect={setScenarioId} />

                    {/* Info Alert */}
                    <div className="bg-[#6CA3A2]/10 border border-[#6CA3A2]/30 rounded-2xl px-4 py-3 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
                      <div className="flex gap-2">
                        <Info className="w-4 h-4 text-[#6CA3A2] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[#c0c0c0]">
                          This workspace will use simulated data for practice. No real platform connections needed.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Client Name */}
                    <div>
                      <label
                        htmlFor="clientName"
                        className="block text-sm font-medium text-[#c0c0c0] mb-2"
                      >
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="clientName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Acme Corp"
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:outline-none focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#666]"
                      />
                    </div>

                    {/* Client Email (Optional) */}
                    <div>
                      <label
                        htmlFor="clientEmail"
                        className="block text-sm font-medium text-[#c0c0c0] mb-2"
                      >
                        Email <span className="text-[#666] text-xs">(Optional)</span>
                      </label>
                      <input
                        id="clientEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@example.com"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:outline-none focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#666]"
                      />
                    </div>

                    {/* Client Logo URL (Optional) */}
                    <div>
                      <label
                        htmlFor="clientLogo"
                        className="block text-sm font-medium text-[#c0c0c0] mb-2"
                      >
                        Logo URL <span className="text-[#666] text-xs">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                        <input
                          id="clientLogo"
                          type="url"
                          value={logo}
                          onChange={(e) => setLogo(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          disabled={isSubmitting}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:outline-none focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#666]"
                        />
                      </div>
                      <p className="mt-2 text-xs text-[#999]">
                        Enter a URL to an image file (PNG, JPG, SVG)
                      </p>
                    </div>
                  </>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-[#c0c0c0] rounded-2xl transition-all disabled:opacity-50 font-medium shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || (isEducationMode && !scenarioId)}
                    className="flex-1 px-4 py-3 bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] hover:from-[#5a9493] hover:to-[#4a8382] text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)]"
                  >
                    {isSubmitting
                      ? 'Creating...'
                      : isEducationMode
                      ? 'Create Workspace'
                      : 'Create Client'}
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
