import React, { useState, useEffect } from 'react';
import { defaultQuestionBank, calculatePsychometricResult } from '../../data/psychometricBank';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Leaf, 
  Cpu, 
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';

interface StudentOnboardingAssessmentProps {
  studentName: string;
  studentEmail: string;
  onComplete: (results: any) => void;
  onSkip: () => void;
}

export const StudentOnboardingAssessment: React.FC<StudentOnboardingAssessmentProps> = ({
  studentName,
  studentEmail,
  onComplete,
  onSkip
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const questions = defaultQuestionBank;
  const currentQ = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, answers]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectAnswer = (qId: string, optionLetter: string) => {
    setAnswers(prev => ({ ...prev, [qId]: optionLetter }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleFinishTest = () => {
    const res = calculatePsychometricResult(answers);
    setAssessmentResult(res);
    setIsFinished(true);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / questions.length) * 100);

  // If Finished, show rich celebration & archetype reveal screen
  if (isFinished && assessmentResult) {
    return (
      <div className="space-y-6 animate-fadeIn text-center">
        <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0099B8] rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={180} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} /> Asesmen Masuk Spora Juara Berhasil!
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat, {studentName}!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Tes Psikotes & Green Energy Anda telah dianalisis. Profil kompetensi Anda kini aktif di Talent Pool Industri Nasional!
          </p>

          <div className="mt-6 inline-flex flex-col items-center p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-4xl mb-1">{assessmentResult.archetype.icon}</span>
            <span className="text-xs text-cyan-300 font-semibold tracking-wide uppercase">Profil Psikometrik / Archetype</span>
            <h3 className="text-xl font-black text-white mt-0.5">{assessmentResult.archetype.title}</h3>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#0099B8] text-white text-xs font-bold">
              {assessmentResult.archetype.badge}
            </span>
            <p className="text-xs text-slate-200 mt-2 max-w-sm leading-relaxed">
              {assessmentResult.archetype.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-left">
            <div className="p-3 bg-white/10 rounded-xl">
              <span className="text-[10px] text-slate-300 block">Total Skor Psikotes</span>
              <strong className="text-xl text-emerald-400 font-extrabold">{assessmentResult.percentage}/100</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <span className="text-[10px] text-slate-300 block">K3 & HV Safety</span>
              <strong className="text-xl text-cyan-300 font-extrabold">{assessmentResult.dimensions.safety}%</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <span className="text-[10px] text-slate-300 block">Green Energy & Tech</span>
              <strong className="text-xl text-yellow-300 font-extrabold">{assessmentResult.dimensions.technical}%</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <span className="text-[10px] text-slate-300 block">Learning Agility</span>
              <strong className="text-xl text-purple-300 font-extrabold">{assessmentResult.dimensions.learningAgility}%</strong>
            </div>
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <Card className="p-5 border-l-4 border-emerald-500 bg-emerald-50/40">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-emerald-800 mb-2">
              <CheckCircle2 size={16} /> Keunggulan Utama Anda
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {assessmentResult.strengths.map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 border-l-4 border-amber-500 bg-amber-50/40">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-amber-800 mb-2">
              <Zap size={16} /> Rekomendasi Pengembangan
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {assessmentResult.growthAreas.map((g: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="primary"
            onClick={() => onComplete(assessmentResult)}
            className="w-full bg-[#0099B8] hover:bg-[#007A93] text-white py-3 font-bold rounded-xl text-base shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
          >
            <span>Masuk ke Dashboard Saya & Eksplor Lowongan EV</span>
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  // Active Assessment Test View
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gradient-to-r from-slate-900 to-[#0099B8] rounded-xl text-white">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-cyan-200 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Leaf size={12} /> Psikotes Masuk & Green Energy Assessment
          </div>
          <h3 className="text-base font-bold">Uji Kompetensi & Potensi Diri (20 Soal)</h3>
          <p className="text-xs text-slate-200">Hasil tes ini langsung menentukan Talent Score dan profil Anda bagi industri.</p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg font-mono text-sm font-bold shrink-0">
          <Clock size={16} className="text-cyan-300" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar & Question Selector */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Progres: {answeredCount} dari {questions.length} Soal Terjawab ({progressPct}%)</span>
          <span className="text-[#0099B8]">Soal No. {currentIdx + 1}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#0099B8] to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Quick Grid Navigator */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = currentIdx === idx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  isCurrent 
                    ? 'bg-[#0099B8] text-white ring-2 ring-[#0099B8] ring-offset-1'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-5 sm:p-6 border border-slate-200 space-y-4">
        <div className="flex justify-between items-center gap-2 border-b pb-3">
          <Badge variant="info" className="text-xs bg-cyan-50 text-[#0099B8] border-cyan-200">
            {currentQ.category}
          </Badge>
          <span className="text-xs font-bold text-slate-400">Bobot: {currentQ.points} Poin</span>
        </div>

        <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
          {currentIdx + 1}. {currentQ.text}
        </div>

        {/* Options */}
        <div className="space-y-2.5 pt-2">
          {currentQ.options.map((opt, optIdx) => {
            const letter = optionLetters[optIdx];
            const isSelected = answers[currentQ.id] === letter;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectAnswer(currentQ.id, letter)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected 
                    ? 'border-[#0099B8] bg-cyan-50/70 text-slate-900 ring-1 ring-[#0099B8]' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  isSelected ? 'bg-[#0099B8] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {letter}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Navigation & Submission Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="px-4 py-2 text-xs font-bold"
          >
            <ArrowLeft size={14} className="mr-1" /> Sebelumnya
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleNext}
            disabled={currentIdx === questions.length - 1}
            className="px-4 py-2 text-xs font-bold"
          >
            Selanjutnya <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Lewati & Kerjakan di Dashboard
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleFinishTest}
            className="bg-[#0099B8] hover:bg-[#007A93] text-white px-6 font-bold text-xs shadow-md"
          >
            Selesaikan & Lihat Skor ({answeredCount}/20) ➔
          </Button>
        </div>
      </div>
    </div>
  );
};
