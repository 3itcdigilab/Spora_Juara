import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Bell, Briefcase, FileText, CheckCircle, AlertCircle, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export const StudentNotifications: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);

  const notifications = useMemo(() => {
    return localDB.getNotifications(user?.email || 'student-1');
  }, [user, refreshKey]);

  const handleMarkAllRead = () => {
    notifications.forEach((n: any) => {
      localDB.markNotificationRead(n.id);
    });
    setRefreshKey(k => k + 1);
  };

  const handleCardClick = (notifId: string) => {
    localDB.markNotificationRead(notifId);
    setRefreshKey(k => k + 1);
  };

  const filteredNotifs = useMemo(() => {
    return notifications.filter((n: any) => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Application') return n.type === 'status' || n.type === 'invite' || n.type === 'feedback';
      if (activeTab === 'Assessment') return n.type === 'reminder';
      return true;
    });
  }, [notifications, activeTab]);

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500">Pembaruan waktu nyata mengenai lamaran, wawancara, dan hasil seleksi industri.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-[#0099B8] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <Tabs 
        tabs={[
          { id: 'All', label: `All (${notifications.length})` },
          { id: 'Application', label: 'Applications & Status' },
          { id: 'Assessment', label: 'Assessments' },
          { id: 'System', label: 'System Updates' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="space-y-3">
        {filteredNotifs.map((n: any) => {
          let Icon = Bell;
          let colorBg = 'bg-slate-100 text-slate-500';

          if (n.type === 'invite') {
            Icon = Calendar;
            colorBg = 'bg-violet-100 text-violet-700';
          } else if (n.type === 'feedback') {
            Icon = AlertCircle;
            colorBg = 'bg-red-100 text-red-600';
          } else if (n.type === 'status') {
            Icon = Briefcase;
            colorBg = 'bg-cyan-100 text-[#0099B8]';
          }

          return (
            <Card 
              key={n.id} 
              onClick={() => handleCardClick(n.id)}
              className={`p-4 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer border-slate-200 ${!n.isRead ? 'bg-cyan-50/30 border-cyan-200' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorBg}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2 font-mono">
                    {n.createdAt ? n.createdAt.split('T')[0] : 'Today'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
              {!n.isRead && <div className="w-2.5 h-2.5 bg-[#0099B8] rounded-full mt-1.5 shrink-0 animate-pulse"></div>}
            </Card>
          );
        })}

        {filteredNotifs.length === 0 && (
          <Card className="p-12 text-center text-slate-500 border-slate-200">
            <Bell size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">Belum Ada Notifikasi</p>
            <p className="text-xs text-slate-400 mt-1">Notifikasi mengenai status lamaran dan wawancara industri akan muncul di sini secara otomatis.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
