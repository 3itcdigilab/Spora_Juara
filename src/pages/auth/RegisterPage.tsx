import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { GraduationCap, School, Factory, CheckCircle2 } from 'lucide-react';

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
    password: '',
    confirmPassword: '',
    // Student specific
    school: 'SMKN 1 Cikarang',
    major: 'Teknik Kendaraan Ringan (Otomotif EV)',
    graduationYear: '2025',
    province: 'Jawa Barat',
    city: 'Kabupaten Bekasi',
    // Industry specific
    companyName: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (newRole: string) => {
    setSearchParams({ role: newRole });
    setFormData(prev => ({ ...prev, role: newRole }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    // Set name fallback based on role if left empty
    let finalName = formData.name.trim();
    if (!finalName) {
      if (formData.role === 'school') finalName = formData.schoolName || 'SMK Negeri 1 Cikarang';
      else if (formData.role === 'industry') finalName = formData.companyName || 'Hyundai Motor Indonesia';
      else finalName = 'Tubagus';
    }

    const payload = {
      ...formData,
      name: finalName
    };

    await register(payload);

    if (formData.role === 'school' || formData.role === 'industry') {
      navigate('/pending-verification');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-10 font-sans">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <Logo size="lg" />
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
        
        {/* Role Selector Tabs (3 Core Roles) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6">
          {[
            { id: 'student', label: 'Talent Candidate', icon: GraduationCap },
            { id: 'industry', label: 'Industry Partner', icon: Factory },
            { id: 'school', label: 'Vocational School', icon: School }
          ].map(item => {
            const Icon = item.icon;
            const isSelected = formData.role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={16} className={isSelected ? 'text-[#0099B8]' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role Header Banner */}
        <div className="mb-6 flex items-start gap-4 p-4 rounded-xl border bg-slate-50/50">
          <div className="p-3 rounded-xl bg-white shadow-sm border shrink-0" style={{ color: currentRoleMeta.color }}>
            <currentRoleMeta.icon size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentRoleMeta.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{currentRoleMeta.subtitle}</p>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0 rounded"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0099B8] z-0 rounded transition-all duration-300" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Role Profile' },
              { num: 3, label: 'Confirm' }
            ].map((item) => (
              <div key={item.num} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  step >= item.num ? 'bg-[#0099B8] text-white shadow-md' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > item.num ? '✓' : item.num}
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Account Credentials */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">Step 1: Account Credentials</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {formData.role === 'school' ? 'Coordinator / Headmaster Name' : 
                   formData.role === 'industry' ? 'Company Representative Name' : 'Full Candidate Name'}
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder={formData.role === 'school' ? 'e.g. Drs. H. Ahmad Wijaya' : formData.role === 'industry' ? 'e.g. Hendra Pratama' : 'e.g. Tubagus'}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder={formData.role === 'school' ? 'admin@smkn1cikarang.sch.id' : formData.role === 'industry' ? 'hr@hyundai.co.id' : 'tubagus@gmail.com'}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
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
                Step 2: {formData.role === 'student' ? 'Academic & Vocational Profile' : 
                        formData.role === 'industry' ? 'Company & Hiring Profile' : 'School & Curriculum Profile'}
              </h3>

              {/* Student Role Fields */}
              {formData.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vocational School (SMK)</label>
                    <select 
                      name="school" 
                      required 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      value={formData.school} 
                      onChange={handleChange}
                    >
                      <option value="SMKN 1 Cikarang">SMKN 1 Cikarang (Jawa Barat)</option>
                      <option value="SMKN 2 Karawang">SMKN 2 Karawang (Jawa Barat)</option>
                      <option value="SMKN 1 Bekasi">SMKN 1 Bekasi (Jawa Barat)</option>
                      <option value="SMKN 2 Bandung">SMKN 2 Bandung (Jawa Barat)</option>
                      <option value="SMKN 5 Surabaya">SMKN 5 Surabaya (Jawa Timur)</option>
                      <option value="Other Vocational School">Other SMK School</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Major / Vocational Stream</label>
                    <select 
                      name="major" 
                      required 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0099B8] focus:outline-none" 
                      value={formData.major} 
                      onChange={handleChange}
                    >
                      <option value="Teknik Kendaraan Ringan (Otomotif EV)">Teknik Kendaraan Ringan (Otomotif EV)</option>
                      <option value="Teknik Elektronika Industri">Teknik Elektronika Industri</option>
                      <option value="Teknik Mekatronika">Teknik Mekatronika</option>
                      <option value="Teknik Listrik & High Voltage">Teknik Listrik & High Voltage</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Year</label>
                      <select 
                        name="graduationYear" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" 
                        value={formData.graduationYear} 
                        onChange={handleChange}
                      >
                        <option value="2024">2024 (Graduated)</option>
                        <option value="2025">2025 (Final Year)</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                      <select 
                        name="province" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" 
                        value={formData.province} 
                        onChange={handleChange}
                      >
                        <option value="Jawa Barat">Jawa Barat</option>
                        <option value="DKI Jakarta">DKI Jakarta</option>
                        <option value="Jawa Tengah">Jawa Tengah</option>
                        <option value="Jawa Timur">Jawa Timur</option>
                        <option value="Banten">Banten</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Industry Role Fields */}
              {formData.role === 'industry' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company / Industry Name</label>
                    <input 
                      type="text" 
                      name="companyName" 
                      required 
                      placeholder="e.g. Hyundai Motor Manufacturing Indonesia"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8]" 
                      value={formData.companyName} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry Sector</label>
                    <select 
                      name="sector" 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" 
                      value={formData.sector} 
                      onChange={handleChange}
                    >
                      <option value="EV Battery Assembly">EV Battery Assembly & Thermal Tech</option>
                      <option value="EV Automotive Manufacturing">EV Automotive Manufacturing</option>
                      <option value="Charging Network Infrastructure">Charging Network Infrastructure</option>
                      <option value="EV Fleet & Maintenance">EV Fleet & Maintenance Operations</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Office Location</label>
                      <input 
                        type="text" 
                        name="officeCity" 
                        placeholder="e.g. Cikarang, Jawa Barat"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" 
                        value={formData.officeCity} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Annual Hiring Target</label>
                      <select 
                        name="hiringTarget" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" 
                        value={formData.hiringTarget} 
                        onChange={handleChange}
                      >
                        <option value="1-10 Graduates / Year">1 - 10 Graduates / Year</option>
                        <option value="10-50 Graduates / Year">10 - 50 Graduates / Year</option>
                        <option value="50+ Graduates / Year">50+ Graduates / Year</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* School Role Fields */}
              {formData.role === 'school' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                    <input 
                      type="text" 
                      name="schoolName" 
                      required 
                      placeholder="e.g. SMKN 1 Cikarang"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099B8]" 
                      value={formData.schoolName} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">School Status</label>
                      <select 
                        name="schoolType" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" 
                        value={formData.schoolType} 
                        onChange={handleChange}
                      >
                        <option value="State Vocational School (SMKN)">State School (SMKN)</option>
                        <option value="Private Vocational School (SMKS)">Private School (SMKS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Annual Graduates Cohort</label>
                      <select 
                        name="totalGraduates" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" 
                        value={formData.totalGraduates} 
                        onChange={handleChange}
                      >
                        <option value="50-100 Graduates / Year">50 - 100 Graduates / Year</option>
                        <option value="100-300 Graduates / Year">100 - 300 Graduates / Year</option>
                        <option value="300+ Graduates / Year">300+ Graduates / Year</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: Confirmation Summary */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Review & Complete Registration</h3>
              <p className="text-xs text-slate-500">Verify your information before initializing your Spora Juara account.</p>
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-sm space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Selected Role:</span>
                  <span className="font-bold capitalize text-[#0099B8]">{formData.role}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Full Name / Entity:</span>
                  <span className="font-semibold text-slate-800">{formData.name || 'Tubagus'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="font-mono text-slate-800">{formData.email}</span>
                </div>
                {formData.role === 'student' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">School & Stream:</span>
                    <span className="font-semibold text-slate-800">{formData.school}</span>
                  </div>
                )}
                {formData.role === 'industry' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Industry Company:</span>
                    <span className="font-semibold text-slate-800">{formData.companyName || 'Hyundai Motor'}</span>
                  </div>
                )}
                {formData.role === 'school' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registered School:</span>
                    <span className="font-semibold text-slate-800">{formData.schoolName || 'SMKN 1 Cikarang'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
            ) : (
              <div />
            )}
            <Button type="submit" variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]">
              {step < 3 ? 'Next Step' : 'Initialize Account'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#0099B8] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
