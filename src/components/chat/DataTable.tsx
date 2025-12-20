/**
 * Data Table Component
 *
 * Table with inline visual elements for dimensional data
 * Features: Icons, progress bars, secondary values, hover effects
 */

'use client';

import { ProgressBar } from './ProgressBar';

export interface DataTableRow {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  progressBar?: { value: number; max: number; color?: string };
  secondaryValue?: string | number;
}

interface DataTableProps {
  rows: DataTableRow[];
  emptyMessage?: string;
  compact?: boolean;
}

export function DataTable({
  rows,
  emptyMessage = 'No data available',
  compact = false,
}: DataTableProps) {
  if (!rows || rows.length === 0) {
    return (
      <div className="py-6 text-center">
        <p
          className="text-sm text-[#808080]"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {rows.map((row, index) => (
        <div
          key={index}
          className={`
            flex items-center justify-between gap-3
            ${compact ? 'py-1.5 px-3' : 'py-3 px-4'}
            rounded-xl
            bg-[#151515]
            border border-white/10
            shadow-neu-inset
            hover:shadow-neu-raised
            hover:bg-[#1a1a1a]
            transition-all duration-300
            group
          `}
        >
          {/* Left: Icon + Label */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {row.icon && (
              <div className="flex-shrink-0 text-[#6CA3A2] opacity-40 group-hover:opacity-100 transition-opacity">
                {row.icon}
              </div>
            )}
            <span
              className="text-[11px] font-black text-[#666] group-hover:text-white uppercase tracking-tighter italic truncate transition-colors"
            >
              {row.label}
            </span>
          </div>

          {/* Right: Value + Progress Bar */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span
              className="text-xs font-black text-white italic tracking-tighter text-right"
            >
              {row.value}
            </span>

            {row.progressBar && (
              <div className="w-20 hidden sm:block">
                <ProgressBar
                  value={row.progressBar.value}
                  max={row.progressBar.max}
                  color={row.progressBar.color}
                  showPercentage={false}
                />
              </div>
            )}

            {row.secondaryValue && (
              <span
                className="text-[9px] font-black text-[#444] min-w-[2rem] text-right uppercase tracking-widest italic"
              >
                {row.secondaryValue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
