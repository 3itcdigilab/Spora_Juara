import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { defaultQuestionBank } from '../../data/psychometricBank';
import { Clock, Flag, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AssessmentTest: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const questions = defaultQuestionBank;
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = sessionStorage.getItem(`assessment_answers_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const currentQ = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/assessment/${id}/review`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [id, navigate]);

  const handleAnswer = (val: string) => {
    setSaveState('saving');
    const updated = { ...answers, [currentQ.id]: val };
    setAnswers(updated);
    try {
      sessionStorage.setItem(`assessment_answers_${id}`, JSON.stringify(updated));
    } catch {}
    setTimeout(() => setSaveState('saved'), 400);
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isLowTime = timeLeft < 300; // < 5 mins
  const isCriticalTime = timeLeft < 60; // < 1 min

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="font-bold text-slate-900 text-sm sm:text-base hidden sm:block">
            Psikotes & Green Energy Induction Test (20 Soal)
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Soal {currentQuestionIdx + 1} dari {questions.length}</span>
            {saveState === 'saving' && <span className="text-amber-500 font-bold">Menyimpan...</span>}
            {saveState === 'saved' && <span className="text-emerald-500 font-bold">Tersimpan ✓</span>}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold
          ${isCriticalTime ? 'bg-red-100 text-red-600 animate-pulse' : 
            isLowTime ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-700'}`}>
          <Clock size={16} /> {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col">
          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-[#0099B8] text-white font-extrabold px-3 py-1 rounded-lg text-xs">
                      Soal #{currentQuestionIdx + 1}
                    </span>
                    <Badge variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 text-xs">
                      {currentQ.category}
                    </Badge>
                  </div>
                  <button 
                    onClick={toggleFlag}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      flagged.has(currentQ.id) 
                        ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                        : 'text-slate-500 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Flag size={14} /> {flagged.has(currentQ.id) ? 'Ditandai Ragu' : 'Tandai Ragu'}
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed pt-2">
                  {currentQ.text}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-4">
                  {currentQ.options.map((opt, optIdx) => {
                    const letter = optionLetters[optIdx];
                    const isSelected = answers[currentQ.id] === letter;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswer(letter)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                          isSelected 
                            ? 'border-[#0099B8] bg-cyan-50/70 text-slate-900 ring-2 ring-[#0099B8] font-medium shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#0099B8] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-sm leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Button 
                  variant="outline" 
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="px-5 py-2 font-bold text-xs"
                >
                  <ArrowLeft size={14} className="mr-1" /> Sebelumnya
                </Button>
                
                {isLastQuestion ? (
                  <Button 
                    variant="primary"
                    onClick={() => navigate(`/assessment/${id}/review`)}
                    className="bg-[#0099B8] hover:bg-[#007A93] text-white px-6 font-bold text-xs shadow-md"
                  >
                    Tinjau & Kumpulkan ➔
                  </Button>
                ) : (
                  <Button 
                    variant="primary"
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="bg-[#0099B8] hover:bg-[#007A93] text-white px-6 font-bold text-xs shadow-md"
                  >
                    Soal Berikutnya <ArrowRight size={14} className="ml-1" />
                  </Button>
                )}
              </div>

            </div>
          </div>
        </main>

        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden lg:flex w-80 flex-col bg-white border-l border-slate-200 p-5 shadow-inner">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Navigasi Soal Asesmen</h3>
          <p className="text-xs text-slate-500 mb-4">Pilih nomor untuk langsung menuju soal.</p>
          
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, i) => {
              const isCurrent = i === currentQuestionIdx;
              const isAnswered = !!answers[q.id];
              const isFlagged = flagged.has(q.id);
              
              let btnClass = "border-slate-200 text-slate-600 hover:bg-slate-50";
              if (isCurrent) btnClass = "border-[#0099B8] bg-cyan-50 text-[#0099B8] ring-2 ring-[#0099B8]";
              else if (isFlagged) btnClass = "border-amber-400 bg-amber-50 text-amber-700 font-bold";
              else if (isAnswered) btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold";

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(i)}
                  className={`h-10 rounded-xl border font-bold text-xs flex items-center justify-center transition-all relative ${btnClass}`}
                >
                  {i + 1}
                  {isFlagged && <span className="absolute -top-1 -right-1 text-[10px] text-amber-600">⚑</span>}
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto pt-6 space-y-2 text-xs border-t border-slate-100 font-semibold text-slate-600">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Sudah Terjawab ({Object.keys(answers).length})</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Belum Terjawab ({questions.length - Object.keys(answers).length})</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Ditandai Ragu ({flagged.size})</div>
          </div>
        </aside>
      </div>
    </div>
  );
};
