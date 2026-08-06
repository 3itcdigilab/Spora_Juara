import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { Application } from '../../data/types';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Clock, XCircle, ChevronRight, AlertCircle, Briefcase, Trash2 } from 'lucide-react';

export const StudentApplications: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('All');
  
  const studentId = user?.email || (user as any)?.id || 'student-1';

  // Trigger state update when withdrawing or deleting
  const [refreshKey, setRefreshKey] = useState(0);

  const rawApps = useMemo(() => {
    // Fetch applications for logged-in user
    const apps = localDB.getApplications();
    const userEmail = (user?.email || '').toLowerCase();
    const userName = (user?.name || '').toLowerCase();

    if (userEmail) {
      return apps.filter((a: any) => 
        (a.studentEmail && a.studentEmail.toLowerCase() === userEmail) ||
        (a.studentId && a.studentId.toLowerCase() === userEmail) ||
        (userName && a.studentName && a.studentName.toLowerCase().includes(userName)) ||
        a.studentId === 'student-1'
      );
    }
    return apps;
  }, [user, refreshKey]);

  const stages = ['Applied', 'Document Screening', 'Shortlisted', 'Interview', 'Offered'];

  const formattedApps = useMemo(() => {
    const jobs = localDB.getJobs();

    return rawApps.map((app: Application) => {
      const job = jobs.find((j: any) => j.id === app.jobId);
      if (!job) return null;

      let stageIdx = 0;
      if (app.status === 'ai_screening') stageIdx = 1;
      if (app.status === 'shortlisted') stageIdx = 2;
      if (app.status === 'interview') stageIdx = 3;
      if (app.status === 'offered' || app.status === 'hired') stageIdx = 4;
      
      let displayCategory = 'Active';
      if (app.status === 'hired') displayCategory = 'Hired';
      if (app.status === 'rejected' || app.status === 'withdrawn') displayCategory = 'Closed';

      return {
        ...app,
        jobTitle: job.title,
        company: job.department,
        currentStage: stageIdx,
        displayCategory
      };
    }).filter(Boolean);
  }, [rawApps]);

  const filteredApps = useMemo(() => {
    if (activeTab === 'All') return formattedApps;
    return formattedApps.filter((app: any) => app.displayCategory === activeTab);
  }, [formattedApps, activeTab]);

  const handleWithdraw = (appId: string, title: string) => {
    if (window.confirm(`Yakin ingin menarik lamaran posisi ${title}?`)) {
      localDB.withdrawApplication(appId);
      setRefreshKey(prev => prev + 1);
      showToast('Lamaran berhasil ditarik.', 'info');
    }
  };

  const handleDeleteRejected = (appId: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus riwayat lamaran posisi "${title}" yang ditolak ini dari daftar Anda?`)) {
      localDB.withdrawApplication(appId);
      setRefreshKey(prev => prev + 1);
      showToast(`Riwayat lamaran ${title} berhasil dihapus dari daftar Anda.`, 'warning');
    }
  };

  const countActive = formattedApps.filter((a: any) => a.displayCategory === 'Active').length;
  const countHired = formattedApps.filter((a: any) => a.displayCategory === 'Hired').length;
  const countClosed = formattedApps.filter((a: any) => a.displayCategory === 'Closed').length;

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Job Applications</h1>
        <p className="text-xs sm:text-sm text-slate-500">Track your recruitment pipeline stages and interview invitations in real time.</p>
      </div>
      
      <Tabs 
        tabs={[
          { id: 'All', label: `All Applications (${formattedApps.length})` },
          { id: 'Active', label: `In Progress (${countActive})` },
          { id: 'Hired', label: `Hired / Offered (${countHired})` },
          { id: 'Closed', label: `Closed / Rejected (${countClosed})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="space-y-4">
        {filteredApps.map((app: any) => (
          <Card key={app.id} className="p-6 hover:shadow-md transition-all border-slate-200 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                  {app.status === 'hired' && (
                    <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold">
                      🎉 Hired!
                    </Badge>
                  )}
                  {app.status === 'rejected' && (
                    <Badge variant="error" className="bg-red-50 text-red-700 border-red-200 font-semibold">
                      Rejected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-semibold">{app.company} • Applied on {app.appliedAt}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 font-bold">
                  {app.aiMatchScore}% Score Match
                </Badge>
                <Link to={`/student/jobs/${app.jobId}`} className="text-xs font-bold text-[#0099B8] hover:underline flex items-center gap-1">
                  View Job <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Pipeline Stepper */}
            <div className="relative pt-2 mb-4">
              <div className="overflow-hidden h-2.5 mb-3 text-xs flex rounded-full bg-slate-100">
                <div 
                  style={{ width: `${Math.max(10, (app.currentStage / (stages.length - 1)) * 100)}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                    app.status === 'rejected' ? 'bg-red-500' : app.status === 'hired' ? 'bg-emerald-600' : 'bg-[#0099B8]'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                {stages.map((stage, idx) => {
                  const isCurrent = idx === app.currentStage;
                  const isPassed = idx <= app.currentStage;

                  let colorClass = 'text-slate-400';
                  if (isPassed) colorClass = 'text-[#0099B8]';
                  if (app.status === 'rejected' && isCurrent) colorClass = 'text-red-600';
                  if (app.status === 'hired' && isPassed) colorClass = 'text-emerald-700';

                  return (
                    <span key={stage} className={colorClass}>
                      {app.status === 'rejected' && isCurrent ? 'Not Selected' : stage}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Stage Actions & Rejection Reason */}
            {app.status === 'rejected' && app.rejectionReason && (
              <div className="mt-4 bg-red-50/80 p-3.5 rounded-xl border border-red-100 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
                <div>
                  <p className="font-bold">Feedback / Catatan dari Rekruter:</p>
                  <p className="mt-0.5">{app.rejectionReason}</p>
                </div>
              </div>
            )}

            {/* Hapus opsi hanya jika status REJECTED */}
            {app.status === 'rejected' && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">Proses seleksi telah selesai</span>
                <button 
                  onClick={() => handleDeleteRejected(app.id, app.jobTitle)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Hapus Riwayat Lamaran Ditolak
                </button>
              </div>
            )}

            {/* Hanya tampilkan opsi Withdraw untuk status Applied yang masih awal */}
            {app.status === 'applied' && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => handleWithdraw(app.id, app.jobTitle)}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
                >
                  Withdraw Application
                </button>
              </div>
            )}
          </Card>
        ))}

        {filteredApps.length === 0 && (
          <div className="text-center py-14 text-slate-500 bg-white rounded-2xl border border-slate-200">
            <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Lamaran Pekerjaan</h3>
            <p className="text-xs text-slate-500 mb-4">Anda belum memiliki lamaran di kategori ini.</p>
            <Link to="/student/jobs">
              <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white text-xs font-bold px-4 py-2">
                Browse EV Job Opportunities
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
