import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { useToast } from '../../components/ui/Toast';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Calendar, Target, CheckCircle2, Award, Zap } from 'lucide-react';
import { localDB } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

export const StudentJobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { user } = useAuth();

  const studentId = 'student-1'; // Primary active candidate ID

  // Fetch target job dynamically with safe fallback
  const job = useMemo(() => {
    if (!id) return localDB.getJobs()[0];
    return localDB.getJobById(id) || localDB.getJobs()[0];
  }, [id]);

  // Fetch candidate profile & talent score with safe fallback
  const student = useMemo(() => {
    const s = localDB.getStudentById(studentId);
    if (s && Array.isArray(s.skills)) return s;
    return {
      id: studentId,
      skills: ['EV Battery Assembly', 'High Voltage Safety', 'Electric Motor Winding', 'Quality Control'],
      major: 'Teknik Kendaraan Ringan (Otomotif EV)',
      city: 'Bekasi',
      province: 'Jawa Barat'
    };
  }, [studentId]);

  const talentScore = useMemo(() => localDB.getTalentScore(studentId), [studentId]);

  // Track application state
  const [hasApplied, setHasApplied] = useState(() => {
    if (!job) return false;
    const apps = localDB.getApplications(studentId);
    return apps.some((a: any) => a.jobId === job.id);
  });

  const handleApply = () => {
    if (hasApplied || !job) return;
    localDB.applyForJob(studentId, job.id);
    setHasApplied(true);
    showToast(`Application submitted for ${job.title}!`, 'success');
  };

  // Safe skill match logic comparing required skills vs candidate skills
  const matchedSkills = useMemo(() => {
    if (!job || !Array.isArray(job.requiredSkills)) return [];
    const candidateSkills = student?.skills || [];
    return job.requiredSkills.filter((s: any) => candidateSkills.includes(s));
  }, [job, student]);

  const missingSkills = useMemo(() => {
    if (!job || !Array.isArray(job.requiredSkills)) return [];
    const candidateSkills = student?.skills || [];
    return job.requiredSkills.filter((s: any) => !candidateSkills.includes(s));
  }, [job, student]);

  const aiMatchPercent = useMemo(() => {
    if (!job || !job.requiredSkills || job.requiredSkills.length === 0) return 90;
    const ratio = matchedSkills.length / job.requiredSkills.length;
    return Math.min(98, Math.max(70, Math.round(ratio * 100)));
  }, [job, matchedSkills]);

  if (!job) {
    return (
      <div className="text-center py-20 font-sans">
        <p className="text-base font-bold text-slate-700">Job Detail Not Found</p>
        <Link to="/student/jobs" className="text-xs font-bold text-[#0099B8] mt-2 inline-block">
          ← Back to Job Board
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10 font-sans space-y-6">
      <Link to="/student/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0099B8] transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Job Board
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 border-slate-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">{job.title}</h1>
                <p className="text-base text-[#0099B8] font-bold">{job.department}</p>
              </div>
              <div className="w-16 h-16 bg-cyan-50 border border-cyan-100 rounded-2xl flex items-center justify-center font-black text-2xl text-[#0099B8] shrink-0">
                {job.department ? job.department.charAt(0) : 'E'}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-xs font-semibold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400" /> <span className="capitalize">{job.employmentType}</span></span>
              <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-slate-400" /> Rp {(job.salaryMin / 1000000).toFixed(1)}M - {(job.salaryMax / 1000000).toFixed(1)}M</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> Deadline: {job.deadline ? job.deadline.split('T')[0] : '2026-09-01'}</span>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3">Role Overview</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
              </div>

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">Required Competencies</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill: string, i: number) => (
                      <Badge key={i} variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 font-semibold px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.requiredCertifications && job.requiredCertifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">Required Certifications</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredCertifications.map((cert: string, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg">
                        <Award size={14} /> {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Competency Match Analysis Sidebar & Action */}
        <div className="space-y-6">
          <Card className="p-6 border-cyan-100 bg-cyan-50/20 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-[#0099B8]" /> Competency Match Analysis
            </h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 shrink-0">
                <ProgressRing value={aiMatchPercent} color="emerald" size={80} strokeWidth={8} />
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">{aiMatchPercent}%</p>
                <p className="text-xs text-slate-600 font-bold">Strong Qualification Fit</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-500 mb-1">Talent Score Requirement</p>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-700">Your Score: {talentScore?.overall || 88}/100</span>
                  <span className="text-slate-600">Min Req: {job.requiredTalentScore || 75}/100</span>
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-500 mb-2">Skill Verification</p>
                <ul className="space-y-1.5">
                  {matchedSkills.map((s: string) => (
                    <li key={s} className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {s}
                    </li>
                  ))}
                  {missingSkills.map((s: string) => (
                    <li key={s} className="flex items-center gap-1.5 text-amber-700 font-medium">
                      <span className="w-3.5 h-3.5 rounded-full border border-amber-400 flex items-center justify-center text-[9px] font-bold text-amber-600 shrink-0">!</span> Gap: {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {hasApplied ? (
              <Button disabled variant="primary" className="w-full h-12 text-sm font-bold bg-emerald-600 border-emerald-600 text-white flex items-center justify-center gap-2 rounded-xl">
                <CheckCircle2 size={18} /> Application Submitted
              </Button>
            ) : (
              <Button onClick={handleApply} variant="primary" className="w-full h-12 text-base font-bold bg-[#0099B8] hover:bg-[#007A93] text-white rounded-xl shadow-md">
                Apply Now
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
