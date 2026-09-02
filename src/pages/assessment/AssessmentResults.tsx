import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';
import { openRouterService } from '../../services/OpenRouterAI';
import { AIPsychologicalReport } from '../../data/types';
import { 
  CheckCircle2, TrendingUp, Sparkles, Award, ArrowRight, 
  ShieldCheck, Leaf, Zap, User, Brain, AlertTriangle, Briefcase, RefreshCw, Cpu 
} from 'lucide-react';

export const AssessmentResults: React.FC = () => {
  const { user } = useAuth();
  const studentEmail = user?.email?.toLowerCase().trim() || 'student@spora.id';
  const studentName = user?.name || 'Siswa Juara';
  const studentNisn = user?.nisn || '0071234501';

  const talentScore = localDB.getTalentScore(studentEmail);
  const assessmentResults = localDB.getAssessmentResults(studentEmail);
  const latestResult = assessmentResults && assessmentResults.length > 0 ? assessmentResults[0] : null;

  const scoreVal = talentScore?.overall || latestResult?.score || 85;
  const personalityType = latestResult?.personalityType || 'The High-Voltage Safety Champion & Precision Specialist';
  
  const dimScores = latestResult?.dimensionScores || {
    safety: 90,
    technical: 85,
    psychometric: 88,
    learningAgility: 82,
    communication: 80
  };

  const strengths = latestResult?.strengths || [
    'Pemahaman kuat terhadap SOP K3 Tegangan Tinggi dan penanganan darurat.',
    'Penguasaan mendalam mengenai efisiensi Green Energy dan sirkuit baterai EV.'
  ];

  const growthAreas = latestResult?.weaknesses || [
    'Tingkatkan eksplorasi mandiri terhadap teknologi baterai generasi baru (Semi-Solid State).'
  ];

  // AI Psychological Report State
  const [aiReport, setAiReport] = useState<AIPsychologicalReport | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const generateAIReport = async () => {
    setIsLoadingAI(true);
    try {
      const report = await openRouterService.generatePsychologicalReport({
        studentId: studentEmail,
        studentName: studentName,
        nisn: studentNisn,
        schoolName: user?.schoolName || 'SMKN 1 Cikarang Pusat',
        dimensionScores: dimScores,
        overallScore: scoreVal,
        personalityType: personalityType
      });
      setAiReport(report);
      // Persist in localStorage cache
      localStorage.setItem(`spora_ai_report_${studentEmail}`, JSON.stringify(report));
    } catch (err) {
      console.error('Error generating AI report:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(`spora_ai_report_${studentEmail}`);
    if (cached) {
      try {
        setAiReport(JSON.parse(cached));
      } catch (e) {}
    } else {
      generateAIReport();
    }
  }, [studentEmail]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 font-sans">
      <div className="text-center">
        <Badge variant="success" className="mb-3 bg-emerald-100 text-emerald-800 border-emerald-300 font-bold px-3 py-1">
          ✓ Asesmen Selesai Dikerjakan
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Hasil Psikotes & Green Energy Assessment
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
          Berikut adalah rincian profil psikometrik, kompetensi energi hijau, dan rekomendasi jalur karir industri EV Anda.
        </p>
      </div>

      {/* Hero Score & Archetype Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-2xl border-0 shadow-lg">
          <p className="text-xs font-bold text-cyan-300 tracking-wider uppercase mb-2">Total Nilai Asesmen</p>
          <div className="text-5xl sm:text-6xl font-black text-emerald-400 mb-3">
            {scoreVal}<span className="text-2xl text-slate-400">/100</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-bold px-3 py-1">
            {scoreVal >= 80 ? 'Kategori Unggulan (Top Tier)' : 'Kategori Kompeten'}
          </Badge>
          <p className="text-[11px] text-slate-300 mt-4 leading-relaxed">
            Terverifikasi dalam Talent Pool Nasional untuk rekomendasi rekrutmen mitra industri EV.
          </p>
        </Card>

        <Card className="p-6 md:col-span-2 space-y-4 border border-slate-200">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles size={18} className="text-[#0099B8]" /> Rincian 5 Dimensi Kompetensi
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Bobot Standar Industri</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#0099B8]" /> K3 & Keselamatan Tegangan Tinggi (HV)
                </span>
                <span className="font-mono text-slate-900 font-bold">{dimScores.safety || 90}%</span>
              </div>
              <ProgressBar value={dimScores.safety || 90} color="emerald" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Leaf size={14} className="text-emerald-600" /> Green Energy & Powertrain EV
                </span>
                <span className="font-mono text-slate-900 font-bold">{dimScores.technical || 85}%</span>
              </div>
              <ProgressBar value={dimScores.technical || 85} color="emerald" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" /> Etos Kerja 5S & Presisi Torsi
                </span>
                <span className="font-mono text-slate-900 font-bold">{dimScores.psychometric || 88}%</span>
              </div>
              <ProgressBar value={dimScores.psychometric || 88} color="emerald" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-purple-600" /> Learning Agility & Adaptabilitas
                </span>
                <span className="font-mono text-slate-900 font-bold">{dimScores.learningAgility || 82}%</span>
              </div>
              <ProgressBar value={dimScores.learningAgility || 82} color="amber" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <User size={14} className="text-blue-600" /> Komunikasi & Kerjasama Tim
                </span>
                <span className="font-mono text-slate-900 font-bold">{dimScores.communication || 80}%</span>
              </div>
              <ProgressBar value={dimScores.communication || 80} color="amber" />
            </div>
          </div>
        </Card>
      </div>

      {/* OpenRouter AI Deep Psychological Assessment Report Card */}
      <Card className="p-6 border-l-4 border-violet-500 bg-gradient-to-r from-violet-50/40 via-white to-purple-50/20 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-violet-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md">
              <Brain size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">AI Psychological & Behavioral Report</h3>
                <span className="text-[11px] font-bold text-violet-700 bg-violet-100 border border-violet-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Cpu size={12} /> {aiReport?.modelUsed || 'OpenRouter LLM'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Analisis mendalam profil kepribadian kerja industri manufaktur EV dan mitigasi risiko operasional.
              </p>
            </div>
          </div>

          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs font-bold border-violet-300 text-violet-700 bg-white hover:bg-violet-50 flex items-center gap-1.5"
            onClick={generateAIReport}
            disabled={isLoadingAI}
          >
            <RefreshCw size={13} className={isLoadingAI ? 'animate-spin' : ''} />
            {isLoadingAI ? 'Menganalisis...' : 'Regenerate AI Analysis'}
          </Button>
        </div>

        {aiReport && (
          <div className="space-y-6 animate-fadeIn">
            {/* Archetype & Executive Summary */}
            <div className="p-4 bg-white rounded-xl border border-violet-100 space-y-2">
              <div className="flex items-center gap-2 text-violet-800 font-bold text-sm">
                <Sparkles size={16} className="text-violet-600" />
                <span>Archetype: {aiReport.archetype}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {aiReport.summary}
              </p>
            </div>

            {/* Big Five Personality Analysis Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <Brain size={14} className="text-violet-600" /> Big Five Industrial Work Traits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <p className="text-[11px] font-bold text-slate-600">Conscientiousness</p>
                  <p className="text-xl font-black text-emerald-600">{aiReport.bigFiveTraits?.conscientiousness?.score || 90}%</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{aiReport.bigFiveTraits?.conscientiousness?.analysis || 'Sangat disiplin SOP'}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <p className="text-[11px] font-bold text-slate-600">Emotional Stability</p>
                  <p className="text-xl font-black text-blue-600">{aiReport.bigFiveTraits?.emotionalStability?.score || 88}%</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{aiReport.bigFiveTraits?.emotionalStability?.analysis || 'Tenang dalam mitigasi bahaya'}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <p className="text-[11px] font-bold text-slate-600">Extraversion</p>
                  <p className="text-xl font-black text-indigo-600">{aiReport.bigFiveTraits?.extraversion?.score || 80}%</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{aiReport.bigFiveTraits?.extraversion?.analysis || 'Komunikatif saat serah terima shift'}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <p className="text-[11px] font-bold text-slate-600">Agreeableness</p>
                  <p className="text-xl font-black text-cyan-600">{aiReport.bigFiveTraits?.agreeableness?.score || 85}%</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{aiReport.bigFiveTraits?.agreeableness?.analysis || 'Kooperatif dalam tim workshop'}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <p className="text-[11px] font-bold text-slate-600">Openness (Agility)</p>
                  <p className="text-xl font-black text-purple-600">{aiReport.bigFiveTraits?.openness?.score || 92}%</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{aiReport.bigFiveTraits?.openness?.analysis || 'Cepat adaptasi teknologi EV'}</p>
                </div>
              </div>
            </div>

            {/* Operational Risks & Recommended Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50/50 rounded-xl border border-red-200 space-y-2">
                <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-red-600" /> Potensi Blindspot & Mitigasi Risiko
                </h4>
                <ul className="text-xs text-red-700 space-y-1.5 list-disc pl-4">
                  {aiReport.operationalRisks?.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-emerald-600" /> Posisi Karir EV Paling Direkomendasikan
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aiReport.recommendedEVRoles?.map((role, i) => (
                    <span key={i} className="text-xs font-bold bg-white text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg shadow-2xs">
                      ⚡ {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Strengths & Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-emerald-500 bg-emerald-50/30">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="text-emerald-600" size={18} /> Keunggulan Terverifikasi
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {strengths.map((s: string, idx: number) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 border-l-4 border-amber-500 bg-amber-50/30">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 text-amber-800">
            <TrendingUp className="text-amber-600" size={18} /> Area Rekomendasi Peningkatan
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {growthAreas.map((g: string, idx: number) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="text-amber-600 font-bold">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Talent Score Ready Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0099B8] rounded-2xl p-6 sm:p-8 text-white shadow-xl text-center space-y-4">
        <div className="w-12 h-12 bg-white/20 text-cyan-300 rounded-full flex items-center justify-center mx-auto">
          <Award size={26} />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white">Talent Score Anda Sudah Aktif!</h3>
          <p className="text-slate-200 text-xs sm:text-sm max-w-lg mx-auto mt-1">
            Data penilaian ini telah disinkronkan ke algoritma matchmaking Spora Juara dan dapat dilihat oleh mitra industri EV.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link to="/student/talent-score">
            <Button className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold border-0 px-6 py-2.5 text-xs">
              Lihat Detail Radar Talent Score ➔
            </Button>
          </Link>
          <Link to="/student/jobs">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold px-6 py-2.5 text-xs">
              Eksplor Lowongan Kerja Sesuai Skor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
