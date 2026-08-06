import React, { useState } from 'react';
import { classNames } from '../../utils/helpers';
export interface AccordionProps { items: { title: string; content: React.ReactNode }[]; }
export const Accordion = ({ items }: AccordionProps) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div key={i}>
          <div className="accordion-header" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
            {it.title} <span>{openIdx === i ? '▲' : '▼'}</span>
          </div>
          <div className={classNames('accordion-content', openIdx === i && 'open')}>{it.content}</div>
        </div>
      ))}
    </div>
  );
};