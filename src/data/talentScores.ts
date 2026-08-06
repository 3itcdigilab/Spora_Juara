import { TalentScore } from './types';
export const mockTalentScores: TalentScore[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ts-${i + 1}`, studentId: `student-${i + 1}`, overall: 80 + (i % 15),
  dimensions: [
    { key: 'technical', label: 'Technical', score: 85, weight: 0.25, source: 'assessment', description: '', color: '#3B82F6' },
    { key: 'psychometric', label: 'Psychometric', score: 75, weight: 0.2, source: 'assessment', description: '', color: '#10B981' }
  ],
  calculatedAt: '2024-07-28T00:00:00Z', configVersion: 'v1'
}));