import React from 'react';
import { Link } from 'react-router';
import { KPICard } from '../../components/charts/KPICard';
import { LineChart } from '../../components/charts/LineChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { Users, TrendingUp, Award, CheckCircle, Activity, School, MessageSquare, AlertTriangle, ArrowRight, Key, Share2, Copy, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockSchools } from '../../data/schools';
import { useToast } from '../../components/ui/Toast';

interface Feedback {
  company: string;
  rating: number;
  comment: string;
}

export const SchoolDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const schoolName = user?.name || 'SMKN 1 Cikarang Pusat';
  const matchingSchool = mockSchools.find(s => s.name.toLowerCase() === schoolName.toLowerCase()) || mockSchools[0];
  const schoolToken = user?.schoolToken || matchingSchool?.registrationToken || 'SMK1CIK-2025';

  const registrationUrl = `${window.location.origin}/register?role=student`;
  const waShareText = encodeURIComponent(
    `Halo Siswa/i ${schoolName}!\n\nSilakan lengkapi pendaftaran dan ikuti asesmen bakat kendaraan listrik (EV) di platform resmi Spora Juara Talent Pool:\n🔗 ${registrationUrl}\n\n🔑 Gunakan Kode Token Sekolah: *${schoolToken}* saat mendaftar agar akun Anda otomatis terverifikasi oleh sekolah.\n\nSalam, BKK ${schoolName}`
  );

  const handleCopyToken = () => {
    navigator.clipboard.writeText(schoolToken);
    showToast(`Token Sekolah "${schoolToken}" berhasil disalin!`, 'success');
  };

  const feedbacks: Feedback[] = [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <School size={320} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <School size={14} /> Vocational School Command Portal (SMK BKK)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{schoolName}</h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Track student EV competency benchmarks, industry feedback on graduates, and graduate employment placement.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/school/students">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs font-bold">
                <Users className="w-4 h-4 mr-1.5" /> Student Roster
              </Button>
            </Link>
            <Link to="/school/feedback">
              <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white border-0 text-xs font-bold">
                <MessageSquare className="w-4 h-4 mr-1.5" /> Industry Feedback
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Official School Registration Token Widget (Anti-Pemalsuan Siswa) */}
      <div className="bg-gradient-to-r from-cyan-900 via-[#005f73] to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-5 border border-cyan-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
            <Key className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Token Resmi Pendaftaran Siswa</h3>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck size={11} /> Anti-Impersonation Active
              </span>
            </div>
            <p className="text-xs text-cyan-100/80 mt-0.5">
              Bagikan token ini ke siswa agar otomatis terdaftar dan terverifikasi di bawah naungan <strong>{schoolName}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="bg-black/30 border border-cyan-400/40 px-4 py-2 rounded-xl font-mono text-lg font-black text-cyan-300 tracking-widest flex items-center gap-2 shadow-inner">
            {schoolToken}
          </div>
          <Button 
            onClick={handleCopyToken}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5"
          >
            <Copy size={14} /> Salin Token
          </Button>
          <a 
            href={`https://wa.me/?text=${waShareText}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <Share2 size={14} /> Share WhatsApp
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Enrolled Students" value="1,245" icon={<Users className="w-5 h-5 text-[#0099B8]" />} trend="+5%" />
        <KPICard title="Graduates This Year" value="320" icon={<Award className="w-5 h-5 text-emerald-600" />} trend="+12%" />
        <KPICard title="Graduate Placement Rate" value="84%" icon={<TrendingUp className="w-5 h-5 text-blue-600" />} trend="+3%" />
        <KPICard title="Avg School Talent Score" value="78/100" icon={<Activity className="w-5 h-5 text-violet-600" />} trend="+2 points" />
        <KPICard title="EV Competencies Passed" value="890" icon={<CheckCircle className="w-5 h-5 text-cyan-600" />} trend="+15%" />
      </div>

      {/* Main Content Grid: Placement Trend & Curriculum Skill Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Graduate Employment Placement Rate</h3>
              <p className="text-xs text-slate-500">Cohort placement trend across EV automotive partners.</p>
            </div>
            <Link to="/school/placement" className="text-xs text-[#0099B8] font-bold hover:underline">
              Placement Details →
            </Link>
          </div>
          <div className="h-64">
            <LineChart data={[{ id: 'Placement %', data: [{ x: 'Jan', y: 70 }, { x: 'Mar', y: 74 }, { x: 'Jun', y: 80 }, { x: 'Dec', y: 84 }] }]} />
          </div>
        </Card>

        {/* Industry Feedback Highlights */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-[#0099B8]" /> Industry Feedback
            </h3>
            <Link to="/school/feedback" className="text-xs text-[#0099B8] font-bold hover:underline">
              All Feedback →
            </Link>
          </div>

          <div className="space-y-3">
            {feedbacks.length === 0 ? (
              <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs">No industry feedback available yet.</p>
              </div>
            ) : feedbacks.map((fb: any, i: number) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900">{fb.company}</span>
                  <span className="text-xs font-bold text-amber-600">★ {fb.rating}</span>
                </div>
                <p className="text-xs text-slate-600 italic">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Curriculum Skill Gap Recommendations */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Curriculum Skill Gap Recommendations</h3>
              <p className="text-xs text-slate-500">Skills requested by EV industries to be emphasized in SMK curriculum.</p>
            </div>
          </div>
          <Link to="/school/curriculum" className="text-xs text-[#0099B8] font-bold hover:underline">
            Curriculum Module →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <Badge className="bg-amber-100 text-amber-800 text-xs">High Priority Gap</Badge>
            <h4 className="font-bold text-sm text-slate-900">High Voltage Safety (HV Safety 1000V)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Industri membutuhkan penambahan 10 jam praktikum standar APD Listrik Tegangan Tinggi.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/50 space-y-2">
            <Badge className="bg-cyan-100 text-cyan-800 text-xs">Medium Priority Gap</Badge>
            <h4 className="font-bold text-sm text-slate-900">BMS Diagnostic Tools</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pengenalan software diagnostik Battery Management System untuk pembacaan fault code.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <Badge className="bg-emerald-100 text-emerald-800 text-xs">On Benchmark</Badge>
            <h4 className="font-bold text-sm text-slate-900">EV Motor Winding & Assembly</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kompetensi penggulungan dinamo dan perakitan motor listrik siswa sudah memenuhi standar industri.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
