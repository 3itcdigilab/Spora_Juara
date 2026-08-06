import { Application } from './types';

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    studentId: 'student-1',
    jobId: 'job-1',
    status: 'applied',
    aiMatchScore: 92,
    aiMatchReasons: ['High score in EV Battery Assembly', 'Completed BNSP HV Safety Certification'],
    appliedAt: '2026-07-28',
    statusUpdatedAt: '2026-07-28',
    rejectionReason: ''
  },
  {
    id: 'app-2',
    studentId: 'student-2',
    jobId: 'job-1',
    status: 'ai_screening',
    aiMatchScore: 88,
    aiMatchReasons: ['Strong background in Electrical Engineering', 'Passes psychometric stability benchmark'],
    appliedAt: '2026-07-26',
    statusUpdatedAt: '2026-07-27',
    rejectionReason: ''
  },
  {
    id: 'app-3',
    studentId: 'student-3',
    jobId: 'job-1',
    status: 'shortlisted',
    aiMatchScore: 85,
    aiMatchReasons: ['Top 5% Talent Score in West Java', 'Gold medalist in SMK Skills Competition'],
    appliedAt: '2026-07-20',
    statusUpdatedAt: '2026-07-22',
    rejectionReason: ''
  },
  {
    id: 'app-4',
    studentId: 'student-4',
    jobId: 'job-1',
    status: 'interview',
    aiMatchScore: 90,
    aiMatchReasons: ['Excellent technical exam performance', 'Prior internship in EV battery conversion'],
    appliedAt: '2026-07-16',
    statusUpdatedAt: '2026-07-25',
    rejectionReason: ''
  },
  {
    id: 'app-5',
    studentId: 'student-5',
    jobId: 'job-1',
    status: 'offered',
    aiMatchScore: 94,
    aiMatchReasons: ['Perfect 100/100 score in High Voltage Safety', 'Recommended by SMKN 1 Cikarang Principal'],
    appliedAt: '2026-07-10',
    statusUpdatedAt: '2026-07-30',
    rejectionReason: ''
  },
  {
    id: 'app-6',
    studentId: 'student-6',
    jobId: 'job-2',
    status: 'hired',
    aiMatchScore: 89,
    aiMatchReasons: ['Specialist skill match in Electric Motor Winding', 'Fastest assessment time'],
    appliedAt: '2026-07-05',
    statusUpdatedAt: '2026-07-29',
    rejectionReason: ''
  },
  {
    id: 'app-7',
    studentId: 'student-1',
    jobId: 'job-3',
    status: 'shortlisted',
    aiMatchScore: 86,
    aiMatchReasons: ['BMS diagnostics competency certified'],
    appliedAt: '2026-07-29',
    statusUpdatedAt: '2026-08-01',
    rejectionReason: ''
  },
  {
    id: 'app-8',
    studentId: 'student-2',
    jobId: 'job-4',
    status: 'rejected',
    aiMatchScore: 62,
    aiMatchReasons: ['Below required ISO quality control threshold'],
    appliedAt: '2026-07-15',
    statusUpdatedAt: '2026-07-18',
    rejectionReason: 'Candidate score did not meet the required Quality Control minimum benchmark of 72.'
  }
];