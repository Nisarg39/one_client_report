interface WeekData {
  week: string;
  sessions: number;
  conversions: number;
}

interface PerformanceTrendsChartProps {
  data: WeekData[];
}

export function PerformanceTrendsChart({ data }: PerformanceTrendsChartProps) {
  const maxSessions = Math.max(...data.map((d) => d.sessions));
  const maxConversions = Math.max(...data.map((d) => d.conversions));

  return (
    <div className="space-y-4">
      {/* Chart Container */}
      <div className="relative flex gap-4">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-[#666] pt-4 pb-10" style={{ height: '256px' }}>
          <span>{maxSessions.toLocaleString()}</span>
          <span>{Math.round(maxSessions * 0.75).toLocaleString()}</span>
          <span>{Math.round(maxSessions * 0.5).toLocaleString()}</span>
          <span>{Math.round(maxSessions * 0.25).toLocaleString()}</span>
          <span>0</span>
        </div>

        {/* Bars with Labels */}
        <div className="flex-1 flex justify-around gap-4">
          {data.map((week, index) => {
            const sessionHeight = (week.sessions / maxSessions) * 100;
            const conversionHeight = (week.conversions / maxConversions) * 100;

            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-[80px]">
                {/* Bar Container */}
                <div className="relative w-full h-64 flex items-end justify-center gap-2 group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-[#1a1a1a] shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)] border border-[#2a2a2a] text-xs whitespace-nowrap z-10">
                    <div className="text-[#f5f5f5] font-semibold mb-1">{week.week}</div>
                    <div className="text-[#6CA3A2]">Sessions: {week.sessions.toLocaleString()}</div>
                    <div className="text-[#FF8C42]">Conversions: {week.conversions}</div>
                  </div>

                  {/* Session Bar */}
                  <div
                    className="w-6 rounded-t-lg bg-gradient-to-t from-[#6CA3A2] to-[#5a9493] shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-[-6px_-6px_12px_rgba(70,70,70,0.4),6px_6px_12px_rgba(0,0,0,0.7)]"
                    style={{
                      height: `${Math.max(sessionHeight, 2)}%`,
                      minHeight: '4px'
                    }}
                  />

                  {/* Conversion Bar */}
                  <div
                    className="w-6 rounded-t-lg bg-gradient-to-t from-[#FF8C42] to-[#E67A33] shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-[-6px_-6px_12px_rgba(70,70,70,0.4),6px_6px_12px_rgba(0,0,0,0.7)]"
                    style={{
                      height: `${Math.max(conversionHeight, 2)}%`,
                      minHeight: '4px'
                    }}
                  />
                </div>

                {/* Week Label */}
                <div className="text-xs text-[#999] mt-2 text-center">
                  {week.week}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-2px_-2px_4px_rgba(70,70,70,0.3),2px_2px_4px_rgba(0,0,0,0.6)]" />
          <span className="text-xs text-[#c0c0c0]">Sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-[#FF8C42] to-[#E67A33] shadow-[-2px_-2px_4px_rgba(70,70,70,0.3),2px_2px_4px_rgba(0,0,0,0.6)]" />
          <span className="text-xs text-[#c0c0c0]">Conversions</span>
        </div>
      </div>
    </div>
  );
}
