import { ScoreConfig } from './types';
export const defaultScoreConfig: ScoreConfig = {
  id: 'cfg-1', version: 'v1.0',
  dimensions: [
    { key: 'technical', label: 'Technical Skills', weight: 0.25, source: 'assessments', description: '', color: 'blue' },
    { key: 'psychometric', label: 'Psychometric', weight: 0.20, source: 'assessments', description: '', color: 'green' },
    { key: 'learningAgility', label: 'Learning Agility', weight: 0.15, source: 'assessments', description: '', color: 'yellow' },
    { key: 'safety', label: 'Safety Awareness', weight: 0.15, source: 'assessments', description: '', color: 'red' },
    { key: 'communication', label: 'Communication', weight: 0.10, source: 'assessments', description: '', color: 'purple' },
    { key: 'leadership', label: 'Leadership', weight: 0.10, source: 'assessments', description: '', color: 'orange' },
    { key: 'experience', label: 'Experience', weight: 0.05, source: 'portfolio', description: '', color: 'gray' }
  ],
  minPoolScore: 65, minMatchPercent: 70, minProfileCompletion: 80,
  updatedAt: '2024-01-01T00:00:00Z', updatedBy: 'admin-1'
};