import { Monitor, Smartphone, Tablet } from "lucide-react";

interface DeviceData {
  device: "Desktop" | "Mobile" | "Tablet";
  sessions: number;
  percentage: number;
}

interface DeviceBreakdownChartProps {
  data: DeviceData[];
}

export function DeviceBreakdownChart({ data }: DeviceBreakdownChartProps) {
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Desktop":
        return <Monitor className="w-5 h-5" />;
      case "Mobile":
        return <Smartphone className="w-5 h-5" />;
      case "Tablet":
        return <Tablet className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getDeviceColor = (device: string) => {
    switch (device) {
      case "Desktop":
        return "#6CA3A2";
      case "Mobile":
        return "#FF8C42";
      case "Tablet":
        return "#9B87F5";
      default:
        return "#666";
    }
  };

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.reduce((acc, item, index) => {
            const circumference = 2 * Math.PI * 30;
            const dashOffset = acc.offset;
            const dashArray = `${(item.percentage / 100) * circumference} ${circumference}`;

            acc.elements.push(
              <circle
                key={item.device}
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke={getDeviceColor(item.device)}
                strokeWidth="20"
                strokeDasharray={dashArray}
                strokeDashoffset={-dashOffset}
                opacity="0.9"
              />
            );

            acc.offset += (item.percentage / 100) * circumference;
            return acc;
          }, { elements: [] as React.JSX.Element[], offset: 0 }).elements}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-[#f5f5f5]">
            {data.reduce((sum, d) => sum + d.sessions, 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-[#999] mt-1">Total Sessions</p>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.device} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)]"
                style={{ color: getDeviceColor(item.device) }}
              >
                {getDeviceIcon(item.device)}
              </div>
              <span className="text-sm font-medium text-[#f5f5f5]">
                {item.device}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#6CA3A2]">
                {item.percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-[#999]">
                {item.sessions.toLocaleString()} sessions
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
