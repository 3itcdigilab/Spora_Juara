import React from 'react';
import { classNames } from '../../utils/helpers';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'danger' | string; dot?: boolean; }
export const Badge = ({ className, variant = 'neutral', dot, children, ...props }: BadgeProps) => (
  <span className={classNames('badge', `badge-${variant}`, className)} {...props}>
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 mr-1" />}
    {children}
  </span>
);