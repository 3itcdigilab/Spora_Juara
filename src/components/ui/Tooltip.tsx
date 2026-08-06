import React from 'react';
import { classNames } from '../../utils/helpers';
export interface TooltipProps { content: React.ReactNode; position?: 'top'|'right'|'bottom'|'left'; children: React.ReactNode; }
export const Tooltip = ({ content, position = 'top', children }: TooltipProps) => (
  <div className="tooltip-container">
    {children}
    <div className={classNames('tooltip', 
      position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : 
      position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : 
      position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : 
      'left-full top-1/2 -translate-y-1/2 ml-2'
    )}>{content}</div>
  </div>
);