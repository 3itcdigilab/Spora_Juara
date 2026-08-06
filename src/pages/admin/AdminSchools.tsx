import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';
import { School, Plus, Edit2, Trash2, GraduationCap, Users, UserPlus, Save, ExternalLink, LayoutDashboard } from 'lucide-react';

export const AdminSchools: React.FC = () => {
  const { showToast } = useToast();
  const { approveUser } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<any[]>(() => {
    const raw = localStorage.getItem('spora_users');
    const all = raw ? JSON.parse(raw) : [];
    return all.filter((u: any) => u.role === 'school');
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123',
    status: 'active'
  });

  // Enrolled Students Modal State
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);
  const [institutionStudents, setInstitutionStudents] = useState<any[]>([]);
  
  // Edit / Add Student state inside modal
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [isAddStudentForm, setIsAddStudentForm] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    major: 'Teknik Kendaraan Ringan (Otomotif EV)',
    graduationYear: '2025',
    city: 'Jawa Barat',
    status: 'active'
  });

  const refreshSchools = () => {
    const raw = localStorage.getItem('spora_users');
    const all = raw ? JSON.parse(raw) : [];
    setUsers(all.filter((u: any) => u.role === 'school'));
  };

  const handleOpenAddModal = () => {
    setEditingSchool(null);
    setFormData({ name: '', email: '', password: '123', status: 'active' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: any) => {
    setEditingSchool(s);
    setFormData({
      name: s.name || '',
      email: s.email || '',
      password: s.password || '123',
      status: s.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = localStorage.getItem('spora_users');
    let allUsers = raw ? JSON.parse(raw) : [];

    if (editingSchool) {
      allUsers = allUsers.map((u: any) => {
        if (u.email.toLowerCase() === editingSchool.email.toLowerCase()) {
          return { ...u, name: formData.name, password: formData.password, status: formData.status };
        }
        return u;
      });
      showToast(`Institusi "${formData.name}" diperbarui.`, 'success');
    } else {
      const exists = allUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
      if (exists) {
        showToast(`Email ${formData.email} sudah terdaftar!`, 'error');
        return;
      }
      allUsers.push({ ...formData, role: 'school' });
      showToast(`Institusi pendidikan baru "${formData.name}" berhasil dibuat!`, 'success');
    }

    localStorage.setItem('spora_users', JSON.stringify(allUsers));
    refreshSchools();
    setIsModalOpen(false);
  };

  const handleDeleteSchool = (email: string, name: string) => {
    if (!window.confirm(`Hapus institusi pendidikan "${name}" dari sistem SporaOS?`)) return;

    const raw = localStorage.getItem('spora_users');
    const allUsers = raw ? JSON.parse(raw) : [];
    const filtered = allUsers.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());

    localStorage.setItem('spora_users', JSON.stringify(filtered));
    refreshSchools();
    showToast(`Institusi "${name}" dihapus.`, 'warning');
  };

  const handleApprove = (email: string, name: string) => {
    approveUser(email);
    refreshSchools();
    showToast(`Institusi "${name}" berhasil diverifikasi!`, 'success');
  };

  // Open Students Enrolled Pop-Up Modal
  const handleOpenStudentsModal = (institution: any) => {
    setSelectedInstitution(institution);
    
    // Check spora_students_db first
    const rawDb = localStorage.getItem('spora_students_db');
    let dbStudents = rawDb ? JSON.parse(rawDb) : [];
    
    // Also fetch localDB
    const allStudents = localDB.getStudents();
    allStudents.forEach((st: any) => {
      if (!dbStudents.some((d: any) => d.id === st.id)) {
        dbStudents.push({
          id: st.id,
          name: st.major || st.fullName || 'Siswa Vokasi',
          school: st.schoolName || st.schoolId || 'SMK Negeri 1 Cikarang',
          major: st.major || 'Teknik Kendaraan Ringan (Otomotif EV)',
          gradYear: st.graduationYear?.toString() || '2025',
          status: 'active'
        });
      }
    });

    const filtered = dbStudents.filter((st: any) => 
      st.school?.toLowerCase().includes(institution.name.toLowerCase()) ||
      institution.name.toLowerCase().includes(st.school?.toLowerCase() || '') ||
      st.schoolId === institution.email
    );

    setInstitutionStudents(filtered);
    setIsAddStudentForm(false);
    setEditingStudent(null);
    setIsStudentsModalOpen(true);
  };

  // Open Full-Page Dashboard View
  const handleOpenFullPageStudents = () => {
    if (!selectedInstitution) return;
    const targetUrl = `/admin/students?schoolName=${encodeURIComponent(selectedInstitution.name)}`;
    window.open(targetUrl, '_blank');
    showToast(`Membuka halaman lengkap daftar siswa ${selectedInstitution.name}...`, 'info');
  };

  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentFormData({
      name: '',
      major: 'Teknik Kendaraan Ringan (Otomotif EV)',
      graduationYear: '2025',
      city: selectedInstitution?.name || 'Jawa Barat',
      status: 'active'
    });
    setIsAddStudentForm(true);
  };

  const handleEditStudent = (st: any) => {
    setEditingStudent(st);
    setStudentFormData({
      name: st.name || st.fullName || 'Siswa Vokasi',
      major: st.major || 'Teknik Kendaraan Ringan (Otomotif EV)',
      graduationYear: st.graduationYear?.toString() || '2025',
      city: st.school || selectedInstitution?.name || 'Jawa Barat',
      status: st.status || 'active'
    });
    setIsAddStudentForm(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const rawDb = localStorage.getItem('spora_students_db');
    let allDbStudents = rawDb ? JSON.parse(rawDb) : [];

    if (editingStudent) {
      allDbStudents = allDbStudents.map((st: any) => {
        if (st.id === editingStudent.id) {
          return {
            ...st,
            name: studentFormData.name,
            major: studentFormData.major,
            gradYear: studentFormData.graduationYear,
            status: studentFormData.status
          };
        }
        return st;
      });
      showToast(`Data siswa "${studentFormData.name}" diperbarui.`, 'success');
    } else {
      const newSt = {
        id: `st-${Date.now()}`,
        name: studentFormData.name,
        school: selectedInstitution?.name || 'SMK Negeri 1 Cikarang',
        major: studentFormData.major,
        gradYear: studentFormData.graduationYear,
        score: 85,
        status: studentFormData.status
      };
      allDbStudents.unshift(newSt);
      showToast(`Siswa baru "${studentFormData.name}" berhasil ditambahkan!`, 'success');
    }

    localStorage.setItem('spora_students_db', JSON.stringify(allDbStudents));

    // Refresh pop-up list
    const filtered = allDbStudents.filter((st: any) => 
      st.school?.toLowerCase().includes(selectedInstitution.name.toLowerCase()) ||
      selectedInstitution.name.toLowerCase().includes(st.school?.toLowerCase() || '')
    );
    setInstitutionStudents(filtered);
    setIsAddStudentForm(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (!window.confirm(`Hapus siswa "${name}" dari daftar institusi?`)) return;

    const rawDb = localStorage.getItem('spora_students_db');
    let allDbStudents = rawDb ? JSON.parse(rawDb) : [];
    const updated = allDbStudents.filter((st: any) => st.id !== id);

    localStorage.setItem('spora_students_db', JSON.stringify(updated));

    const filtered = updated.filter((st: any) => 
      st.school?.toLowerCase().includes(selectedInstitution.name.toLowerCase()) ||
      selectedInstitution.name.toLowerCase().includes(st.school?.toLowerCase() || '')
    );
    setInstitutionStudents(filtered);
    showToast(`Siswa "${name}" dihapus.`, 'warning');
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="Education Institutions (Institution CRUD)" 
        subtitle="Tambah, edit, hapus, kelola institusi pendidikan (SMK, Politeknik, Universitas, BLK) & siswa terdaftar."
      >
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add Institution
        </Button>
      </PageHeader>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                <th className="p-4">Nama Institusi Pendidikan</th>
                <th className="p-4">Email Kontak</th>
                <th className="p-4 text-center">Siswa / Kandidat Enrolled</th>
                <th className="p-4">Status Verifikasi</th>
                <th className="p-4 text-right">Aksi Admin (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <School size={18} className="text-[#0099B8]" /> {s.name}
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-xs">{s.email}</td>
                  <td className="p-4 text-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs font-bold text-[#0099B8] border-cyan-200 bg-cyan-50 hover:bg-cyan-100 flex items-center gap-1.5 mx-auto"
                      onClick={() => handleOpenStudentsModal(s)}
                    >
                      <Users size={14} /> Lihat Siswa (Pop-Up)
                    </Button>
                  </td>
                  <td className="p-4">
                    {s.status === 'pending' ? (
                      <Badge variant="warning">⏳ Pending Approval</Badge>
                    ) : s.status === 'rejected' ? (
                      <Badge variant="error">❌ Nonaktif</Badge>
                    ) : (
                      <Badge variant="success">✓ Verified & Active</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      {s.status === 'pending' && (
                        <Button size="sm" className="bg-emerald-600 text-white text-xs px-2.5 py-1" onClick={() => handleApprove(s.email, s.name)}>
                          Setujui
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="p-1.5" onClick={() => handleOpenEditModal(s)}>
                        <Edit2 size={14} className="text-slate-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1.5 text-red-600 hover:bg-red-50" onClick={() => handleDeleteSchool(s.email, s.name)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add/Edit Institution */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSchool ? "Edit Education Institution" : "Add Education Institution"}>
        <form onSubmit={handleSaveSchool} className="space-y-4 pt-2">
          <Input label="Institution Name (e.g. SMKN 1 Cikarang / Politeknik Negeri)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Official Contact Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={!!editingSchool} />
          <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
            <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="active">Active & Verified</option>
              <option value="pending">Pending Approval</option>
              <option value="rejected">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8]">Save Institution</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Pop-Up View & Edit Enrolled Students */}
      <Modal 
        isOpen={isStudentsModalOpen} 
        onClose={() => setIsStudentsModalOpen(false)} 
        title={`Daftar Siswa/Kandidat Enrolled — ${selectedInstitution?.name || ''}`}
        size="lg"
      >
        <div className="space-y-4 pt-2">
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
            <div>
              <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <School size={16} className="text-[#0099B8]" /> {selectedInstitution?.name}
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{selectedInstitution?.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs" 
                onClick={handleOpenFullPageStudents}
              >
                <LayoutDashboard size={14} /> Halaman List Siswa (Page Baru) <ExternalLink size={13} />
              </Button>
              <Button size="sm" className="bg-[#0099B8] hover:bg-[#007A93] text-white text-xs font-bold flex items-center gap-1" onClick={handleOpenAddStudent}>
                <UserPlus size={14} /> + Tambah Siswa Baru
              </Button>
            </div>
          </div>

          {/* Form inline edit/add student */}
          {isAddStudentForm && (
            <form onSubmit={handleSaveStudent} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-1">
                {editingStudent ? `Edit Data Siswa: ${editingStudent.name || editingStudent.fullName}` : 'Form Tambah Siswa Baru'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Nama Lengkap Siswa" value={studentFormData.name} onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })} required />
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                  <select 
                    className="w-full p-2.5 border rounded-lg text-xs bg-white"
                    value={studentFormData.major} 
                    onChange={(e) => setStudentFormData({ ...studentFormData, major: e.target.value })}
                  >
                    <option value="Teknik Kendaraan Ringan (Otomotif EV)">Teknik Kendaraan Ringan (Otomotif EV)</option>
                    <option value="Teknik Elektronika Industri">Teknik Elektronika Industri</option>
                    <option value="Teknik Mekatronika">Teknik Mekatronika</option>
                    <option value="Teknik Listrik Industri">Teknik Listrik Industri</option>
                  </select>
                </div>
                <Input label="Tahun Kelulusan" value={studentFormData.graduationYear} onChange={(e) => setStudentFormData({ ...studentFormData, graduationYear: e.target.value })} required />
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select className="w-full p-2.5 border rounded-lg text-xs bg-white" value={studentFormData.status} onChange={(e) => setStudentFormData({ ...studentFormData, status: e.target.value })}>
                    <option value="active">Aktif / Siap Kerja</option>
                    <option value="graduated">Lulus</option>
                    <option value="employed">Terekrut</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setIsAddStudentForm(false)}>Batal</Button>
                <Button type="submit" size="sm" className="bg-[#0099B8] text-white flex items-center gap-1">
                  <Save size={14} /> Simpan Siswa
                </Button>
              </div>
            </form>
          )}

          {/* Table list of students */}
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b font-bold uppercase">
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">Jurusan / Stream</th>
                  <th className="p-3">Tahun Lulus</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {institutionStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      <GraduationCap size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700">Belum Ada Siswa Terdaftar</p>
                      <p className="text-xs text-slate-400 mt-1">Klik "+ Tambah Siswa Baru" di atas untuk menambahkan kandidat.</p>
                    </td>
                  </tr>
                ) : (
                  institutionStudents.map((st, idx) => (
                    <tr key={st.id || idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{st.name || st.fullName}</td>
                      <td className="p-3 text-slate-600">{st.major}</td>
                      <td className="p-3 font-mono text-slate-700">{st.gradYear || st.graduationYear}</td>
                      <td className="p-3">
                        <Badge variant="success" className="text-[10px]">Aktif Vokasi</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1.5 items-center">
                          <Button size="sm" variant="outline" className="p-1 text-xs" onClick={() => handleEditStudent(st)}>
                            <Edit2 size={13} />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1 text-red-600 hover:bg-red-50" onClick={() => handleDeleteStudent(st.id, st.name || st.fullName)}>
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs text-[#0099B8] border-cyan-200 bg-cyan-50 hover:bg-cyan-100 font-bold flex items-center gap-1.5"
              onClick={handleOpenFullPageStudents}
            >
              <LayoutDashboard size={14} /> Buka Halaman Full Dashboard List ↗
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsStudentsModalOpen(false)}>Tutup</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
