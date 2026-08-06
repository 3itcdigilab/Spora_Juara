import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { School, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminSchools: React.FC = () => {
  const { showToast } = useToast();
  const { approveUser } = useAuth();
  
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
      showToast(`Data sekolah "${formData.name}" diperbarui.`, 'success');
    } else {
      const exists = allUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
      if (exists) {
        showToast(`Email ${formData.email} sudah terdaftar!`, 'error');
        return;
      }
      allUsers.push({ ...formData, role: 'school' });
      showToast(`Sekolah baru "${formData.name}" berhasil dibuat!`, 'success');
    }

    localStorage.setItem('spora_users', JSON.stringify(allUsers));
    refreshSchools();
    setIsModalOpen(false);
  };

  const handleDeleteSchool = (email: string, name: string) => {
    if (!window.confirm(`Hapus sekolah "${name}" dari sistem SporaOS?`)) return;

    const raw = localStorage.getItem('spora_users');
    const allUsers = raw ? JSON.parse(raw) : [];
    const filtered = allUsers.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());

    localStorage.setItem('spora_users', JSON.stringify(filtered));
    refreshSchools();
    showToast(`Sekolah "${name}" dihapus.`, 'warning');
  };

  const handleApprove = (email: string, name: string) => {
    approveUser(email);
    refreshSchools();
    showToast(`Sekolah "${name}" berhasil diverifikasi!`, 'success');
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="Partner Vocational Schools (SMK CRUD)" 
        subtitle="Tambah, edit, hapus, dan verifikasi sekolah vokasi dalam ekosistem SporaOS."
      >
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add Vocational School
        </Button>
      </PageHeader>
      
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                <th className="p-4">Nama Sekolah Vokasi</th>
                <th className="p-4">Email Kontak Sekolah</th>
                <th className="p-4">Status Verifikasi</th>
                <th className="p-4 text-right">Aksi Admin (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <School size={18} className="text-emerald-600" /> {s.name}
                  </td>
                  <td className="p-4 font-mono text-slate-600 text-xs">{s.email}</td>
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

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSchool ? "Edit School" : "Add Vocational School"}>
        <form onSubmit={handleSaveSchool} className="space-y-4 pt-2">
          <Input label="School Name (e.g. SMKN 1 Cikarang)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="School Admin Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={!!editingSchool} />
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
            <Button type="submit" variant="primary" className="bg-[#0099B8]">Save School</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
