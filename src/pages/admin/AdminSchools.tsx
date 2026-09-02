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
import { mockSchools } from '../../data/schools';
import { School, Plus, Edit2, Trash2, GraduationCap, Users, UserPlus, Save, ExternalLink, LayoutDashboard, Key, ShieldCheck } from 'lucide-react';

import { getAll, addItem, updateItem, removeWhere } from '../../services/firestoreSync';

export const AdminSchools: React.FC = () => {
  const { showToast } = useToast();
  const { approveUser } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<any[]>(() => {
    return getAll('users').filter((u: any) => u.role === 'school');
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123',
    registrationToken: '',
    schoolType: 'State Vocational School (SMKN)',
    province: 'Jawa Barat',
    city: 'Cikarang',
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
    major: '',
    graduationYear: '',
    city: '',
    status: 'active'
  });

  const refreshSchools = () => {
    setUsers([...getAll('users').filter((u: any) => u.role === 'school')]);
  };

  const handleOpenAddModal = () => {
    setEditingSchool(null);
    const autoToken = `SMK${users.length + 1}-2025`;
    setFormData({
      name: '',
      email: '',
      password: '123',
      registrationToken: autoToken,
      schoolType: 'State Vocational School (SMKN)',
      province: 'Jawa Barat',
      city: 'Cikarang',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: any) => {
    setEditingSchool(s);
    const currentToken = s.registrationToken || s.schoolToken || (mockSchools.find(ms => ms.name.toLowerCase() === s.name?.toLowerCase())?.registrationToken) || `SMK${users.indexOf(s) + 1}-2025`;
    setFormData({
      name: s.name || '',
      email: s.email || '',
      password: s.password || '123',
      registrationToken: currentToken,
      schoolType: s.schoolType || 'State Vocational School (SMKN)',
      province: s.province || 'Jawa Barat',
      city: s.city || 'Cikarang',
      status: s.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const allUsers = getAll('users');

    if (editingSchool) {
      const target = allUsers.find((u: any) => u.email.toLowerCase() === editingSchool.email.toLowerCase());
      if (target) {
        const docId = target._docId || target.id || `user-${Date.now()}`;
        updateItem('users', docId, {
          name: formData.name,
          schoolName: formData.name,
          school: formData.name,
          password: formData.password,
          registrationToken: formData.registrationToken.trim().toUpperCase(),
          schoolToken: formData.registrationToken.trim().toUpperCase(),
          schoolType: formData.schoolType,
          province: formData.province,
          city: formData.city,
          status: formData.status
        });
      }
      showToast(`Institusi "${formData.name}" diperbarui.`, 'success');
    } else {
      const exists = allUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
      if (exists) {
        showToast(`Email ${formData.email} sudah terdaftar!`, 'error');
        return;
      }
      addItem('users', {
        id: `user-${Date.now()}`,
        name: formData.name,
        schoolName: formData.name,
        school: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'school',
        registrationToken: formData.registrationToken.trim().toUpperCase() || `SMK${Date.now()}-2025`,
        schoolToken: formData.registrationToken.trim().toUpperCase() || `SMK${Date.now()}-2025`,
        schoolType: formData.schoolType,
        province: formData.province,
        city: formData.city,
        status: formData.status
      });
      showToast(`Institusi pendidikan baru "${formData.name}" berhasil dibuat langsung oleh Admin!`, 'success');
    }

    refreshSchools();
    setIsModalOpen(false);
  };

  const handleDeleteSchool = (email: string, name: string) => {
    if (!window.confirm(`Hapus institusi pendidikan "${name}" dari sistem Spora Juara?`)) return;

    removeWhere('users', (u: any) => u.email.toLowerCase() === email.toLowerCase());
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
          name: st.name || st.fullName || 'Siswa Vokasi',
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

  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentFormData({
      name: '',
      major: '',
      graduationYear: '',
      city: selectedInstitution?.name || '',
      status: 'active'
    });
    setIsAddStudentForm(true);
  };

  const handleEditStudent = (st: any) => {
    setEditingStudent(st);
    setStudentFormData({
      name: st.name || st.fullName || '',
      major: st.major || '',
      graduationYear: st.graduationYear?.toString() || '',
      city: st.school || selectedInstitution?.name || '',
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
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5 font-bold text-xs" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add New Institution
        </Button>
      </PageHeader>

      <Card className="p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                <th className="p-4">Nama Institusi Pendidikan</th>
                <th className="p-4">Email Kontak</th>
                <th className="p-4 text-center">Token Registrasi</th>
                <th className="p-4 text-center">Siswa Enrolled</th>
                <th className="p-4">Status Verifikasi</th>
                <th className="p-4 text-right">Aksi Admin (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((s, idx) => {
                const schoolToken = s.registrationToken || s.schoolToken || (mockSchools.find(ms => ms.name.toLowerCase() === s.name?.toLowerCase())?.registrationToken) || `SMK${idx + 1}-2025`;
                return (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <School size={18} className="text-[#0099B8]" /> {s.name}
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-xs">{s.email}</td>
                  <td className="p-4 text-center">
                    <button 
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(schoolToken);
                        showToast(`Token "${schoolToken}" disalin ke clipboard!`, 'info');
                      }}
                      className="px-2.5 py-1 bg-cyan-50 border border-cyan-200 text-[#0099B8] hover:bg-cyan-100 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1 shadow-2xs"
                      title="Klik untuk Salin Token"
                    >
                      <span>{schoolToken}</span>
                      <span className="text-[10px] text-slate-400">📋</span>
                    </button>
                  </td>
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
                        <Button size="sm" className="bg-emerald-600 text-white text-xs px-2.5 py-1 font-bold" onClick={() => handleApprove(s.email, s.name)}>
                          Setujui
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="p-1.5" onClick={() => handleOpenEditModal(s)} title="Edit Institusi">
                        <Edit2 size={14} className="text-slate-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1.5 text-red-600 hover:bg-red-50" onClick={() => handleDeleteSchool(s.email, s.name)} title="Hapus Institusi">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add/Edit Institution */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSchool ? "Edit Data Institusi Pendidikan" : "Tambah Institusi Pendidikan Baru (Admin Direct)"}>
        <form onSubmit={handleSaveSchool} className="space-y-4 pt-2 font-sans">
          <Input 
            label="Nama Resmi Institusi (e.g. SMKN 1 Cikarang Pusat / Politeknik Negeri)" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            placeholder="Nama Sekolah / Institusi"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input 
              label="Email Kontak Resmi (Untuk Login)" 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              required 
              disabled={!!editingSchool} 
              placeholder="Email Kontak"
            />
            <Input 
              label="Password Akun" 
              type="text" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
              placeholder="Password"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
              <Key size={13} className="text-[#0099B8]" /> Token Registrasi Siswa
            </label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono uppercase font-bold tracking-wider focus:ring-2 focus:ring-[#0099B8] bg-white"
              value={formData.registrationToken} 
              onChange={(e) => setFormData({ ...formData, registrationToken: e.target.value.toUpperCase() })} 
              required
              placeholder="Contoh: SMK1CIK-2025"
            />
            <p className="text-[10px] text-slate-500">Token ini akan dibagikan ke siswa sekolah ini untuk pendaftaran akun.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Akun</label>
              <select className="w-full p-2.5 border rounded-lg text-xs bg-white font-semibold" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active & Verified</option>
                <option value="pending">Pending Approval</option>
                <option value="rejected">Inactive / Nonaktif</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Institusi</label>
              <select className="w-full p-2.5 border rounded-lg text-xs bg-white font-semibold" value={formData.schoolType} onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}>
                <option value="State Vocational School (SMKN)">SMK Negeri (SMKN)</option>
                <option value="Private Vocational School (SMKS)">SMK Swasta (SMKS)</option>
                <option value="Vocational Training Center (BLK)">Balai Latihan Kerja (BLK)</option>
                <option value="Polytechnic / University">Politeknik / Vokasi Kampus</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8] text-white font-bold">Simpan Data Institusi</Button>
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
        <div className="space-y-4 font-sans max-h-[70vh] overflow-y-auto pr-1">
          {/* Header Action inside Modal */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap size={16} className="text-[#0099B8]" /> Total Siswa Terdaftar: {institutionStudents.length} Siswa
              </p>
              <p className="text-[11px] text-slate-500">Kelola langsung siswa vokasi dari institusi ini.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" className="bg-[#0099B8] text-white text-xs flex items-center gap-1" onClick={handleOpenAddStudent}>
                <UserPlus size={14} /> Tambah Siswa Baru
              </Button>
            </div>
          </div>

          {/* Inline Add / Edit Student Form */}
          {isAddStudentForm && (
            <form onSubmit={handleSaveStudent} className="p-4 border-2 border-cyan-200 rounded-xl bg-cyan-50/40 space-y-3 animate-fadeIn">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  {editingStudent ? <Edit2 size={13} className="text-[#0099B8]" /> : <Plus size={13} className="text-[#0099B8]" />}
                  {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru ke Institusi'}
                </h4>
                <button type="button" onClick={() => setIsAddStudentForm(false)} className="text-xs text-slate-500 hover:text-slate-800">Batal ✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Nama Lengkap Siswa" value={studentFormData.name} onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })} required />
                <Input label="Jurusan Vokasi (e.g. Teknik Kendaraan Listrik)" value={studentFormData.major} onChange={(e) => setStudentFormData({ ...studentFormData, major: e.target.value })} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Tahun Kelulusan (e.g. 2025)" value={studentFormData.graduationYear} onChange={(e) => setStudentFormData({ ...studentFormData, graduationYear: e.target.value })} required />
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select className="w-full p-2 border rounded-lg text-xs bg-white" value={studentFormData.status} onChange={(e) => setStudentFormData({ ...studentFormData, status: e.target.value })}>
                    <option value="active">Active (Siap Direkrut)</option>
                    <option value="employed">Employed (Sudah Bekerja)</option>
                    <option value="graduated">Graduated (Alumni)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddStudentForm(false)}>Batal</Button>
                <Button size="sm" variant="primary" type="submit" className="bg-[#0099B8] text-white flex items-center gap-1">
                  <Save size={13} /> {editingStudent ? 'Perbarui Siswa' : 'Simpan Siswa'}
                </Button>
              </div>
            </form>
          )}

          {/* Students Table */}
          {institutionStudents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-500 text-xs">
              Belum ada data siswa terdaftar untuk sekolah ini. Klik <strong>"+ Tambah Siswa Baru"</strong> untuk menginput siswa secara manual.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b font-bold uppercase">
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Jurusan Vokasi</th>
                    <th className="p-3">Tahun Lulus</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {institutionStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3 text-slate-600">{st.major}</td>
                      <td className="p-3 text-slate-600 font-mono">{st.gradYear || st.graduationYear || '2025'}</td>
                      <td className="p-3">
                        <Badge variant="success" className="text-[10px] px-2 py-0.5">Active</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" className="p-1" onClick={() => handleEditStudent(st)} title="Edit Siswa">
                            <Edit2 size={12} className="text-slate-600" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1 text-red-600 hover:bg-red-50" onClick={() => handleDeleteStudent(st.id, st.name)} title="Hapus Siswa">
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsStudentsModalOpen(false)}>Tutup</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
