import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { GraduationCap, School, Factory, CheckCircle2, Phone, Mail, User, Lock, Sparkles, Key, ShieldCheck } from 'lucide-react';
import { StudentOnboardingAssessment } from '../../components/assessment/StudentOnboardingAssessment';
import { localDB } from '../../services/db';
import { mockSchools } from '../../data/schools';
import { openRouterService } from '../../services/OpenRouterAI';

const roleMeta: Record<string, { title: string; subtitle: string; icon: any; color: string }> = {
  student: {
    title: 'Talent Candidate Registration',
    subtitle: 'Build your profile, take EV competency assessments, and get discovered by industry leaders.',
    icon: GraduationCap,
    color: '#0099B8'
  },
  industry: {
    title: 'Industry Partner Registration',
    subtitle: 'Access Indonesia\'s pre-assessed vocational talent pool and streamline recruitment.',
    icon: Factory,
    color: '#8B5CF6'
  },
  school: {
    title: 'Vocational School (SMK) Registration',
    subtitle: 'Connect your graduates with EV industries and track competency benchmarks.',
    icon: School,
    color: '#10B981'
  }
};

export const RegisterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawRoleParam = searchParams.get('role') || 'student';
  const roleParam = (rawRoleParam === 'admin' ? 'student' : rawRoleParam);

  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: roleParam,
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Student specific
    nisn: '',
    school: 'SMKN 1 Cikarang Pusat',
    schoolToken: '',
    major: 'Teknik Kendaraan Ringan (Otomotif EV)',
    graduationYear: '2025',
    province: 'Jawa Barat',
    city: 'Kabupaten Bekasi',
    // Industry specific
    companyName: '',
    directorName: '',
    picName: '',
    picEmail: '',
    picPhone: '',
    picRole: '',
    picNotes: '',
    sector: 'EV Battery Assembly',
    officeCity: 'Cikarang, Jawa Barat',
    hiringTarget: '10-50 Graduates / Year',
    // School specific
    schoolName: '',
    schoolType: 'State Vocational School (SMKN)',
    totalGraduates: '100-300 Graduates / Year'
  });

  useEffect(() => {
    const validRole = rawRoleParam === 'admin' ? 'student' : rawRoleParam;
    setFormData(prev => ({ ...prev, role: validRole }));
  }, [rawRoleParam]);

  const currentRoleMeta = roleMeta[formData.role] || roleMeta.student;

  const currentSelectedSchool = mockSchools.find(s => s.name.toLowerCase() === formData.school.toLowerCase()) || mockSchools[0];
  const isTokenMatch = formData.schoolToken.trim().toUpperCase() === currentSelectedSchool?.registrationToken?.toUpperCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (newRole: string) => {
    setSearchParams({ role: newRole });
    setFormData(prev => ({ ...prev, role: newRole }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleStudentCompleteWithAssessment = async (result: any) => {
    let finalName = formData.name.trim() || 'Kandidat Siswa';
    const payload = {
      ...formData,
      name: finalName,
      isSchoolVerified: isTokenMatch
    };

    await register(payload);

    // Save student calculated Talent Score & Assessment Results
    const studentEmail = payload.email.toLowerCase().trim();
    
    // Save Talent Score with dynamic dimensions
    localDB.saveTalentScore({
      id: `score-${Date.now()}`,
      studentId: studentEmail,
      overall: result.percentage,
      dimensions: [
        { key: 'technical', label: 'Technical & Green Energy', score: result.dimensions.technical, weight: 0.25, source: 'Induction Assessment', description: 'Penguasaan konsep powertrain EV dan Green Energy', color: '#10B981' },
        { key: 'safety', label: 'High Voltage Safety', score: result.dimensions.safety, weight: 0.25, source: 'Induction Assessment', description: 'Kepatuhan K3 & prosedur isolasi tegangan tinggi', color: '#0099B8' },
        { key: 'psychometric', label: 'Work Style & 5S', score: result.dimensions.psychometric, weight: 0.20, source: 'Induction Assessment', description: 'Ketelitian torsi dan etos kerja industri', color: '#8B5CF6' },
        { key: 'learningAgility', label: 'Learning Agility', score: result.dimensions.learningAgility, weight: 0.15, source: 'Induction Assessment', description: 'Kecepatan adaptasi teknologi baru', color: '#F59E0B' },
        { key: 'communication', label: 'Communication & Teamwork', score: result.dimensions.communication, weight: 0.15, source: 'Induction Assessment', description: 'Kolaborasi dan pemecahan masalah tim', color: '#3B82F6' }
      ],
      calculatedAt: new Date().toISOString(),
      configVersion: 'v2.0'
    });

    // Save Assessment Result
    localDB.saveAssessmentResult({
      id: `res-${Date.now()}`,
      studentId: studentEmail,
      assessmentId: 'ass-1',
      score: result.percentage,
      totalQuestions: result.maxScore / 5,
      correctAnswers: result.totalScore / 5,
      timeTaken: 600,
      dimensionScores: result.dimensions,
      strengths: result.strengths,
      weaknesses: result.growthAreas,
      personalityType: result.archetype.title,
      completedAt: new Date().toISOString()
    });

    // Trigger AI deep report generation in background if OpenRouter key exists
    if (openRouterService.hasApiKey()) {
      openRouterService.generatePsychologicalReport({
        studentId: studentEmail,
        studentName: finalName,
        nisn: formData.nisn,
        schoolName: formData.school,
        major: formData.major,
        dimensionScores: result.dimensions,
        overallScore: result.percentage,
        personalityType: result.archetype.title
      }).catch(err => console.error('Background AI Report error:', err));
    }

    navigate('/student/dashboard');
  };

  const handleStudentSkipAssessment = async () => {
    let finalName = formData.name.trim() || 'Kandidat Siswa';
    const payload = {
      ...formData,
      name: finalName,
      isSchoolVerified: isTokenMatch
    };
    await register(payload);
    navigate('/student/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    // Set name fallback based on role if left empty
    let finalName = formData.name.trim();
    if (!finalName) {
      if (formData.role === 'school') finalName = formData.schoolName || 'Institusi Sekolah';
      else if (formData.role === 'industry') finalName = formData.companyName || 'Mitra Industri';
      else finalName = 'Kandidat Siswa';
    }

    const payload = {
      ...formData,
      name: finalName,
      isSchoolVerified: isTokenMatch
    };

    await register(payload);

    if (formData.role === 'school' || formData.role === 'industry') {
      navigate('/pending-verification');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <Logo size="md" />
            </Link>
          </div>
          
          <div className="inline-flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                formData.role === 'student' ? 'bg-white text-[#0099B8] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap size={16} /> Talent Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('industry')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                formData.role === 'industry' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Factory size={16} /> Industry Partner
            </button>
            <button
              type="button"
              onClick={() => setRole('school')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                formData.role === 'school' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <School size={16} /> Education Institution
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4 text-left">
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-[#0099B8] shrink-0">
              <currentRoleMeta.icon size={28} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{currentRoleMeta.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentRoleMeta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Form Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 -z-0"></div>
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Role Profile' },
              { num: 3, label: formData.role === 'student' ? 'Psikotes & Green Energy' : 'Confirm' }
            ].map((item) => (
              <div key={item.num} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= item.num ? 'bg-[#0099B8] text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {item.num}
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {step === 3 && formData.role === 'student' ? (
          <StudentOnboardingAssessment
            studentName={formData.name || 'Kandidat Siswa'}
            studentEmail={formData.email}
            onComplete={handleStudentCompleteWithAssessment}
            onSkip={handleStudentSkipAssessment}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Account Credentials */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">Step 1: Account Credentials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {formData.role === 'school' ? 'Nama Koordinator / Kepala Sekolah' : 
                     formData.role === 'industry' ? 'Nama Perwakilan Perusahaan' : 'Nama Lengkap'}
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Nama Lengkap"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>

                {formData.role === 'student' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      NISN (10 Digit)
                    </label>
                    <input 
                      type="text" 
                      name="nisn" 
                      required 
                      maxLength={10}
                      placeholder="NISN"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none font-mono tracking-wider" 
                      value={formData.nisn} 
                      onChange={handleChange} 
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kode Organisasi / NPWP</label>
                    <input 
                      type="text" 
                      name="nisn" 
                      placeholder="Kode Organisasi / NPWP"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      value={formData.nisn} 
                      onChange={handleChange} 
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="Email"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nomor HP / WhatsApp</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    placeholder="Nomor HP / WhatsApp"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    placeholder="••••••••"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                    value={formData.password} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    required 
                    placeholder="••••••••"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Role Specific Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                Step 2: {formData.role === 'student' ? 'Education & Competency Profile' : formData.role === 'industry' ? 'Company Details' : 'School Profile'}
              </h3>

              {/* Student Fields */}
              {formData.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pilih SMK Mitra</label>
                    <select 
                      name="school" 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white"
                      value={formData.school}
                      onChange={handleChange}
                    >
                      {mockSchools.map(sch => (
                        <option key={sch.id} value={sch.name}>
                          {sch.name} ({sch.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* School Token Input */}
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-cyan-50/40 rounded-xl border border-cyan-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Key size={14} className="text-[#0099B8]" /> Token Registrasi Sekolah (Enrollment Token)
                      </label>
                      {isTokenMatch ? (
                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <ShieldCheck size={13} /> Token Terverifikasi ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          Wajib Diisi
                        </span>
                      )}
                    </div>
                    <input 
                      type="text" 
                      name="schoolToken" 
                      placeholder="Kode Token Registrasi Sekolah"
                      className={`w-full p-2.5 border rounded-lg text-xs font-mono uppercase tracking-wider focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white ${
                        isTokenMatch ? 'border-emerald-400 ring-1 ring-emerald-300' : 'border-slate-300'
                      }`}
                      value={formData.schoolToken} 
                      onChange={handleChange} 
                    />
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      💡 Masukkan kode token pendaftaran dari guru atau koordinator BKK sekolah Anda.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jurusan Vokasi EV</label>
                    <select 
                      name="major" 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white"
                      value={formData.major}
                      onChange={handleChange}
                    >
                      <option value="Teknik Kendaraan Ringan (Otomotif EV)">Teknik Kendaraan Ringan (Otomotif EV)</option>
                      <option value="Teknik Elektronika Industri">Teknik Elektronika Industri</option>
                      <option value="Teknik Mekatronika & Otomasi EV">Teknik Mekatronika & Otomasi EV</option>
                      <option value="Teknik Baterai & Elektronika Daya">Teknik Baterai & Elektronika Daya</option>
                      <option value="Teknik Tenaga Listrik & SPKLU">Teknik Tenaga Listrik & SPKLU</option>
                      <option value="Teknik Sepeda Motor (EV Conversion)">Teknik Sepeda Motor (EV Conversion)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Year</label>
                      <select 
                        name="graduationYear" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white"
                        value={formData.graduationYear}
                        onChange={handleChange}
                      >
                        <option value="2024">2024 (Graduated)</option>
                        <option value="2025">2025 (Final Year)</option>
                        <option value="2026">2026 (Grade 11)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Provinsi</label>
                      <input 
                        type="text" 
                        name="province" 
                        placeholder="Provinsi"
                        value={formData.province} 
                        onChange={handleChange}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Kota / Kabupaten</label>
                      <input 
                        type="text" 
                        name="city" 
                        placeholder="Kota / Kabupaten"
                        value={formData.city} 
                        onChange={handleChange}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Industry Fields */}
              {formData.role === 'industry' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
                    <input 
                      type="text" 
                      name="companyName" 
                      required 
                      placeholder="Nama Perusahaan"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      value={formData.companyName} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Direktur Perusahaan</label>
                    <input 
                      type="text" 
                      name="directorName" 
                      placeholder="Nama Direktur Perusahaan"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      value={formData.directorName} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nama PIC Rekrutmen</label>
                      <input 
                        type="text" 
                        name="picName" 
                        placeholder="Nama PIC Rekrutmen"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                        value={formData.picName} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan PIC</label>
                      <input 
                        type="text" 
                        name="picRole" 
                        placeholder="Jabatan PIC"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                        value={formData.picRole} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">EV Industry Sector</label>
                      <select 
                        name="sector" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white"
                        value={formData.sector}
                        onChange={handleChange}
                      >
                        <option value="EV Battery Assembly">EV Battery Assembly & Manufacturing</option>
                        <option value="Electric Motor Manufacturing">Electric Motor Manufacturing</option>
                        <option value="EV 2W/4W Conversion Workshop">EV 2W/4W Conversion Workshop</option>
                        <option value="Charging Infrastructure (SPKLU)">Charging Infrastructure (SPKLU)</option>
                        <option value="EV Fleet Maintenance">EV Fleet Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi Pabrik / Kantor</label>
                      <input 
                        type="text" 
                        name="officeCity" 
                        placeholder="Lokasi Pabrik / Kantor"
                        value={formData.officeCity} 
                        onChange={handleChange}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      />
                    </div>
                  </div>
                </>
              )}

              {/* School Fields */}
              {formData.role === 'school' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Resmi Sekolah</label>
                    <input 
                      type="text" 
                      name="schoolName" 
                      required 
                      placeholder="Nama Resmi Sekolah"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      value={formData.schoolName} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">School Type</label>
                      <select 
                        name="schoolType" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white"
                        value={formData.schoolType}
                        onChange={handleChange}
                      >
                        <option value="State Vocational School (SMKN)">State Vocational School (SMKN)</option>
                        <option value="Private Vocational School (SMKS)">Private Vocational School (SMKS)</option>
                        <option value="Vocational Training Center (BLK)">Vocational Training Center (BLK)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Annual EV Graduates Count</label>
                      <select 
                        name="totalGraduates" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white"
                        value={formData.totalGraduates}
                        onChange={handleChange}
                      >
                        <option value="50-100 Graduates / Year">50-100 Graduates / Year</option>
                        <option value="100-300 Graduates / Year">100-300 Graduates / Year</option>
                        <option value="300+ Graduates / Year">300+ Graduates / Year</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-2 py-2">
                <div className="w-12 h-12 bg-cyan-50 text-[#0099B8] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Review & Complete Registration</h3>
                <p className="text-xs text-slate-500">Verify your information before initializing your Spora Juara account.</p>
                
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-sm space-y-2 mt-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Account Role:</span>
                    <span className="font-bold text-slate-900 capitalize">{formData.role}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Name / Org:</span>
                    <span className="font-bold text-slate-900">{formData.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-bold text-slate-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Phone / WA:</span>
                    <span className="font-bold text-slate-900">{formData.phone || '081234567890'}</span>
                  </div>
                  {formData.role === 'student' && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">School & Major:</span>
                      <span className="font-bold text-slate-900">{formData.school} • {formData.major}</span>
                    </div>
                  )}
                  {formData.role === 'industry' && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Company & Sector:</span>
                      <span className="font-bold text-slate-900">{formData.companyName} • {formData.sector}</span>
                    </div>
                  )}
                  {formData.role === 'school' && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">School Name:</span>
                      <span className="font-bold text-slate-900">{formData.schoolName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="px-6 text-slate-700">
                Previous
              </Button>
            ) : <div />}

            <Button type="submit" variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white px-8 font-bold">
              {step === 3 ? 'Complete Registration ➔' : 'Next Step ➔'}
            </Button>
          </div>
        </form>
        )}

        <div className="mt-6 text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0099B8] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
