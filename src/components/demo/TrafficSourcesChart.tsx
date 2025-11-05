import { PlatformIcon } from "./PlatformIcon";
import type { PlatformType } from "@/types/demo";

interface TrafficSource {
  platform: PlatformType;
  name: string;
  sessions: number;
  percentage: number;
}

interface TrafficSourcesChartProps {
  sources: TrafficSource[];
}

export function TrafficSourcesChart({ sources }: TrafficSourcesChartProps) {
  const total = sources.reduce((sum, s) => sum + s.sessions, 0);

  if (sources.length === 0) {
    return (
      <div className="text-center py-8 text-[#666] text-sm">
        No platform data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <div key={source.platform} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlatformIcon platformType={source.platform} className="w-4 h-4" />
              <span className="text-sm font-medium text-[#f5f5f5]">
                {source.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#999]">
                {source.sessions.toLocaleString()} sessions
              </span>
              <span className="text-sm font-semibold text-[#6CA3A2] min-w-[45px] text-right">
                {source.percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 rounded-full bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#6CA3A2] to-[#5a9493] transition-all duration-500"
              style={{ width: `${source.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
