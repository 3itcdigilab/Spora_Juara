import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { 
  ClipboardList, Plus, Edit2, Trash2, HelpCircle, CheckCircle2, 
  Brain, Sparkles, Search, RefreshCw, Cpu, ShieldCheck, Zap, 
  AlertTriangle, Briefcase, Eye, Printer, Download, UserCheck
} from 'lucide-react';
import { defaultQuestionBank } from '../../data/psychometricBank';
import { mockAssessments } from '../../data/assessments';
import { mockStudents } from '../../data/students';
import { openRouterService } from '../../services/OpenRouterAI';
import { AIPsychologicalReport } from '../../data/types';
import { getAll, addItem, updateItem, removeItem } from '../../services/firestoreSync';

export const AdminAssessments: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'questions' | 'ai_reports'>('ai_reports');

  // Assessment Modules State backed by Firestore
  const [assessments, setAssessments] = useState<any[]>(() => {
    const fromFs = getAll('assessments');
    return fromFs.length > 0 ? fromFs : mockAssessments;
  });

  // Questions Database State backed by Firestore
  const [questionsDb, setQuestionsDb] = useState<any[]>(() => {
    const fromFs = getAll('questions');
    return fromFs.length > 0 ? fromFs : defaultQuestionBank;
  });

  // AI Psychological Reports State
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
  const [aiSearchTerm, setAiSearchTerm] = useState('');
  const [selectedReportForView, setSelectedReportForView] = useState<any | null>(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Initialize or fetch AI reports
  const allReports = useMemo(() => {
    const saved = openRouterService.getAllReports();
    // If empty, pre-generate seeded entries for students
    if (saved.length === 0) {
      const initialReports: any[] = mockStudents.slice(0, 15).map((st, idx) => ({
        id: `ai-rep-seed-${st.id}`,
        studentId: st.email.toLowerCase().trim(),
        studentName: st.name,
        nisn: st.nisn,
        schoolName: st.schoolName,
        major: st.major,
        score: st.score,
        generatedAt: new Date(Date.now() - idx * 3600000).toISOString(),
        modelUsed: 'OpenRouter (deepseek/deepseek-chat)',
        archetype: idx % 3 === 0 ? 'The High-Voltage Safety Champion' : idx % 3 === 1 ? 'The Precision EV Battery Specialist' : 'The Agile Powertrain Troubleshooter',
        summary: `Kandidat ${st.name} memiliki kecerdasan logika elektrikal yang solid dengan skor K3 ${88 + (idx % 8)}%. Memiliki etos kerja manufaktur teruji dan disiplin 5S tinggi.`,
        bigFiveTraits: {
          conscientiousness: { score: 92 - (idx % 6), analysis: 'Sangat disiplin SOP dan presisi kalibrasi torsi' },
          emotionalStability: { score: 89 - (idx % 5), analysis: 'Tenang dalam penanganan darurat thermal runaway' },
          extraversion: { score: 82 + (idx % 8), analysis: 'Komunikatif dalam serah terima shift (handover)' },
          agreeableness: { score: 88, analysis: 'Kooperatif dalam tim manufaktur baterai' },
          openness: { score: 94 - (idx % 7), analysis: 'Adaptif terhadap teknologi BMS dan converter baru' }
        },
        safetyMindsetIndex: 88 + (idx % 8),
        workplaceStrengths: [
          'Kepatuhan ketat terhadap SOP LOTO (Lockout/Tagout) dan isolasi tegangan tinggi.',
          'Pemahaman mendalam mengenai sirkuit baterai pack EV dan balancing cell.',
          'Disiplin 5S dan budaya pencegahan cacat perakitan (Poka-Yoke).'
        ],
        operationalRisks: [
          'Perlu supervisi berkala saat pertama kali menangani pack baterai di atas 800V DC.',
          'Pastikan terus memperbarui wawasan standar protokol DC Fast Charging.'
        ],
        developmentRecommendations: [
          'Ikuti sertifikasi BNSP Teknisi Otomotif Listrik Level 3.',
          'Pelajari protokol komunikasi telemetri IoT baterai.'
        ],
        recommendedEVRoles: [
          'EV Battery Assembly & QC Inspector',
          'High-Voltage Maintenance Specialist',
          'SPKLU Charging Infrastructure Tech',
          'Powertrain Retrofit Specialist'
        ]
      }));

      initialReports.forEach(r => openRouterService.saveReport(r));
      return initialReports;
    }
    return saved;
  }, [reportsRefreshKey]);

  const filteredReports = useMemo(() => {
    return allReports.filter(r => {
      const term = aiSearchTerm.toLowerCase();
      return (
        !term ||
        r.studentName?.toLowerCase().includes(term) ||
        r.nisn?.includes(term) ||
        r.schoolName?.toLowerCase().includes(term) ||
        r.archetype?.toLowerCase().includes(term)
      );
    });
  }, [allReports, aiSearchTerm]);

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
      updateItem('assessments', editingAssessment.id, moduleFormData);
      showToast(`Modul asesmen "${moduleFormData.title}" diperbarui.`, 'success');
    } else {
      const newEntry = { id: `ass-${Date.now()}`, ...moduleFormData, questionsCount: 0 };
      updatedList.unshift(newEntry);
      addItem('assessments', newEntry);
      showToast(`Modul asesmen baru "${moduleFormData.title}" berhasil dibuat!`, 'success');
    }

    setAssessments(updatedList);
    setIsModuleModalOpen(false);
  };

  const handleDeleteModule = (id: string, title: string) => {
    if (!window.confirm(`Hapus modul asesmen "${title}"?`)) return;

    const filtered = assessments.filter(a => a.id !== id);
    removeItem('assessments', id);
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
      updateItem('questions', editingQuestion.id, newQuestionObj);
      showToast('Soal & Kunci Jawaban diperbarui.', 'success');
    } else {
      currentQuestions.push(newQuestionObj);
      addItem('questions', newQuestionObj);
      showToast('Soal & Kunci Jawaban baru ditambahkan!', 'success');
    }

    setQuestionsDb(currentQuestions);

    const updatedCount = currentQuestions.filter(q => q.assessmentId === selectedAssessmentForQuestions.id).length;
    const updatedModules = assessments.map(a => a.id === selectedAssessmentForQuestions.id ? { ...a, questionsCount: updatedCount } : a);
    updateItem('assessments', selectedAssessmentForQuestions.id, { questionsCount: updatedCount });
    setAssessments(updatedModules);

    setIsQuestionFormOpen(false);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!window.confirm('Hapus soal ini dari bank pertanyaan?')) return;

    const filtered = questionsDb.filter(q => q.id !== qId);
    removeItem('questions', qId);
    setQuestionsDb(filtered);

    if (selectedAssessmentForQuestions) {
      const updatedCount = filtered.filter(q => q.assessmentId === selectedAssessmentForQuestions.id).length;
      const updatedModules = assessments.map(a => a.id === selectedAssessmentForQuestions.id ? { ...a, questionsCount: updatedCount } : a);
      updateItem('assessments', selectedAssessmentForQuestions.id, { questionsCount: updatedCount });
      setAssessments(updatedModules);
    }

    showToast('Soal dihapus.', 'warning');
  };

  // Open full dossier
  const handleInspectDossier = (report: any) => {
    setSelectedReportForView(report);
    setIsDossierModalOpen(true);
  };

  // Run Batch AI generation via OpenRouter
  const handleBatchEvaluateWithOpenRouter = async () => {
    setIsBatchGenerating(true);
    showToast('Memulai evaluasi AI Psikotes via OpenRouter...', 'info');

    try {
      // Pick next 5 unassessed students
      const unassessed = mockStudents.slice(15, 20);
      for (const st of unassessed) {
        await openRouterService.generatePsychologicalReport({
          studentId: st.email.toLowerCase().trim(),
          studentName: st.name,
          nisn: st.nisn,
          schoolName: st.schoolName,
          major: st.major,
          dimensionScores: {
            technical: 85 + (st.score % 10),
            safety: 88 + (st.score % 10),
            psychometric: 86 + (st.score % 10),
            learningAgility: 84 + (st.score % 10),
            communication: 82 + (st.score % 10)
          },
          overallScore: st.score,
          personalityType: 'The High-Voltage Safety Champion & Precision Specialist'
        });
      }
      setReportsRefreshKey(k => k + 1);
      showToast('Berhasil menganalisis psikotes 5 kandidat via OpenRouter AI!', 'success');
    } catch (err: any) {
      showToast('Gagal memproses batch OpenRouter: ' + err.message, 'error');
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const currentQuestions = selectedAssessmentForQuestions
    ? questionsDb.filter(q => q.assessmentId === selectedAssessmentForQuestions.id)
    : [];

  return (
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="Psychological Assessment & Question Bank Manager" 
        subtitle="Laporan analisis psikotes OpenRouter AI, monitoring K3, evaluasi Big Five, dan pengelolaan modul bank soal."
      >
        <div className="flex gap-2">
          {activeTab === 'questions' ? (
            <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white flex items-center gap-1.5" onClick={handleOpenAddModule}>
              <Plus size={16} /> Add Assessment Module
            </Button>
          ) : (
            <Button 
              variant="primary" 
              className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1.5 font-bold text-xs" 
              onClick={handleBatchEvaluateWithOpenRouter}
              disabled={isBatchGenerating}
            >
              <Sparkles size={15} className={isBatchGenerating ? 'animate-spin' : ''} />
              {isBatchGenerating ? 'Menganalisis OpenRouter...' : '⚡ Generate AI Batch Evaluation'}
            </Button>
          )}
        </div>
      </PageHeader>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ai_reports')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === 'ai_reports'
              ? 'border-violet-600 text-violet-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain size={18} />
          <span>🧠 Laporan Psikotes AI (OpenRouter Reports)</span>
          <span className="bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full text-xs font-black">
            {allReports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === 'questions'
              ? 'border-[#0099B8] text-[#0099B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList size={18} />
          <span>📋 Modul & Bank Soal (20 Soal Green Energy)</span>
          <span className="bg-cyan-100 text-[#0099B8] px-2 py-0.5 rounded-full text-xs font-black">
            {assessments.length}
          </span>
        </button>
      </div>

      {/* TAB 1: AI PSYCHOLOGICAL REPORTS */}
      {activeTab === 'ai_reports' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top KPI Cards for Psychological Insight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-violet-500 bg-violet-50/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Laporan AI</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{allReports.length} Kandidat</h3>
                <p className="text-[11px] text-violet-600 font-semibold mt-0.5">Teranalisis OpenRouter</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <Brain size={22} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-emerald-500 bg-emerald-50/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Safety Mindset (K3)</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">91.4%</h3>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">High-Voltage Compliant</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-blue-500 bg-blue-50/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Conscientiousness</p>
                <h3 className="text-2xl font-black text-blue-600 mt-1">92.8%</h3>
                <p className="text-[11px] text-blue-700 font-semibold mt-0.5">5S & Torsi Presisi</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Zap size={22} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-[#0099B8] bg-cyan-50/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engine OpenRouter</p>
                <h3 className="text-base font-extrabold text-[#0099B8] mt-1 truncate max-w-[140px]">
                  {openRouterService.getModel().split('/')[1] || 'DeepSeek V3'}
                </h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Online
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-cyan-100 text-[#0099B8] flex items-center justify-center">
                <Cpu size={22} />
              </div>
            </Card>
          </div>

          {/* Search & Filter Header */}
          <Card className="p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="text-violet-600" size={20} />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Daftar Analisis Psikometrik & Behavioral Fit Siswa ({filteredReports.length})
                </h3>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari kandidat, NISN, archetype, SMK..." 
                    className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    value={aiSearchTerm}
                    onChange={(e) => setAiSearchTerm(e.target.value)}
                  />
                </div>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => setReportsRefreshKey(k => k + 1)}>
                  <RefreshCw size={13} />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b text-xs font-bold uppercase">
                    <th className="p-4">Nama Siswa & NISN</th>
                    <th className="p-4">SMK / Asal Sekolah</th>
                    <th className="p-4">Archetype Karakter AI</th>
                    <th className="p-4 text-center">Safety Mindset</th>
                    <th className="p-4 text-center">Disiplin 5S</th>
                    <th className="p-4">Model OpenRouter</th>
                    <th className="p-4 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <Brain size={36} className="mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-700">Belum Ada Laporan Psikotes Ditemukan</p>
                        <p className="text-xs text-slate-400 mt-1">Klik tombol "+ Generate AI Batch Evaluation" untuk menganalisis kandidat secara otomatis.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((rep: any) => (
                      <tr key={rep.id || rep.studentId} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{rep.studentName || 'Kandidat Siswa'}</p>
                          <p className="font-mono text-xs text-[#0099B8] font-bold">NISN: {rep.nisn || '0071234501'}</p>
                        </td>
                        <td className="p-4 text-slate-700 text-xs font-semibold">
                          {rep.schoolName || 'SMKN 1 Cikarang Pusat'}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold inline-flex items-center gap-1">
                            <Sparkles size={12} className="text-violet-600" />
                            {rep.archetype}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                            {rep.safetyMindsetIndex || 90}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                            {rep.bigFiveTraits?.conscientiousness?.score || 92}%
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs font-mono">
                          {rep.modelUsed || 'OpenRouter LLM'}
                        </td>
                        <td className="p-4 text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs font-bold text-violet-700 border-violet-200 bg-violet-50/50 hover:bg-violet-100 flex items-center gap-1 ml-auto"
                            onClick={() => handleInspectDossier(rep)}
                          >
                            <Eye size={13} /> Buka Dossier Lengkap
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: QUESTIONS & ASSESSMENT MODULES */}
      {activeTab === 'questions' && (
        <Card className="p-0 overflow-hidden animate-fadeIn">
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
      )}

      {/* MODAL: FULL AI PSYCHOLOGICAL DOSSIER REPORT */}
      {selectedReportForView && (
        <Modal 
          isOpen={isDossierModalOpen} 
          onClose={() => setIsDossierModalOpen(false)} 
          title={`AI Psychological Dossier: ${selectedReportForView.studentName}`}
        >
          <div className="space-y-6 font-sans max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Candidate Meta */}
            <div className="p-4 bg-gradient-to-r from-violet-900 to-slate-900 text-white rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-violet-300 tracking-wider">Candidate Dossier</span>
                <h3 className="text-lg font-extrabold">{selectedReportForView.studentName}</h3>
                <p className="text-xs text-slate-300">
                  NISN: <span className="font-mono text-cyan-300 font-bold">{selectedReportForView.nisn || '0071234501'}</span> • {selectedReportForView.schoolName}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-violet-500/30 text-violet-200 border border-violet-400/40 text-xs font-bold">
                  {selectedReportForView.modelUsed || 'OpenRouter LLM'}
                </Badge>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(selectedReportForView.generatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Archetype & Summary */}
            <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-200 space-y-2">
              <div className="flex items-center gap-2 text-violet-900 font-bold text-sm">
                <Sparkles size={16} className="text-violet-600" />
                <span>Archetype: {selectedReportForView.archetype}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedReportForView.summary}
              </p>
            </div>

            {/* Big Five Personality Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Brain size={14} className="text-violet-600" /> Big Five Industrial Work Traits
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-lg border text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Conscientiousness</p>
                  <p className="text-lg font-black text-emerald-600">{selectedReportForView.bigFiveTraits?.conscientiousness?.score || 90}%</p>
                  <p className="text-[9px] text-slate-400">{selectedReportForView.bigFiveTraits?.conscientiousness?.analysis || 'Disiplin SOP'}</p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Emotional Stability</p>
                  <p className="text-lg font-black text-blue-600">{selectedReportForView.bigFiveTraits?.emotionalStability?.score || 88}%</p>
                  <p className="text-[9px] text-slate-400">{selectedReportForView.bigFiveTraits?.emotionalStability?.analysis || 'Tenang di darurat'}</p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Extraversion</p>
                  <p className="text-lg font-black text-indigo-600">{selectedReportForView.bigFiveTraits?.extraversion?.score || 80}%</p>
                  <p className="text-[9px] text-slate-400">{selectedReportForView.bigFiveTraits?.extraversion?.analysis || 'Komunikasi shift'}</p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Agreeableness</p>
                  <p className="text-lg font-black text-cyan-600">{selectedReportForView.bigFiveTraits?.agreeableness?.score || 85}%</p>
                  <p className="text-[9px] text-slate-400">{selectedReportForView.bigFiveTraits?.agreeableness?.analysis || 'Kooperatif tim'}</p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Openness (Agility)</p>
                  <p className="text-lg font-black text-purple-600">{selectedReportForView.bigFiveTraits?.openness?.score || 92}%</p>
                  <p className="text-[9px] text-slate-400">{selectedReportForView.bigFiveTraits?.openness?.analysis || 'Cepat adaptasi EV'}</p>
                </div>
              </div>
            </div>

            {/* Strengths & Operational Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" /> Keunggulan di Lingkungan Pabrik
                </h4>
                <ul className="text-xs text-emerald-900 space-y-1 list-disc pl-4">
                  {selectedReportForView.workplaceStrengths?.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200 space-y-1.5">
                <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-red-600" /> Mitigasi Blindspot & Risiko Operasional
                </h4>
                <ul className="text-xs text-red-900 space-y-1 list-disc pl-4">
                  {selectedReportForView.operationalRisks?.map((r: string, idx: number) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Industrial Roles */}
            <div className="p-3.5 bg-slate-50 rounded-xl border space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#0099B8]" /> Rekomendasi Penempatan Divisi Manufaktur EV
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedReportForView.recommendedEVRoles?.map((role: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 shadow-2xs">
                    ⚡ {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1 text-slate-600"
                onClick={() => window.print()}
              >
                <Printer size={13} /> Cetak / Print Dossier
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-[#0099B8] text-white text-xs font-bold"
                onClick={() => setIsDossierModalOpen(false)}
              >
                Tutup Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}

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
