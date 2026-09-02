import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { Calendar, Clock, Video, User, Plus, CheckCircle2 } from 'lucide-react';

export const IndustryInterviews: React.FC = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    candidateName: '',
    interviewerName: '',
    scheduledAt: '',
    meetingUrl: '',
    location: 'online'
  });

  // Load interviews combined with applications in 'interview' stage
  const interviews = useMemo(() => {
    const raw = localStorage.getItem('spora_interviews');
    let list = raw ? JSON.parse(raw) : [];

    // Also get applications in interview status
    const apps = localDB.getApplications().filter((a: any) => a.status === 'interview');
    const students = localDB.getStudents();
    const jobs = localDB.getJobs();

    apps.forEach((app: any) => {
      const exists = list.some((i: any) => i.applicationId === app.id);
      if (!exists) {
        const student = students.find((s: any) => s.id === app.studentId) || localDB.getStudentById(app.studentId);
        const job = jobs.find((j: any) => j.id === app.jobId);
        list.push({
          id: `iv-${app.id}`,
          applicationId: app.id,
          candidateName: student?.name || student?.fullName || student?.major || 'Unknown Candidate',
          jobTitle: job?.title || 'Unknown Position',
          scheduledAt: 'Not Scheduled',
          durationMinutes: 45,
          interviewerName: 'Unassigned',
          location: 'online',
          meetingUrl: 'https://meet.jit.si/spora-ev-interview',
          status: 'scheduled'
        });
      }
    });

    return list;
  }, [refreshKey]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInterview = {
      id: `iv-${Date.now()}`,
      candidateName: formData.candidateName,
      jobTitle: 'EV Technician Position',
      scheduledAt: formData.scheduledAt.replace('T', ' '),
      durationMinutes: 45,
      interviewerName: formData.interviewerName,
      location: formData.location,
      meetingUrl: formData.meetingUrl,
      status: 'scheduled'
    };

    const existing = JSON.parse(localStorage.getItem('spora_interviews') || '[]');
    existing.unshift(newInterview);
    localStorage.setItem('spora_interviews', JSON.stringify(existing));

    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
    showToast(`Interview scheduled for ${formData.candidateName}!`, 'success');
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Interview Schedule</h1>
          <p className="text-slate-500 text-sm">Kelola jadwal wawancara langsung kandidat siswa vokasi EV.</p>
        </div>
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Schedule Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Interviews Scheduled</h3>
            <p className="text-xs text-slate-500 mt-1">When candidates are invited for interviews, they will appear here.</p>
          </div>
        ) : interviews.map((iv: any, idx: number) => {
          const candidateName = iv.candidateName || iv.name || 'Unknown Candidate';
          const jobTitle = iv.jobTitle || 'Unknown Position';

          return (
            <Card key={iv.id || idx} className="p-6 space-y-4 border-slate-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                    <User size={16} className="text-[#0099B8]" /> {candidateName}
                  </h3>
                  <p className="text-xs text-[#0099B8] font-bold mt-0.5">{jobTitle}</p>
                </div>
                <Badge variant={iv.status === 'scheduled' ? 'warning' : 'success'} className="capitalize text-xs">
                  {iv.status || 'Scheduled'}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-slate-800 font-bold">{iv.scheduledAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-slate-800">{iv.durationMinutes || 45} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Interviewer:</span>
                  <span className="text-slate-800">{iv.interviewerName || 'HR Team'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-[#0099B8] capitalize font-bold">{iv.location || 'Online Video Call'}</span>
                </div>
              </div>

              {iv.meetingUrl && (
                <a
                  href={iv.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs font-bold text-[#0099B8] bg-cyan-50 hover:bg-cyan-100 py-2.5 rounded-xl border border-cyan-200 transition-colors"
                >
                  <Video size={14} className="inline mr-1" /> Join Virtual Meeting Room ↗
                </a>
              )}
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Candidate Interview">
        <form className="space-y-4 pt-2 font-sans" onSubmit={handleScheduleSubmit}>
          <Input 
            label="Candidate Name" 
            value={formData.candidateName} 
            onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })} 
            placeholder="Nama Lengkap Kandidat" 
            required 
          />
          <Input 
            label="Interviewer Name / Panel" 
            value={formData.interviewerName} 
            onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })} 
            placeholder="Nama Pewawancara / Panel HR" 
            required 
          />
          <Input 
            label="Date & Time" 
            type="datetime-local" 
            value={formData.scheduledAt} 
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })} 
            required 
          />
          <Input 
            label="Meeting Link (Google Meet / Jitsi / Zoom)" 
            value={formData.meetingUrl} 
            onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })} 
            placeholder="https://meet.google.com/..." 
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="bg-[#0099B8] text-white font-bold">Confirm & Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
