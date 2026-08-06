import React, { useState } from 'react';
export interface TagInputProps { 
  tags: string[]; 
  onAdd?: (t: string) => void; 
  onRemove?: (t: string) => void; 
  onTagsChange?: (tags: string[]) => void; 
  suggestions?: string[]; 
  placeholder?: string;
}
export const TagInput = ({ tags, onAdd, onRemove, onTagsChange, placeholder = "Add tag..." }: TagInputProps) => {
  const [val, setVal] = useState('');
  const handleRemove = (t: string) => {
    if (onRemove) onRemove(t);
    if (onTagsChange) onTagsChange(tags.filter(item => item !== t));
  };
  const handleAdd = (t: string) => {
    if (onAdd) onAdd(t);
    if (onTagsChange && !tags.includes(t)) onTagsChange([...tags, t]);
  };
  return (
    <div className="tag-input-container">
      {tags.map(t => <span key={t} className="tag">{t} <button type="button" onClick={() => handleRemove(t)}>✕</button></span>)}
      <input className="outline-none flex-1 min-w-[100px] bg-transparent" value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && val) { e.preventDefault(); handleAdd(val); setVal(''); } }} placeholder={placeholder} />
    </div>
  );
};