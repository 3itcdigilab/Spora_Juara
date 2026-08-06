import { mockStudents } from '../data/students';
import { mockProfiles } from '../data/profiles';
import { mockCertificates } from '../data/certificates';
import { mockPortfolioProjects } from '../data/portfolioProjects';
import { mockApplications } from '../data/applications';
import { mockTalentScores } from '../data/talentScores';
import { mockJobs } from '../data/jobs';
import { Application, Job } from '../data/types';

// Initialize LocalStorage with mock data if not already present
export const initDB = () => {
  if (!localStorage.getItem('spora_students')) {
    localStorage.setItem('spora_students', JSON.stringify(mockStudents));
  }
  if (!localStorage.getItem('spora_profiles')) {
    localStorage.setItem('spora_profiles', JSON.stringify(mockProfiles));
  }
  if (!localStorage.getItem('spora_certificates')) {
    localStorage.setItem('spora_certificates', JSON.stringify(mockCertificates));
  }
  if (!localStorage.getItem('spora_portfolio')) {
    localStorage.setItem('spora_portfolio', JSON.stringify(mockPortfolioProjects));
  }
  if (!localStorage.getItem('spora_applications')) {
    localStorage.setItem('spora_applications', JSON.stringify(mockApplications));
  }
  if (!localStorage.getItem('spora_talent_scores')) {
    localStorage.setItem('spora_talent_scores', JSON.stringify(mockTalentScores));
  }
  if (!localStorage.getItem('spora_jobs')) {
    localStorage.setItem('spora_jobs', JSON.stringify(mockJobs));
  }
};

initDB();

export const localDB = {
  // Profiles
  getProfile: (studentId: string) => {
    const profiles = JSON.parse(localStorage.getItem('spora_profiles') || '[]');
    return profiles.find((p: any) => p.studentId === studentId) || mockProfiles[0];
  },
  saveProfile: (profileData: any) => {
    const profiles = JSON.parse(localStorage.getItem('spora_profiles') || '[]');
    const idx = profiles.findIndex((p: any) => p.studentId === profileData.studentId);
    if (idx >= 0) {
      profiles[idx] = { ...profiles[idx], ...profileData };
    } else {
      profiles.push(profileData);
    }
    localStorage.setItem('spora_profiles', JSON.stringify(profiles));
    return profileData;
  },

  // Students
  getStudents: () => {
    return JSON.parse(localStorage.getItem('spora_students') || '[]') as typeof mockStudents;
  },
  getStudentById: (studentId: string) => {
    const students = JSON.parse(localStorage.getItem('spora_students') || '[]');
    return students.find((s: any) => s.id === studentId) || mockStudents[0];
  },

  // Certificates
  getCertificates: (studentId: string) => {
    const certs = JSON.parse(localStorage.getItem('spora_certificates') || '[]');
    return certs.filter((c: any) => c.studentId === studentId);
  },
  addCertificate: (certData: any) => {
    const certs = JSON.parse(localStorage.getItem('spora_certificates') || '[]');
    const newCert = {
      id: `cert-${Date.now()}`,
      status: 'verified',
      issueDate: new Date().toISOString().split('T')[0],
      ...certData
    };
    certs.unshift(newCert);
    localStorage.setItem('spora_certificates', JSON.stringify(certs));
    return newCert;
  },

  // Portfolio
  getPortfolio: (studentId: string) => {
    const projects = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    return projects.filter((p: any) => p.studentId === studentId);
  },
  addPortfolioProject: (projectData: any) => {
    const projects = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    const newProject = {
      id: `proj-${Date.now()}`,
      completedDate: new Date().toISOString().split('T')[0],
      ...projectData
    };
    projects.unshift(newProject);
    localStorage.setItem('spora_portfolio', JSON.stringify(projects));
    return newProject;
  },

  // Jobs CRUD
  getJobs: (): Job[] => {
    const jobs = JSON.parse(localStorage.getItem('spora_jobs') || '[]');
    return jobs.length > 0 ? jobs : mockJobs;
  },
  getJobById: (jobId: string): Job | undefined => {
    const jobs = localDB.getJobs();
    return jobs.find(j => j.id === jobId);
  },
  addJob: (jobData: Omit<Job, 'id' | 'postedAt'>): Job => {
    const jobs = localDB.getJobs();
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString()
    };
    jobs.unshift(newJob);
    localStorage.setItem('spora_jobs', JSON.stringify(jobs));
    return newJob;
  },
  updateJob: (jobId: string, updates: Partial<Job>): Job | null => {
    const jobs = localDB.getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx < 0) return null;
    jobs[idx] = { ...jobs[idx], ...updates };
    localStorage.setItem('spora_jobs', JSON.stringify(jobs));
    return jobs[idx];
  },
  deleteJob: (jobId: string): boolean => {
    const jobs = localDB.getJobs();
    const filtered = jobs.filter(j => j.id !== jobId);
    localStorage.setItem('spora_jobs', JSON.stringify(filtered));
    return true;
  },

  // Applications CRUD & Pipeline Stage Transitions
  getApplications: (studentId?: string): Application[] => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    if (studentId) {
      return apps.filter((a: any) => a.studentId === studentId);
    }
    return apps;
  },
  getApplicationsForJob: (jobId: string): Application[] => {
    const apps = localDB.getApplications();
    return apps.filter(a => a.jobId === jobId);
  },
  applyForJob: (studentId: string, jobId: string) => {
    const apps = localDB.getApplications();
    const existing = apps.find(a => a.studentId === studentId && a.jobId === jobId);
    if (existing) return existing;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      studentId,
      jobId,
      status: 'applied',
      aiMatchScore: 88,
      aiMatchReasons: ['Matches EV Battery Assembly competencies', 'High psychometric stability score'],
      appliedAt: new Date().toISOString().split('T')[0],
      statusUpdatedAt: new Date().toISOString().split('T')[0],
      rejectionReason: ''
    };
    apps.unshift(newApp);
    localStorage.setItem('spora_applications', JSON.stringify(apps));
    return newApp;
  },
  updateApplicationStatus: (appId: string, newStatus: Application['status'], rejectionReason: string = ''): Application | null => {
    const apps = localDB.getApplications();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx < 0) return null;
    
    apps[idx] = {
      ...apps[idx],
      status: newStatus,
      statusUpdatedAt: new Date().toISOString().split('T')[0],
      rejectionReason: rejectionReason || apps[idx].rejectionReason
    };
    localStorage.setItem('spora_applications', JSON.stringify(apps));
    return apps[idx];
  },
  withdrawApplication: (appId: string): boolean => {
    const apps = localDB.getApplications();
    const filtered = apps.filter(a => a.id !== appId);
    localStorage.setItem('spora_applications', JSON.stringify(filtered));
    return true;
  },

  // Talent Scores
  getTalentScore: (studentId: string) => {
    const scores = JSON.parse(localStorage.getItem('spora_talent_scores') || '[]');
    return scores.find((s: any) => s.studentId === studentId) || mockTalentScores[0];
  },
  updateTalentScore: (studentId: string, scoreData: any) => {
    const scores = JSON.parse(localStorage.getItem('spora_talent_scores') || '[]');
    const idx = scores.findIndex((s: any) => s.studentId === studentId);
    if (idx >= 0) {
      scores[idx] = { ...scores[idx], ...scoreData };
    } else {
      scores.push({ id: `ts-${Date.now()}`, studentId, ...scoreData });
    }
    localStorage.setItem('spora_talent_scores', JSON.stringify(scores));
    return scoreData;
  }
};
