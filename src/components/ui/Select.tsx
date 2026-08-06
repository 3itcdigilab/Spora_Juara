import React from 'react';
import { classNames } from '../../utils/helpers';
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; error?: string; options: { label: string; value: string }[]; }
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, options, ...props }, ref) => (
  <div className="input-group">
    {label && <label className="text-sm font-medium">{label}</label>}
    <select ref={ref} className={classNames('input select', error && 'input-error', className)} {...props}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
)); Select.displayName = 'Select';