'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Scenario templates matching the mock data generator
const SCENARIOS = [
  {
    id: 'beginner-ecommerce',
    name: 'E-commerce Bounce Rate Mystery',
    difficulty: 'beginner' as const,
    description: '72% mobile bounce rate - find the issue',
    objectives: ['Device analysis', 'Metric identification']
  },
  {
    id: 'intermediate-ads',
    name: 'Google Ads CPC Crisis',
    difficulty: 'intermediate' as const,
    description: 'High CPC eating your budget',
    objectives: ['CPA calculation', 'Budget optimization']
  },
  {
    id: 'advanced-attribution',
    name: 'Multi-Channel Attribution',
    difficulty: 'advanced' as const,
    description: 'Complex conversion paths',
    objectives: ['Attribution modeling', 'Cross-platform']
  },
  {
    id: 'beginner-local',
    name: 'Local Business Patterns',
    difficulty: 'beginner' as const,
    description: 'Weekend traffic analysis',
    objectives: ['Trend analysis', 'Seasonality']
  }
];

export function ScenarioSelector({
  onSelect
}: {
  onSelect: (scenarioId: string) => void;
}) {
  const [selected, setSelected] = useState<string>('');

  const selectedScenario = SCENARIOS.find(s => s.id === selected);

  const getBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'secondary';
      case 'intermediate':
        return 'default';
      case 'advanced':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-[#c0c0c0] mb-2 block">
          Choose Practice Scenario <span className="text-red-500">*</span>
        </label>
        <Select
          value={selected}
          onValueChange={(value) => {
            setSelected(value);
            onSelect(value);
          }}
        >
          <SelectTrigger 
            size="default"
            className="!w-full !h-auto !px-4 !py-3 !rounded-2xl !bg-[#1a1a1a] !text-[#f5f5f5] !border-2 !border-transparent !shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus-visible:!border-[#6CA3A2] focus-visible:!shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] hover:!border-[#6CA3A2]/50 !transition-all data-[placeholder]:!text-[#666]"
          >
            <SelectValue placeholder="Select a case study..." className="!text-[#c0c0c0]" />
          </SelectTrigger>
          <SelectContent 
            className="!bg-[#1a1a1a] !border !border-[#2a2a2a] !rounded-2xl !shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)]"
            position="popper"
          >
            {SCENARIOS.map((scenario) => (
              <SelectItem 
                key={scenario.id} 
                value={scenario.id}
                className="!text-[#f5f5f5] hover:!bg-[#252525] focus:!bg-[#252525] !cursor-pointer !rounded-xl !my-1"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(scenario.difficulty)}>
                    {scenario.difficulty}
                  </Badge>
                  <span>{scenario.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedScenario && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-[#6CA3A2] flex-shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium text-[#f5f5f5]">{selectedScenario.name}</p>
              <p className="text-xs text-[#c0c0c0]">{selectedScenario.description}</p>
              <p className="text-xs text-[#c0c0c0] mt-1">
                <span className="font-medium text-[#6CA3A2]">Learning objectives:</span>{' '}
                {selectedScenario.objectives.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
