import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { SearchBar } from '../../components/ui/SearchBar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { GraduationCap, Users, Plus, Search } from 'lucide-react';

export const SchoolStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    major: '',
    gradYear: ''
  });

  const students = useMemo(() => {
    const raw = localStorage.getItem('spora_students_db');
    let dbList = raw ? JSON.parse(raw) : [];

    const localStudents = localDB.getStudents();
    localStudents.forEach((st: any) => {
      if (!dbList.some((d: any) => d.id === st.id)) {
        dbList.push(st);
      }
    });

    return dbList;
  }, [refreshKey]);

  const filteredStudents = useMemo(() => {
    return students.filter((s: any) => {
      const name = s.name || s.fullName || '';
      const major = s.major || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase()) || major.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [students, searchTerm]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = {
      id: `student-${Date.now()}`,
      name: formData.name,
      major: formData.major,
      gradYear: formData.gradYear,
      score: Math.floor(Math.random() * 20) + 80 // random score 80-99
    };
    
    const saved = JSON.parse(localStorage.getItem('spora_students_db') || '[]');
    saved.push(newStudent);
    localStorage.setItem('spora_students_db', JSON.stringify(saved));
    
    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
    setFormData({ name: '', major: '', gradYear: '' });
    showToast('Student added successfully!', 'success');
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader title="Education Institution Student Directory" subtitle="Monitoring dan pengelolaan data siswa terdaftar institusi pendidikan.">
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> + Tambah Siswa Baru
        </Button>
      </PageHeader>
      
      <Card className="p-4 border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="w-full sm:w-72">
            <SearchBar placeholder="Cari siswa atau jurusan..." value={searchTerm} onChange={setSearchTerm} />
          </div>
          <span className="text-xs font-bold text-slate-500">Total: {filteredStudents.length} Siswa</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b font-bold uppercase">
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Jurusan / Stream</th>
                <th className="p-3">Tahun Kelulusan</th>
                <th className="p-3">Talent Score</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <GraduationCap size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">Belum Ada Siswa Terdaftar</p>
                    <p className="text-xs text-slate-400 mt-1">Data siswa yang diinput akan muncul di sini secara langsung.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st: any) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{st.name || st.fullName}</td>
                    <td className="p-3 text-slate-600">{st.major}</td>
                    <td className="p-3 font-mono text-slate-700">{st.gradYear || st.graduationYear || '2025'}</td>
                    <td className="p-3">
                      <Badge variant="info" className="bg-cyan-50 text-[#0099B8] font-bold">
                        {st.score || 85}/100
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="success">Aktif Vokasi</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Siswa Baru">
        <form onSubmit={handleAddStudent} className="space-y-4">
          <Input 
            label="Nama Siswa" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label="Jurusan / Stream" 
            value={formData.major}
            onChange={(e) => setFormData({...formData, major: e.target.value})}
            required
          />
          <Input 
            label="Tahun Kelulusan" 
            type="number"
            value={formData.gradYear}
            onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8] text-white">Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
