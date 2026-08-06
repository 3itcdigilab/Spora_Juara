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
import { Sparkles, ArrowRight, Briefcase, FileCheck, Clock, Award, UserCheck, ShieldCheck, Zap } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const savedProfile = localDB.getProfile('stu-1');
  const rawName = user?.name || savedProfile?.fullName || 'Usman Domiri';
  const userName = rawName.includes('@') ? (savedProfile?.fullName || 'Usman Domiri') : rawName;
  const profileCompletion = 85;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0099B8] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 opacity-10 pointer-events-none">
          <svg className="w-96 h-96 text-white" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5 L58 38 L92 25 L68 50 L92 75 L58 62 L50 95 L42 62 L8 75 L32 50 L8 25 L42 38 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Zap size={14} /> EV Talent Candidate Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, {userName}!</h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • Ready for Indonesia's EV Industry.
            </p>
          </div>

          {/* Quick Action & Completion Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="space-y-1 text-left">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">Profile Completion</span>
                <span className="text-cyan-300">{profileCompletion}%</span>
              </div>
              <div className="w-44 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
              </div>
            </div>
            <Link to="/student/profile">
              <Button size="sm" variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white border-0 text-xs font-bold whitespace-nowrap">
                Complete Profile →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{profileCompletion}%</p>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">✓ Almost Complete</span>
          </div>
          <div className="w-14 h-14 shrink-0">
            <ProgressRing value={profileCompletion} color="blue" size={56} strokeWidth={6} />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Talent Score</p>
            <p className="text-2xl font-black text-slate-900 mt-1">78<span className="text-xs text-slate-400 font-normal">/100</span></p>
            <span className="text-[11px] text-[#0099B8] font-bold mt-1 inline-block">Tier 1 Qualified</span>
          </div>
          <div className="w-14 h-14 shrink-0">
            <ProgressGauge value={78} max={100} size={56} color="emerald" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessments</p>
            <p className="text-base font-bold text-slate-900 mt-1">Competency Passed</p>
            <Badge variant="success" className="mt-1 bg-emerald-100 text-emerald-800">Verified ✓</Badge>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileCheck size={24} />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-black text-slate-900 mt-1">3 <span className="text-xs text-slate-400 font-normal">Active</span></p>
            <span className="text-[11px] text-blue-600 font-bold mt-1 inline-block">1 Interview Scheduled</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase size={24} />
          </div>
        </Card>
      </div>

      {/* AI Recommendations */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-100 text-violet-700 rounded-lg">
              <Sparkles size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">AI Recommendations</h2>
          </div>
          <Link to="/student/ai-recommendation" className="text-xs text-[#0099B8] font-bold hover:underline">
            View All AI Insights →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-t-4 border-t-violet-500 hover:shadow-md transition-all">
            <Badge className="bg-violet-100 text-violet-700 mb-3 text-xs">Career Path</Badge>
            <h3 className="font-bold text-slate-900 text-base">EV Battery Technician</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
              Based on your high mechanical aptitude and attention to detail, this is a 92% match.
            </p>
            <Link to="/student/ai-recommendation" className="text-xs font-bold text-violet-600 flex items-center gap-1 hover:text-violet-700">
              View Path <ArrowRight size={14} />
            </Link>
          </Card>
          
          <Card className="p-5 border-t-4 border-t-cyan-500 hover:shadow-md transition-all">
            <Badge className="bg-cyan-100 text-cyan-800 mb-3 text-xs">Learning Module</Badge>
            <h3 className="font-bold text-slate-900 text-base">Safety Protocols 101</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
              Complete this module to boost your High Voltage Safety score by up to 15 points.
            </p>
            <Link to="/student/ai-recommendation" className="text-xs font-bold text-[#0099B8] flex items-center gap-1 hover:text-[#007A93]">
              Start Course <ArrowRight size={14} />
            </Link>
          </Card>

          <Card className="p-5 border-t-4 border-t-emerald-500 hover:shadow-md transition-all">
            <Badge className="bg-emerald-100 text-emerald-700 mb-3 text-xs">Recommended Job</Badge>
            <h3 className="font-bold text-slate-900 text-base">Hyundai - Jr. Assembler</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
              88% Match score. Requires EV Assembly familiarity in Cikarang, Jawa Barat.
            </p>
            <Link to="/student/jobs/1" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
              View Job Detail <ArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </section>

      {/* Main Grid: Skills Radar + Recent Jobs & Timeline */}
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
              {[
                { company: 'Toyota Motor Manufacturing', role: 'EV Assembly & Inspection Staff', salary: 'Rp 5.500.000 / mo', match: 92, location: 'Karawang' },
                { company: 'Wuling Motors Indonesia', role: 'Battery Pack Quality Inspector', salary: 'Rp 6.000.000 / mo', match: 88, location: 'Cikarang' },
              ].map((job, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-xs transition-all bg-white gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0099B8] flex items-center justify-center font-black text-sm shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{job.role}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{job.company} • {job.location} • {job.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                      {job.match}% Match
                    </Badge>
                    <Link to={`/student/jobs/${i + 1}`}>
                      <Button size="sm" variant="outline" className="text-xs font-bold border-slate-200 hover:bg-slate-50">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
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
                  <p className="text-sm font-bold text-slate-900">Hyundai Technical Interview</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tomorrow, 10:00 AM • Online Meet</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 bg-cyan-100 p-2 rounded-xl text-[#0099B8] shrink-0">
                  <FileCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">High Voltage Safety Assessment</p>
                  <p className="text-xs text-slate-500 mt-0.5">Due Friday, 11:59 PM</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b pb-3">Recent Activity</h2>
            <Timeline 
              items={[
                { title: 'Applied to Toyota Motor', date: '2 days ago', status: 'completed' },
                { title: 'Technical Assessment Completed', date: '1 week ago', status: 'completed' },
                { title: 'Profile Updated', date: '1 week ago', status: 'completed' },
                { title: 'Joined Spora TalentOS', date: '2 weeks ago', status: 'completed' },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
