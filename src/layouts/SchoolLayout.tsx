import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { AIChatbotWidget } from '../components/ai/AIChatbotWidget';
import { LayoutDashboard, Users, GraduationCap, BarChart3, AlertTriangle, MessageSquare, BookOpen, MapPin, Trophy, Settings } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/school/dashboard' },
  { icon: Users, label: 'Students', path: '/school/students' },
  { icon: GraduationCap, label: 'Graduates', path: '/school/graduates' },
  { icon: BarChart3, label: 'Analytics', path: '/school/analytics' },
  { icon: AlertTriangle, label: 'Skill Gap', path: '/school/skill-gap' },
  { icon: MessageSquare, label: 'Industry Feedback', path: '/school/feedback' },
  { icon: BookOpen, label: 'Curriculum', path: '/school/curriculum' },
  { icon: MapPin, label: 'Placement', path: '/school/placement' },
  { icon: Trophy, label: 'Rankings', path: '/school/rankings' },
  { icon: Settings, label: 'Settings', path: '/school/settings' }
];

export const SchoolLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        <Topbar title="School Portal" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        <AIChatbotWidget />
      </div>
    </div>
  );
};
