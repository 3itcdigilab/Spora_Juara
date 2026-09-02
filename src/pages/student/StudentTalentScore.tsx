import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ProgressGauge } from '../../components/charts/ProgressGauge';
import { RadarChart } from '../../components/charts/RadarChart';
import { Sparkles, Briefcase, Award, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';
import { openRouterService } from '../../services/OpenRouterAI';

export const StudentTalentScore: React.FC = () => {
  const { user } = useAuth();
  const studentEmail = user?.email || '';
  
  const talentScore = localDB.getTalentScore(studentEmail);
  const aiReport = openRouterService.getReportByStudentId(studentEmail);
  const overallScore = talentScore?.overall || (aiReport as any)?.score || 85;

  const rawDimensions = talentScore?.dimensions && talentScore.dimensions.length > 0
    ? talentScore.dimensions
    : [
        { key: 'technical', label: 'Technical & Green Energy', score: overallScore, weight: 'High' },
        { key: 'safety', label: 'High Voltage Safety', score: Math.min(100, overallScore + 5), weight: 'High' },
        { key: 'psychometric', label: 'Work Style & 5S', score: Math.max(60, overallScore - 2), weight: 'Medium' },
        { key: 'learningAgility', label: 'Learning Agility', score: overallScore, weight: 'Medium' },
        { key: 'communication', label: 'Communication & Teamwork', score: Math.max(60, overallScore - 4), weight: 'Low' },
      ];

  const dimensions = rawDimensions.map((d: any) => ({
    label: d.label,
    score: d.score,
    weight: typeof d.weight === 'number' ? (d.weight >= 0.2 ? 'High' : 'Medium') : (d.weight || 'Medium')
  }));

  const tierText = overallScore >= 85 
    ? 'Tier 1 Competency (Sangat Siap Kerja di Industri EV)' 
    : overallScore >= 70 
    ? 'Tier 2 Competency (Siap Kerja & Penempatan Magang)' 
    : 'Tier 3 Competency (Perlu Penguatan Kompetensi)';

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-8 font-sans">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#0099B8] text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles size={14} /> AI Standardized Talent Evaluation
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Skor Kompetensi Vokasi EV Anda</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Hasil evaluasi AI berdasarkan 20 instrumen Psikotes, Green Energy, dan K3 Tegangan Tinggi.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center my-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center max-w-sm w-full text-center">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Overall Talent Score</span>
          <div className="text-5xl font-black text-[#0099B8] tracking-tight">
            {overallScore}<span className="text-2xl text-slate-400 font-normal">/100</span>
          </div>
          <Badge variant="success" className="mt-3 text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
            {tierText}
          </Badge>
          <p className="text-xs text-slate-500 mt-2">
            Profil: <strong className="text-slate-800">"{aiReport?.archetype || 'The Precision EV Battery Specialist'}"</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 flex flex-col border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 border-b pb-3">Distribusi Radar Kompetensi</h2>
          <div className="flex-1 flex items-center justify-center min-h-[300px] bg-slate-50 rounded-xl p-2">
             <RadarChart 
                data={dimensions.map((d: any) => ({ dimension: d.label.split('&')[0].trim(), score: d.score }))}
                indexBy="dimension"
                keys={['score']}
                height={320}
              />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 border-b pb-3">Rincian Dimensi Penilaian</h2>
            <div className="space-y-4">
              {dimensions.map((dim: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{dim.label}</span>
                    <span className="font-extrabold text-[#0099B8]">{dim.score}/100</span>
                  </div>
                  <ProgressBar value={dim.score} color={dim.score >= 80 ? 'emerald' : dim.score >= 70 ? 'blue' : 'amber'} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-violet-200 bg-gradient-to-br from-violet-50/50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-violet-600" size={18} />
              <h2 className="text-base font-extrabold text-slate-900">Analisis Rekomendasi AI</h2>
            </div>
            <ul className="space-y-2.5">
              <li className="flex gap-2">
                <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={16} />
                <p className="text-xs text-slate-700 leading-relaxed">
                  Pemahaman <strong>Green Energy & Powertrain EV</strong> sangat solid ({dimensions[0]?.score || overallScore}%), siap ditempatkan di lini produksi baterai EV.
                </p>
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="text-[#0099B8] mt-0.5 shrink-0" size={16} />
                <p className="text-xs text-slate-700 leading-relaxed">
                  Kesadaran <strong>K3 Tegangan Tinggi (High Voltage Safety)</strong> memenuhi standar kepatuhan regulasi pabrik otomotif modern.
                </p>
              </li>
              <li className="flex gap-2">
                <Zap className="text-amber-600 mt-0.5 shrink-0" size={16} />
                <p className="text-xs text-slate-700 leading-relaxed">
                  Saran Pengembangan: Ambil sertifikasi teknis lanjutan untuk mengoptimalkan matching rate industri tier 1.
                </p>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-extrabold text-slate-900 mb-4">Peluang Karir Industri EV yang Cocok</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { ind: 'EV Battery Manufacturing', match: Math.min(99, overallScore + 4), company: 'PT Hyundai Motor / LG Energy Solution' },
            { ind: 'High Voltage Assembly QC', match: Math.min(98, overallScore + 2), company: 'PT SGMW Motor Indonesia (Wuling)' },
            { ind: 'EV Charging Station (SPKLU)', match: Math.max(70, overallScore - 3), company: 'PT PLN & Ekosistem EV' }
          ].map((item, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between border-slate-200 hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{item.ind}</h3>
                  <Badge variant="success" className="shrink-0 text-xs font-bold">{item.match}% Match</Badge>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                  <Briefcase size={13} className="text-slate-400" /> {item.company}
                </p>
              </div>
              <Link to="/student/jobs" className="mt-4">
                <Button variant="outline" className="w-full text-xs font-bold text-[#0099B8] border-cyan-200 hover:bg-cyan-50">
                  Lihat Lowongan Terkait →
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
