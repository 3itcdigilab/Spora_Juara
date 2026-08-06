import React from 'react';
import { NavLink, Link } from 'react-router';
import { Logo } from '../ui/Logo';
import { classNames } from '../../utils/helpers';
import { X } from 'lucide-react';

export const Sidebar = ({ items, collapsed, onToggle, mobileOpen, onMobileClose }: any) => {
  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity duration-300 animate-fadeIn"
          onClick={onMobileClose}
        />
      )}

      {/* Responsive Sidebar Container */}
      <aside className={classNames(
        'bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50 font-sans shadow-sm',
        // Mobile Off-Canvas Drawer (Slide from left)
        'fixed inset-y-0 left-0',
        mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full',
        // Desktop In-line Static
        'lg:static lg:translate-x-0',
        collapsed ? 'lg:w-20' : 'lg:w-64'
      )}>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 shrink-0">
          <Link to="/" className="flex items-center gap-2 overflow-hidden py-1" onClick={onMobileClose}>
            <Logo size="sm" />
          </Link>

          <div className="flex items-center gap-1">
            <button 
              onClick={onToggle} 
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xs font-bold"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? '▶' : '◀'}
            </button>

            <button 
              onClick={onMobileClose}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close Menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map((it: any) => {
            const Icon = it.icon;
            return (
              <NavLink 
                key={it.path} 
                to={it.path} 
                onClick={onMobileClose}
                className={({ isActive }) => classNames(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors',
                  isActive 
                    ? 'bg-cyan-50 text-[#0099B8] font-bold shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={classNames('flex-1 truncate', collapsed ? 'lg:hidden' : 'block')}>{it.label}</span>
                {it.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {it.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};