import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { PlusCircle, Search, Sparkles, Briefcase, Users, Calendar, ArrowRight, CheckCircle2, Factory, ShieldCheck, UserCheck, Phone, Mail, Edit2, Save, UserPlus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export interface IndustryPIC {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  notes?: string;
}

export const IndustryDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const companyName = user?.name || '3ITC Digital Academy';

  // Managing Director State
  const [directorName, setDirectorName] = useState(() => (user as any)?.directorName || 'Tubagus Aria');
  const [isEditingDirector, setIsEditingDirector] = useState(false);

  // Multi-PIC list State
  const [picsList, setPicsList] = useState<IndustryPIC[]>(() => {
    const existing = (user as any)?.pics;
    if (existing && Array.isArray(existing) && existing.length > 0) return existing;
    return [
      {
        id: 'pic-1',
        name: (user as any)?.picName || user?.name || '3ITC',
        role: (user as any)?.picRole || 'Direktur / Head of HR',
        email: user?.email || 'tubagusaria31@gmail.com',
        phone: (user as any)?.picPhone || '087780092090',
        notes: 'Penanggung jawab utama rekrutmen lulusan SMK Vokasi & magang industri.'
      }
    ];
  });

  // Add / Edit PIC Modal State
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [editingPicId, setEditingPicId] = useState<string | null>(null);
  const [picFormData, setPicFormData] = useState<IndustryPIC>({
    id: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    notes: ''
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

  // Handle Add / Edit PIC Item
  const handleOpenAddPic = () => {
    setEditingPicId(null);
    setPicFormData({
      id: `pic-${Date.now()}`,
      name: '',
      role: 'Talent Acquisition Manager',
      email: user?.email || '',
      phone: '',
      notes: ''
    });
    setIsPicModalOpen(true);
  };

  const handleOpenEditPic = (pic: IndustryPIC) => {
    setEditingPicId(pic.id);
    setPicFormData({ ...pic });
    setIsPicModalOpen(true);
  };

  const handleSavePicItem = (e: React.FormEvent) => {
    e.preventDefault();
    let nextPics = [...picsList];

    if (editingPicId) {
      nextPics = nextPics.map(p => p.id === editingPicId ? { ...picFormData } : p);
      showToast(`PIC "${picFormData.name}" diperbarui.`, 'success');
    } else {
      nextPics.push({ ...picFormData, id: `pic-${Date.now()}` });
      showToast(`PIC baru "${picFormData.name}" ditambahkan.`, 'success');
    }

    setPicsList(nextPics);
    savePicsToAuth(nextPics, directorName);
    setIsPicModalOpen(false);
  };

  const handleDeletePicItem = (picId: string, name: string) => {
    if (picsList.length <= 1) {
      showToast('Minimal harus ada 1 PIC rekrutmen terdaftar.', 'warning');
      return;
    }
    if (!window.confirm(`Hapus PIC "${name}" dari daftar kontak perusahaan?`)) return;

    const filtered = picsList.filter(p => p.id !== picId);
    setPicsList(filtered);
    savePicsToAuth(filtered, directorName);
    showToast(`PIC "${name}" dihapus.`, 'warning');
  };

  const handleSaveDirector = (e: React.FormEvent) => {
    e.preventDefault();
    savePicsToAuth(picsList, directorName);
    setIsEditingDirector(false);
    showToast('Nama Direktur Perusahaan berhasil diperbarui!', 'success');
  };

  const savePicsToAuth = (updatedPics: IndustryPIC[], dirName: string) => {
    updateUser({
      directorName: dirName,
      pics: updatedPics,
      picName: updatedPics[0]?.name,
      picRole: updatedPics[0]?.role,
      picPhone: updatedPics[0]?.phone
    } as any);
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

      {/* Corporate Executive & Multi-PIC Info Card */}
      <Card className="p-6 bg-gradient-to-r from-violet-50 via-white to-slate-50 border-violet-200 space-y-4">
        {/* Direktur Utama Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700 font-bold">
              <UserCheck size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direktur Utama / Executive Director</p>
              {!isEditingDirector ? (
                <h4 className="text-base font-extrabold text-slate-900">{directorName}</h4>
              ) : (
                <form onSubmit={handleSaveDirector} className="flex items-center gap-2 mt-1">
                  <input 
                    type="text" 
                    className="p-1.5 px-3 border border-violet-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-violet-600"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="bg-violet-600 text-white text-xs px-3 py-1">Simpan</Button>
                </form>
              )}
            </div>
          </div>
          
          {!isEditingDirector && (
            <Button size="sm" variant="outline" className="text-xs font-bold text-violet-700 border-violet-300 hover:bg-violet-50" onClick={() => setIsEditingDirector(true)}>
              <Edit2 size={13} className="mr-1" /> Edit Nama Direktur
            </Button>
          )}
        </div>

        {/* Section Header Multi PIC & Add PIC Button */}
        <div className="flex justify-between items-center border-b border-violet-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase size={18} className="text-violet-600" /> Penanggung Jawab Rekrutmen ({picsList.length} PIC Active)
            </h3>
            <p className="text-xs text-slate-500">Kelola kontak PIC rekrutmen & hubungan institusi vokasi.</p>
          </div>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5" onClick={handleOpenAddPic}>
            <UserPlus size={14} /> + Tambah PIC Baru
          </Button>
        </div>

        {/* PIC Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {picsList.map((pic, idx) => (
            <div key={pic.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-violet-300 transition-all space-y-3 relative">
              <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                    {idx === 0 ? '⭐ PIC Utama' : `PIC #${idx + 1}`}
                  </span>
                  <h5 className="font-extrabold text-slate-900 text-sm mt-1">{pic.name}</h5>
                  <p className="text-[#0099B8] font-bold text-xs">{pic.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" className="p-1 text-xs hover:border-violet-400" onClick={() => handleOpenEditPic(pic)}>
                    <Edit2 size={13} />
                  </Button>
                  {picsList.length > 1 && (
                    <Button size="sm" variant="ghost" className="p-1 text-red-600 hover:bg-red-50" onClick={() => handleDeletePicItem(pic.id, pic.name)}>
                      <Trash2 size={13} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Mail size={13} className="text-violet-600 shrink-0" /> {pic.email}
                </p>
                <p className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-600 shrink-0" /> {pic.phone}
                </p>
              </div>

              {pic.notes && (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg leading-relaxed border border-slate-100">
                  📝 {pic.notes}
                </p>
              )}
            </div>
          ))}
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
                      {app.aiMatchScore}% Score Match
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

        {/* Right Column: Top Recommended Candidates */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="text-violet-600" size={18} /> Top Recommended Candidates
            </h2>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-xl bg-slate-50">
              <Users size={32} className="mx-auto text-violet-400 mb-2" />
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
                      {95 - i * 3}% Score Match
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

      {/* Modal Add/Edit PIC Form */}
      <Modal isOpen={isPicModalOpen} onClose={() => setIsPicModalOpen(false)} title={editingPicId ? "Edit Data PIC" : "Tambah PIC Rekrutmen Baru"}>
        <form onSubmit={handleSavePicItem} className="space-y-4 pt-2 font-sans">
          <Input 
            label="Nama Lengkap PIC" 
            value={picFormData.name} 
            onChange={(e) => setPicFormData({ ...picFormData, name: e.target.value })} 
            required 
            placeholder="e.g. Hendra Pratama, S.Psi"
          />

          <Input 
            label="Jabatan / Title PIC" 
            value={picFormData.role} 
            onChange={(e) => setPicFormData({ ...picFormData, role: e.target.value })} 
            required 
            placeholder="e.g. Senior Talent Acquisition Lead"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input 
              label="Email Kontak PIC" 
              type="email" 
              value={picFormData.email} 
              onChange={(e) => setPicFormData({ ...picFormData, email: e.target.value })} 
              required 
            />
            <Input 
              label="No. WhatsApp / Telepon PIC" 
              value={picFormData.phone} 
              onChange={(e) => setPicFormData({ ...picFormData, phone: e.target.value })} 
              required 
              placeholder="e.g. 0812-3456-7890"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Catatan & Keterangan Tugas PIC</label>
            <textarea 
              rows={3} 
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-violet-600 focus:outline-none"
              value={picFormData.notes || ''} 
              onChange={(e) => setPicFormData({ ...picFormData, notes: e.target.value })}
              placeholder="Detail tugas atau area rekrutmen PIC ini..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPicModalOpen(false)}>Batal</Button>
            <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1 font-bold">
              <Save size={14} /> Simpan Data PIC
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
