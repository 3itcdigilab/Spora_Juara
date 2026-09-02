import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { useToast } from '../../components/ui/Toast';
import { GraduationCap, School, Factory, CheckCircle2, Phone, Mail, User, Lock, Sparkles, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { StudentOnboardingAssessment } from '../../components/assessment/StudentOnboardingAssessment';
import { localDB } from '../../services/db';
import { mockSchools } from '../../data/schools';
import { openRouterService } from '../../services/OpenRouterAI';
import { getAll } from '../../services/firestoreSync';

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
  const { showToast } = useToast();
  
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
    school: '',
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

  // Resolve matched school strictly from the entered token (Anti-impersonation mechanism)
  const matchedSchool = useMemo(() => {
    const inputToken = formData.schoolToken.trim().toUpperCase();
    if (!inputToken) return null;
    
    // Check mockSchools
    const fromMock = mockSchools.find(s => s.registrationToken?.toUpperCase() === inputToken);
    if (fromMock) return fromMock;

    // Check dynamic schools created by admin in users db
    try {
      const schoolUsers = getAll('users').filter((u: any) => u.role === 'school');
      const fromUsers = schoolUsers.find((u: any) => 
        (u.registrationToken && u.registrationToken.toUpperCase() === inputToken) || 
        (u.schoolToken && u.schoolToken.toUpperCase() === inputToken)
      );
      if (fromUsers) {
        return {
          id: fromUsers.id,
          name: fromUsers.name,
          province: fromUsers.province || 'Jawa Barat',
          city: fromUsers.city || 'Cikarang',
          registrationToken: inputToken
        };
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }, [formData.schoolToken]);

  const isTokenMatch = Boolean(matchedSchool);

  // Automatically bind school name, province, and city when token matches
  useEffect(() => {
    if (matchedSchool) {
      setFormData(prev => ({
        ...prev,
        school: matchedSchool.name,
        province: (matchedSchool as any).province || prev.province,
        city: matchedSchool.city || prev.city
      }));
    } else if (formData.role === 'student') {
      setFormData(prev => ({
        ...prev,
        school: ''
      }));
    }
  }, [matchedSchool, formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (newRole: string) => {
    setSearchParams({ role: newRole });
    setFormData(prev => ({ ...prev, role: newRole }));
  };

  const nextStep = () => {
    if (step === 2 && formData.role === 'student' && !isTokenMatch) {
      showToast('Wajib memasukkan Token Registrasi Sekolah yang valid untuk memverifikasi SMK asal Anda!', 'error');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleStudentCompleteWithAssessment = async (result: any) => {
    let finalName = formData.name.trim() || 'Kandidat Siswa';
    const finalSchool = matchedSchool?.name || formData.school || 'SMKN Terverifikasi';

    const payload = {
      ...formData,
      name: finalName,
      school: finalSchool,
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
        schoolName: finalSchool,
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
    const finalSchool = matchedSchool?.name || formData.school || 'SMKN Terverifikasi';

    const payload = {
      ...formData,
      name: finalName,
      school: finalSchool,
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
      school: matchedSchool?.name || formData.school,
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
                  {/* PURE TOKEN-BASED SCHOOL IDENTIFICATION (ANTI-FRAUD / ANTI-PEMALSUAN) */}
                  <div className="p-5 bg-gradient-to-r from-slate-50 via-cyan-50/40 to-blue-50/30 rounded-2xl border border-cyan-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Key size={16} className="text-[#0099B8]" /> Token Registrasi Sekolah (Wajib Diisi)
                      </label>
                      {isTokenMatch ? (
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs animate-fadeIn">
                          <ShieldCheck size={14} /> Terverifikasi Asli ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                          Anti-Pemalsuan Institusi
                        </span>
                      )}
                    </div>

                    <input 
                      type="text" 
                      name="schoolToken" 
                      placeholder="Masukkan Kode Token Resmi Sekolah Anda (contoh: SMK1CIK-2025)"
                      className={`w-full p-3 border rounded-xl text-sm font-mono uppercase font-black tracking-widest focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-white shadow-inner transition ${
                        isTokenMatch ? 'border-emerald-500 ring-2 ring-emerald-200 text-emerald-900' : 'border-slate-300 text-slate-800'
                      }`}
                      value={formData.schoolToken} 
                      onChange={handleChange} 
                      required
                    />

                    {/* Live School Recognition Feedback Card */}
                    {isTokenMatch && matchedSchool ? (
                      <div className="p-3.5 bg-white rounded-xl border border-emerald-300 shadow-sm flex items-center gap-3.5 animate-fadeIn">
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                          <School size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1">
                            <ShieldCheck size={12} /> Institusi Mitra Resmi Terdeteksi
                          </p>
                          <h4 className="text-sm font-extrabold text-slate-900">{matchedSchool.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{matchedSchool.city}, {(matchedSchool as any).province || 'Indonesia'}</p>
                        </div>
                      </div>
                    ) : formData.schoolToken.trim().length > 0 ? (
                      <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2 animate-fadeIn">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>Token tidak valid atau belum terdaftar di sistem. Minta kode token resmi dari guru atau koordinator BKK sekolah Anda.</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        💡 <strong>Sistem Validasi Anti-Pemalsuan</strong>: Anda tidak perlu memilih nama sekolah secara manual. Cukup masukkan token resmi dari sekolah Anda, dan sistem akan mengidentifikasi SMK asal secara otomatis.
                      </p>
                    )}
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
                <h3 className="text-lg font-bold text-slate-900">Konfirmasi Pendaftaran</h3>
                <p className="text-xs text-slate-500">Periksa kembali data sebelum menyelesaikan pendaftaran akun Anda.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-slate-500">Role / Peran:</span>
                  <span className="font-bold text-slate-900 uppercase">{formData.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-slate-500">Nama:</span>
                  <span className="font-bold text-slate-900">{formData.name || 'Kandidat'}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-900">{formData.email}</span>
                </div>
                {formData.role === 'student' && (
                  <>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-500">NISN:</span>
                      <span className="font-bold font-mono text-[#0099B8]">{formData.nisn}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-500">SMK Asal (Auto-Verified):</span>
                      <span className="font-bold text-emerald-700">{matchedSchool?.name || formData.school}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-500">Jurusan:</span>
                      <span className="font-bold text-slate-900">{formData.major}</span>
                    </div>
                  </>
                )}
                {formData.role === 'industry' && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-500">Perusahaan:</span>
                    <span className="font-bold text-slate-900">{formData.companyName}</span>
                  </div>
                )}
                {formData.role === 'school' && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-500">Nama Sekolah:</span>
                    <span className="font-bold text-slate-900">{formData.schoolName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Action Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="text-xs font-semibold">
                Back
              </Button>
            ) : <div></div>}

            <Button 
              type="submit" 
              variant="primary" 
              className="bg-[#0099B8] hover:bg-[#007A93] text-white text-xs font-bold px-6 py-2.5"
            >
              {step === 3 ? (formData.role === 'student' ? 'Mulai Asesmen Masuk' : 'Daftar Sekarang') : 'Next Step →'}
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
