import React from 'react';
import { Button } from './Button';
export interface EmptyStateProps { icon?: React.ReactNode; title: string; description: string; actionLabel?: string; onAction?: () => void; }
export const EmptyState = ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="empty-state">
    {icon && <div className="mb-4 text-4xl text-gray-400">{icon}</div>}
    <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
    {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
  </div>
);