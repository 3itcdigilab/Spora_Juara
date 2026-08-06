import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { Factory, Plus, Edit2, Trash2, Eye, UserCheck, Phone, Mail, ShieldCheck, Briefcase, FileText, Save } from 'lucide-react';

export const AdminIndustries: React.FC = () => {
  const { showToast } = useToast();
  const { approveUser } = useAuth();
  
  const [users, setUsers] = useState<any[]>(() => {
    const raw = localStorage.getItem('spora_users');
    const all = raw ? JSON.parse(raw) : [];
    return all.filter((u: any) => u.role === 'industry');
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    directorName: '',
    picName: '',
    picPhone: '',
    picRole: '',
    picNotes: '',
    password: '123',
    status: 'active'
  });

  // View PIC Details Modal State
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [selectedPicIndustry, setSelectedPicIndustry] = useState<any | null>(null);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [picFormData, setPicFormData] = useState({
    directorName: '',
    picName: '',
    picEmail: '',
    picPhone: '',
    picRole: '',
    picNotes: ''
  });

  const refreshIndustries = () => {
    const raw = localStorage.getItem('spora_users');
    const all = raw ? JSON.parse(raw) : [];
    setUsers(all.filter((u: any) => u.role === 'industry'));
  };

  const handleOpenAddModal = () => {
    setEditingIndustry(null);
    setFormData({
      name: '',
      email: '',
      directorName: '',
      picName: '',
      picPhone: '',
      picRole: '',
      picNotes: '',
      password: '123',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ind: any) => {
    setEditingIndustry(ind);
    setFormData({
      name: ind.name || '',
      email: ind.email || '',
      directorName: ind.directorName || '',
      picName: ind.picName || '',
      picPhone: ind.picPhone || ind.phone || '',
      picRole: ind.picRole || 'Talent Acquisition Manager',
      picNotes: ind.picNotes || '',
      password: ind.password || '123',
      status: ind.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = localStorage.getItem('spora_users');
    let allUsers = raw ? JSON.parse(raw) : [];

    if (editingIndustry) {
      allUsers = allUsers.map((u: any) => {
        if (u.email.toLowerCase() === editingIndustry.email.toLowerCase()) {
          return { 
            ...u, 
            name: formData.name, 
            directorName: formData.directorName,
            picName: formData.picName,
            picPhone: formData.picPhone,
            picRole: formData.picRole,
            picNotes: formData.picNotes,
            password: formData.password, 
            status: formData.status 
          };
        }
        return u;
      });
      showToast(`Data industri "${formData.name}" diperbarui.`, 'success');
    } else {
      const exists = allUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
      if (exists) {
        showToast(`Email ${formData.email} sudah terdaftar!`, 'error');
        return;
      }
      allUsers.push({ ...formData, role: 'industry' });
      showToast(`Mitra industri "${formData.name}" berhasil dibuat!`, 'success');
    }

    localStorage.setItem('spora_users', JSON.stringify(allUsers));
    refreshIndustries();
    setIsModalOpen(false);
  };

  const handleDeleteIndustry = (email: string, name: string) => {
    if (!window.confirm(`Hapus mitra industri "${name}" dari sistem SporaOS?`)) return;

    const raw = localStorage.getItem('spora_users');
    const allUsers = raw ? JSON.parse(raw) : [];
    const filtered = allUsers.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());

    localStorage.setItem('spora_users', JSON.stringify(filtered));
    refreshIndustries();
    showToast(`Industri "${name}" dihapus.`, 'warning');
  };

  const handleApprove = (email: string, name: string) => {
    approveUser(email);
    refreshIndustries();
    showToast(`Industri "${name}" berhasil diverifikasi!`, 'success');
  };

  // Open View PIC Details Modal
  const handleOpenPicModal = (ind: any) => {
    setSelectedPicIndustry(ind);
    setPicFormData({
      directorName: ind.directorName || 'Ir. H. Bambang Soesilo, M.T. (Direktur Utama)',
      picName: ind.picName || ind.name || 'Hendra Pratama, S.Psi',
      picEmail: ind.picEmail || ind.email || 'hr@industry.co.id',
      picPhone: ind.picPhone || ind.phone || '+62 812-9876-5432',
      picRole: ind.picRole || 'Head of Talent Acquisition & Campus Relations',
      picNotes: ind.picNotes || 'Penanggung jawab utama rekrutmen lulusan SMK Vokasi & program magang industri.'
    });
    setIsEditingPic(false);
    setIsPicModalOpen(true);
  };

  // Save Edit PIC Details
  const handleSavePicDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = localStorage.getItem('spora_users');
    let allUsers = raw ? JSON.parse(raw) : [];

    allUsers = allUsers.map((u: any) => {
      if (u.email.toLowerCase() === selectedPicIndustry.email.toLowerCase()) {
        return {
          ...u,
          directorName: picFormData.directorName,
          picName: picFormData.picName,
          picEmail: picFormData.picEmail,
          picPhone: picFormData.picPhone,
          picRole: picFormData.picRole,
          picNotes: picFormData.picNotes
        };
      }
      return u;
    });

    localStorage.setItem('spora_users', JSON.stringify(allUsers));
    refreshIndustries();
    setSelectedPicIndustry({ ...selectedPicIndustry, ...picFormData });
    setIsEditingPic(false);
    showToast(`Data PIC & Direktur "${selectedPicIndustry.name}" berhasil diperbarui!`, 'success');
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="Industry Corporate Partners (CRUD)" 
        subtitle="Tambah, edit, hapus, dan kelola PIC kontak & otorisasi rekrutmen mitra industri EV."
      >
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add Industry Partner
        </Button>
      </PageHeader>
      
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                <th className="p-4">Nama Perusahaan Industri</th>
                <th className="p-4 text-center">PIC</th>
                <th className="p-4">Status Verifikasi</th>
                <th className="p-4 text-right">Aksi Admin (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((ind, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <Factory size={18} className="text-violet-600" /> {ind.name}
                  </td>
                  <td className="p-4 text-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs font-bold text-violet-700 border-violet-200 bg-violet-50 hover:bg-violet-100 flex items-center gap-1.5 mx-auto"
                      onClick={() => handleOpenPicModal(ind)}
                    >
                      <Eye size={14} /> View PIC
                    </Button>
                  </td>
                  <td className="p-4">
                    {ind.status === 'pending' ? (
                      <Badge variant="warning">⏳ Pending Approval</Badge>
                    ) : ind.status === 'rejected' ? (
                      <Badge variant="error">❌ Nonaktif</Badge>
                    ) : (
                      <Badge variant="success">✓ Verified & Active</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      {ind.status === 'pending' && (
                        <Button size="sm" className="bg-[#0099B8] text-white text-xs px-2.5 py-1" onClick={() => handleApprove(ind.email, ind.name)}>
                          Setujui
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="p-1.5" onClick={() => handleOpenEditModal(ind)}>
                        <Edit2 size={14} className="text-slate-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1.5 text-red-600 hover:bg-red-50" onClick={() => handleDeleteIndustry(ind.email, ind.name)}>
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

      {/* Modal Add/Edit Industry */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIndustry ? "Edit Industry Partner" : "Add Industry Partner"}>
        <form onSubmit={handleSaveIndustry} className="space-y-4 pt-2">
          <Input label="Company Name (e.g. Hyundai Motor Indonesia)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Nama Direktur Perusahaan / Managing Director" value={formData.directorName} onChange={(e) => setFormData({ ...formData, directorName: e.target.value })} placeholder="e.g. Bpk. Ir. H. Bambang Soesilo, M.T." />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Nama PIC Rekrutmen" value={formData.picName} onChange={(e) => setFormData({ ...formData, picName: e.target.value })} placeholder="e.g. Hendra Pratama" />
            <Input label="Jabatan PIC (Role)" value={formData.picRole} onChange={(e) => setFormData({ ...formData, picRole: e.target.value })} placeholder="e.g. Talent Acquisition Manager" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Email Kontak HR / PIC" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={!!editingIndustry} />
            <Input label="No. Telepon / WhatsApp PIC" value={formData.picPhone} onChange={(e) => setFormData({ ...formData, picPhone: e.target.value })} placeholder="e.g. 0812-9876-5432" />
          </div>

          <Input label="Password Akun" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          
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
            <Button type="submit" variant="primary" className="bg-[#0099B8]">Save Industry Partner</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Pop-Up View & Edit PIC Details */}
      <Modal 
        isOpen={isPicModalOpen} 
        onClose={() => setIsPicModalOpen(false)} 
        title={`Corporate PIC & Executive Info — ${selectedPicIndustry?.name || ''}`}
        size="md"
      >
        <div className="space-y-4 pt-2">
          {!isEditingPic ? (
            /* View PIC Mode */
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-violet-900 to-purple-800 text-white p-5 rounded-2xl shadow-md space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-200">Mitra Industri EV</span>
                    <h3 className="text-lg font-extrabold">{selectedPicIndustry?.name}</h3>
                  </div>
                  <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">
                    ✓ Verified Partner
                  </Badge>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-violet-100">
                  <UserCheck size={16} className="text-amber-300" />
                  <span>Direktur Utama: <strong className="text-white">{picFormData.directorName}</strong></span>
                </div>
              </div>

              {/* PIC Contact Details Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider text-violet-600 flex items-center gap-1.5">
                  <Briefcase size={16} /> Penanggung Jawab Rekrutmen (PIC)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Nama Lengkap PIC</p>
                    <p className="font-extrabold text-slate-900 text-sm">{picFormData.picName}</p>
                    <p className="text-[11px] text-violet-600 font-semibold">{picFormData.picRole}</p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Email & WhatsApp PIC</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-1">
                      <Mail size={13} className="text-violet-600" /> {picFormData.picEmail}
                    </p>
                    <p className="font-semibold text-emerald-700 flex items-center gap-1">
                      <Phone size={13} className="text-emerald-600" /> {picFormData.picPhone}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1 text-xs">
                  <p className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                    <FileText size={12} /> Catatan Kontak & Otorisasi
                  </p>
                  <p className="text-slate-700 leading-relaxed">{picFormData.picNotes}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => setIsPicModalOpen(false)}>Tutup</Button>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1.5" onClick={() => setIsEditingPic(true)}>
                  <Edit2 size={14} /> Edit Data PIC & Direktur
                </Button>
              </div>
            </div>
          ) : (
            /* Edit PIC Form Mode */
            <form onSubmit={handleSavePicDetails} className="space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 text-violet-700">Form Edit Data PIC & Direktur</h4>
              
              <Input 
                label="Nama Direktur Perusahaan / Managing Director" 
                value={picFormData.directorName} 
                onChange={(e) => setPicFormData({ ...picFormData, directorName: e.target.value })} 
                required 
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  label="Nama PIC Rekrutmen / Contact Person" 
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
                />
                <Input 
                  label="Nomor Telepon / WhatsApp PIC" 
                  value={picFormData.picPhone} 
                  onChange={(e) => setPicFormData({ ...picFormData, picPhone: e.target.value })} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Catatan Kontak & Keterangan Tambahan</label>
                <textarea 
                  rows={3} 
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-violet-600 focus:outline-none"
                  value={picFormData.picNotes} 
                  onChange={(e) => setPicFormData({ ...picFormData, picNotes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingPic(false)}>Batal</Button>
                <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1">
                  <Save size={14} /> Simpan Perubahan PIC
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
