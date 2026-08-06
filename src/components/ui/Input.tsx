import React from 'react';
import { classNames } from '../../utils/helpers';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; helperText?: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; }
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => (
  <div className="input-group">
    {label && <label className="text-sm font-medium">{label}</label>}
    <div className="relative">
      {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</div>}
      <input ref={ref} className={classNames('input', error ? 'input-error' : '', leftIcon ? 'pl-10' : '', rightIcon ? 'pr-10' : '', className)} {...props} />
      {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
    {(error || helperText) && <span className={classNames('text-xs', error ? 'text-red-500' : 'text-gray-500')}>{error || helperText}</span>}
  </div>
)); Input.displayName = 'Input';