import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { GraduationCap, Plus, Edit2, Trash2, Award, Search, Filter, ExternalLink, ArrowLeft, School } from 'lucide-react';

import { getAll, addItem, updateItem, removeItem } from '../../services/firestoreSync';

export const AdminStudents: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const schoolFilter = searchParams.get('schoolName') || searchParams.get('school') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync state with localDB and students collection
  const students = useMemo(() => {
    const localStudents = localDB.getStudents();
    return localStudents.map((st: any, idx: number) => ({
      id: st.id || `st-${Date.now()}`,
      name: st.name || st.fullName || 'Siswa Vokasi',
      nisn: st.nisn || `007${(1234500 + idx + 1).toString().padStart(7, '0')}`,
      school: st.schoolName || st.school || st.schoolId || 'SMK Negeri 1 Cikarang Pusat',
      major: st.major || 'Teknik Kendaraan Ringan (Otomotif EV)',
      gradYear: st.graduationYear?.toString() || st.gradYear || '2025',
      province: st.province || 'Jawa Barat',
      score: st.score || 85
    }));
  }, [refreshKey]);

  // Filter students based on URL parameter & search input
  const filteredStudents = useMemo(() => {
    return students.filter((s: any) => {
      const matchSchool = !schoolFilter || s.school?.toLowerCase().includes(schoolFilter.toLowerCase()) || schoolFilter.toLowerCase().includes(s.school?.toLowerCase() || '');
      const matchSearch = !searchTerm || 
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn?.includes(searchTerm) ||
        s.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.major?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSchool && matchSearch;
    });
  }, [students, schoolFilter, searchTerm]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    school: '',
    major: '',
    gradYear: '2025',
    province: 'Jawa Barat',
    score: 85
  });

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      nisn: '',
      school: schoolFilter || 'SMK Negeri 1 Cikarang Pusat',
      major: 'Teknik Kendaraan Ringan (Otomotif EV)',
      gradYear: '2025',
      province: 'Jawa Barat',
      score: 85
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (st: any) => {
    setEditingStudent(st);
    setFormData({
      name: st.name || '',
      nisn: st.nisn || '',
      school: st.school || '',
      major: st.major || '',
      gradYear: st.gradYear || '',
      province: st.province || '',
      score: st.score || 0
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudent) {
      updateItem('students', editingStudent.id, {
        ...formData,
        fullName: formData.name,
        schoolName: formData.school,
        graduationYear: parseInt(formData.gradYear, 10) || 2025
      });
      showToast(`Data siswa kandidat "${formData.name}" berhasil diperbarui.`, 'success');
    } else {
      const newEntry = {
        id: `stu-${Date.now()}`,
        userId: `user-${Date.now()}`,
        name: formData.name,
        fullName: formData.name,
        nisn: formData.nisn || `007${Math.floor(1000000 + Math.random() * 9000000)}`,
        schoolName: formData.school,
        school: formData.school,
        major: formData.major,
        graduationYear: parseInt(formData.gradYear, 10) || 2025,
        gradYear: formData.gradYear,
        province: formData.province,
        score: formData.score,
        status: 'active'
      };
      addItem('students', newEntry);
      showToast(`Kandidat baru "${formData.name}" berhasil ditambahkan!`, 'success');
    }

    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (!window.confirm(`Hapus kandidat siswa "${name}" dari database SporaOS?`)) return;

    removeItem('students', id);
    setRefreshKey(prev => prev + 1);
    showToast(`Kandidat "${name}" dihapus.`, 'warning');
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="National Student Candidates Directory (Full Page Dashboard)" 
        subtitle="Daftar lengkap seluruh kandidat siswa vokasi, penilaian Talent Score, dan pengelolaan institusi asal."
      >
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add New Student Candidate
        </Button>
      </PageHeader>

      {/* Active Filter Banner if filtered by School */}
      {schoolFilter && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0099B8] text-white flex items-center justify-center">
              <School size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filtered by Education Institution</p>
              <h3 className="text-base font-extrabold text-slate-900">{schoolFilter}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info" className="bg-cyan-100 text-[#0099B8] font-bold text-xs">
              {filteredStudents.length} Siswa Terdaftar
            </Badge>
            <Button size="sm" variant="outline" className="text-xs text-slate-600 bg-white" onClick={clearFilter}>
              ✕ Reset Filter Sekolah
            </Button>
          </div>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        {/* Table Filter & Search Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <GraduationCap size={18} className="text-[#0099B8]" /> 
            Daftar Lengkap Siswa {schoolFilter ? `— ${schoolFilter}` : `(${filteredStudents.length} Siswa Pool)`}
          </h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari siswa, NISN, jurusan, sekolah..." 
                className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0099B8]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setRefreshKey(k => k + 1)}>
              🔄 Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                <th className="p-4">Nama Siswa Kandidat</th>
                <th className="p-4">NISN (10 Digit)</th>
                <th className="p-4">Sekolah / Institusi Pendidikan</th>
                <th className="p-4">Jurusan / Vocational Stream</th>
                <th className="p-4">Tahun Lulus</th>
                <th className="p-4">Talent Score</th>
                <th className="p-4 text-right">Aksi Admin (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <GraduationCap size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">Belum Ada Siswa Terdaftar</p>
                    <p className="text-xs text-slate-400 mt-1">Gunakan tombol "+ Add New Student Candidate" untuk menambahkan data siswa baru.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{s.name}</td>
                    <td className="p-4 font-mono text-xs font-bold text-[#0099B8] bg-cyan-50/40">
                      {s.nisn}
                    </td>
                    <td className="p-4 text-slate-700 font-semibold">{s.school}</td>
                    <td className="p-4 text-slate-600 text-xs">{s.major}</td>
                    <td className="p-4 font-mono text-xs text-slate-700">{s.gradYear}</td>
                    <td className="p-4">
                      <Badge className={`font-bold ${s.score >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-50 text-[#0099B8]'}`}>
                        ⭐ {s.score}/100
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <Button size="sm" variant="outline" className="p-1.5" onClick={() => handleOpenEditModal(s)}>
                          <Edit2 size={14} className="text-slate-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1.5 text-red-600 hover:bg-red-50" onClick={() => handleDeleteStudent(s.id, s.name)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add/Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? "Edit Student Candidate" : "Add New Student Candidate"}>
        <form onSubmit={handleSaveStudent} className="space-y-4 pt-2 font-sans">
          <Input label="Student Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Nama Lengkap Siswa" />
          <Input label="Vocational School Name" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} required />
          <Input label="Major / Vocational Stream" value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Graduation Year" value={formData.gradYear} onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })} required />
            <Input label="Talent Score (0-100)" type="number" value={formData.score} onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })} required />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8]">Save Candidate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
