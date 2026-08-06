import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { Factory, Plus, Edit2, Trash2, Eye, UserCheck, Phone, Mail, Briefcase, FileText, Save, UserPlus, ShieldCheck } from 'lucide-react';

export interface IndustryPIC {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  notes?: string;
}

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
    password: '123',
    status: 'active'
  });

  // Multi-PIC Modal State
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [selectedPicIndustry, setSelectedPicIndustry] = useState<any | null>(null);
  const [picsList, setPicsList] = useState<IndustryPIC[]>([]);
  const [directorName, setDirectorName] = useState('');
  
  // Single PIC Add/Edit Form inside modal
  const [isEditingPicForm, setIsEditingPicForm] = useState(false);
  const [editingPicId, setEditingPicId] = useState<string | null>(null);
  const [picFormData, setPicFormData] = useState<IndustryPIC>({
    id: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    notes: ''
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
      allUsers.push({ ...formData, role: 'industry', pics: [] });
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

  // Open Multi-PIC Details Modal
  const handleOpenPicModal = (ind: any) => {
    setSelectedPicIndustry(ind);
    setDirectorName(ind.directorName || 'Tubagus Aria');
    
    // Resolve initial multi PICs list
    let existingPics: IndustryPIC[] = ind.pics || [];
    if (existingPics.length === 0) {
      existingPics = [
        {
          id: `pic-1`,
          name: ind.picName || ind.name || '3ITC',
          role: ind.picRole || 'Direktur / HR Lead',
          email: ind.picEmail || ind.email || 'tubagusaria31@gmail.com',
          phone: ind.picPhone || ind.phone || '087780092090',
          notes: ind.picNotes || 'Penanggung jawab utama rekrutmen lulusan SMK Vokasi & program magang industri.'
        }
      ];
    }
    setPicsList(existingPics);
    setIsEditingPicForm(false);
    setIsPicModalOpen(true);
  };

  const handleOpenAddPicForm = () => {
    setEditingPicId(null);
    setPicFormData({
      id: `pic-${Date.now()}`,
      name: '',
      role: 'Talent Acquisition Specialist',
      email: '',
      phone: '',
      notes: ''
    });
    setIsEditingPicForm(true);
  };

  const handleOpenEditPicForm = (pic: IndustryPIC) => {
    setEditingPicId(pic.id);
    setPicFormData({ ...pic });
    setIsEditingPicForm(true);
  };

  const handleSavePicItem = (e: React.FormEvent) => {
    e.preventDefault();
    let nextPics = [...picsList];

    if (editingPicId) {
      nextPics = nextPics.map(p => p.id === editingPicId ? { ...picFormData } : p);
      showToast(`PIC "${picFormData.name}" berhasil diperbarui!`, 'success');
    } else {
      nextPics.push({ ...picFormData, id: `pic-${Date.now()}` });
      showToast(`PIC baru "${picFormData.name}" berhasil ditambahkan!`, 'success');
    }

    setPicsList(nextPics);
    savePicsToDB(nextPics, directorName);
    setIsEditingPicForm(false);
  };

  const handleDeletePicItem = (picId: string, picName: string) => {
    if (picsList.length <= 1) {
      showToast('Mitra industri minimal memiliki 1 PIC kontak rekrutmen.', 'warning');
      return;
    }
    if (!window.confirm(`Hapus PIC "${picName}" dari daftar kontak industri?`)) return;

    const filtered = picsList.filter(p => p.id !== picId);
    setPicsList(filtered);
    savePicsToDB(filtered, directorName);
    showToast(`PIC "${picName}" dihapus.`, 'warning');
  };

  const handleSaveDirectorName = (e: React.FormEvent) => {
    e.preventDefault();
    savePicsToDB(picsList, directorName);
    showToast('Nama Direktur Utama berhasil disimpan!', 'success');
  };

  const savePicsToDB = (updatedPics: IndustryPIC[], dirName: string) => {
    const raw = localStorage.getItem('spora_users');
    let allUsers = raw ? JSON.parse(raw) : [];

    allUsers = allUsers.map((u: any) => {
      if (u.email.toLowerCase() === selectedPicIndustry.email.toLowerCase()) {
        return {
          ...u,
          directorName: dirName,
          pics: updatedPics,
          // Sync primary PIC for backwards compatibility
          picName: updatedPics[0]?.name || u.name,
          picRole: updatedPics[0]?.role || 'HR Lead',
          picEmail: updatedPics[0]?.email || u.email,
          picPhone: updatedPics[0]?.phone || u.phone
        };
      }
      return u;
    });

    localStorage.setItem('spora_users', JSON.stringify(allUsers));
    refreshIndustries();
    setSelectedPicIndustry({ ...selectedPicIndustry, directorName: dirName, pics: updatedPics });
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="Industry Corporate Partners (CRUD)" 
        subtitle="Tambah, edit, hapus, dan kelola multi-PIC kontak & otorisasi rekrutmen mitra industri EV."
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
                <th className="p-4 text-center">PIC Kontaks</th>
                <th className="p-4">Status Verifikasi</th>
                <th className="p-4 text-right">Aksi Admin (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((ind, idx) => {
                const picCount = ind.pics?.length || 1;
                return (
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
                        <Eye size={14} /> View PIC ({picCount})
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
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add/Edit Industry Partner */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIndustry ? "Edit Industry Partner" : "Add Industry Partner"}>
        <form onSubmit={handleSaveIndustry} className="space-y-4 pt-2">
          <Input label="Company Name (e.g. Hyundai Motor Indonesia)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Nama Direktur Perusahaan / Managing Director" value={formData.directorName} onChange={(e) => setFormData({ ...formData, directorName: e.target.value })} placeholder="e.g. Bpk. Ir. H. Bambang Soesilo, M.T." />
          <Input label="Email Utama Perusahaan" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={!!editingIndustry} />
          <Input label="Password Akun" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status Verifikasi</label>
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

      {/* Modal Pop-Up Multi-PIC & Executive Details */}
      <Modal 
        isOpen={isPicModalOpen} 
        onClose={() => setIsPicModalOpen(false)} 
        title={`Corporate PIC & Executive Info — ${selectedPicIndustry?.name || ''}`}
        size="lg"
      >
        <div className="space-y-4 pt-2">
          {/* Executive Director Banner */}
          <div className="bg-gradient-to-r from-violet-900 to-purple-800 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-200">Mitra Industri EV</span>
                <h3 className="text-lg font-extrabold">{selectedPicIndustry?.name}</h3>
              </div>
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">
                ✓ Verified Partner ({picsList.length} PIC Active)
              </Badge>
            </div>

            <form onSubmit={handleSaveDirectorName} className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2">
              <span className="text-xs text-violet-100 flex items-center gap-1 shrink-0 font-bold">
                <UserCheck size={16} className="text-amber-300" /> Direktur Utama:
              </span>
              <input 
                type="text" 
                className="bg-white/10 text-white placeholder-violet-300 text-xs p-1.5 px-3 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-amber-300 flex-1 w-full font-bold"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                placeholder="Nama Direktur Perusahaan"
              />
              <Button type="submit" size="sm" className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold shrink-0 py-1.5">
                <Save size={13} /> Simpan Direktur
              </Button>
            </form>
          </div>

          {/* Section Header & Add PIC Button */}
          <div className="flex justify-between items-center bg-violet-50 p-3 rounded-xl border border-violet-100">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider text-violet-700 flex items-center gap-1.5">
              <Briefcase size={16} /> Daftar Penanggung Jawab Rekrutmen ({picsList.length} PIC)
            </h4>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs flex items-center gap-1" onClick={handleOpenAddPicForm}>
              <UserPlus size={14} /> + Tambah PIC Baru
            </Button>
          </div>

          {/* Add / Edit PIC Form */}
          {isEditingPicForm && (
            <form onSubmit={handleSavePicItem} className="p-4 bg-slate-50 rounded-xl border border-violet-200 space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-1 text-violet-700">
                {editingPicId ? 'Edit Data PIC' : 'Form Tambah PIC Rekrutmen Baru'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Nama Lengkap PIC" value={picFormData.name} onChange={(e) => setPicFormData({ ...picFormData, name: e.target.value })} required />
                <Input label="Jabatan / Title PIC" value={picFormData.role} onChange={(e) => setPicFormData({ ...picFormData, role: e.target.value })} required />
                <Input label="Email Kontak PIC" type="email" value={picFormData.email} onChange={(e) => setPicFormData({ ...picFormData, email: e.target.value })} required />
                <Input label="No. WhatsApp / Telepon PIC" value={picFormData.phone} onChange={(e) => setPicFormData({ ...picFormData, phone: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Catatan & Keterangan Tugas PIC</label>
                <textarea 
                  rows={2} 
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-violet-600"
                  value={picFormData.notes || ''}
                  onChange={(e) => setPicFormData({ ...picFormData, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingPicForm(false)}>Batal</Button>
                <Button type="submit" size="sm" className="bg-violet-600 text-white flex items-center gap-1">
                  <Save size={14} /> Simpan PIC
                </Button>
              </div>
            </form>
          )}

          {/* List of PIC Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {picsList.map((pic, index) => (
              <div key={pic.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-violet-300 transition-all space-y-2.5 shadow-2xs relative">
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                      {index === 0 ? '⭐ PIC Utama' : `PIC #${index + 1}`}
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-sm mt-1">{pic.name}</h5>
                    <p className="text-[11px] text-violet-600 font-bold">{pic.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" className="p-1 text-xs hover:border-violet-400" onClick={() => handleOpenEditPicForm(pic)}>
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

          <div className="flex justify-end pt-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsPicModalOpen(false)}>Tutup</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
