import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (!res.success) {
      setError('Akun belum terdaftar atau password salah.');
      return;
    }

    if (res.status === 'pending') {
      navigate('/pending-verification');
      return;
    }

    if (res.role === 'admin' || email.toLowerCase().includes('admin') || email.toLowerCase().startsWith('sporaadmin')) {
      navigate('/admin/dashboard');
    } else if (res.role === 'school' || email.toLowerCase().includes('school')) {
      navigate('/school/dashboard');
    } else if (res.role === 'industry' || email.toLowerCase().includes('industry')) {
      navigate('/industry/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-[#0099B8]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="lg" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Juara</h1>
          <p className="text-slate-500 text-sm">Sign in to your Spora Juara account</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              Email Address / NISN (10 Digit Siswa)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0099B8] focus:border-[#0099B8] bg-white shadow-sm sm:text-sm"
                placeholder="sporaadmin@spora.id atau NISN: 0071234501"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0099B8] focus:border-[#0099B8] bg-white shadow-sm sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#0099B8] focus:ring-[#0099B8] border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-[#0099B8] hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full justify-center text-base py-2.5 bg-[#0099B8] hover:bg-[#007A93]">
              <LogIn className="w-5 h-5 mr-2" /> Sign In
            </Button>
          </div>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
          <p className="font-bold text-slate-700 flex items-center gap-1">🔑 Quick Demo Accounts (Klik untuk Isi):</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button 
              type="button" 
              onClick={() => { setEmail('sporaadmin@spora.id'); setPassword('sporagreenenergy'); }}
              className="px-2 py-1 bg-white border rounded text-[11px] font-semibold text-slate-700 hover:bg-cyan-50 hover:text-[#0099B8]"
            >
              Admin
            </button>
            <button 
              type="button" 
              onClick={() => { setEmail('0071234501'); setPassword('123'); }}
              className="px-2 py-1 bg-white border rounded text-[11px] font-semibold text-slate-700 hover:bg-cyan-50 hover:text-[#0099B8]"
            >
              Siswa (via NISN: 0071234501)
            </button>
            <button 
              type="button" 
              onClick={() => { setEmail('smkn1cikarang@spora.id'); setPassword('123'); }}
              className="px-2 py-1 bg-white border rounded text-[11px] font-semibold text-slate-700 hover:bg-cyan-50 hover:text-[#0099B8]"
            >
              SMKN 1 Cikarang
            </button>
            <button 
              type="button" 
              onClick={() => { setEmail('hyundai@spora.id'); setPassword('123'); }}
              className="px-2 py-1 bg-white border rounded text-[11px] font-semibold text-slate-700 hover:bg-cyan-50 hover:text-[#0099B8]"
            >
              Hyundai EV
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm border-t pt-4">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link to="/role-selection" className="font-semibold text-[#0099B8] hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
