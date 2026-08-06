import React, { useRef } from 'react';
export interface FileUploadProps { onFileSelect: (f: File) => void; accept?: string; maxSize?: number; label?: string; helpText?: string; }
export const FileUpload = ({ onFileSelect, accept, maxSize, label = 'Drag and drop or click to upload', helpText }: FileUploadProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="file-upload" onClick={() => ref.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) onFileSelect(e.dataTransfer.files[0]); }}>
      <input type="file" className="hidden" ref={ref} accept={accept} onChange={e => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); }} />
      <div>{label}</div>
      {helpText && <div className="text-xs text-gray-500 mt-1">{helpText}</div>}
    </div>
  );
};