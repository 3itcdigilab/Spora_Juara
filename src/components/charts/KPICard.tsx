import React, { useEffect, useState } from 'react';
import { classNames } from '../../utils/helpers';
export const KPICard = ({ title, value, change, changeLabel, icon: Icon }: any) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (typeof value === 'number') { let start = 0; const end = value; const duration = 1000; const step = end / (duration / 16);
      const timer = setInterval(() => { start += step; if (start >= end) { setVal(end); clearInterval(timer); } else setVal(Math.floor(start)); }, 16);
      return () => clearInterval(timer);
    } else setVal(value);
  }, [value]);
  
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    if (typeof Icon === 'function' || typeof Icon === 'object') {
      const Component = Icon;
      return <Component className="w-5 h-5 text-gray-400" />;
    }
    return null;
  };

  return (
    <div className="kpi-card">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {renderIcon()}
      </div>
      <div className="text-2xl font-bold">{val}</div>
      {change !== undefined && (
        <div className="flex items-center text-xs mt-1">
          <span className={classNames(change >= 0 ? 'text-emerald-500' : 'text-red-500', 'font-medium mr-1')}>{change >= 0 ? '+' : ''}{change}%</span>
          <span className="text-gray-500">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};