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
  ChevronRight, XCircle, CheckCircle2, Calendar, User, Zap, Filter, Award, Search,
  Eye, Mail, Phone, MapPin, GraduationCap, FileText, Download, Briefcase, ExternalLink
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
  const [viewingApplicant, setViewingApplicant] = useState<any | null>(null);

  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');

  const [interviewingAppId, setInterviewingAppId] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState<string>('2026-08-15T10:00');
  const [meetingUrl, setMeetingUrl] = useState<string>('https://meet.jit.si/spora-ev-interview');

  // Load data
  const jobs = useMemo(() => localDB.getJobs(), []);
  const allApplications = useMemo(() => localDB.getApplications(), [refreshKey]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return allApplications.filter((app: any) => {
      const matchJob = selectedJobId === 'All' || app.jobId === selectedJobId;
      
      const studentObj = localDB.getStudentById(app.studentId || app.studentEmail);
      const appName = app.studentName && app.studentName !== '3ITC' ? app.studentName : studentObj.name;
      const appMajor = app.major || studentObj.major || '';

      const matchSearch = search.trim() === '' || 
        appName.toLowerCase().includes(search.toLowerCase()) ||
        appMajor.toLowerCase().includes(search.toLowerCase());

      return matchJob && matchSearch;
    });
  }, [allApplications, selectedJobId, search]);

  // Advance stage action
  const handleAdvance = (app: any) => {
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
          <p className="text-xs sm:text-sm text-slate-500">Kelola lamaran pelamar real, lihat profil & proyek, dan majukan tahap seleksi.</p>
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
            {jobs.map((job: any) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex overflow-x-auto gap-4 pb-6 min-h-[580px] scrollbar-thin">
        {pipelineStages.map((stage) => {
          const stageApps = filteredApps.filter((a: any) => a.status === stage.key);

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
                  const studentObj = localDB.getStudentById(app.studentId || app.studentEmail);
                  const job = jobs.find((j: any) => j.id === app.jobId);
                  const isFinalStage = app.status === 'hired';

                  // Real candidate name & attributes resolved directly from registered candidate account
                  const candidateName = app.studentName && app.studentName !== '3ITC' && app.studentName !== 'Pelamar Vokasi EV' ? app.studentName : studentObj.name;
                  const candidateEmail = app.studentEmail || studentObj.email;
                  const candidateSchool = app.school || studentObj.schoolName;
                  const candidateMajor = app.major || studentObj.major;
                  const candidateSkills = app.skills || studentObj.skills;

                  return (
                    <Card key={app.id} className="p-4 bg-white hover:shadow-md transition-all border-slate-200 space-y-3 font-sans">
                      {/* Top Meta */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                            {candidateName}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-semibold">{candidateSchool}</p>
                          <p className="text-[10px] text-[#0099B8] font-bold mt-0.5">{candidateMajor}</p>
                        </div>
                        <Badge variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 text-[10px] font-bold shrink-0">
                          {app.aiMatchScore}% Score Match
                        </Badge>
                      </div>

                      {/* View Profile Button */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs font-bold text-[#0099B8] border-cyan-200 bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center gap-1.5 py-1.5"
                        onClick={() => setViewingApplicant({ 
                          ...app, 
                          candidateName, 
                          candidateEmail, 
                          candidateSchool, 
                          candidateMajor, 
                          candidateSkills, 
                          jobTitle: job?.title 
                        })}
                      >
                        <Eye size={14} /> View Profile & Detail Pelamar ↗
                      </Button>

                      {/* Key Skills */}
                      <div className="flex flex-wrap gap-1">
                        {candidateSkills.slice(0, 2).map((skill: string) => (
                          <span key={skill} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Candidate Score & Date */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
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

      {/* Candidate Profile Detail Modal */}
      <Modal 
        isOpen={!!viewingApplicant} 
        onClose={() => setViewingApplicant(null)} 
        title={`Detail Profil & Portofolio Pelamar: ${viewingApplicant?.candidateName || ''}`}
        size="lg"
      >
        {viewingApplicant && (
          <div className="space-y-5 pt-2 font-sans text-slate-800">
            {/* Header Identity Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xs shrink-0">
                  {viewingApplicant.candidateName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{viewingApplicant.candidateName}</h3>
                  <p className="text-xs font-bold text-[#0099B8]">{viewingApplicant.candidateMajor}</p>
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                    <GraduationCap size={14} className="text-[#0099B8]" /> {viewingApplicant.candidateSchool}
                  </p>
                </div>
              </div>

              <div className="text-right bg-white p-3 rounded-xl border border-cyan-100 shadow-2xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase">National Talent Score</p>
                <p className="text-2xl font-black text-emerald-600">88/100</p>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Email Kontak Pelamar</span>
                <p className="font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
                  <Mail size={14} className="text-[#0099B8]" /> {viewingApplicant.candidateEmail || 'tubagus@spora.id'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">No. Telepon / WhatsApp</span>
                <p className="font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
                  <Phone size={14} className="text-[#0099B8]" /> {viewingApplicant.phone || '0812-3456-7890'}
                </p>
              </div>
            </div>

            {/* Bio & Skills */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Bio / Ringkasan Diri</h4>
                <p className="text-slate-600 leading-relaxed">
                  {viewingApplicant.bio || 'Kandidat siswa vokasi berdedikasi tinggi dengan spesialisasi perakitan modul baterai EV dan standar keselamatan High Voltage.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Terverifikasi Competencies & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(viewingApplicant.candidateSkills || ['EV Battery Assembly', 'High Voltage Safety', 'Quality Control']).map((sk: string) => (
                    <Badge key={sk} variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 font-semibold px-2.5 py-1 text-xs">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificates & Portfolio Section */}
            <div className="space-y-3 pt-2 border-t text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Award size={16} className="text-[#0099B8]" /> Sertifikat Competency & Portofolio Projek
              </h4>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <FileText size={16} className="text-emerald-600" />
                  <span>CV_Lengkap_{viewingApplicant.candidateName.replace(/\s+/g, '_')}.pdf</span>
                </div>
                <Button size="sm" variant="outline" className="text-xs bg-white font-bold flex items-center gap-1">
                  <Download size={13} /> Download CV
                </Button>
              </div>
            </div>

            {/* Footer Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setViewingApplicant(null)}>Tutup</Button>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold flex items-center gap-1 text-xs"
                  onClick={() => {
                    handleAdvance(viewingApplicant);
                    setViewingApplicant(null);
                  }}
                >
                  Advance Stage <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

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
