import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { AIChatbotWidget } from '../components/ai/AIChatbotWidget';
import { LayoutDashboard, Briefcase, PlusCircle, Users, GitBranch, UserCheck, Calendar, BarChart3, Sparkles, Settings } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/industry/dashboard' },
  { icon: Briefcase, label: 'Vacancies', path: '/industry/vacancies' },
  { icon: PlusCircle, label: 'Post Job', path: '/industry/post-job' },
  { icon: Users, label: 'Talent Pool', path: '/industry/talent-pool' },
  { icon: GitBranch, label: 'Pipeline', path: '/industry/pipeline' },
  { icon: UserCheck, label: 'Candidates', path: '/industry/candidates' },
  { icon: Calendar, label: 'Interviews', path: '/industry/interviews' },
  { icon: BarChart3, label: 'Reports', path: '/industry/reports' },
  { icon: Sparkles, label: 'AI Recommendations', path: '/industry/ai-recommendations' },
  { icon: Settings, label: 'Settings', path: '/industry/settings' },
];

export const IndustryLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        <AIChatbotWidget />
      </div>
    </div>
  );
};
