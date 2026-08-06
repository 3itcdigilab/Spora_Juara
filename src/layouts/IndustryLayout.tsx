import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { LayoutDashboard, Briefcase, PlusCircle, Users, GitBranch, UserCheck, Calendar, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/industry/dashboard' },
  { icon: Briefcase, label: 'Vacancies', path: '/industry/vacancies' },
  { icon: PlusCircle, label: 'Post Job', path: '/industry/post-job' },
  { icon: Users, label: 'Talent Pool', path: '/industry/talent-pool' },
  { icon: GitBranch, label: 'Pipeline', path: '/industry/pipeline' },
  { icon: UserCheck, label: 'Candidates', path: '/industry/candidates' },
  { icon: Calendar, label: 'Interviews', path: '/industry/interviews' },
  { icon: BarChart3, label: 'Reports', path: '/industry/reports' },
  { icon: Settings, label: 'Settings', path: '/industry/settings' },
];

export const IndustryLayout: React.FC = () => {
  const { role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (role === 'school') return <Navigate to="/school/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        items={sidebarItems} 
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        <Topbar onMenuToggle={() => setMobileOpen(prev => !prev)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
