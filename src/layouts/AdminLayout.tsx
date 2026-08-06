import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { AIChatbotWidget } from '../components/ai/AIChatbotWidget';
import { LayoutDashboard, Users, GraduationCap, School, Building, ClipboardList, Sparkles, FileBarChart, Map, Monitor, Settings } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: GraduationCap, label: 'Students', path: '/admin/students' },
  { icon: School, label: 'Schools', path: '/admin/schools' },
  { icon: Building, label: 'Industries', path: '/admin/industries' },
  { icon: ClipboardList, label: 'Assessments', path: '/admin/assessments' },
  { icon: Sparkles, label: 'AI Rules', path: '/admin/ai-rules' },
  { icon: FileBarChart, label: 'Reports', path: '/admin/reports' },
  { icon: Map, label: 'Analytics', path: '/admin/analytics' },
  { icon: Monitor, label: 'System', path: '/admin/system' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' }
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        <Topbar title="National Command Center" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        <AIChatbotWidget />
      </div>
    </div>
  );
};
