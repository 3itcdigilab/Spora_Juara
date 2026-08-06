import React from 'react';
export const ProgressGauge = ({ value, size = 120, label }: any) => {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 80 ? 'var(--emerald-500)' : value > 60 ? 'var(--amber-500)' : 'var(--red-500)';
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} stroke="var(--gray-200)" strokeWidth="10" fill="none" />
          <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth="10" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">{Math.round(value)}%</div>
      </div>
      {label && <span className="mt-2 text-sm text-gray-500">{label}</span>}
    </div>
  );
};