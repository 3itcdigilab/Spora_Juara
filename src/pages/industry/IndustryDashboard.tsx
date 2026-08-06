import React, { useMemo } from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PlusCircle, Search, Sparkles, Briefcase, Users, Calendar, ArrowRight, CheckCircle2, Factory, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();
  const companyName = user?.name || 'Hyundai Motor Manufacturing Indonesia';

  // Dynamic database statistics
  const jobs = useMemo(() => localDB.getJobs(), []);
  const applications = useMemo(() => localDB.getApplications(), []);
  const students = useMemo(() => localDB.getStudents(), []);

  const recentApplications = useMemo(() => {
    return applications.slice(0, 5).map(app => {
      const student = students.find(s => s.id === app.studentId) || students[0];
      const job = jobs.find(j => j.id === app.jobId) || jobs[0];
      return {
        ...app,
        studentName: student.major,
        studentCity: student.city,
        jobTitle: job.title
      };
    });
  }, [applications, students, jobs]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-violet-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <Factory size={320} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-violet-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <ShieldCheck size={14} /> EV Industry Partner Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{companyName}</h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Access pre-assessed vocational EV talent, filter by 7-dimension competency scores, and streamline recruitment.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/industry/talent-pool">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs font-bold">
                <Search className="w-4 h-4 mr-1.5" /> Search Talent Pool
              </Button>
            </Link>
            <Link to="/industry/post-job">
              <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white border-0 text-xs font-bold">
                <PlusCircle className="w-4 h-4 mr-1.5" /> Post EV Vacancy
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Active Vacancies", value: jobs.filter(j => j.status === 'active').length, label: "Live EV Roles", icon: Briefcase, color: "text-[#0099B8]", bg: "bg-cyan-50" },
          { title: "Total Applications", value: applications.length, label: "In Pipeline", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "In Interview Stage", value: applications.filter(a => a.status === 'interview').length, label: "Scheduled Candidate Meetings", icon: Calendar, color: "text-violet-600", bg: "bg-violet-50" },
          { title: "Hired Candidates", value: applications.filter(a => a.status === 'hired').length, label: "Hired & Placed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Assessed Talent Pool", value: students.length, label: "National SMK Pool", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{kpi.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Applicants & Top AI Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-4 border-slate-200">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Candidate Applications</h2>
              <p className="text-xs text-slate-500">Live evaluation feed from localDB applications.</p>
            </div>
            <Link to="/industry/pipeline" className="text-xs text-[#0099B8] font-bold hover:underline">
              View All Pipeline ({applications.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-xs transition-all bg-white gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0099B8] font-black text-sm flex items-center justify-center shrink-0 border border-cyan-100">
                    {app.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{app.studentName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{app.jobTitle} • {app.studentCity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 text-xs font-bold">
                    {app.aiMatchScore}% Match
                  </Badge>
                  <Link to="/industry/pipeline">
                    <Button size="sm" variant="outline" className="text-xs font-bold text-slate-700">
                      Review in Pipeline
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {recentApplications.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No recent candidate applications found.</p>
            )}
          </div>
        </Card>
        
        {/* Top AI Matched Candidates */}
        <Card className="p-6 space-y-4 bg-gradient-to-b from-white to-violet-50/40 border-violet-100">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-violet-600" size={18} /> Top AI Recommended
            </h2>
          </div>

          <div className="space-y-3">
            {students.slice(0, 3).map((student, i) => (
              <div key={student.id} className="bg-white p-4 rounded-xl border border-violet-100 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{student.major}</p>
                    <p className="text-xs text-slate-500">{student.city}, {student.province}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-800 font-bold text-xs rounded-full">
                    {95 - i * 3}% Match
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t text-xs">
                  <span className="text-slate-500">Talent Score: <strong className="text-slate-900">88/100</strong></span>
                  <Link to={`/industry/talent-pool/${student.id}`} className="text-xs font-bold text-[#0099B8] hover:underline flex items-center">
                    Inspect <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
