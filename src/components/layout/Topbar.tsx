import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { SearchBar } from '../ui/SearchBar';
import { Avatar } from '../ui/Avatar';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, LogOut, User, Settings, ShieldCheck, ChevronDown } from 'lucide-react';

export const Topbar = ({ onMenuToggle }: any) => {
  const { unreadCount } = useNotifications();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userName = user?.name || user?.email || 'Administrator';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 font-sans shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          ☰
        </button>
        <div className="hidden sm:block w-72">
          <SearchBar placeholder="Search platform analytics, users..." />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <div className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <Avatar src={user?.avatarUrl} fallback={userInitials} size="sm" className="bg-[#0099B8] text-white font-bold" />
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1">
                {userName}
              </span>
              <span className="text-[10px] text-[#0099B8] font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} /> {role || 'Admin'}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn font-sans">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to={role === 'admin' ? '/admin/settings' : `/${role}/settings`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Settings size={15} className="text-slate-400" /> Account Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} /> Sign Out / Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};