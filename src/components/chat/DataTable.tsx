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
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div
          key={index}
          className={`
            flex items-center justify-between gap-3
            ${compact ? 'py-2' : 'py-3'}
            px-3 rounded-lg
            bg-[#151515]
            hover:bg-[#1a1a1a]
            transition-colors
            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]
          `}
        >
          {/* Left: Icon + Label */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {row.icon && (
              <div className="flex-shrink-0 text-[#6CA3A2]">{row.icon}</div>
            )}
            <span
              className="text-sm text-[#c0c0c0] truncate"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {row.label}
            </span>
          </div>

          {/* Right: Value + Progress Bar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-sm font-medium text-[#e0e0e0] min-w-[3rem] text-right"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {row.value}
            </span>

            {row.progressBar && (
              <div className="w-24 hidden sm:block">
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
                className="text-xs text-[#808080] min-w-[2rem] text-right"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
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
