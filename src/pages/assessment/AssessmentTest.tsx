import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';

// Mock questions
const mockQuestions = [
  { id: 1, text: 'What is the primary function of a Battery Management System (BMS)?', options: ['Cooling', 'Monitoring cell voltage', 'Charging', 'Discharging'] },
  { id: 2, text: 'Which tool is best for measuring high voltage systems safely?', options: ['Multimeter', 'Oscilloscope', 'Megohmmeter', 'Standard Voltmeter'] },
  { id: 3, text: 'What is the standard PPE requirement for EV battery maintenance?', options: ['Safety glasses only', 'Class 0 gloves', 'Class 0 gloves, arc flash shield, insulated tools', 'Cotton gloves'] },
  { id: 4, text: 'Identify the safe procedure for isolating an EV powertrain.', options: ['Remove main fuse', 'Disconnect 12V then service disconnect', 'Cut main cables', 'Turn off ignition only'] },
  { id: 5, text: 'What does a sudden drop in a single cell voltage indicate?', options: ['Normal operation', 'Cell degradation or fault', 'Overcharging', 'BMS failure'] },
];

export const AssessmentTest: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const currentQ = mockQuestions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === mockQuestions.length - 1;

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
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    setTimeout(() => setSaveState('saved'), 500);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="font-bold text-gray-900 hidden sm:block">Technical Assessment: EV Fundamentals</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Question {currentQuestionIdx + 1} of {mockQuestions.length}</span>
            {saveState === 'saving' && <span className="text-amber-500 text-xs">Saving...</span>}
            {saveState === 'saved' && <span className="text-emerald-500 text-xs">Saved ✓</span>}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-lg font-bold
          ${isCriticalTime ? 'bg-red-100 text-red-600 animate-pulse' : 
            isLowTime ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-700'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col">
          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10 flex-1 flex flex-col">
              
              <div className="flex justify-between items-start mb-6">
                <span className="inline-block bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-md mb-4">
                  Q{currentQuestionIdx + 1}
                </span>
                <button 
                  onClick={toggleFlag}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    flagged.has(currentQ.id) 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">⚑</span> {flagged.has(currentQ.id) ? 'Flagged' : 'Flag for Review'}
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl text-gray-900 font-medium mb-8">
                {currentQ.text}
              </h2>

              <div className="space-y-3 flex-1">
                {currentQ.options.map((opt, i) => (
                  <label key={i} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    answers[currentQ.id] === opt 
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name={`question-${currentQ.id}`}
                      value={opt}
                      checked={answers[currentQ.id] === opt}
                      onChange={() => handleAnswer(opt)}
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-800 text-lg">{opt}</span>
                  </label>
                ))}
              </div>

              {/* Bottom Nav */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <Button 
                  variant="outline" 
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                >
                  Previous
                </Button>
                
                {isLastQuestion ? (
                  <Button 
                    variant="primary"
                    onClick={() => navigate(`/assessment/${id}/review`)}
                  >
                    Review & Submit
                  </Button>
                ) : (
                  <Button 
                    variant="primary"
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  >
                    Next Question
                  </Button>
                )}
              </div>

            </div>
          </div>
        </main>

        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden lg:flex w-72 flex-col bg-white border-l border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-4 gap-2">
            {mockQuestions.map((q, i) => {
              const isCurrent = i === currentQuestionIdx;
              const isAnswered = !!answers[q.id];
              const isFlagged = flagged.has(q.id);
              
              let btnClass = "border-gray-200 text-gray-600 hover:bg-gray-50"; // default unattempted
              if (isCurrent) btnClass = "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200";
              else if (isFlagged) btnClass = "border-amber-400 bg-amber-50 text-amber-700";
              else if (isAnswered) btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700";

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(i)}
                  className={`h-10 rounded-md border font-medium flex items-center justify-center transition-all ${btnClass}`}
                >
                  {i + 1}
                  {isFlagged && <span className="absolute -top-1 -right-1 text-[10px]">⚑</span>}
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto pt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Answered</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-200"></span> Unanswered</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Flagged</div>
          </div>
        </aside>

        {/* Mobile bottom drawer toggle could go here */}
      </div>
    </div>
  );
};
