import React, { useState, useEffect } from 'react';
import { defaultQuestionBank, calculatePsychometricResult } from '../../data/psychometricBank';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
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
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface StudentOnboardingAssessmentProps {
  studentName: string;
  studentEmail: string;
  onComplete: (results: any) => void;
}

export const StudentOnboardingAssessment: React.FC<StudentOnboardingAssessmentProps> = ({
  studentName,
  studentEmail,
  onComplete
}) => {
  const { showToast } = useToast();
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
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      // Find the first unanswered question
      const unansweredIdx = questions.findIndex(q => !answers[q.id]);
      if (unansweredIdx >= 0) {
        setCurrentIdx(unansweredIdx);
      }
      showToast(`Mohon selesaikan seluruh ${questions.length} soal psikotes (${answeredCount}/${questions.length} terjawab) sebelum menyelesaikan pendaftaran!`, 'error');
      return;
    }

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

          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Selamat, {studentName}!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Hasil psikotes, uji keselamatan K3, dan pemahaman Green Energy Anda telah dianalisis oleh AI Engine.
          </p>

          <div className="my-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 inline-block max-w-md w-full">
            <div className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-1">
              AI Talent Archetype Terpilih
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">
              "{assessmentResult.archetype.title}"
            </div>
            <p className="text-xs text-slate-200 mt-1 font-light leading-relaxed">
              {assessmentResult.archetype.desc}
            </p>
          </div>

          {/* Scores Breakdown Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left my-4 max-w-xl mx-auto">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 block">Total Score</span>
              <span className="text-lg font-bold text-white">{assessmentResult.percentage}/100</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-300 block">Green Energy</span>
              <span className="text-lg font-bold text-emerald-400">{assessmentResult.dimensions.technical}%</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-cyan-300 block">Safety K3 HV</span>
              <span className="text-lg font-bold text-cyan-400">{assessmentResult.dimensions.safety}%</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] text-purple-300 block">Work Style 5S</span>
              <span className="text-lg font-bold text-purple-400">{assessmentResult.dimensions.psychometric}%</span>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => onComplete(assessmentResult)}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold text-sm px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Masuk ke Dashboard Siswa & Mulai Melamar ➔
          </Button>
        </div>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Test Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0099B8]" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Psikotes & Green Energy Induction Test (Wajib Diisi)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            20 Soal Terstandarisasi Industri EV Nasional • Jawab seluruh soal untuk validasi akun.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-[#0099B8] rounded-xl text-xs font-mono font-bold">
            <Clock size={14} /> {formatTime(timeLeft)}
          </div>
          <div className="text-xs font-bold text-slate-600">
            {answeredCount}/{questions.length} Selesai
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#0099B8] to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>

      {/* Question Number Pills Navigation */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200 max-h-24 overflow-y-auto">
        {questions.map((q, idx) => {
          const isAnswered = Boolean(answers[q.id]);
          const isCurrent = idx === currentIdx;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-[#0099B8] text-white ring-2 ring-[#0099B8]/40'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 shadow-sm relative">
        <div className="flex justify-between items-center border-b pb-3">
          <Badge 
            variant="info" 
            className="text-[11px] font-bold px-2.5 py-0.5"
          >
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
            variant="primary"
            onClick={handleFinishTest}
            className={`px-6 font-bold text-xs shadow-md transition-all ${
              answeredCount === questions.length
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : 'bg-[#0099B8] hover:bg-[#007A93] text-white'
            }`}
          >
            Selesaikan & Lihat Skor ({answeredCount}/{questions.length}) ➔
          </Button>
        </div>
      </div>
    </div>
  );
};
