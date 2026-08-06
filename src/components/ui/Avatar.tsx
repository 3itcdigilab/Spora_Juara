import React from 'react';
import { classNames, getInitials } from '../../utils/helpers';
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> { src?: string; name?: string; fallback?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; statusDot?: boolean; status?: boolean; }
export const Avatar = ({ className, src, name, fallback, size = 'md', statusDot, status, ...props }: AvatarProps) => {
  const displayName = name || fallback || 'U';
  return (
    <div className={classNames('avatar', `avatar-${size}`, className)} {...props}>
      {src ? <img src={src} alt={displayName} /> : <span className="text-white font-medium">{getInitials(displayName)}</span>}
      {(statusDot || status) && <div className="status-dot" />}
    </div>
  );
};