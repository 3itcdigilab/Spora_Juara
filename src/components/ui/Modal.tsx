import React from 'react';
import { classNames } from '../../utils/helpers';
export interface ModalProps { isOpen: boolean; onClose: () => void; title: string; size?: 'sm' | 'md' | 'lg'; children: React.ReactNode; }
export const Modal = ({ isOpen, onClose, title, size = 'md', children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={classNames('modal', `modal-${size}`)} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};