import { AIRecommendation } from './types';
export const mockRecommendations: AIRecommendation[] = Array.from({ length: 15 }, (_, i) => ({
  id: `rec-${i + 1}`, studentId: `student-${i + 1}`, type: 'job', title: 'Apply to EV QC',
  description: 'You are a 90% match.', reason: 'High technical score.', confidence: 0.9, relatedJobId: 'job-1', generatedAt: new Date().toISOString()
}));