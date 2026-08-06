import { Application, Job } from '../data/types';

// Reset & Clear database of all dummy data
export const clearAllDummyData = () => {
  localStorage.setItem('spora_students', JSON.stringify([]));
  localStorage.setItem('spora_profiles', JSON.stringify([]));
  localStorage.setItem('spora_certificates', JSON.stringify([]));
  localStorage.setItem('spora_portfolio', JSON.stringify([]));
  localStorage.setItem('spora_applications', JSON.stringify([]));
  localStorage.setItem('spora_talent_scores', JSON.stringify([]));
  localStorage.setItem('spora_jobs', JSON.stringify([]));
  localStorage.setItem('spora_schools', JSON.stringify([]));
  localStorage.setItem('spora_industries', JSON.stringify([]));
  localStorage.setItem('spora_notifications', JSON.stringify([]));
  localStorage.setItem('spora_interviews', JSON.stringify([]));
  localStorage.setItem('spora_clean_db_initialized', 'true');
};

export const initDB = () => {
  if (!localStorage.getItem('spora_clean_db_initialized')) {
    clearAllDummyData();
  }
};

initDB();

export const localDB = {
  resetDB: () => {
    clearAllDummyData();
  },

  // Profiles
  getProfile: (studentId: string) => {
    const profiles = JSON.parse(localStorage.getItem('spora_profiles') || '[]');
    return profiles.find((p: any) => p.studentId === studentId) || null;
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
    return JSON.parse(localStorage.getItem('spora_students') || '[]');
  },
  getStudentById: (studentId: string) => {
    const students = JSON.parse(localStorage.getItem('spora_students') || '[]');
    const found = students.find((s: any) => s.id === studentId || s.email === studentId);
    if (found) return found;

    // Check spora_profiles
    const profiles = JSON.parse(localStorage.getItem('spora_profiles') || '[]');
    const matchedProfile = profiles.find((p: any) => p.studentId === studentId || p.email === studentId);

    // Check spora_users to resolve real account name if registered via Auth
    const users = JSON.parse(localStorage.getItem('spora_users') || '[]');
    const matchedUser = users.find((u: any) => 
      (u.email && u.email.toLowerCase() === studentId?.toLowerCase()) || 
      u.id === studentId || 
      u.name === studentId
    );

    const name = matchedProfile?.fullName || matchedUser?.name || (studentId && !studentId.startsWith('app-') && !studentId.startsWith('student-') ? studentId : 'Tubagus');
    const email = matchedProfile?.email || matchedUser?.email || (studentId?.includes('@') ? studentId : 'tubagus@spora.id');
    const schoolName = matchedProfile?.schoolName || matchedUser?.school || 'SMK Negeri 1 Cikarang';
    const major = matchedProfile?.major || matchedUser?.major || 'Teknik Kendaraan Ringan (Otomotif EV)';

    return {
      id: studentId || email,
      userId: 'u-1',
      name,
      email,
      schoolId: 'sch-1',
      schoolName,
      major,
      graduationYear: 2025,
      province: matchedProfile?.province || matchedUser?.province || 'Jawa Barat',
      city: matchedProfile?.city || matchedUser?.city || 'Bekasi',
      skills: matchedProfile?.skills || ['EV Battery Assembly', 'High Voltage Safety', 'Quality Control'],
      languages: ['Indonesia', 'English'],
      resumeUrl: '',
      careerInterest: 'EV Technician',
      profileCompletion: 85,
      status: 'active'
    };
  },

  // Certificates
  getCertificates: (studentId: string) => {
    const certs = JSON.parse(localStorage.getItem('spora_certificates') || '[]');
    return certs.filter((c: any) => c.studentId === studentId);
  },
  addCertificate: (certData: any) => {
    const certs = JSON.parse(localStorage.getItem('spora_certificates') || '[]');
    const newCert = { id: `cert-${Date.now()}`, status: 'verified', ...certData };
    certs.push(newCert);
    localStorage.setItem('spora_certificates', JSON.stringify(certs));
    return newCert;
  },
  deleteCertificate: (id: string) => {
    const certs = JSON.parse(localStorage.getItem('spora_certificates') || '[]');
    const filtered = certs.filter((c: any) => c.id !== id);
    localStorage.setItem('spora_certificates', JSON.stringify(filtered));
  },

  // Portfolio
  getPortfolio: (studentId: string) => {
    const projects = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    return projects.filter((p: any) => p.studentId === studentId);
  },
  getPortfolioProjects: (studentId: string) => {
    const projects = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    return projects.filter((p: any) => p.studentId === studentId);
  },
  addPortfolioProject: (projData: any) => {
    const projects = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    const newProj = { id: `proj-${Date.now()}`, ...projData };
    projects.push(newProj);
    localStorage.setItem('spora_portfolio', JSON.stringify(projects));
    return newProj;
  },
  deletePortfolioProject: (id: string) => {
    const projects = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    const filtered = projects.filter((p: any) => p.id !== id);
    localStorage.setItem('spora_portfolio', JSON.stringify(filtered));
  },

  // Applications
  getApplications: (studentId?: string) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const jobs = JSON.parse(localStorage.getItem('spora_jobs') || '[]');

    // Only return applications for jobs that currently exist
    const validApps = apps.filter((a: any) => jobs.some((j: any) => j.id === a.jobId));

    // Auto-repair applicant names for existing applications
    const repairedApps = validApps.map((a: any) => {
      if (!a.studentName || a.studentName === '3ITC' || a.studentName === 'Pelamar Vokasi EV' || a.studentName === 'Siswa Vokasi EV') {
        const studentObj = localDB.getStudentById(a.studentId || a.studentEmail);
        return {
          ...a,
          studentName: studentObj.name,
          studentEmail: studentObj.email,
          school: studentObj.schoolName,
          major: studentObj.major
        };
      }
      return a;
    });

    // Deduplicate applications by (jobId + studentEmail/studentName) so only 1 unique application per candidate per job is returned
    const uniqueApps: any[] = [];
    const seenKeys = new Set<string>();

    repairedApps.forEach((a: any) => {
      const candidateKey = `${a.jobId}_${(a.studentName || a.studentEmail || a.studentId || 'default').toLowerCase()}`;
      if (!seenKeys.has(candidateKey)) {
        seenKeys.add(candidateKey);
        uniqueApps.push(a);
      }
    });

    if (studentId) return uniqueApps.filter((a: any) => a.studentId === studentId || a.studentEmail === studentId);
    return uniqueApps;
  },
  applyForJob: (studentId: string, jobId: string, applicantDetails?: any) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const targetEmail = applicantDetails?.studentEmail || studentId;
    const targetName = applicantDetails?.studentName;

    // Check if application already exists for this job & candidate
    const existingIdx = apps.findIndex((a: any) => 
      a.jobId === jobId && 
      (a.studentId === studentId || 
       a.studentEmail === targetEmail || 
       (targetName && a.studentName === targetName) || 
       a.studentId === 'student-1')
    );

    if (existingIdx >= 0) {
      // Update existing application with fresh applicant details instead of creating a duplicate
      apps[existingIdx] = {
        ...apps[existingIdx],
        studentId,
        jobId,
        ...applicantDetails
      };
      localStorage.setItem('spora_applications', JSON.stringify(apps));
      return apps[existingIdx];
    }

    const newApp: Application & Record<string, any> = {
      id: `app-${Date.now()}`,
      studentId,
      jobId,
      status: 'applied',
      aiMatchScore: 88,
      aiMatchReasons: ['Met all required EV Assembly skills'],
      appliedAt: new Date().toISOString().split('T')[0],
      statusUpdatedAt: new Date().toISOString().split('T')[0],
      rejectionReason: '',
      ...applicantDetails
    };
    apps.unshift(newApp);
    localStorage.setItem('spora_applications', JSON.stringify(apps));
    return newApp;
  },
  updateApplicationStatus: (appId: string, status: Application['status'], rejectionReason?: string) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const idx = apps.findIndex((a: any) => a.id === appId);
    if (idx >= 0) {
      apps[idx].status = status;
      apps[idx].statusUpdatedAt = new Date().toISOString().split('T')[0];
      if (rejectionReason) apps[idx].rejectionReason = rejectionReason;
      localStorage.setItem('spora_applications', JSON.stringify(apps));
    }
  },
  withdrawApplication: (appId: string) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const filtered = apps.filter((a: any) => a.id !== appId);
    localStorage.setItem('spora_applications', JSON.stringify(filtered));
  },

  // Talent Scores
  getTalentScore: (studentId: string) => {
    const scores = JSON.parse(localStorage.getItem('spora_talent_scores') || '[]');
    const found = scores.find((s: any) => s.studentId === studentId);
    if (found) return found;
    return {
      studentId,
      overall: 88,
      dimensions: [
        { key: 'technical', label: 'Technical Competency', score: 85, weight: 0.25 },
        { key: 'psychometric', label: 'Psychometric', score: 80, weight: 0.20 },
        { key: 'learningAgility', label: 'Learning Agility', score: 90, weight: 0.15 },
        { key: 'safety', label: 'Safety Protocols', score: 95, weight: 0.15 },
        { key: 'communication', label: 'Communication', score: 82, weight: 0.10 }
      ]
    };
  },

  // Jobs
  getJobs: () => {
    const jobs = JSON.parse(localStorage.getItem('spora_jobs') || '[]');
    return jobs;
  },
  getJobById: (id: string) => {
    const jobs = localDB.getJobs();
    return jobs.find((j: any) => j.id === id) || null;
  },
  postJob: (jobData: any) => {
    const jobs = JSON.parse(localStorage.getItem('spora_jobs') || '[]');
    const newJob: Job = {
      id: `job-${Date.now()}`,
      status: 'active',
      postedAt: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      ...jobData
    };
    jobs.unshift(newJob);
    localStorage.setItem('spora_jobs', JSON.stringify(jobs));
    return newJob;
  },
  updateJob: (jobId: string, updatedData: any) => {
    const jobs = JSON.parse(localStorage.getItem('spora_jobs') || '[]');
    const idx = jobs.findIndex((j: any) => j.id === jobId);
    if (idx >= 0) {
      jobs[idx] = { ...jobs[idx], ...updatedData };
      localStorage.setItem('spora_jobs', JSON.stringify(jobs));
    }
  },
  deleteJob: (jobId: string) => {
    const jobs = JSON.parse(localStorage.getItem('spora_jobs') || '[]');
    const filtered = jobs.filter((j: any) => j.id !== jobId);
    localStorage.setItem('spora_jobs', JSON.stringify(filtered));

    // Cascade delete applications for this deleted job
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const filteredApps = apps.filter((a: any) => a.jobId !== jobId);
    localStorage.setItem('spora_applications', JSON.stringify(filteredApps));
  }
};
