import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { PlusCircle, Search, Sparkles, Briefcase, Users, Calendar, ArrowRight, CheckCircle2, Factory, ShieldCheck, UserCheck, Phone, Mail, Edit2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export const IndustryDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const companyName = user?.name || '3ITC Digital Academy';

  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [picFormData, setPicFormData] = useState({
    directorName: (user as any)?.directorName || 'Ir. H. Bambang Soesilo, M.T.',
    picName: (user as any)?.picName || user?.name || 'Hendra Pratama, S.Psi',
    picEmail: user?.email || '3itcdigilab@gmail.com',
    picPhone: (user as any)?.picPhone || '+62 812-9876-5432',
    picRole: (user as any)?.picRole || 'Head of Talent Acquisition & HR',
    picNotes: (user as any)?.picNotes || 'Otorisasi rekrutmen & seleksi kandidat vokasi EV.'
  });

  // Dynamic database statistics
  const jobs = useMemo(() => localDB.getJobs(), []);
  const applications = useMemo(() => localDB.getApplications(), []);
  const students = useMemo(() => localDB.getStudents(), []);

  const recentApplications = useMemo(() => {
    return applications.slice(0, 5).map((app: any) => {
      const student = students.find((s: any) => s.id === app.studentId);
      const job = jobs.find((j: any) => j.id === app.jobId);
      return {
        ...app,
        studentName: student?.major || 'Kandidat Vokasi EV',
        studentCity: student?.city || 'Indonesia',
        jobTitle: job?.title || 'EV Position'
      };
    });
  }, [applications, students, jobs]);

  const handleSavePic = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      directorName: picFormData.directorName,
      picName: picFormData.picName,
      picPhone: picFormData.picPhone,
      picRole: picFormData.picRole,
      picNotes: picFormData.picNotes
    } as any);

    showToast('Data PIC Rekrutmen & Direktur Perusahaan berhasil disimpan!', 'success');
    setIsPicModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-violet-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <Factory size={320} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-violet-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <ShieldCheck size={14} /> EV Industry Partner Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{companyName}</h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Access pre-assessed vocational EV talent, filter by 7-dimension competency scores, and streamline recruitment.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/industry/talent-pool">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs font-bold">
                <Search className="w-4 h-4 mr-1.5" /> Search Talent Pool
              </Button>
            </Link>
            <Link to="/industry/post-job">
              <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white border-0 text-xs font-bold">
                <PlusCircle className="w-4 h-4 mr-1.5" /> Post EV Vacancy
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Active Vacancies", value: jobs.filter(j => j.status === 'active').length, label: "Live EV Roles", icon: Briefcase, color: "text-[#0099B8]", bg: "bg-cyan-50" },
          { title: "Total Applications", value: applications.length, label: "In Pipeline", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "In Interview Stage", value: applications.filter(a => a.status === 'interview').length, label: "Scheduled Candidate Meetings", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Hired Candidates", value: applications.filter(a => a.status === 'hired').length, label: "Hired & Placed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Assessed Talent Pool", value: students.length, label: "National SMK Pool", icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</span>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{kpi.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Corporate PIC & Executive Info Card */}
      <Card className="p-5 bg-gradient-to-r from-violet-50 via-white to-slate-50 border-violet-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-violet-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck size={18} className="text-violet-600" /> Corporate Executive & PIC Rekrutmen Perusahaan
            </h3>
            <p className="text-xs text-slate-500">Informasi Direktur Utama & Penanggung Jawab Rekrutmen (PIC) terdaftar.</p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs font-bold text-violet-700 border-violet-300 bg-white hover:bg-violet-100 flex items-center gap-1.5"
            onClick={() => setIsPicModalOpen(true)}
          >
            <Edit2 size={14} /> Edit Data PIC & Direktur
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Managing Director / Direktur Utama</p>
            <p className="font-extrabold text-slate-900 text-sm">{picFormData.directorName}</p>
            <span className="inline-block px-2 py-0.5 bg-violet-100 text-violet-800 text-[10px] font-bold rounded-full">Executive Lead</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Nama PIC Rekrutmen</p>
            <p className="font-extrabold text-slate-900 text-sm">{picFormData.picName}</p>
            <p className="text-[#0099B8] font-bold text-[11px]">{picFormData.picRole}</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Kontak Email & WhatsApp PIC</p>
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              <Mail size={13} className="text-violet-600" /> {picFormData.picEmail}
            </p>
            <p className="font-semibold text-emerald-700 flex items-center gap-1">
              <Phone size={13} className="text-emerald-600" /> {picFormData.picPhone}
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Applications */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Candidate Applications</h2>
              <p className="text-xs text-slate-500">Live evaluation feed from localDB applications.</p>
            </div>
            <Link to="/industry/pipeline">
              <Button size="sm" variant="ghost" className="text-xs text-[#0099B8] font-bold flex items-center gap-1">
                View All Pipeline ({applications.length}) →
              </Button>
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-xl bg-slate-50">
              <Users size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-700">Belum Ada Pelamar Masuk</p>
              <p className="text-xs text-slate-500 mt-1">Gunakan tombol "Post EV Vacancy" di atas untuk mempublikasikan lowongan pekerjaan baru.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 rounded-xl border border-slate-200 hover:border-cyan-300 transition-colors flex items-center justify-between gap-4 bg-white">
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm text-slate-900">{app.studentName}</span>
                    <p className="text-xs text-slate-500 font-semibold">{app.studentCity} • Applied for <strong className="text-[#0099B8]">{app.jobTitle}</strong></p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="info" className="bg-cyan-50 text-[#0099B8] font-bold text-xs">
                      {app.aiMatchScore}% AI Match
                    </Badge>
                    <Link to="/industry/pipeline">
                      <Button size="sm" variant="outline" className="text-xs font-bold">Review</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right Column: AI Top Recommended Candidates */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-violet-600" size={18} /> Top AI Recommended
            </h2>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-xl bg-slate-50">
              <Sparkles size={32} className="mx-auto text-violet-400 mb-2" />
              <p className="text-xs font-bold text-slate-700">Database Siswa Kosong</p>
              <p className="text-[11px] text-slate-500 mt-1">Kandidat baru akan muncul di sini secara otomatis.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 3).map((student: any, i: number) => (
                <div key={student.id} className="bg-white p-4 rounded-xl border border-violet-100 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{student.major}</p>
                      <p className="text-xs text-slate-500">{student.city}, {student.province}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-800 font-bold text-xs rounded-full">
                      {95 - i * 3}% Match
                    </span>
                  </div>

                  <Link to={`/industry/talent-pool`}>
                    <Button size="sm" variant="outline" className="w-full text-xs font-bold border-violet-200 text-violet-700 hover:bg-violet-50">
                      View Talent Score Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modal Edit PIC Info for Industry Dashboard */}
      <Modal isOpen={isPicModalOpen} onClose={() => setIsPicModalOpen(false)} title="Edit Data PIC & Direktur Perusahaan">
        <form onSubmit={handleSavePic} className="space-y-4 pt-2">
          <Input 
            label="Nama Direktur Perusahaan / Managing Director" 
            value={picFormData.directorName} 
            onChange={(e) => setPicFormData({ ...picFormData, directorName: e.target.value })} 
            required 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input 
              label="Nama PIC Rekrutmen" 
              value={picFormData.picName} 
              onChange={(e) => setPicFormData({ ...picFormData, picName: e.target.value })} 
              required 
            />
            <Input 
              label="Jabatan / Role PIC" 
              value={picFormData.picRole} 
              onChange={(e) => setPicFormData({ ...picFormData, picRole: e.target.value })} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input 
              label="Email Kontak PIC" 
              type="email" 
              value={picFormData.picEmail} 
              onChange={(e) => setPicFormData({ ...picFormData, picEmail: e.target.value })} 
              required 
              disabled
            />
            <Input 
              label="No. Telepon / WhatsApp PIC" 
              value={picFormData.picPhone} 
              onChange={(e) => setPicFormData({ ...picFormData, picPhone: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Catatan Kontak Rekrutmen</label>
            <textarea 
              rows={3} 
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-violet-600 focus:outline-none"
              value={picFormData.picNotes} 
              onChange={(e) => setPicFormData({ ...picFormData, picNotes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPicModalOpen(false)}>Batal</Button>
            <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1">
              <Save size={14} /> Simpan Data PIC
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
