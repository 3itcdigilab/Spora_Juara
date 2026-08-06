import React from 'react';

interface ProgressGaugeProps {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  showText?: boolean;
  color?: string;
}

export const ProgressGauge: React.FC<ProgressGaugeProps> = ({ 
  value, 
  max = 100,
  size = 120, 
  label, 
  showText = false,
  color: customColor
}) => {
  const strokeWidth = Math.max(4, Math.round(size / 8));
  const radius = (size - strokeWidth) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  let strokeColor = customColor;
  if (!strokeColor || strokeColor === 'emerald') strokeColor = percentage >= 80 ? '#10B981' : percentage >= 60 ? '#F59E0B' : '#EF4444';

  const fontSizeClass = size < 70 ? 'text-[10px]' : size < 100 ? 'text-xs font-bold' : 'text-xl font-black';

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke="#E2E8F0" 
            strokeWidth={strokeWidth} 
            fill="none" 
          />
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke={strokeColor} 
            strokeWidth={strokeWidth} 
            fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            className="transition-all duration-1000 ease-out" 
            strokeLinecap="round" 
          />
        </svg>
        {showText && (
          <div className={`absolute inset-0 flex items-center justify-center text-slate-800 font-bold ${fontSizeClass}`}>
            {Math.round(value)}%
          </div>
        )}
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-slate-500">{label}</span>}
    </div>
  );
};