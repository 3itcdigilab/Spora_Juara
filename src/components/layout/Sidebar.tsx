import React from 'react';
import { NavLink, Link } from 'react-router';
import { Logo } from '../ui/Logo';
import { classNames } from '../../utils/helpers';

export const Sidebar = ({ items, collapsed, onToggle }: any) => {
  return (
    <aside className={classNames(
      'bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-40 font-sans',
      collapsed ? 'w-20' : 'w-64'
    )}>
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 shrink-0">
        <Link to="/" className="flex items-center gap-2 overflow-hidden py-1">
          <Logo size="sm" />
        </Link>
        <button 
          onClick={onToggle} 
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xs font-bold"
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {items.map((it: any) => {
          const Icon = it.icon;
          return (
            <NavLink 
              key={it.path} 
              to={it.path} 
              className={({ isActive }) => classNames(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors',
                isActive 
                  ? 'bg-cyan-50 text-[#0099B8] font-bold shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
              {!collapsed && it.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {it.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};