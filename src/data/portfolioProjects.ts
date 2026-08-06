import { PortfolioProject } from './types';
export const mockPortfolioProjects: PortfolioProject[] = Array.from({ length: 15 }, (_, i) => ({
  id: `port-${i + 1}`, studentId: `student-${i + 1}`, title: 'EV Motor Build',
  description: 'Built a small EV motor.', imageUrl: '', projectUrl: '', tags: ['EV'], completedDate: '2023-05-01'
}));