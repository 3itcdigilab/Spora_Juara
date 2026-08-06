import React from 'react';
import { classNames } from '../../utils/helpers';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { variant?: 'default' | 'glass' | 'elevated' | 'interactive'; }
export const Card = ({ className, variant = 'default', children, ...props }: CardProps) => (
  <div className={classNames('card', variant !== 'default' && `card-${variant}`, className)} {...props}>{children}</div>
);
export { Button } from './Button';