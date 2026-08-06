import React from 'react';
import { Link } from 'react-router';
import { KPICard } from '../../components/charts/KPICard';
import { LineChart } from '../../components/charts/LineChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { Users, TrendingUp, Award, CheckCircle, Activity, School, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Feedback {
  company: string;
  rating: number;
  comment: string;
}

export const SchoolDashboard: React.FC = () => {
  const { user } = useAuth();
  const schoolName = user?.name || 'SMK Negeri 1 Cikarang';
  // Mock fetching feedback or just leave empty if not present.
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
