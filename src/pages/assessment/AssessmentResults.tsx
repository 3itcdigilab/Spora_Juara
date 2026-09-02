import React from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';
import { CheckCircle2, TrendingUp, Sparkles, Award, ArrowRight, ShieldCheck, Leaf, Zap, User } from 'lucide-react';

export const AssessmentResults: React.FC = () => {
  const { user } = useAuth();
  const studentEmail = user?.email?.toLowerCase().trim() || 'student@spora.id';

  const talentScore = localDB.getTalentScore(studentEmail);
  const assessmentResults = localDB.getAssessmentResults(studentEmail);
  const latestResult = assessmentResults && assessmentResults.length > 0 ? assessmentResults[0] : null;

  const scoreVal = talentScore?.overall || latestResult?.score || 85;
  const personalityType = latestResult?.personalityType || 'The Green Tech & Safety Specialist';
  
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
