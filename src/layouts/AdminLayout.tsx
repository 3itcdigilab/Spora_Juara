import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { LayoutDashboard, Users, GraduationCap, School, Building, ClipboardList, FileBarChart, Map, Monitor, Settings } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: GraduationCap, label: 'Students', path: '/admin/students' },
  { icon: School, label: 'Education Institution', path: '/admin/schools' },
  { icon: Building, label: 'Industries', path: '/admin/industries' },
  { icon: ClipboardList, label: 'Assessments', path: '/admin/assessments' },
  { icon: FileBarChart, label: 'Reports', path: '/admin/reports' },
  { icon: Map, label: 'Analytics', path: '/admin/analytics' },
  { icon: Monitor, label: 'System', path: '/admin/system' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' }
];

export const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
        <Topbar title="National Command Center" onMenuToggle={() => setMobileOpen(prev => !prev)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
