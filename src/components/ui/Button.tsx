import React from 'react';
import { classNames } from '../../utils/helpers';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; isLoading?: boolean; icon?: React.ReactNode; }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', isLoading, icon, children, disabled, ...props }, ref) => {
  return (
    <button ref={ref} className={classNames('btn', `btn-${variant}`, `btn-${size}`, className)} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="mr-2">...</span> : icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}); Button.displayName = 'Button';