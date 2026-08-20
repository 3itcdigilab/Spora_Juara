import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Clock, UserCheck, Plus, Edit2, Trash2, Key } from 'lucide-react';

import { getAll, addItem, updateItem, removeWhere, findOne } from '../../services/firestoreSync';

export const AdminUsers: React.FC = () => {
  const { showToast } = useToast();
  const { approveUser, rejectUser } = useAuth();
  
  const [users, setUsers] = useState<any[]>(() => {
    return getAll('users');
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    status: 'active'
  });

  const refreshUsers = () => {
    setUsers([...getAll('users')]);
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '123', role: 'student', status: 'active' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: any) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      email: u.email || '',
      password: u.password || '123',
      role: u.role || 'student',
      status: u.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUsers = getAll('users');

    if (editingUser) {
      const target = currentUsers.find((u: any) => u.email.toLowerCase() === editingUser.email.toLowerCase());
      if (target) {
        const docId = target._docId || target.id || `user-${Date.now()}`;
        updateItem('users', docId, { ...formData, name: formData.name });
      }
      showToast(`User "${formData.name}" berhasil diperbarui.`, 'success');
    } else {
      const exists = currentUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
      if (exists) {
        showToast(`Email ${formData.email} sudah terdaftar!`, 'error');
        return;
      }
      addItem('users', { id: `user-${Date.now()}`, ...formData });
      showToast(`User baru "${formData.name}" berhasil dibuat!`, 'success');
    }

    refreshUsers();
    setIsModalOpen(false);
  };

  const handleDeleteUser = (email: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun "${name}" (${email})?`)) return;

    removeWhere('users', (u: any) => u.email.toLowerCase() === email.toLowerCase());
    refreshUsers();
    showToast(`Akun "${name}" telah dihapus dari sistem.`, 'warning');
  };

  const handleApprove = (email: string, name: string) => {
    approveUser(email);
    refreshUsers();
    showToast(`Akun mitra "${name}" (${email}) berhasil diverifikasi & diaktifkan!`, 'success');
  };

  const handleReject = (email: string, name: string) => {
    rejectUser(email);
    refreshUsers();
    showToast(`Akun mitra "${name}" ditolak/dinonaktifkan.`, 'warning');
  };

  const pendingCount = users.filter(u => u.status === 'pending').length;

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="User Access & Directory Management (CRUD)" 
        subtitle="Kelola penuh hak akses pengguna, persetujuan mitra, edit profil, dan hapus akun SporaOS."
      >
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add New User / Partner
        </Button>
      </PageHeader>

      {/* Pending Callout */}
      {pendingCount > 0 ? (
        <Card className="p-6 border-l-4 border-amber-500 bg-amber-50/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Permintaan Verifikasi Mitra ({pendingCount})</h3>
              <p className="text-xs text-slate-600">Ada {pendingCount} pendaftaran mitra Sekolah/Industri yang membutuhkan persetujuan Administrator.</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 border-l-4 border-emerald-500 bg-emerald-50/40 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-800">Semua pendaftaran mitra telah diverifikasi dan aktif.</span>
        </Card>
      )}

      {/* Users Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <UserCheck size={18} className="text-[#0099B8]" /> Direktori Pengguna & Hak Akses ({users.length})
          </h3>
          <Button size="sm" variant="outline" onClick={refreshUsers}>🔄 Refresh Directory</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Nama Pengguna / Perusahaan</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Peran (Role)</th>
                <th className="p-4">Status Verifikasi</th>
                <th className="p-4 text-right">Aksi Administrator (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u: any, idx: number) => {
                const isPending = u.status === 'pending';
                const isRejected = u.status === 'rejected';

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{u.name || 'User'}</td>
                    <td className="p-4 font-mono text-slate-600 text-xs">{u.email}</td>
                    <td className="p-4 capitalize">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                        u.role === 'school' ? 'bg-emerald-100 text-emerald-800' :
                        u.role === 'industry' ? 'bg-violet-100 text-violet-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {isPending ? (
                        <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-300">
                          ⏳ Pending Verification
                        </Badge>
                      ) : isRejected ? (
                        <Badge variant="error" className="bg-red-100 text-red-800 border-red-300">
                          ❌ Ditolak / Inaktif
                        </Badge>
                      ) : (
                        <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                          ✓ Terverifikasi & Aktif
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        {isPending && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1"
                            onClick={() => handleApprove(u.email, u.name)}
                          >
                            Setujui
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs p-1.5 hover:bg-slate-100"
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit Access / Password"
                        >
                          <Edit2 size={14} className="text-slate-600" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs p-1.5 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteUser(u.email, u.name)}
                          title="Delete User"
                        >
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

      {/* Add / Edit User Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? `Edit User: ${editingUser.name}` : "Add New User / Partner Account"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4 font-sans text-left">
          <Input 
            label="Full Name / Entity Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
          />

          <Input 
            label="Email Address" 
            type="email"
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
            disabled={!!editingUser}
          />

          <Input 
            label="Password" 
            type="password"
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">User Role</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student / Candidate</option>
                <option value="school">Vocational School (SMK)</option>
                <option value="industry">Industry Partner</option>
                <option value="admin">Platform Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Verification Status</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active & Verified</option>
                <option value="pending">Pending Admin Verification</option>
                <option value="rejected">Rejected / Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]">
              {editingUser ? "Save Changes" : "Create User Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
