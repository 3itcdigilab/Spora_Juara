import React from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { defaultQuestionBank, calculatePsychometricResult } from '../../data/psychometricBank';
import { localDB } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, CheckCircle, Flag, ArrowLeft, Send } from 'lucide-react';

export const AssessmentReview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const questions = defaultQuestionBank;
  const rawAnswers = sessionStorage.getItem(`assessment_answers_${id}`) || '{}';
  const answers: Record<string, string> = JSON.parse(rawAnswers);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSubmit = () => {
    const studentId = user?.email?.toLowerCase().trim() || 'student@spora.id';
    const result = calculatePsychometricResult(answers);

    // Save calculated Talent Score
    localDB.saveTalentScore({
      id: `score-${Date.now()}`,
      studentId: studentId,
      overall: result.percentage,
      dimensions: [
        { key: 'technical', label: 'Technical & Green Energy', score: result.dimensions.technical, weight: 0.25, source: 'Induction Assessment', description: 'Penguasaan konsep powertrain EV dan Green Energy', color: '#10B981' },
        { key: 'safety', label: 'High Voltage Safety', score: result.dimensions.safety, weight: 0.25, source: 'Induction Assessment', description: 'Kepatuhan K3 & prosedur isolasi tegangan tinggi', color: '#0099B8' },
        { key: 'psychometric', label: 'Work Style & 5S', score: result.dimensions.psychometric, weight: 0.20, source: 'Induction Assessment', description: 'Ketelitian torsi dan etos kerja industri', color: '#8B5CF6' },
        { key: 'learningAgility', label: 'Learning Agility', score: result.dimensions.learningAgility, weight: 0.15, source: 'Induction Assessment', description: 'Kecepatan adaptasi teknologi baru', color: '#F59E0B' },
        { key: 'communication', label: 'Communication & Teamwork', score: result.dimensions.communication, weight: 0.15, source: 'Induction Assessment', description: 'Kolaborasi dan pemecahan masalah tim', color: '#3B82F6' }
      ],
      calculatedAt: new Date().toISOString(),
      configVersion: 'v2.0'
    });

    // Save Assessment Result
    localDB.saveAssessmentResult({
      id: `res-${Date.now()}`,
      studentId: studentId,
      assessmentId: id || 'ass-1',
      score: result.percentage,
      totalQuestions: questions.length,
      correctAnswers: result.totalScore / 5,
      timeTaken: 900,
      dimensionScores: result.dimensions,
      strengths: result.strengths,
      weaknesses: result.growthAreas,
      personalityType: result.archetype.title,
      completedAt: new Date().toISOString()
    });

    navigate(`/assessment/${id}/results`);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6 font-sans">
      <div className="text-center mb-8">
        <Badge className="bg-cyan-50 text-[#0099B8] border-cyan-200 mb-2">Tinjauan Pra-Submit</Badge>
        <h1 className="text-2xl font-bold text-slate-900">Tinjau Lembar Jawaban Asesmen</h1>
        <p className="text-slate-500 text-sm">Pastikan seluruh pertanyaan telah Anda jawab dengan seksama sebelum mengirimkan hasil akhir.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-slate-500 text-xs mb-1">Total Soal</p>
          <p className="text-2xl font-black text-slate-900">{questions.length}</p>
        </Card>
        <Card className="p-4 text-center border-emerald-200 bg-emerald-50/40">
          <p className="text-emerald-700 text-xs mb-1 font-bold">Sudah Terjawab</p>
          <p className="text-2xl font-black text-emerald-700">{answeredCount}</p>
        </Card>
        <Card className={`p-4 text-center ${unansweredCount > 0 ? 'border-red-200 bg-red-50/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <p className={`${unansweredCount > 0 ? 'text-red-700 font-bold' : 'text-slate-500'} text-xs mb-1`}>Belum Terjawab</p>
          <p className={`text-2xl font-black ${unansweredCount > 0 ? 'text-red-700' : 'text-slate-900'}`}>{unansweredCount}</p>
        </Card>
      </div>

      {unansweredCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 text-xs sm:text-sm font-medium">
          <AlertTriangle size={20} className="shrink-0 text-amber-600" />
          <span>Masih ada <strong>{unansweredCount} soal</strong> yang belum dijawab. Nilai Anda akan dihitung berdasarkan soal yang telah terisi.</span>
        </div>
      )}

      <Card className="overflow-hidden border border-slate-200">
        <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto">
          {questions.map((q, idx) => {
            const userAns = answers[q.id];
            return (
              <div key={q.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    userAns ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-md">{q.text}</p>
                    <span className="text-[11px] text-slate-400">{q.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {userAns ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle size={13} /> Pilihan: {userAns}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                      Belum Diisi
                    </span>
                  )}

                  <Link to={`/assessment/${id}/test`} className="text-xs font-bold text-[#0099B8] hover:underline">
                    Ubah
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Link to={`/assessment/${id}/test`}>
          <Button variant="outline" className="text-xs font-bold">
            <ArrowLeft size={14} className="mr-1" /> Kembali ke Soal
          </Button>
        </Link>
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold text-sm px-6 shadow-md flex items-center gap-1.5"
        >
          <Send size={16} /> Kumpulkan & Lihat Hasil Asesmen ➔
        </Button>
      </div>
    </div>
  );
};
