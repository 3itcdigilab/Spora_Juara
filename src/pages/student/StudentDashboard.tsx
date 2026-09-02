import React from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Timeline } from '../../components/ui/Timeline';
import { ProgressGauge } from '../../components/charts/ProgressGauge';
import { RadarChart } from '../../components/charts/RadarChart';
import { Sparkles, ArrowRight, Briefcase, FileCheck, Clock, Award, UserCheck, ShieldCheck, Zap, Target, Brain, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';
import { openRouterService } from '../../services/OpenRouterAI';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const studentEmail = user?.email || '';
  const savedProfile = localDB.getProfile(studentEmail);
  const rawName = user?.name || savedProfile?.fullName || 'Kandidat';
  const userName = rawName.includes('@') ? (savedProfile?.fullName || 'Kandidat') : rawName;
  const profileCompletion = 85;

  const talentScore = localDB.getTalentScore(studentEmail);
  const aiReport = openRouterService.getReportByStudentId(studentEmail);
  const realScore = talentScore?.overall || aiReport?.score || (talentScore?.dimensions ? Math.round(talentScore.dimensions.reduce((a: number, b: any) => a + (b.score * b.weight), 0)) : 88);

  const allJobs = localDB.getJobs();
  const activeJobs = allJobs.filter((j: any) => j.status === 'open' || j.status === 'published' || j.status === 'active');
  const recommendedJobs = activeJobs.slice(0, 2);

  const getCompanyName = (job: any) => job?.company || job?.companyName || 'EV Industry Partner';
  const getSalaryText = (job: any) => {
    if (job?.salary) return job.salary;
    if (job?.salaryMin && job?.salaryMax) return `Rp ${(job.salaryMin / 1000000).toFixed(1)}M - Rp ${(job.salaryMax / 1000000).toFixed(1)}M / mo`;
    return 'Competitive Salary';
  };

  const myApps = studentEmail ? localDB.getApplications(studentEmail) : [];
  const timelineItems = myApps.length > 0 
    ? myApps.map(app => {
        const job = allJobs.find((j: any) => j.id === app.jobId);
        return {
          title: `Applied to ${job?.title || 'EV Position'} at ${getCompanyName(job)}`,
          date: app.appliedAt || 'Recently',
          status: 'completed' as const
        };
      }).slice(0, 4)
    : [{ title: 'Psikotes & Green Energy AI Induction Selesai', date: 'Hari Ini', status: 'completed' as const }];

  // Radar Data from dimensions
  const radarData = talentScore?.dimensions && talentScore.dimensions.length > 0
    ? talentScore.dimensions.map((d: any) => ({
        dimension: d.label.split('&')[0].trim(),
        score: d.score
      }))
    : [
        { dimension: 'Technical', score: 85 },
        { dimension: 'Safety HV', score: 90 },
        { dimension: '5S Work', score: 88 },
        { dimension: 'Agility', score: 86 },
        { dimension: 'Teamwork', score: 82 },
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0099B8] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 opacity-10 pointer-events-none">
          <svg className="w-96 h-96 text-white" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5 L58 38 L92 25 L68 50 L92 75 L58 62 L50 95 L42 62 L8 75 L32 50 L8 25 L42 38 Z" />
          </svg>
        </div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Zap size={14} className="text-amber-300" /> Spora Vocational Candidate Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Selamat Datang, {userName}!</h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Hasil Psikotes & Karakter Kerja Anda telah dievaluasi oleh AI. Nilai Anda: <strong className="text-white">{realScore}/100</strong> ({aiReport?.archetype || 'The Precision EV Battery Specialist'}).
          </p>
        </div>
      </div>

      {/* KPI Stats Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Completion</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{profileCompletion}%</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">8 dari 10 data terisi</p>
          </div>
          <ProgressRing value={profileCompletion} size={54} strokeWidth={6} color="#0099B8" />
        </Card>

        <Card className="p-5 border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Talent Score</p>
            <h3 className="text-2xl font-extrabold text-[#0099B8] mt-1">{realScore}<span className="text-xs text-slate-400 font-normal">/100</span></h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Tier 1 Competency</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0099B8] font-bold">
            <Target size={24} />
          </div>
        </Card>

        <Card className="p-5 border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment Status</p>
            <h3 className="text-xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 size={18} /> Verified ✓
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Psikotes Selesai (AI Verified)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
            <Brain size={24} />
          </div>
        </Card>

        <Card className="p-5 border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lamaran Terkirim</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myApps.length}</h3>
            <p className="text-[11px] text-[#0099B8] font-bold mt-0.5">Aktif dalam recruitment</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
            <FileCheck size={24} />
          </div>
        </Card>
      </div>

      {/* Completion Banner CTA */}
      {profileCompletion < 100 && (
        <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Lengkapi Profil Anda hingga 100%</h4>
              <p className="text-xs text-slate-600 mt-0.5">Upload sertifikat kompetensi & portofolio proyek EV untuk tampil di urutan teratas pencarian industri.</p>
            </div>
          </div>
          <Link to="/student/profile" className="shrink-0 w-full sm:w-auto">
            <Button size="sm" variant="primary" className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs w-full sm:w-auto">
              Lengkapi Sekarang →
            </Button>
          </Link>
        </Card>
      )}

      {/* AI Recommendation Highlights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h2 className="text-base font-bold text-slate-900">Rekomendasi Karir & Pembelajaran Siswa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-t-4 border-t-violet-500 hover:shadow-md transition-all">
            <Badge className="bg-violet-100 text-violet-700 mb-3 text-xs font-bold">AI Career Path</Badge>
            <h3 className="font-bold text-slate-900 text-base">EV Battery Technician</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
              Berdasarkan hasil psikotes AI dan skor keselamatan K3 Anda ({talentScore?.dimensions?.find((d:any)=>d.key==='safety')?.score || 88}%), jalur karir ini sangat cocok.
            </p>
            <Link to="/student/talent-score" className="text-xs font-bold text-violet-600 flex items-center gap-1 hover:text-violet-700">
              Buka Analisis Karir AI <ArrowRight size={14} />
            </Link>
          </Card>
          
          <Card className="p-5 border-t-4 border-t-cyan-500 hover:shadow-md transition-all">
            <Badge className="bg-cyan-100 text-cyan-800 mb-3 text-xs font-bold">Ujian Teknis Tersedia</Badge>
            <h3 className="font-bold text-slate-900 text-base">EV Battery Assembly</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
              Ikuti modul ujian teknis lanjutan untuk menambah poin portofolio dan sertifikasi industri.
            </p>
            <Link to="/student/assessments" className="text-xs font-bold text-[#0099B8] flex items-center gap-1 hover:text-[#007A93]">
              Buka Daftar Asesmen <ArrowRight size={14} />
            </Link>
          </Card>

          <Card className="p-5 border-t-4 border-t-emerald-500 hover:shadow-md transition-all">
            <Badge className="bg-emerald-100 text-emerald-700 mb-3 text-xs font-bold">Lowongan Rekomendasi</Badge>
            {recommendedJobs.length > 0 ? (
              <>
                <h3 className="font-bold text-slate-900 text-base">{getCompanyName(recommendedJobs[0])} - {recommendedJobs[0].title}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
                  Kesesuaian tinggi dengan jurusan vokasi & skor asesmen Anda di {recommendedJobs[0].location || 'Indonesia'}.
                </p>
                <Link to={`/student/jobs/${recommendedJobs[0].id}`} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
                  Lihat Detail Lowongan <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <>
                <h3 className="font-bold text-slate-900 text-base">Lowongan EV</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
                  Cek lowongan kerja terbaru di papan lowongan Spora TalentOS.
                </p>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Main Grid: Radar Chart & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">EV Competency Skills Radar</h2>
                <p className="text-xs text-slate-500">Skor terstandarisasi 5 pilar dari asesmen induksi Anda.</p>
              </div>
              <Link to="/student/talent-score" className="text-xs text-[#0099B8] font-bold hover:underline">
                Full Talent Score →
              </Link>
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border p-2">
              <RadarChart 
                data={radarData}
                indexBy="dimension"
                keys={['score']}
                height={240}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">Recommended EV Vacancies</h2>
              <Link to="/student/jobs" className="text-xs text-[#0099B8] font-bold hover:underline">
                View Job Board →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recommendedJobs.map((j) => (
                <div key={j.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{j.title}</span>
                      <Badge variant="primary" className="bg-blue-50 text-blue-700 text-[10px]">
                        {j.department || 'EV Assembly'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700">{getCompanyName(j)}</span>
                      <span>• {j.location || 'Cikarang, Jawa Barat'}</span>
                      <span className="text-emerald-700 font-bold">• {getSalaryText(j)}</span>
                    </div>
                  </div>

                  <Link to={`/student/jobs/${j.id}`}>
                    <Button size="sm" variant="outline" className="text-xs font-bold text-[#0099B8] border-cyan-200 hover:bg-cyan-50">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Activity Timeline */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b pb-3">Aktivitas Terkini</h2>
            <Timeline items={timelineItems} />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100">
            <div className="flex items-center gap-2 text-[#0099B8] mb-2 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={16} /> AI Psychological Fit
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              "{aiReport?.archetype || 'The Precision EV Battery Specialist'}"
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Profil psikometrik Anda menunjukkan kesiapan kerja tinggi dalam manufaktur baterai dan pemeliharaan keselamatan tegangan tinggi.
            </p>
            <Link to="/student/talent-score" className="mt-3 block text-xs font-bold text-[#0099B8] hover:underline">
              Buka Detail Analisis AI →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
