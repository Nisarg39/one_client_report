/**
 * Create Client Step Component
 * Step 2: Create first client form with validation
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Building2, Mail, Upload, AlertCircle, GraduationCap } from 'lucide-react';
import { z } from 'zod';
import { ScenarioSelector } from '@/components/chat/ScenarioSelector';

// Validation schema - scenarioId is optional but required for education mode
const clientSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  logo: z
    .string()
    .url('Invalid logo URL')
    .optional()
    .or(z.literal('')),
  scenarioId: z
    .string()
    .optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface CreateClientStepProps {
  onChange: (data: ClientFormData, isValid: boolean) => void;
  isLoading?: boolean;
  error?: string;
}

export function CreateClientStep({
  onChange,
  isLoading = false,
  error: externalError,
}: CreateClientStepProps) {
  const { data: session } = useSession();
  const accountType = (session?.user as any)?.accountType;
  const isEducationMode = accountType === 'education';

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    logo: '',
    scenarioId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ClientFormData, boolean>>>({});

  // Validate form
  const validateForm = (): boolean => {
    try {
      clientSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ClientFormData, string>> = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ClientFormData;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle input change
  const handleChange = (field: keyof ClientFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Notify parent of form data change
    // For education mode, also require scenarioId
    const isValid = newData.name.trim().length >= 2 && (!isEducationMode || !!newData.scenarioId);
    onChange(newData, isValid);
  };

  // Handle scenario selection
  const handleScenarioSelect = (scenarioId: string) => {
    handleChange('scenarioId', scenarioId);
  };

  // Handle blur
  const handleBlur = (field: keyof ClientFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Validate single field
    try {
      clientSchema.pick({ [field]: true }).parse({ [field]: formData[field] });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.issues[0]?.message,
        }));
      }
    }
  };

  // Check if form is valid
  const isFormValid = formData.name.trim().length >= 2 && (!isEducationMode || !!formData.scenarioId);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
          {isEducationMode ? (
            <GraduationCap className="w-8 h-8 text-white" />
          ) : (
            <Building2 className="w-8 h-8 text-white" />
          )}
        </div>
        <h2
          className="text-3xl font-bold text-[#f5f5f5] mb-3"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
        >
          {isEducationMode ? 'Create Your Practice Workspace' : 'Who do you work with?'}
        </h2>
        <p className="text-[#c0c0c0]">
          {isEducationMode
            ? 'Choose a case study scenario to practice with'
            : 'Add your first client to get started with OneAssist'}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 max-w-lg mx-auto">
        {/* Client/Workspace Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#c0c0c0] mb-2"
          >
            {isEducationMode ? 'Workspace Name' : 'Client Name'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              disabled={isLoading}
              placeholder={isEducationMode ? "e.g., My First Analysis" : "Your Company or Client Name"}
              className={`w-full px-4 py-3 pl-12 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 transition-all outline-none ${
                touched.name && errors.name
                  ? 'border-red-500 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)]'
                  : 'border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
          </div>
          {touched.name && errors.name && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Scenario Selector for Education Mode */}
        {isEducationMode && (
          <div>
            <ScenarioSelector onSelect={handleScenarioSelect} />
            {!formData.scenarioId && touched.scenarioId && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please select a practice scenario
              </p>
            )}
          </div>
        )}

        {/* Email (Optional) - Only for business mode */}
        {!isEducationMode && (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#c0c0c0] mb-2"
            >
              Email <span className="text-[#666]">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={isLoading}
                placeholder="client@example.com"
                className={`w-full px-4 py-3 pl-12 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 transition-all outline-none ${
                  touched.email && errors.email
                    ? 'border-red-500 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)]'
                    : 'border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            </div>
            {touched.email && errors.email && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>
        )}

        {/* Logo URL (Optional) - Only for business mode */}
        {!isEducationMode && (
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-[#c0c0c0] mb-2"
            >
              Logo URL <span className="text-[#666]">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                onBlur={() => handleBlur('logo')}
                disabled={isLoading}
                placeholder="https://example.com/logo.png"
                className={`w-full px-4 py-3 pl-12 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 transition-all outline-none ${
                  touched.logo && errors.logo
                    ? 'border-red-500 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)]'
                    : 'border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            </div>
            {touched.logo && errors.logo && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.logo}
              </p>
            )}
            <p className="mt-2 text-xs text-[#999]">
              You can upload a logo later in settings if you don't have one ready
            </p>
          </div>
        )}

        {/* Examples - Only for business mode */}
        {!isEducationMode && (
          <div className="p-4 rounded-2xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] border border-[#2a2a2a]">
            <p className="text-sm font-medium text-[#c0c0c0] mb-2">Examples:</p>
            <ul className="space-y-1 text-sm text-[#999]">
              <li>• Your company name (if you're tracking your own marketing)</li>
              <li>• A client you manage (if you're an agency or consultant)</li>
              <li>• A project or brand you're working on</li>
            </ul>
          </div>
        )}

        {/* Info Alert for Education Mode */}
        {isEducationMode && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs text-blue-300">
              This workspace will use simulated data for practice. No real platform connections needed.
            </p>
          </div>
        )}

        {/* External Error */}
        {externalError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {externalError}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
