import React, { useState, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Tabs } from '../../components/ui/Tabs';
import { TagInput } from '../../components/ui/TagInput';
import { FileUpload } from '../../components/ui/FileUpload';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';
import { UserCheck, ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle2, Camera } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { showToast } = useToast();
  const { user, updateUser } = useAuth();
  const studentId = 'stu-1';
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [savedProfile, setSavedProfile] = useState(() => localDB.getProfile(studentId));
  const [activeTab, setActiveTab] = useState('Personal Info');

  const defaultName = user?.name || savedProfile?.fullName || 'Usman Domiri';
  const initialName = defaultName.includes('@') ? (savedProfile?.fullName || 'Usman Domiri') : defaultName;

  const [fullName, setFullName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(() => savedProfile?.avatarUrl || user?.avatarUrl || '');
  const [dob, setDob] = useState(savedProfile?.dateOfBirth || '2005-08-17');
  const [gender, setGender] = useState(savedProfile?.gender || 'Male');
  const [phone, setPhone] = useState(savedProfile?.phone || '+62 812-3456-7890');
  const [bio, setBio] = useState(savedProfile?.bio || 'Passionate EV technology candidate specializing in electrical systems & battery maintenance from SMKN 1 Cikarang.');
  const [linkedinUrl, setLinkedinUrl] = useState(savedProfile?.linkedinUrl || 'https://linkedin.com/in/usman-domiri');

  const [major, setMajor] = useState('Teknik Kendaraan Ringan (Otomotif EV)');
  const [gradYear, setGradYear] = useState('2025');
  const [province, setProvince] = useState('Jawa Barat');
  const [city, setCity] = useState('Kabupaten Bekasi');

  const [skills, setSkills] = useState<string[]>(['EV Battery Assembly', 'Electric Motor Winding', 'Safety Protocols', 'Wiring Harness']);
  const [languages, setLanguages] = useState<string[]>(['Indonesian', 'English']);
  const [resumeName, setResumeName] = useState('usman_domiri_resume_2026.pdf');

  const completion = 90;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatarUrl(base64);
        localDB.saveProfile({
          studentId,
          avatarUrl: base64
        });
        updateUser({ avatarUrl: base64 });
        showToast('Foto profil berhasil diunggah dari galeri!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updated = localDB.saveProfile({
      studentId,
      fullName,
      avatarUrl,
      dateOfBirth: dob,
      gender,
      phone,
      bio,
      linkedinUrl
    });
    setSavedProfile(updated);
    updateUser({ name: fullName, avatarUrl });
    showToast('Profil kandidat berhasil disimpan & diperbarui!', 'success');
  };

  const userInitials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'UD';

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6 font-sans">
      {/* Hidden File Input for Avatar Photo */}
      <input 
        type="file" 
        ref={photoInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handlePhotoUpload} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Candidate Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your academic credentials, EV competencies, and resume.</p>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-500">Profile Completion:</span>
            <span className="text-[#0099B8] font-bold block">{completion}%</span>
          </div>
          <div className="w-10 h-10">
            <ProgressBar value={completion} color="cyan" />
          </div>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        {/* User Avatar Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 border-b pb-6">
          <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
            <Avatar 
              src={avatarUrl} 
              fallback={userInitials} 
              size="xl" 
              className="bg-[#0099B8] text-white font-bold text-xl shadow-md border-2 border-white ring-2 ring-cyan-100" 
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{fullName}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Talent Score Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1"><Mail size={14} className="text-[#0099B8]" /> {user?.email || 'usman@spora.id'}</span>
              <span className="flex items-center gap-1"><Phone size={14} className="text-emerald-600" /> {phone}</span>
              <span className="flex items-center gap-1"><MapPin size={14} className="text-amber-600" /> {city}, {province}</span>
            </p>
          </div>

          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs font-bold flex items-center gap-1.5 border-slate-300 hover:border-[#0099B8] hover:text-[#0099B8]" 
            onClick={() => photoInputRef.current?.click()}
          >
            <Camera size={14} /> Change Photo
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs 
          tabs={[
            { id: 'Personal Info', label: 'Personal Info' },
            { id: 'Education', label: 'Education' },
            { id: 'Skills', label: 'Skills & Competencies' },
            { id: 'Experience', label: 'Resume & Documents' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 'Personal Info' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Input label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Gender</label>
                  <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0099B8]"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Bio / Professional Summary</label>
                <textarea 
                  rows={3} 
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <Input label="LinkedIn Profile URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />

              <div className="pt-4 flex justify-end">
                <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]" onClick={handleSave}>
                  Save Personal Info
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'Education' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Vocational School Name" value="SMK Negeri 1 Cikarang" disabled />
                <Input label="Vocational Major / Stream" value={major} onChange={(e) => setMajor(e.target.value)} />
                <Input label="Graduation Cohort Year" value={gradYear} onChange={(e) => setGradYear(e.target.value)} />
                <Input label="Province" value={province} onChange={(e) => setProvince(e.target.value)} />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]" onClick={handleSave}>
                  Save Education Info
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'Skills & Competencies' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Technical Skills & EV Competencies</label>
                <TagInput tags={skills} onAdd={(t) => setSkills([...skills, t])} onRemove={(t) => setSkills(skills.filter(s => s !== t))} />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Languages Spoken</label>
                <TagInput tags={languages} onAdd={(l) => setLanguages([...languages, l])} onRemove={(l) => setLanguages(languages.filter(x => x !== l))} />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]" onClick={handleSave}>
                  Save Skills
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'Experience' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center space-y-2">
                <p className="text-xs font-bold text-slate-800">Current Resume: {resumeName}</p>
                <p className="text-[11px] text-slate-500">PDF, DOCX up to 10MB</p>
                <FileUpload onFileSelect={(f) => setResumeName(f.name)} />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]" onClick={handleSave}>
                  Upload Resume & Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
