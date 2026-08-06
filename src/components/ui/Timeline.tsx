import React from 'react';
export interface TimelineProps { items: { icon?: React.ReactNode; title: string; description?: string; date: string; status?: string }[]; }
export const Timeline = ({ items }: TimelineProps) => (
  <div className="timeline">
    {items.map((it, i) => (
      <div key={i} className="timeline-item">
        <div className="icon">{it.icon || <div className="w-2 h-2 rounded-full bg-primary-500" />}</div>
        <div className="text-sm font-medium">{it.title}</div>
        <div className="text-xs text-gray-500">{it.date}</div>
        {it.description && <div className="text-sm mt-1 text-gray-700">{it.description}</div>}
      </div>
    ))}
  </div>
);