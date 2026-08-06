import React from 'react';
export interface ProgressBarProps { value: number; color?: string; label?: string; animated?: boolean; }
export const ProgressBar = ({ value, color = 'var(--primary-500)', label, animated }: ProgressBarProps) => (
  <div className="w-full">
    {label && <div className="flex justify-between text-sm mb-1"><span>{label}</span><span>{Math.round(value)}%</span></div>}
    <div className="progress-bar"><div className="progress-fill" style={{ width: `${value}%`, backgroundColor: color }} /></div>
  </div>
);