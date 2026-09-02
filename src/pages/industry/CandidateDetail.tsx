import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { 
  ArrowLeft, MapPin, Mail, Phone, Download, GraduationCap, Award, 
  Brain, Sparkles, ShieldCheck, AlertTriangle, Briefcase, RefreshCw, Cpu 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { openRouterService } from '../../services/OpenRouterAI';
import { AIPsychologicalReport } from '../../data/types';

export const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const candidate = useMemo(() => {
    if (!id) return null;
    return localDB.getStudentById(id);
  }, [id]);

  const score = useMemo(() => {
    return candidate ? localDB.getTalentScore(candidate.id) || localDB.getTalentScore(candidate.email) : null;
  }, [candidate]);

  const prof = useMemo(() => {
    if (!candidate) return null;
    return localDB.getProfile(candidate.id) || localDB.getProfile(candidate.email);
  }, [candidate]);

  const candidateName = prof?.fullName || candidate?.name || (candidate as any)?.fullName || candidate?.userId || 'Kandidat Vokasi EV';
  const schoolName = prof?.school || candidate?.school || candidate?.schoolName || 'SMK Negeri 1 Cikarang Pusat';
  const major = prof?.major || candidate?.major || 'Teknik Kendaraan Ringan (Otomotif EV)';
  const province = prof?.province || candidate?.province || 'Jawa Barat';
  const phone = prof?.phone || candidate?.phone || '';
  const bio = prof?.bio || candidate?.bio || 'Lulusan vokasi dengan kompetensi siap kerja pada perakitan baterai dan sistem elektrikal EV.';
  const skills = (prof?.skills && prof.skills.length > 0) ? prof.skills : (candidate?.skills || ['EV Battery Assembly', 'High Voltage Safety', 'Quality Control']);
  const nisn = (prof as any)?.nisn || (candidate as any)?.nisn || '0071234501';

  // AI Psychological Report State
  const [aiReport, setAiReport] = useState<AIPsychologicalReport | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const fetchOrGenerateAIReport = async () => {
    if (!candidate) return;
    setIsLoadingAI(true);
    try {
      const candidateEmail = candidate.email?.toLowerCase().trim() || candidate.id;
      const existing = openRouterService.getReportByStudentId(candidateEmail);
      if (existing) {
        setAiReport(existing);
      } else {
        const report = await openRouterService.generatePsychologicalReport({
          studentId: candidateEmail,
          studentName: candidateName,
          nisn: nisn,
          schoolName: schoolName,
          major: major,
          dimensionScores: {
            technical: 88,
            safety: 92,
            psychometric: 90,
            learningAgility: 85,
            communication: 82
          },
          overallScore: score?.overall || 88,
          personalityType: 'The High-Voltage Safety Champion'
        });
        setAiReport(report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchOrGenerateAIReport();
  }, [candidate]);

  if (!candidate) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans pb-10">
        <Link to="/industry/talent-pool" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-[#0099B8] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Talent Pool
        </Link>
        <Card className="p-16 text-center border-slate-200">
          <h2 className="text-xl font-bold text-slate-700">Candidate Not Found</h2>
          <p className="text-slate-500 mt-2">The candidate you are looking for does not exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-10">
      <Link to="/industry/talent-pool" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-[#0099B8] transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Talent Pool
      </Link>
      
      <Card className="p-6 md:p-8 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0099B8] to-blue-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm shrink-0">
              {(candidateName || 'K').charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{candidateName}</h1>
                <span className="text-xs font-mono font-bold text-[#0099B8] bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                  NISN: {nisn}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0099B8] mt-0.5">{major} • {schoolName}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-semibold">
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400"/> {province}, Indonesia</span>
                <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-slate-400"/> {candidate.email || 'candidate@vokasi.id'}</span>
                {phone && <span className="flex items-center font-mono"><Phone className="w-3.5 h-3.5 mr-1 text-slate-400"/> {phone}</span>}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3 w-full md:w-auto">
            <Button variant="outline" className="text-xs font-bold flex-1 md:flex-initial" onClick={() => showToast('Candidate added to shortlist', 'success')}>Add to Shortlist</Button>
            <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white text-xs font-bold flex-1 md:flex-initial" onClick={() => showToast('Invitation sent to candidate', 'success')}>Invite to Apply</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Profile Overview / Bio</h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              {bio}
            </p>
            
            <div>
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Verified Competencies & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: string) => (
                  <Badge key={s} variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 text-xs font-semibold px-3 py-1">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* OpenRouter AI Psychological & Behavioral Fit Report Card */}
          <Card className="p-6 border-l-4 border-violet-500 bg-gradient-to-r from-violet-50/40 via-white to-slate-50 space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-violet-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                  <Brain size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">AI Psychological & Behavioral Fit Report</h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Cpu size={12} className="text-violet-600" /> Powered by {aiReport?.modelUsed || 'OpenRouter LLM'}
                  </p>
                </div>
              </div>

              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs font-bold text-violet-700 border-violet-200 bg-white hover:bg-violet-50 flex items-center gap-1"
                onClick={fetchOrGenerateAIReport}
                disabled={isLoadingAI}
              >
                <RefreshCw size={12} className={isLoadingAI ? 'animate-spin' : ''} />
                {isLoadingAI ? 'Analyzing...' : 'Re-Evaluate AI'}
              </Button>
            </div>

            {aiReport && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-white rounded-xl border border-violet-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-violet-800 font-bold text-xs">
                    <Sparkles size={14} className="text-violet-600" />
                    <span>Archetype: {aiReport.archetype}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {aiReport.summary}
                  </p>
                </div>

                {/* Big Five Traits Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Brain size={13} className="text-violet-600" /> Big Five Industrial Work Traits
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <p className="text-[10px] text-slate-500 font-bold">Conscientiousness</p>
                      <p className="text-base font-black text-emerald-600">{aiReport.bigFiveTraits?.conscientiousness?.score || 90}%</p>
                      <p className="text-[9px] text-slate-500">{aiReport.bigFiveTraits?.conscientiousness?.analysis || 'Sangat disiplin SOP'}</p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <p className="text-[10px] text-slate-500 font-bold">Emotional Stability</p>
                      <p className="text-base font-black text-blue-600">{aiReport.bigFiveTraits?.emotionalStability?.score || 88}%</p>
                      <p className="text-[9px] text-slate-500">{aiReport.bigFiveTraits?.emotionalStability?.analysis || 'Tenang di darurat'}</p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <p className="text-[10px] text-slate-500 font-bold">Extraversion</p>
                      <p className="text-base font-black text-indigo-600">{aiReport.bigFiveTraits?.extraversion?.score || 80}%</p>
                      <p className="text-[9px] text-slate-500">{aiReport.bigFiveTraits?.extraversion?.analysis || 'Komunikasi shift'}</p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <p className="text-[10px] text-slate-500 font-bold">Agreeableness</p>
                      <p className="text-base font-black text-cyan-600">{aiReport.bigFiveTraits?.agreeableness?.score || 85}%</p>
                      <p className="text-[9px] text-slate-500">{aiReport.bigFiveTraits?.agreeableness?.analysis || 'Kooperatif tim'}</p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <p className="text-[10px] text-slate-500 font-bold">Openness (Agility)</p>
                      <p className="text-base font-black text-purple-600">{aiReport.bigFiveTraits?.openness?.score || 92}%</p>
                      <p className="text-[9px] text-slate-500">{aiReport.bigFiveTraits?.openness?.analysis || 'Cepat adaptasi'}</p>
                    </div>
                  </div>
                </div>

                {/* Risk and Role Recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 space-y-1">
                    <h5 className="text-xs font-bold text-red-800 flex items-center gap-1">
                      <AlertTriangle size={13} className="text-red-600" /> Operational Blindspots
                    </h5>
                    <ul className="text-[11px] text-red-800 space-y-1 list-disc pl-3">
                      {aiReport.operationalRisks?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                    <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <Briefcase size={13} className="text-emerald-600" /> Top Recommended EV Roles
                    </h5>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {aiReport.recommendedEVRoles?.map((role, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                          ⚡ {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          <Card className="p-6 border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Curriculum Vitae / Resume</h2>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
              <div className="flex items-center text-xs font-bold text-slate-800">
                <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-black text-xs mr-3">PDF</div> 
                CV_{candidateName.replace(/\s+/g, '_')}.pdf
              </div>
              <Button variant="outline" size="sm" className="text-xs font-bold" onClick={() => showToast('Downloading CV...', 'info')}>
                <Download className="w-3.5 h-3.5 mr-1.5"/> Download CV
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">National Talent Score</h2>
            <div className="text-center mb-6 bg-cyan-50 p-4 rounded-xl border border-cyan-100">
              <div className="text-4xl font-black text-[#0099B8]">{score?.overall || 88}</div>
              <div className="text-xs font-bold text-slate-600 mt-1">Overall Competency Score</div>
            </div>
            <div className="space-y-3 text-xs">
              {score?.dimensions?.map((dim: any) => (
                <div key={dim.key}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">{dim.label}</span>
                    <span className="text-slate-900 font-bold">{dim.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#0099B8] h-full rounded-full" style={{ width: `${dim.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
