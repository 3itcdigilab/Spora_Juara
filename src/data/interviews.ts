import { Interview } from './types';
export const mockInterviews: Interview[] = Array.from({ length: 8 }, (_, i) => ({
  id: `int-${i + 1}`, applicationId: `app-${i + 1}`, scheduledAt: new Date().toISOString(),
  durationMinutes: 60, location: 'online', meetingUrl: 'https://zoom.us',
  interviewerName: 'HR', status: 'scheduled', feedback: '', rating: 0
}));