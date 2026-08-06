import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router';
import { 
  LayoutDashboard, User, ClipboardList, Award, Folder, Target, 
  Sparkles, Briefcase, FileCheck, Bell, Settings, Menu, X, LogOut 
} from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { SearchBar } from '../components/ui/SearchBar';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../contexts/AuthContext';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
  { icon: User, label: 'My Profile', path: '/student/profile' },
  { icon: ClipboardList, label: 'Assessments', path: '/student/assessments' },
  { icon: Award, label: 'Certificates', path: '/student/certificates' },
  { icon: Folder, label: 'Portfolio', path: '/student/portfolio' },
  { icon: Target, label: 'Talent Score', path: '/student/talent-score' },
  { icon: Sparkles, label: 'AI Recommendation', path: '/student/ai-recommendation' },
  { icon: Briefcase, label: 'Job Board', path: '/student/jobs' },
  { icon: FileCheck, label: 'Applications', path: '/student/applications' },
  { icon: Bell, label: 'Notifications', path: '/student/notifications' },
  { icon: Settings, label: 'Settings', path: '/student/settings' }
];

import { localDB } from '../services/db';

import { AIChatbotWidget } from '../components/ai/AIChatbotWidget';

export const StudentLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (role === 'industry') return <Navigate to="/industry/dashboard" replace />;
  if (role === 'school') return <Navigate to="/school/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;

  const savedProfile = localDB.getProfile('stu-1');
  const rawName = user?.name || savedProfile?.fullName || 'Tubagus';
  const userName = rawName.includes('@') ? (savedProfile?.fullName || 'Tubagus') : rawName;
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          lg:static lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className={`flex items-center gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <Logo size="sm" />
          </Link>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {sidebarItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-cyan-50 text-[#0099B8] font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-[#0099B8]' : 'text-gray-400'} />
                    <span className={`${isCollapsed ? 'lg:hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 backdrop-blur-md bg-white/80 z-30">
          <div className="flex items-center gap-4">
            <button
              className="p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button
              className="hidden lg:flex p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block w-64">
              <SearchBar placeholder="Search jobs, competencies..." />
            </div>
            
            <Link to="/student/notifications" className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
            </Link>
            
            <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>
            
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{userName}</p>
                  <p className="text-xs text-[#0099B8]">Student Candidate</p>
                </div>
                <Avatar fallback={userInitials} size="md" />
              </div>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                    <p className="text-sm font-bold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link 
                    to="/student/profile" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <Link 
                    to="/student/settings" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
        <AIChatbotWidget />
      </main>
    </div>
  );
};
