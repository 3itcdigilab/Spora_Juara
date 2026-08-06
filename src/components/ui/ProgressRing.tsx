import React from 'react';
export interface ProgressRingProps { value: number; size?: number; strokeWidth?: number; color?: string; }
export const ProgressRing = ({ value, size = 60, strokeWidth = 4, color = 'var(--primary-500)' }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size}>
      <circle stroke="var(--gray-200)" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size/2} cy={size/2} />
      <circle stroke={color} fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease-in-out' }} r={radius} cx={size/2} cy={size/2} transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
};