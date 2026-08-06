import React, { useState } from 'react';
import { Input } from './Input';
export interface SearchBarProps { value?: string; onChange?: (v: string) => void; placeholder?: string; onSearch?: (v?: string) => void; }
export const SearchBar = ({ value: controlledValue, onChange, placeholder = 'Search...', onSearch }: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const handleChange = (v: string) => {
    if (!isControlled) setInternalValue(v);
    if (onChange) onChange(v);
  };
  return (
    <Input value={currentValue} onChange={e => handleChange(e.target.value)} placeholder={placeholder} leftIcon={<span>🔍</span>}
      onKeyDown={e => { if (e.key === 'Enter' && onSearch) onSearch(currentValue); }}
      rightIcon={currentValue ? <button onClick={() => handleChange('')}>✕</button> : undefined}
    />
  );
};