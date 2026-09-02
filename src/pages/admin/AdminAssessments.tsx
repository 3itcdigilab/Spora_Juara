import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { ClipboardList, Plus, Edit2, Trash2, HelpCircle, CheckCircle2, FileQuestion, Key, Leaf, Zap, Sparkles, Filter } from 'lucide-react';
import { defaultQuestionBank } from '../../data/psychometricBank';
import { mockAssessments } from '../../data/assessments';

export const AdminAssessments: React.FC = () => {
  const { showToast } = useToast();

  // Assessment Modules State
  const [assessments, setAssessments] = useState<any[]>(() => {
    const raw = localStorage.getItem('spora_assessments_db');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
    localStorage.setItem('spora_assessments_db', JSON.stringify(mockAssessments));
    return mockAssessments;
  });

  // Questions Database State
  const [questionsDb, setQuestionsDb] = useState<any[]>(() => {
    const raw = localStorage.getItem('spora_questions_db');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length >= defaultQuestionBank.length) return parsed;
    }
    localStorage.setItem('spora_questions_db', JSON.stringify(defaultQuestionBank));
    return defaultQuestionBank;
  });

  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<string>('All');

  // Modal States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<any | null>(null);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedAssessmentForQuestions, setSelectedAssessmentForQuestions] = useState<any | null>(null);

  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

  // Forms
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    category: 'Technical EV',
    timeLimit: 30,
    passingScore: 75,
    status: 'Active'
  });

  const [questionFormData, setQuestionFormData] = useState({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    points: 20
  });

  // Handlers for Assessment Modules
  const handleOpenAddModule = () => {
    setEditingAssessment(null);
    setModuleFormData({ title: '', category: 'Technical EV', timeLimit: 30, passingScore: 75, status: 'Active' });
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (ass: any) => {
    setEditingAssessment(ass);
    setModuleFormData({
      title: ass.title || '',
      category: ass.category || 'Technical EV',
      timeLimit: ass.timeLimit || 30,
      passingScore: ass.passingScore || 75,
      status: ass.status || 'Active'
    });
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList = [...assessments];

    if (editingAssessment) {
      updatedList = updatedList.map(a => a.id === editingAssessment.id ? { ...a, ...moduleFormData } : a);
      showToast(`Modul asesmen "${moduleFormData.title}" diperbarui.`, 'success');
    } else {
      const newEntry = { id: `ass-${Date.now()}`, ...moduleFormData, questionsCount: 0 };
      updatedList.unshift(newEntry);
      showToast(`Modul asesmen baru "${moduleFormData.title}" berhasil dibuat!`, 'success');
    }

    localStorage.setItem('spora_assessments_db', JSON.stringify(updatedList));
    setAssessments(updatedList);
    setIsModuleModalOpen(false);
  };

  const handleDeleteModule = (id: string, title: string) => {
    if (!window.confirm(`Hapus modul asesmen "${title}"?`)) return;

    const filtered = assessments.filter(a => a.id !== id);
    localStorage.setItem('spora_assessments_db', JSON.stringify(filtered));
    setAssessments(filtered);
    showToast(`Modul asesmen "${title}" dihapus.`, 'warning');
  };

  // Handlers for Question Bank
  const handleOpenQuestionBank = (ass: any) => {
    setSelectedAssessmentForQuestions(ass);
    setIsQuestionModalOpen(true);
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      points: 20
    });
    setIsQuestionFormOpen(true);
  };

  const handleOpenEditQuestion = (q: any) => {
    setEditingQuestion(q);
    setQuestionFormData({
      text: q.text || '',
      optionA: q.options?.[0] || '',
      optionB: q.options?.[1] || '',
      optionC: q.options?.[2] || '',
      optionD: q.options?.[3] || '',
      correctAnswer: q.correctAnswer || 'A',
      points: q.points || 20
    });
    setIsQuestionFormOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessmentForQuestions) return;

    let currentQuestions = [...questionsDb];
    const newQuestionObj = {
      id: editingQuestion ? editingQuestion.id : `q-${Date.now()}`,
      assessmentId: selectedAssessmentForQuestions.id,
      text: questionFormData.text,
      options: [questionFormData.optionA, questionFormData.optionB, questionFormData.optionC, questionFormData.optionD],
      correctAnswer: questionFormData.correctAnswer,
      points: Number(questionFormData.points)
    };

    if (editingQuestion) {
      currentQuestions = currentQuestions.map(q => q.id === editingQuestion.id ? newQuestionObj : q);
      showToast('Soal & Kunci Jawaban diperbarui.', 'success');
    } else {
      currentQuestions.push(newQuestionObj);
      showToast('Soal & Kunci Jawaban baru ditambahkan!', 'success');
    }

    localStorage.setItem('spora_questions_db', JSON.stringify(currentQuestions));
    setQuestionsDb(currentQuestions);

    // Update count in module
    const updatedCount = currentQuestions.filter(q => q.assessmentId === selectedAssessmentForQuestions.id).length;
    const updatedModules = assessments.map(a => a.id === selectedAssessmentForQuestions.id ? { ...a, questionsCount: updatedCount } : a);
    localStorage.setItem('spora_assessments_db', JSON.stringify(updatedModules));
    setAssessments(updatedModules);

    setIsQuestionFormOpen(false);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!window.confirm('Hapus soal ini dari bank pertanyaan?')) return;

    const filtered = questionsDb.filter(q => q.id !== qId);
    localStorage.setItem('spora_questions_db', JSON.stringify(filtered));
    setQuestionsDb(filtered);

    // Update count
    if (selectedAssessmentForQuestions) {
      const updatedCount = filtered.filter(q => q.assessmentId === selectedAssessmentForQuestions.id).length;
      const updatedModules = assessments.map(a => a.id === selectedAssessmentForQuestions.id ? { ...a, questionsCount: updatedCount } : a);
      localStorage.setItem('spora_assessments_db', JSON.stringify(updatedModules));
      setAssessments(updatedModules);
    }

    showToast('Soal dihapus.', 'warning');
  };

  const currentQuestions = selectedAssessmentForQuestions
    ? questionsDb.filter(q => q.assessmentId === selectedAssessmentForQuestions.id)
    : [];

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="EV Assessment & Question Bank Manager (CRUD)" 
        subtitle="Buat modul ujian, kelola bank soal pilihan ganda, dan tentukan kunci jawaban & bobot nilai."
      >
        <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModule}>
          <Plus size={16} /> Add New Assessment Module
        </Button>
      </PageHeader>

      {/* Modules Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ClipboardList size={18} className="text-[#0099B8]" /> Modul Ujian Terdaftar ({assessments.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                <th className="p-4">Judul Modul Ujian</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Durasi Ujian</th>
                <th className="p-4">Jumlah Soal</th>
                <th className="p-4">Passing Score</th>
                <th className="p-4 text-right">Kelola Soal & Kunci (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map((a) => {
                const qCount = questionsDb.filter(q => q.assessmentId === a.id).length;
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{a.title}</td>
                    <td className="p-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 text-xs font-bold">
                        {a.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-700">{a.timeLimit} Menit</td>
                    <td className="p-4 font-mono text-xs text-slate-700">
                      <Badge className="bg-cyan-50 text-[#0099B8] border-cyan-200">
                        {qCount} Soal Tersedia
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-emerald-100 text-emerald-800 font-bold border-emerald-300">
                        {a.passingScore}/100
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <Button 
                          size="sm" 
                          className="bg-[#0099B8] hover:bg-[#007A93] text-white text-xs px-3 py-1 flex items-center gap-1"
                          onClick={() => handleOpenQuestionBank(a)}
                        >
                          <HelpCircle size={14} /> Kelola Soal & Kunci ({qCount})
                        </Button>
                        <Button size="sm" variant="outline" className="p-1.5" onClick={() => handleOpenEditModule(a)}>
                          <Edit2 size={14} className="text-slate-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1.5 text-red-600 hover:bg-red-50" onClick={() => handleDeleteModule(a.id, a.title)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add/Edit Module */}
      <Modal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} title={editingAssessment ? "Edit Assessment Module" : "Add New Assessment Module"}>
        <form onSubmit={handleSaveModule} className="space-y-4 pt-2 font-sans">
          <Input label="Judul Modul Ujian (e.g. Technical EV Battery Test)" value={moduleFormData.title} onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })} required />
          <Input label="Kategori Asesmen" value={moduleFormData.category} onChange={(e) => setModuleFormData({ ...moduleFormData, category: e.target.value })} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Durasi Waktu Ujian (Menit)" type="number" value={moduleFormData.timeLimit} onChange={(e) => setModuleFormData({ ...moduleFormData, timeLimit: parseInt(e.target.value) })} required />
            <Input label="Min. Passing Score (0-100)" type="number" value={moduleFormData.passingScore} onChange={(e) => setModuleFormData({ ...moduleFormData, passingScore: parseInt(e.target.value) })} required />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModuleModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8]">Save Module</Button>
          </div>
        </form>
      </Modal>

      {/* Question Bank Manager Modal Drawer */}
      {selectedAssessmentForQuestions && (
        <Modal 
          isOpen={isQuestionModalOpen} 
          onClose={() => setIsQuestionModalOpen(false)} 
          title={`Bank Soal & Kunci Jawaban: ${selectedAssessmentForQuestions.title}`}
        >
          <div className="space-y-4 font-sans max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
              <div>
                <p className="text-xs font-bold text-slate-900">Total Pertanyaan: {currentQuestions.length} Soal</p>
                <p className="text-[11px] text-slate-500">Pilihan ganda dengan kunci jawaban otomatis.</p>
              </div>
              <Button size="sm" variant="primary" className="bg-[#0099B8] text-white text-xs" onClick={handleOpenAddQuestion}>
                <Plus size={14} className="mr-1" /> Tambah Soal & Kunci
              </Button>
            </div>

            {currentQuestions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-500 text-xs">
                Belum ada soal pada modul ini. Klik <strong>"+ Tambah Soal & Kunci"</strong> untuk menyetel soal ujian.
              </div>
            ) : (
              <div className="space-y-3">
                {currentQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 border border-slate-200 rounded-xl bg-white space-y-2 relative hover:border-slate-300">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900">Soal #{idx + 1} ({q.points} Poin)</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="p-1" onClick={() => handleOpenEditQuestion(q)}>
                          <Edit2 size={13} className="text-slate-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 text-red-600" onClick={() => handleDeleteQuestion(q.id)}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">{q.text}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      {['A', 'B', 'C', 'D'].map((letter, lIdx) => {
                        const optText = q.options?.[lIdx] || '';
                        const isCorrect = q.correctAnswer === letter;
                        return (
                          <div 
                            key={letter} 
                            className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                              isCorrect ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}
                          >
                            <span>{letter}. {optText}</span>
                            {isCorrect && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">KUNCI BENAR ✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsQuestionModalOpen(false)}>Selesai / Tutup</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Form for Add/Edit Individual Question & Answer Key */}
      <Modal 
        isOpen={isQuestionFormOpen} 
        onClose={() => setIsQuestionFormOpen(false)} 
        title={editingQuestion ? "Edit Soal & Kunci Jawaban" : "Setel Soal & Kunci Jawaban Baru"}
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4 pt-2 font-sans">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Teks Pertanyaan / Soal Ujian</label>
            <textarea 
              rows={3} 
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0099B8] focus:outline-none"
              placeholder="e.g. Berapa batas tegangan maksimal yang dikategorikan sebagai High Voltage?"
              value={questionFormData.text}
              onChange={(e) => setQuestionFormData({ ...questionFormData, text: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Pilihan A" value={questionFormData.optionA} onChange={(e) => setQuestionFormData({ ...questionFormData, optionA: e.target.value })} required />
            <Input label="Pilihan B" value={questionFormData.optionB} onChange={(e) => setQuestionFormData({ ...questionFormData, optionB: e.target.value })} required />
            <Input label="Pilihan C" value={questionFormData.optionC} onChange={(e) => setQuestionFormData({ ...questionFormData, optionC: e.target.value })} required />
            <Input label="Pilihan D" value={questionFormData.optionD} onChange={(e) => setQuestionFormData({ ...questionFormData, optionD: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border">
            <div>
              <label className="block text-xs font-bold text-emerald-800 mb-1">🔑 Pilih Kunci Jawaban Benar</label>
              <select 
                className="w-full p-2.5 border border-emerald-300 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-900"
                value={questionFormData.correctAnswer}
                onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
              >
                <option value="A">Kunci Jawaban: Pilihan A</option>
                <option value="B">Kunci Jawaban: Pilihan B</option>
                <option value="C">Kunci Jawaban: Pilihan C</option>
                <option value="D">Kunci Jawaban: Pilihan D</option>
              </select>
            </div>

            <Input 
              label="Bobot Nilai / Poin Soal" 
              type="number" 
              value={questionFormData.points} 
              onChange={(e) => setQuestionFormData({ ...questionFormData, points: parseInt(e.target.value) })} 
              required 
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsQuestionFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8]">Simpan Soal & Kunci Jawaban</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
