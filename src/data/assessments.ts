import { Assessment, Question } from './types';
export const mockAssessments: Assessment[] = [
  { id: 'ass-1', type: 'psychometric', title: 'Work Style Profile', description: 'Assesses personality and work style', timeLimit: 30, totalQuestions: 10, passingScore: 0, category: 'General', isActive: true },
  { id: 'ass-2', type: 'technical', title: 'EV Basics', description: 'Tests basic EV domain knowledge', timeLimit: 45, totalQuestions: 10, passingScore: 70, category: 'Technical', isActive: true }
];
export const mockQuestions: Question[] = Array.from({ length: 20 }, (_, i) => ({
  id: `q-${i + 1}`, assessmentId: i < 10 ? 'ass-1' : 'ass-2',
  text: `Sample question ${i + 1}`, type: 'single', options: ['A', 'B', 'C', 'D'],
  correctAnswer: 'A', points: 10, difficulty: 'medium', category: 'General'
}));