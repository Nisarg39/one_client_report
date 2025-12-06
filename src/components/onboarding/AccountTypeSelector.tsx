'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, School, Check } from 'lucide-react';

interface AccountTypeOption {
  type: 'business' | 'education' | 'instructor';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const ACCOUNT_TYPES: AccountTypeOption[] = [
  {
    type: 'business',
    title: 'Business Professional',
    description: 'Analyze real marketing data',
    icon: <Briefcase className="h-8 w-8" />,
    features: [
      'Connect real platforms',
      'Unlimited clients',
      'Export reports',
      'Full AI access'
    ]
  },
  {
    type: 'education',
    title: 'Student',
    description: 'Learn with practice scenarios',
    icon: <GraduationCap className="h-8 w-8" />,
    features: [
      'Guided case studies',
      'AI feedback',
      'Practice data',
      '5 workspaces'
    ]
  },
  {
    type: 'instructor',
    title: 'Instructor',
    description: 'Create assignments (Coming Soon)',
    icon: <School className="h-8 w-8" />,
    features: [
      'Custom scenarios',
      'Student assignments',
      'Progress tracking',
      '50 workspaces'
    ]
  }
];

export function AccountTypeSelector({
  onSelect
}: {
  onSelect: (type: 'business' | 'education' | 'instructor') => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 
          className="text-3xl font-bold text-[#f5f5f5] mb-3"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
        >
          Choose Your Account Type
        </h2>
        <p className="text-[#c0c0c0]">Select the option that best describes your use case</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ACCOUNT_TYPES.map((option) => {
          const isInstructor = option.type === 'instructor';
          const isSelected = selected === option.type;

          return (
            <motion.div
              key={option.type}
              whileHover={!isInstructor ? { scale: 1.02 } : {}}
              whileTap={!isInstructor ? { scale: 0.98 } : {}}
              onClick={() => {
                if (!isInstructor) {
                  setSelected(option.type);
                  onSelect(option.type);
                }
              }}
              className={`
                p-6 rounded-2xl border-2 transition-all
                ${isSelected
                  ? 'border-[#6CA3A2] bg-[#1a1a1a] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)]'
                  : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)]'
                }
                ${isInstructor
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)]'
                }
              `}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`
                  flex items-center justify-center w-16 h-16 rounded-xl transition-all
                  ${isSelected
                    ? 'bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-6px_-6px_12px_rgba(70,70,70,0.4),6px_6px_12px_rgba(0,0,0,0.7)]'
                    : 'bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]'
                  }
                `}>
                  <div className={isSelected ? 'text-white' : 'text-[#6CA3A2]'}>
                    {option.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[#f5f5f5]">{option.title}</h3>
                <p className="text-sm text-[#c0c0c0]">{option.description}</p>
                <ul className="text-xs text-[#999] space-y-2 mt-2 w-full">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-center gap-2">
                      <Check className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-[#6CA3A2]' : 'text-[#6CA3A2]'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {isInstructor && (
                  <div className="mt-2 text-xs text-amber-400 font-medium bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    Coming Soon
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
