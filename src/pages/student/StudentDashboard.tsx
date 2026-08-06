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
import { Sparkles, ArrowRight, Briefcase, FileCheck, Clock, Award, UserCheck, ShieldCheck, Zap, Target } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const savedProfile = localDB.getProfile(user?.email || '');
  const rawName = user?.name || savedProfile?.fullName || 'Student';
  const userName = rawName.includes('@') ? (savedProfile?.fullName || 'Student') : rawName;
  const profileCompletion = 85;

  const allJobs = localDB.getJobs();
  const activeJobs = allJobs.filter((j: any) => j.status === 'open' || j.status === 'published' || j.status === 'active');
  const recommendedJobs = activeJobs.slice(0, 2);

  const getCompanyName = (job: any) => job?.company || job?.companyName || 'EV Industry Partner';
  const getSalaryText = (job: any) => {
    if (job?.salary) return job.salary;
    if (job?.salaryMin && job?.salaryMax) return `Rp ${(job.salaryMin / 1000000).toFixed(1)}M - Rp ${(job.salaryMax / 1000000).toFixed(1)}M / mo`;
    return 'Competitive Salary';
  };

  const myApps = user?.email ? localDB.getApplications(user.email) : [];
  const timelineItems = myApps.length > 0 
    ? myApps.map(app => {
        const job = allJobs.find((j: any) => j.id === app.jobId);
        return {
          title: `Applied to ${job?.title || 'EV Position'} at ${getCompanyName(job)}`,
          date: app.appliedAt || 'Recently',
          status: 'completed' as const
        };
      }).slice(0, 4)
    : [{ title: 'Joined Spora TalentOS', date: 'Recently', status: 'completed' as const }];

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
          <p className="text-slate-300 text-xs sm:text-sm">
            Pantau skor kompetensi vokasi EV 7-dimensi Anda, ikuti asesmen teknis & psikotes, dan dapatkan panggilan kerja langsung dari Industri EV Indonesia.
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Talent Score</p>
            <h3 className="text-2xl font-extrabold text-[#0099B8] mt-1">88<span className="text-xs text-slate-400 font-normal">/100</span></h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Tier 1 Competency</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0099B8] font-bold">
            <Target size={24} />
          </div>
        </Card>

        <Card className="p-5 border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment Status</p>
            <h3 className="text-xl font-extrabold text-emerald-600 mt-1">Verified ✓</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Psychometric & Technical Done</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
            <ShieldCheck size={24} />
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
            <Badge className="bg-violet-100 text-violet-700 mb-3 text-xs">Career Path</Badge>
            <h3 className="font-bold text-slate-900 text-base">EV Battery Technician</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
              Based on your mechanical aptitude and competency scores, this path aligns with your specialization.
            </p>
            <Link to="/student/talent-score" className="text-xs font-bold text-violet-600 flex items-center gap-1 hover:text-violet-700">
              View Path <ArrowRight size={14} />
            </Link>
          </Card>
          
          <Card className="p-5 border-t-4 border-t-cyan-500 hover:shadow-md transition-all">
            <Badge className="bg-cyan-100 text-cyan-800 mb-3 text-xs">Learning Module</Badge>
            <h3 className="font-bold text-slate-900 text-base">Safety Protocols 101</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
              Complete this module to boost your High Voltage Safety score by up to 15 points.
            </p>
            <Link to="/student/talent-score" className="text-xs font-bold text-[#0099B8] flex items-center gap-1 hover:text-[#007A93]">
              Start Course <ArrowRight size={14} />
            </Link>
          </Card>

          <Card className="p-5 border-t-4 border-t-emerald-500 hover:shadow-md transition-all">
            <Badge className="bg-emerald-100 text-emerald-700 mb-3 text-xs">Recommended Job</Badge>
            {recommendedJobs.length > 0 ? (
              <>
                <h3 className="font-bold text-slate-900 text-base">{getCompanyName(recommendedJobs[0])} - {recommendedJobs[0].title}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
                  High alignment with your EV Assembly specialization in {recommendedJobs[0].location || 'Indonesia'}.
                </p>
                <Link to={`/student/jobs/${recommendedJobs[0].id}`} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
                  View Job Detail <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <>
                <h3 className="font-bold text-slate-900 text-base">No Jobs Found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
                  There are no recommended jobs available at this time. Check back later.
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
                <p className="text-xs text-slate-500">Your standardized score across 5 key industry dimensions.</p>
              </div>
              <Link to="/student/talent-score" className="text-xs text-[#0099B8] font-bold hover:underline">
                Full Talent Score →
              </Link>
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border p-2">
              <RadarChart 
                data={[
                  { dimension: 'Technical', score: 85 },
                  { dimension: 'Cognitive', score: 70 },
                  { dimension: 'Personality', score: 80 },
                  { dimension: 'Safety', score: 95 },
                  { dimension: 'Teamwork', score: 88 },
                ]}
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
            <div className="space-y-3">
              {recommendedJobs.length > 0 ? recommendedJobs.map((job: any) => (
                <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-xs transition-all bg-white gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0099B8] flex items-center justify-center font-black text-sm shrink-0">
                      {(getCompanyName(job) || job.title || 'E').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{getCompanyName(job)} • {job.location || 'Indonesia'} • {getSalaryText(job)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                      92% Match
                    </Badge>
                    <Link to={`/student/jobs/${job.id}`}>
                      <Button size="sm" variant="outline" className="text-xs font-bold border-slate-200 hover:bg-slate-50">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-slate-500 text-sm">
                  No open jobs found.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Upcoming Schedules & Activity */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b pb-3">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 bg-amber-100 p-2 rounded-xl text-amber-700 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">EV Technical Interview</p>
                  <p className="text-xs text-slate-500 mt-0.5">Scheduled by Industry Recruiter • Online Meet</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 bg-cyan-100 p-2 rounded-xl text-[#0099B8] shrink-0">
                  <FileCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">High Voltage Safety Assessment</p>
                  <p className="text-xs text-slate-500 mt-0.5">Verified Standard</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b pb-3">Recent Activity</h2>
            <Timeline 
              items={timelineItems}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
