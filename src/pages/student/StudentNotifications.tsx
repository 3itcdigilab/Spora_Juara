import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Bell, Briefcase, FileText, CheckCircle } from 'lucide-react';

export const StudentNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const notifs = [
    { id: 1, type: 'Application', title: 'Interview Scheduled', msg: 'Hyundai has scheduled an interview for Battery Tech on Aug 15.', time: '2 hours ago', read: false, icon: Briefcase },
    { id: 2, type: 'Assessment', title: 'Talent Score Updated', msg: 'Your recent test results have improved your score to 78.', time: '1 day ago', read: true, icon: FileText },
    { id: 3, type: 'System', title: 'Profile Verified', msg: 'Your High Voltage Safety certificate has been verified.', time: '3 days ago', read: true, icon: CheckCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:underline">Mark all as read</button>
      </div>

      <Tabs 
        tabs={[
          { id: 'All', label: 'All' },
          { id: 'Application', label: 'Applications' },
          { id: 'Assessment', label: 'Assessments' },
          { id: 'System', label: 'System' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="space-y-3">
        {notifs.filter(n => activeTab === 'All' || n.type === activeTab).map(n => {
          const Icon = n.icon;
          return (
            <Card key={n.id} className={`p-4 flex gap-4 transition-colors hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{n.time}</span>
                </div>
                <p className="text-sm text-gray-600">{n.msg}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
