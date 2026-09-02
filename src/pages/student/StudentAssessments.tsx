import React from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Brain, Wrench, ShieldCheck, Sparkles, Zap, Award, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';
import { openRouterService } from '../../services/OpenRouterAI';

export const StudentAssessments: React.FC = () => {
  const { user } = useAuth();
  const studentEmail = user?.email || '';
  
  const talentScore = localDB.getTalentScore(studentEmail);
  const aiReport = openRouterService.getReportByStudentId(studentEmail);
  const overallScore = talentScore?.overall || (aiReport as any)?.score || (talentScore?.dimensions ? Math.round(talentScore.dimensions.reduce((a: number, b: any) => a + (b.score * b.weight), 0)) : 88);

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Modul Asesmen Kompetensi Siswa</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hasil Psikotes & Karakter Kerja dievaluasi langsung oleh AI Engine. Asesmen Teknis dapat dikerjakan untuk meningkatkan nilai kompetensi khusus.
          </p>
        </div>
        <Link to="/student/talent-score">
          <Button variant="outline" className="text-xs font-bold text-[#0099B8] border-cyan-200 bg-cyan-50 hover:bg-cyan-100 flex items-center gap-1.5">
            <Award size={14} /> Lihat Talent Score Lengkap →
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Psychological Assessment (COMPLETED & EVALUATED BY AI) */}
        <Card className="p-6 flex flex-col border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
            <Sparkles size={140} className="text-emerald-700" />
          </div>

          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Brain size={24} />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="success" className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 flex items-center gap-1">
                <CheckCircle2 size={13} /> Selesai (AI Verified)
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">Evaluasi AI Terhubung</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-violet-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">OpenRouter AI Evaluation</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Psikotes & Green Energy Induction Test
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengevaluasi kesadaran K3 Tegangan Tinggi, atensi detail & etos kerja 5S, integritas, serta kecepatan belajar (Learning Agility).
            </p>

            {/* AI Archetype & Score Pill */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 mt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Skor Asesmen:</span>
                <span className="font-extrabold text-emerald-700 text-sm">{overallScore}/100</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Profil AI:</span>
                <span className="font-bold text-violet-700 text-[11px] truncate max-w-[180px]">
                  {aiReport?.archetype || 'The Precision EV Battery Specialist'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 my-4 border-t pt-3">
            <span>20 Soal Green Energy & 5S</span>
            <span className="text-emerald-700 font-bold">100% Selesai</span>
          </div>

          <Link to="/student/talent-score">
            <Button variant="primary" className="w-full bg-[#0099B8] hover:bg-[#007A93] text-white text-xs font-bold py-2.5 flex items-center justify-center gap-1.5">
              <Sparkles size={14} /> Lihat Laporan Analisis Psikologis AI
            </Button>
          </Link>
        </Card>

        {/* 2. Technical EV Assessment (AVAILABLE / NOT YET TAKEN) */}
        <Card className="p-6 flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
              <Wrench size={24} />
            </div>
            <Badge variant="neutral" className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5">
              Belum Dikerjakan (Tersedia)
            </Badge>
          </div>

          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modul Teknis Pilihan</span>
            <h3 className="text-lg font-extrabold text-slate-900">
              EV Battery Assembly & Thermal Management
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pengujian kompetensi lanjutan perakitan modul baterai lithium, balancing cell, dan instalasi sistem pendingin cair untuk industri perakitan EV.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1 mt-3">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className="font-semibold text-slate-700">Tersedia untuk diambil</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nilai Minimum Lolos:</span>
                <span className="font-bold text-slate-700">75%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 my-4 border-t pt-3">
            <span>15 Pertanyaan Teknis</span>
            <span>Waktu: 45 Menit</span>
          </div>

          <Link to="/assessment/2/instructions">
            <Button variant="outline" className="w-full text-xs font-bold text-slate-700 hover:text-slate-900 border-slate-300">
              Mulai Ujian Teknis Lanjutan →
            </Button>
          </Link>
        </Card>

        {/* 3. High Voltage Safety & LOTO Compliance (AVAILABLE / NOT YET TAKEN) */}
        <Card className="p-6 flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
              <Zap size={24} />
            </div>
            <Badge variant="neutral" className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5">
              Belum Dikerjakan (Tersedia)
            </Badge>
          </div>

          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sertifikasi K3 & Regulasi</span>
            <h3 className="text-lg font-extrabold text-slate-900">
              High Voltage Safety & LOTO Compliance (1000V)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standar keselamatan tegangan tinggi internasional, verifikasi zero voltage sebelum servis, dan mitigasi risiko thermal runaway baterai EV.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1 mt-3">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className="font-semibold text-slate-700">Tersedia untuk diambil</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nilai Minimum Lolos:</span>
                <span className="font-bold text-slate-700">80%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 my-4 border-t pt-3">
            <span>10 Pertanyaan Spesialis</span>
            <span>Waktu: 25 Menit</span>
          </div>

          <Link to="/assessment/3/instructions">
            <Button variant="outline" className="w-full text-xs font-bold text-slate-700 hover:text-slate-900 border-slate-300">
              Mulai Ujian K3 Tegangan Tinggi →
            </Button>
          </Link>
        </Card>

        {/* 4. AI Talent Score Card Banner */}
        <Card className="p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-[#0099B8] text-white rounded-2xl shadow-md">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} /> Spora AI Scoring Hub
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Talent Score & Matchmaking AI
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Hasil Psikotes dan Green Energy Anda saat registrasi telah mengaktifkan profil kompetensi dan rekomendasi lowongan kerja dari mitra industri.
            </p>
          </div>

          <div className="pt-6">
            <Link to="/student/talent-score">
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs py-2.5 shadow">
                Buka Talent Score & Analisis AI ➔
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
