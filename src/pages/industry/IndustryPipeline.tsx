import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { Application } from '../../data/types';
import { 
  ChevronRight, XCircle, CheckCircle2, Calendar, User, Zap, Filter, Award, Search 
} from 'lucide-react';

const pipelineStages: { key: Application['status']; label: string; color: string; border: string }[] = [
  { key: 'applied', label: 'Applied', color: 'bg-blue-50 text-blue-700', border: 'border-t-blue-500' },
  { key: 'ai_screening', label: 'Document Screening', color: 'bg-violet-50 text-violet-700', border: 'border-t-violet-500' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'bg-amber-50 text-amber-700', border: 'border-t-amber-500' },
  { key: 'interview', label: 'Interview', color: 'bg-cyan-50 text-[#0099B8]', border: 'border-t-[#0099B8]' },
  { key: 'offered', label: 'Offered', color: 'bg-emerald-50 text-emerald-700', border: 'border-t-emerald-500' },
  { key: 'hired', label: 'Hired', color: 'bg-emerald-600 text-white', border: 'border-t-emerald-700' }
];

const nextStageMap: Record<string, Application['status']> = {
  applied: 'ai_screening',
  ai_screening: 'shortlisted',
  shortlisted: 'interview',
  interview: 'offered',
  offered: 'hired'
};

export const IndustryPipeline: React.FC = () => {
  const { showToast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Modals state
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');

  const [interviewingAppId, setInterviewingAppId] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState<string>('2026-08-15T10:00');
  const [meetingUrl, setMeetingUrl] = useState<string>('https://meet.jit.si/spora-ev-interview');

  // Load data
  const jobs = useMemo(() => localDB.getJobs(), []);
  const students = useMemo(() => localDB.getStudents(), []);
  const allApplications = useMemo(() => localDB.getApplications(), [refreshKey]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return allApplications.filter((app: any) => {
      const matchJob = selectedJobId === 'All' || app.jobId === selectedJobId;
      const student = students.find((s: any) => s.id === app.studentId);
      const matchSearch = search.trim() === '' || 
        (student && student.major && student.major.toLowerCase().includes(search.toLowerCase())) ||
        (student && student.city && student.city.toLowerCase().includes(search.toLowerCase()));

      return matchJob && matchSearch;
    });
  }, [allApplications, selectedJobId, search, students]);

  // Advance stage action
  const handleAdvance = (app: Application) => {
    const nextStage = nextStageMap[app.status];
    if (!nextStage) return;

    localDB.updateApplicationStatus(app.id, nextStage);
    setRefreshKey(prev => prev + 1);
    showToast(`Candidate moved to ${nextStage.replace('_', ' ').toUpperCase()}!`, 'success');
  };

  // Reject action
  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingAppId) return;

    localDB.updateApplicationStatus(rejectingAppId, 'rejected', rejectionReasonInput);
    setRejectingAppId(null);
    setRejectionReasonInput('');
    setRefreshKey(prev => prev + 1);
    showToast('Candidate application marked as Rejected.', 'warning');
  };

  // Schedule Interview submit
  const handleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewingAppId) return;

    localDB.updateApplicationStatus(interviewingAppId, 'interview');
    setInterviewingAppId(null);
    setRefreshKey(prev => prev + 1);
    showToast('Interview scheduled & invitation sent to candidate!', 'success');
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Industry Recruitment Pipeline</h1>
          <p className="text-xs sm:text-sm text-slate-500">Review candidate applications, trigger AI evaluations, and advance talent to hire.</p>
        </div>

        {/* Vacancy Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0099B8] w-full md:w-64"
          >
            <option value="All">All Active Vacancies ({jobs.length})</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex overflow-x-auto gap-4 pb-6 min-h-[580px] scrollbar-thin">
        {pipelineStages.map((stage) => {
          const stageApps = filteredApps.filter(a => a.status === stage.key);

          return (
            <div 
              key={stage.key} 
              className={`w-80 shrink-0 bg-slate-100/70 rounded-2xl border-t-4 ${stage.border} border-x border-b border-slate-200 flex flex-col`}
            >
              {/* Stage Column Header */}
              <div className="p-3.5 border-b border-slate-200 flex justify-between items-center bg-white/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase">{stage.label}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${stage.color}`}>
                    {stageApps.length}
                  </span>
                </div>
              </div>

              {/* Candidate Cards List */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {stageApps.map((app: any) => {
                  const student = students.find((s: any) => s.id === app.studentId);
                  const job = jobs.find((j: any) => j.id === app.jobId);
                  const isFinalStage = app.status === 'hired';

                  return (
                    <Card key={app.id} className="p-4 bg-white hover:shadow-md transition-all border-slate-200 space-y-3">
                      {/* Top Meta */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                            {student?.major || 'Kandidat Vokasi EV'}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-semibold">{student?.city || 'Jawa Barat'}, {student?.province || 'Indonesia'}</p>
                        </div>
                        <Badge variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 text-[10px] font-bold shrink-0">
                          {app.aiMatchScore}% Score Match
                        </Badge>
                      </div>

                      {/* Job Role Tag */}
                      <p className="text-[11px] font-bold text-[#0099B8] bg-cyan-50 px-2.5 py-1 rounded-md inline-block">
                        🎯 {job?.title || 'EV Position'}
                      </p>

                      {/* Key Skills */}
                      <div className="flex flex-wrap gap-1">
                        {student?.skills?.slice(0, 2).map((skill: string) => (
                          <span key={skill} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Candidate Score & Date */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <span>Applied: {app.appliedAt}</span>
                        <span className="font-bold text-emerald-600">Score: 88/100</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex gap-2">
                        {app.status === 'shortlisted' && (
                          <button 
                            onClick={() => setInterviewingAppId(app.id)}
                            className="flex-1 py-1.5 px-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <Calendar size={13} /> Interview
                          </button>
                        )}

                        {!isFinalStage && (
                          <button 
                            onClick={() => handleAdvance(app)}
                            className="flex-1 py-1.5 px-2 bg-[#0099B8] hover:bg-[#007A93] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                          >
                            Advance <ChevronRight size={13} />
                          </button>
                        )}

                        {!isFinalStage && (
                          <button 
                            onClick={() => setRejectingAppId(app.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject Candidate"
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                        {isFinalStage && (
                          <div className="w-full py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1">
                            <CheckCircle2 size={14} /> Candidate Hired
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}

                {stageApps.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl">
                    No candidates in {stage.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Reason Modal */}
      <Modal isOpen={!!rejectingAppId} onClose={() => setRejectingAppId(null)} title="Reject Application">
        <form onSubmit={handleRejectSubmit} className="space-y-4 font-sans">
          <p className="text-xs text-slate-600">Provide rejection feedback for candidate record & student notifications.</p>
          <textarea 
            className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 h-24"
            placeholder="Reason for rejection (e.g. Talent Score below required benchmark)..."
            value={rejectionReasonInput}
            onChange={(e) => setRejectionReasonInput(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setRejectingAppId(null)}>Cancel</Button>
            <Button type="submit" variant="danger">Confirm Rejection</Button>
          </div>
        </form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal isOpen={!!interviewingAppId} onClose={() => setInterviewingAppId(null)} title="Schedule Candidate Interview">
        <form onSubmit={handleInterviewSubmit} className="space-y-4 font-sans">
          <Input 
            label="Date & Time" 
            type="datetime-local" 
            value={interviewDate} 
            onChange={(e) => setInterviewDate(e.target.value)} 
            required 
          />
          <Input 
            label="Meeting Link (Zoom / Jitsi / Google Meet)" 
            type="text" 
            value={meetingUrl} 
            onChange={(e) => setMeetingUrl(e.target.value)} 
            required 
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setInterviewingAppId(null)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white">Save & Notify Candidate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
