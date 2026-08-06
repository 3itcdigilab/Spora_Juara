import React from 'react';
import { classNames } from '../../utils/helpers';
export interface SkeletonProps { variant?: 'text' | 'circle' | 'rect'; width?: string | number; height?: string | number; className?: string; }
export const Skeleton = ({ variant = 'text', width, height, className }: SkeletonProps) => {
  const style = { width: width || (variant === 'circle' ? 40 : '100%'), height: height || (variant === 'circle' ? 40 : variant === 'text' ? 16 : 100), borderRadius: variant === 'circle' ? '50%' : undefined };
  return <div className={classNames('skeleton', className)} style={style} />;
};