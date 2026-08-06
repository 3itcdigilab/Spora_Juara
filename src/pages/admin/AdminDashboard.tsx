import React, { useState } from 'react';
import { Link } from 'react-router';
import { KPICard } from '../../components/charts/KPICard';
import { PageHeader } from '../../components/layout/PageHeader';
import { Users, School, Building, TrendingUp, ShieldAlert, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockProvinces } from '../../data/provinces';

export const AdminDashboard: React.FC = () => {
  const rawUsers = localStorage.getItem('spora_users');
  const users = rawUsers ? JSON.parse(rawUsers) : [];
  const pendingUsers = users.filter((u: any) => u.status === 'pending');

  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredProvinces = selectedRegion === 'All'
    ? mockProvinces
    : mockProvinces.filter(p => p.region === selectedRegion);

  const maxStudents = Math.max(...mockProvinces.map(p => p.totalStudents));

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0099B8] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <svg className="w-96 h-96 text-white" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5 L58 38 L92 25 L68 50 L92 75 L58 62 L50 95 L42 62 L8 75 L32 50 L8 25 L42 38 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
              <ShieldAlert size={14} /> National Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Spora Juara Admin</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Monitor Indonesia's national EV vocational ecosystem, AI scoring models, and partner verification pipelines.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/admin/users">
              <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white border-0">
                User Verification <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Action Banner */}
      {pendingUsers.length > 0 && (
        <Card className="p-5 border-l-4 border-amber-500 bg-amber-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <Clock size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Mitra Menunggu Verifikasi ({pendingUsers.length})</h3>
              <p className="text-xs text-slate-600">Ada {pendingUsers.length} pendaftaran mitra Industri/Sekolah yang memerlukan persetujuan Admin.</p>
            </div>
          </div>
          <Link to="/admin/users">
            <Button size="sm" variant="primary" className="bg-amber-600 hover:bg-amber-700 text-white">
              Tinjau & Verifikasi NOW
            </Button>
          </Link>
        </Card>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Candidates" value="12,500+" icon={<Users className="w-5 h-5 text-[#0099B8]" />} trend="+5%" />
        <KPICard title="Partner Schools" value="150+" icon={<School className="w-5 h-5 text-emerald-600" />} trend="+2" />
        <KPICard title="Industry Partners" value="45+" icon={<Building className="w-5 h-5 text-violet-600" />} trend="+5" />
        <KPICard title="Employment Rate" value="87%" icon={<TrendingUp className="w-5 h-5 text-blue-600" />} trend="+1%" />
      </div>

      {/* Updated National Talent Density Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#0099B8]" /> National Talent Density Map (Indonesian Provinces)
              </h3>
              <p className="text-xs text-slate-500">Live distribution & candidate density metrics across Indonesian provinces.</p>
            </div>
            
            {/* Region Selector */}
            <div className="flex gap-1.5 text-xs">
              {['All', 'Jawa', 'Sumatera', 'Sulawesi', 'Kalimantan'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    selectedRegion === r ? 'bg-[#0099B8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Density Visual Bars */}
          <div className="space-y-3.5">
            {filteredProvinces.map((prov) => {
              const pct = Math.round((prov.totalStudents / maxStudents) * 100);
              return (
                <div key={prov.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0099B8]"></span>
                      {prov.name} <span className="text-[10px] text-slate-400 font-normal">({prov.region})</span>
                    </span>
                    <span className="text-slate-700 font-mono">
                      <strong className="text-[#0099B8]">{prov.totalStudents.toLocaleString()}</strong> Kandidat ({prov.totalSchools} SMK • {prov.totalIndustries} Industri)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-[#0099B8] to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Control & Region Summary */}
        <Card className="p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3">Ecosystem Control Center</h3>
          
          <div className="space-y-3">
            <Link to="/admin/ai-rules" className="block p-3 rounded-xl border border-slate-100 hover:border-[#0099B8] hover:bg-cyan-50/50 transition-colors">
              <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-violet-600" /> Configure AI Matching Rules
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Adjust 7-dimension Talent Score weights.</p>
            </Link>

            <Link to="/admin/users" className="block p-3 rounded-xl border border-slate-100 hover:border-[#0099B8] hover:bg-cyan-50/50 transition-colors">
              <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Users size={14} className="text-[#0099B8]" /> User & Access Directory (CRUD)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Manage accounts and partner verifications.</p>
            </Link>

            <Link to="/admin/reports" className="block p-3 rounded-xl border border-slate-100 hover:border-[#0099B8] hover:bg-cyan-50/50 transition-colors">
              <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-600" /> Generate National Ecosystem Report
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Export PDF/Excel metrics per province.</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
