import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { GraduationCap, Plus, Edit2, Trash2, Award } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { showToast } = useToast();

  const [students, setStudents] = useState<any[]>(() => {
    const raw = localStorage.getItem('spora_students_db');
    if (raw) return JSON.parse(raw);

    const defaults = [
      { id: '1', name: 'Usman Domiri', school: 'SMKN 1 Cikarang', major: 'Teknik Kendaraan Ringan (Otomotif EV)', gradYear: '2025', province: 'Jawa Barat', score: 78 },
      { id: '2', name: 'Ahmad Fauzi', school: 'SMKN 2 Karawang', major: 'Teknik Elektronika Industri', gradYear: '2024', province: 'Jawa Barat', score: 85 },
      { id: '3', name: 'Siti Rahmawati', school: 'SMKN 1 Bekasi', major: 'Teknik Mekatronika', gradYear: '2025', province: 'Jawa Barat', score: 82 },
      { id: '4', name: 'Budi Santoso', school: 'SMKN 5 Surabaya', major: 'Teknik Listrik', gradYear: '2024', province: 'Jawa Timur', score: 89 },
    ];
    localStorage.setItem('spora_students_db', JSON.stringify(defaults));
    return defaults;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    school: 'SMKN 1 Cikarang',
    major: 'Teknik Kendaraan Ringan (Otomotif EV)',
    gradYear: '2025',
    province: 'Jawa Barat',
    score: 75
  });

  const refreshStudents = () => {
    const raw = localStorage.getItem('spora_students_db');
    if (raw) setStudents(JSON.parse(raw));
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({ name: '', school: 'SMKN 1 Cikarang', major: 'Teknik Kendaraan Ringan (Otomotif EV)', gradYear: '2025', province: 'Jawa Barat', score: 75 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (st: any) => {
    setEditingStudent(st);
    setFormData({
      name: st.name || '',
      school: st.school || 'SMKN 1 Cikarang',
      major: st.major || 'Teknik Kendaraan Ringan',
      gradYear: st.gradYear || '2025',
      province: st.province || 'Jawa Barat',
      score: st.score || 75
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList = [...students];

    if (editingStudent) {
      updatedList = updatedList.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s);
      showToast(`Data siswa kandidat "${formData.name}" berhasil diperbarui.`, 'success');
    } else {
      const newEntry = { id: Date.now().toString(), ...formData };
      updatedList.unshift(newEntry);
      showToast(`Kandidat baru "${formData.name}" berhasil ditambahkan!`, 'success');
    }

    localStorage.setItem('spora_students_db', JSON.stringify(updatedList));
    setStudents(updatedList);
    setIsModalOpen(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (!window.confirm(`Hapus kandidat siswa "${name}" dari database SporaOS?`)) return;

    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem('spora_students_db', JSON.stringify(filtered));
    setStudents(filtered);
    showToast(`Kandidat "${name}" dihapus.`, 'warning');
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="National Student Candidates Database (CRUD)" 
        subtitle="Tambah data kandidat siswa baru, perbarui nilai Talent Score, dan kelola jurusan vokasi."
      >
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add New Student Candidate
        </Button>
      </PageHeader>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <GraduationCap size={18} className="text-[#0099B8]" /> Total Candidate Pool ({students.length})
          </h3>
          <Button size="sm" variant="outline" onClick={refreshStudents}>🔄 Refresh Data</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                <th className="p-4">Nama Siswa Kandidat</th>
                <th className="p-4">Sekolah Vokasi (SMK)</th>
                <th className="p-4">Jurusan / Stream</th>
                <th className="p-4">Tahun Lulus</th>
                <th className="p-4">Talent Score</th>
                <th className="p-4 text-right">Aksi Admin (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{s.name}</td>
                  <td className="p-4 text-slate-600">{s.school}</td>
                  <td className="p-4 text-slate-600 text-xs">{s.major}</td>
                  <td className="p-4 font-mono text-xs text-slate-700">{s.gradYear}</td>
                  <td className="p-4">
                    <Badge className="bg-emerald-100 text-emerald-800 font-bold border-emerald-300">
                      {s.score}/100
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add/Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? "Edit Student Candidate" : "Add New Student Candidate"}>
        <form onSubmit={handleSaveStudent} className="space-y-4 pt-2 font-sans">
          <Input label="Student Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Usman Domiri" />
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
