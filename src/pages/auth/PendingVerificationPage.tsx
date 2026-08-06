import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Clock, CheckCircle2, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

export const PendingVerificationPage: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isApproved = user?.status === 'active';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {isApproved ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Akun Terverifikasi!</h1>
            <p className="text-slate-600 text-sm">Selamat, akun {role === 'school' ? 'Sekolah' : 'Industri'} Anda telah disetujui oleh Admin. Anda sekarang dapat mengakses dashboard penuh.</p>
            <Button 
              variant="primary" 
              className="w-full bg-[#0099B8] hover:bg-[#007A93]"
              onClick={() => navigate(role === 'school' ? '/school/dashboard' : '/industry/dashboard')}
            >
              Masuk ke Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Clock size={36} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Menunggu Verifikasi Admin</h1>
              <p className="text-slate-600 text-xs leading-relaxed">
                Pendaftaran akun mitra <strong className="text-slate-900">{user?.name || 'Mitra'}</strong> ({user?.email}) telah diterima dan sedang dalam proses peninjauan oleh Administrator Spora Talent.
              </p>
              <p className="text-slate-500 text-[11px] pt-1">
                Silakan hubungi administrator tim Spora jika memerlukan bantuan persetujuan cepat.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh Status Verifikasi
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-center text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" /> Logout / Keluar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
