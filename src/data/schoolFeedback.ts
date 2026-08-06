import { SchoolFeedback } from './types';
export const mockSchoolFeedback: SchoolFeedback[] = Array.from({ length: 10 }, (_, i) => ({
  id: `fb-${i + 1}`, schoolId: `school-${i + 1}`, industryId: 'industry-1',
  category: 'curriculum', skillArea: 'EV Battery', rating: 4, comment: 'Good basics.', recommendation: 'Add practical labs.', createdAt: new Date().toISOString()
}));