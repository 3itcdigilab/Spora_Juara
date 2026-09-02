import { Assessment, Question } from './types';
import { defaultQuestionBank } from './psychometricBank';

export const mockAssessments: Assessment[] = [
  {
    id: 'ass-1',
    type: 'psychometric',
    title: 'Psikotes & Green Energy Induction Test',
    description: 'Evaluasi 6 pilar: Green Energy, Logika Mekanikal, K3 Tegangan Tinggi, Etos Kerja 5S, Situational Judgment, dan Learning Agility.',
    timeLimit: 30,
    totalQuestions: defaultQuestionBank.length,
    passingScore: 70,
    category: 'Psikotes & Green Energy',
    isActive: true
  },
  {
    id: 'ass-2',
    type: 'technical',
    title: 'EV Battery Assembly & Thermal Management',
    description: 'Pengujian kompetensi perakitan modul baterai lithium, balancing sel, dan sistem pendingin cair.',
    timeLimit: 45,
    totalQuestions: 15,
    passingScore: 75,
    category: 'Teknis EV',
    isActive: true
  },
  {
    id: 'ass-3',
    type: 'technical',
    title: 'High Voltage Safety & LOTO Compliance (1000V)',
    description: 'Standar keselamatan tegangan tinggi internasional, verifikasi zero voltage, dan mitigasi thermal runaway.',
    timeLimit: 25,
    totalQuestions: 10,
    passingScore: 80,
    category: 'K3 & Regulasi',
    isActive: true
  }
];

export const mockQuestions: Question[] = defaultQuestionBank.map((q) => ({
  id: q.id,
  assessmentId: q.assessmentId,
  text: q.text,
  type: 'single',
  options: q.options,
  correctAnswer: q.correctAnswer,
  points: q.points,
  difficulty: q.difficulty,
  category: q.category
}));