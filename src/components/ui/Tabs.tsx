import React, { useState } from 'react';
import { classNames } from '../../utils/helpers';
export interface TabsProps { 
  tabs: { label: string; value?: string; id?: string; count?: number; content?: React.ReactNode }[]; 
  activeTab?: string; 
  onChange?: (v: string) => void; 
}
export const Tabs = ({ tabs, activeTab: controlledActiveTab, onChange }: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.value || tabs[0]?.id || tabs[0]?.label || '');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  const handleTabClick = (val: string) => {
    setInternalActiveTab(val);
    if (onChange) onChange(val);
  };

  const activeTabObj = tabs.find(t => (t.value || t.id || t.label) === activeTab) || tabs[0];

  return (
    <div>
      <div className="tabs">
        {tabs.map(t => {
          const val = t.value || t.id || t.label;
          const isActive = activeTab === val || activeTab === t.id || activeTab === t.value;
          return (
            <button key={val} onClick={() => handleTabClick(val)} className={classNames('tab', isActive && 'tab-active')}>
              {t.label} {t.count !== undefined && <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{t.count}</span>}
            </button>
          );
        })}
      </div>
      {activeTabObj?.content && <div className="tab-content mt-4">{activeTabObj.content}</div>}
    </div>
  );
};