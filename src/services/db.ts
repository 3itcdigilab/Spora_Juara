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

  // Notifications
  addNotification: (notifData: any) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: (notifData.userId || '').toLowerCase(),
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'status',
      actionUrl: notifData.actionUrl || '/student/applications',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notifs.unshift(newNotif);
    localStorage.setItem('spora_notifications', JSON.stringify(notifs));
    return newNotif;
  },
  getNotifications: (userId?: string) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    if (!userId) return notifs;
    const cleanId = userId.toLowerCase();
    return notifs.filter((n: any) => (n.userId || '').toLowerCase() === cleanId);
  },
  markNotificationRead: (id: string) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const idx = notifs.findIndex((n: any) => n.id === id);
    if (idx >= 0) {
      notifs[idx].isRead = true;
      localStorage.setItem('spora_notifications', JSON.stringify(notifs));
    }
  },
  deleteNotification: (id: string) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const remaining = notifs.filter((n: any) => n.id !== id);
    localStorage.setItem('spora_notifications', JSON.stringify(remaining));
  },
  deleteMultipleNotifications: (ids: string[]) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const remaining = notifs.filter((n: any) => !ids.includes(n.id));
    localStorage.setItem('spora_notifications', JSON.stringify(remaining));
  },
  clearAllNotifications: (userId: string) => {
    const cleanId = userId.toLowerCase();
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const remaining = notifs.filter((n: any) => n.userId !== cleanId);
    localStorage.setItem('spora_notifications', JSON.stringify(remaining));
  },

  // Profiles
  getProfile: (studentId: string) => {
    if (!studentId) return null;
    const cleanId = studentId.toLowerCase().trim();
    const profiles = JSON.parse(localStorage.getItem('spora_profiles') || '[]');
    return profiles.find((p: any) => 
      (p.studentId && p.studentId.toLowerCase().trim() === cleanId) ||
      (p.email && p.email.toLowerCase().trim() === cleanId)
    ) || null;
  },
  saveProfile: (profileData: any) => {
    const profiles = JSON.parse(localStorage.getItem('spora_profiles') || '[]');
    const targetId = (profileData.studentId || profileData.email || '').toLowerCase().trim();
    const idx = profiles.findIndex((p: any) => 
      (p.studentId && p.studentId.toLowerCase().trim() === targetId) ||
      (p.email && p.email.toLowerCase().trim() === targetId)
    );
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
    if (!studentId) return null;
    const cleanId = studentId.toLowerCase().trim();
    const students = JSON.parse(localStorage.getItem('spora_students') || '[]');
    const found = students.find((s: any) => s.id?.toLowerCase() === cleanId || s.email?.toLowerCase() === cleanId);
    
    // Check spora_profiles
    const profiles = JSON.parse(localStorage.getItem('spora_profiles') || '[]');
    const matchedProfile = profiles.find((p: any) => 
      (p.studentId && p.studentId.toLowerCase().trim() === cleanId) || 
      (p.email && p.email.toLowerCase().trim() === cleanId)
    );

    // Check spora_users to resolve real account name if registered via Auth
    const users = JSON.parse(localStorage.getItem('spora_users') || '[]');
    const matchedUser = users.find((u: any) => 
      (u.email && u.email.toLowerCase().trim() === cleanId) || 
      (u.id && u.id.toLowerCase().trim() === cleanId) || 
      (u.name && u.name.toLowerCase().trim() === cleanId)
    );

    const name = matchedProfile?.fullName || matchedUser?.name || (found?.name || found?.fullName) || (studentId && !studentId.startsWith('app-') && !studentId.startsWith('student-') ? studentId : '');
    const email = matchedProfile?.email || matchedUser?.email || found?.email || (studentId?.includes('@') ? studentId : '');
    const schoolName = matchedProfile?.school || matchedProfile?.schoolName || matchedUser?.school || found?.school || found?.schoolName || '';
    const major = matchedProfile?.major || matchedUser?.major || found?.major || '';

    return {
      id: studentId || email,
      userId: matchedUser?.id || found?.userId || '',
      name,
      email,
      phone: matchedProfile?.phone || matchedUser?.phone || found?.phone || '',
      bio: matchedProfile?.bio || matchedUser?.bio || found?.bio || '',
      linkedinUrl: matchedProfile?.linkedinUrl || found?.linkedinUrl || '',
      resumeName: matchedProfile?.resumeName || found?.resumeName || '',
      schoolId: matchedProfile?.schoolId || found?.schoolId || '',
      schoolName,
      school: schoolName,
      major,
      graduationYear: matchedProfile?.gradYear || matchedProfile?.graduationYear || found?.graduationYear || new Date().getFullYear(),
      province: matchedProfile?.province || matchedUser?.province || found?.province || '',
      city: matchedProfile?.city || matchedUser?.city || found?.city || '',
      skills: (matchedProfile?.skills && matchedProfile.skills.length > 0) ? matchedProfile.skills : (found?.skills || []),
      languages: matchedProfile?.languages || found?.languages || [],
      resumeUrl: matchedProfile?.resumeUrl || found?.resumeUrl || '',
      careerInterest: matchedProfile?.careerInterest || found?.careerInterest || '',
      profileCompletion: matchedProfile?.profileCompletion || found?.profileCompletion || 0,
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

  // Portfolio
  getPortfolio: (studentId: string) => {
    const items = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    return items.filter((p: any) => p.studentId === studentId);
  },
  addPortfolioProject: (projData: any) => {
    const items = JSON.parse(localStorage.getItem('spora_portfolio') || '[]');
    const newProj = { id: `proj-${Date.now()}`, completedDate: new Date().toISOString().split('T')[0], ...projData };
    items.push(newProj);
    localStorage.setItem('spora_portfolio', JSON.stringify(items));
    return newProj;
  },

  // Applications
  getApplications: (studentId?: string) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    
    // Deduplicate applications by jobId + candidate identity (email / studentId / studentName)
    const uniqueAppsMap = new Map();
    const statusPriority: Record<string, number> = {
      'rejected': 10,
      'hired': 9,
      'offered': 8,
      'interview': 7,
      'shortlisted': 6,
      'ai_screening': 5,
      'applied': 1
    };

    apps.forEach((app: any) => {
      const studentObj = localDB.getStudentById(app.studentId || app.studentEmail);
      const candidateKey = (app.studentEmail || app.studentId || studentObj?.email || studentObj?.name || 'unknown').toLowerCase().trim();
      const mapKey = `${app.jobId}_${candidateKey}`;
      
      const existing = uniqueAppsMap.get(mapKey);
      if (!existing) {
        uniqueAppsMap.set(mapKey, app);
      } else {
        const existingPriority = statusPriority[existing.status] || 0;
        const currentPriority = statusPriority[app.status] || 0;
        if (currentPriority >= existingPriority) {
          uniqueAppsMap.set(mapKey, app);
        }
      }
    });

    const deduplicatedApps = Array.from(uniqueAppsMap.values());

    if (!studentId) return deduplicatedApps;
    const cleanId = studentId.toLowerCase().trim();
    return deduplicatedApps.filter((a: any) => {
      const matchId = (a.studentId || '').toLowerCase().trim() === cleanId;
      const matchEmail = (a.studentEmail || '').toLowerCase().trim() === cleanId;
      const matchName = (a.studentName || '').toLowerCase().trim() === cleanId;
      return matchId || matchEmail || matchName;
    });
  },

  applyForJob: (applicationData: Partial<Application> & { studentEmail?: string; studentName?: string; school?: string; major?: string; skills?: string[] }) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const studentObj = localDB.getStudentById(applicationData.studentId || applicationData.studentEmail || '');
    
    const candidateEmail = applicationData.studentEmail || studentObj?.email || applicationData.studentId || '';
    const candidateName = applicationData.studentName && applicationData.studentName !== '3ITC' && applicationData.studentName !== 'Pelamar Vokasi EV'
      ? applicationData.studentName 
      : (studentObj?.name || candidateEmail);

    const newApp = {
      id: `app-${Date.now()}`,
      status: 'applied',
      aiMatchScore: Math.floor(Math.random() * 20) + 80,
      appliedAt: new Date().toISOString().split('T')[0],
      statusUpdatedAt: new Date().toISOString(),
      studentEmail: candidateEmail,
      studentName: candidateName,
      school: applicationData.school || studentObj?.schoolName || '',
      major: applicationData.major || studentObj?.major || '',
      skills: applicationData.skills || studentObj?.skills || [],
      ...applicationData
    };

    apps.unshift(newApp);
    localStorage.setItem('spora_applications', JSON.stringify(apps));

    // Send candidate auto notification
    const job = localDB.getJobById(newApp.jobId || '');
    localDB.addNotification({
      userId: candidateEmail,
      title: 'Lamaran Berhasil Terkirim! 🚀',
      message: `Lamaran Anda untuk posisi "${job?.title || 'Posisi EV'}" di ${job?.company || 'Mitra Industri EV'} berhasil dikirim.`,
      type: 'status',
      actionUrl: '/student/applications'
    });

    return newApp;
  },

  updateApplicationStatus: (appId: string, status: string, rejectionReason?: string) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const idx = apps.findIndex((a: any) => a.id === appId);
    if (idx >= 0) {
      apps[idx].status = status;
      apps[idx].statusUpdatedAt = new Date().toISOString();
      if (rejectionReason) apps[idx].rejectionReason = rejectionReason;
      localStorage.setItem('spora_applications', JSON.stringify(apps));

      // Trigger automatic notification
      const app = apps[idx];
      const job = localDB.getJobById(app.jobId);
      const studentEmail = app.studentEmail || app.studentId;
      const companyName = job?.company || 'Mitra Perusahaan EV';
      const jobTitle = job?.title || 'Posisi EV';

      if (studentEmail) {
        if (status === 'shortlisted' || status === 'ai_screening') {
          localDB.addNotification({
            userId: studentEmail,
            title: 'Lamaran Anda Lolos Tahap Seleksi! 🎉',
            message: `Selamat! Profil Anda telah disetujui & masuk ke tahap Lolos Seleksi oleh ${companyName} untuk posisi ${jobTitle}.`,
            type: 'status',
            actionUrl: '/student/applications'
          });
        } else if (status === 'interview') {
          localDB.addNotification({
            userId: studentEmail,
            title: 'Undangan Wawancara Kerja! 📅',
            message: `${companyName} telah menjadwalkan wawancara kerja untuk Anda pada posisi ${jobTitle}.`,
            type: 'invite',
            actionUrl: '/student/applications'
          });
        } else if (status === 'hired' || status === 'offered') {
          localDB.addNotification({
            userId: studentEmail,
            title: 'Selamat! Anda Diterima Bekerja! 🏆',
            message: `Kabar gembira! ${companyName} secara resmi menawarkan posisi kerja ${jobTitle} kepada Anda.`,
            type: 'status',
            actionUrl: '/student/applications'
          });
        } else if (status === 'rejected') {
          localDB.addNotification({
            userId: studentEmail,
            title: 'Update Status Lamaran Kerja',
            message: `Lamaran Anda untuk posisi ${jobTitle} di ${companyName} telah ditutup.${rejectionReason ? ` Catatan: "${rejectionReason}"` : ''}`,
            type: 'feedback',
            actionUrl: '/student/applications'
          });
        }
      }
    }
  },

  withdrawApplication: (appId: string) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const targetApp = apps.find((a: any) => a.id === appId);
    if (!targetApp) return;

    const targetJobId = targetApp.jobId;
    const targetCandidateKey = (targetApp.studentEmail || targetApp.studentId || targetApp.studentName || '').toLowerCase().trim();

    const remaining = apps.filter((a: any) => {
      const aCandidateKey = (a.studentEmail || a.studentId || a.studentName || '').toLowerCase().trim();
      const isSameJob = a.jobId === targetJobId;
      const isSameCandidate = aCandidateKey === targetCandidateKey || (targetCandidateKey && aCandidateKey.includes(targetCandidateKey));
      return !(isSameJob && isSameCandidate);
    });

    localStorage.setItem('spora_applications', JSON.stringify(remaining));
  },

  // Talent Scores
  getTalentScore: (studentId: string) => {
    const scores = JSON.parse(localStorage.getItem('spora_talent_scores') || '[]');
    const found = scores.find((s: any) => s.studentId === studentId);
    if (found) return found;

    return {
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
    const uniqueMap = new Map();
    jobs.forEach((j: any) => {
      if (j && j.id && !uniqueMap.has(j.id)) {
        uniqueMap.set(j.id, j);
      }
    });
    return Array.from(uniqueMap.values());
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
    const filtered = jobs.filter((j: any) => j.id !== newJob.id);
    filtered.unshift(newJob);
    localStorage.setItem('spora_jobs', JSON.stringify(filtered));
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
    const target = jobs.find((j: any) => j.id === jobId);
    const filtered = jobs.filter((j: any) => {
      if (j.id === jobId) return false;
      if (target && j.title === target.title && j.industryId === target.industryId) return false;
      return true;
    });
    localStorage.setItem('spora_jobs', JSON.stringify(filtered));

    // Cascade delete applications for this deleted job
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const filteredApps = apps.filter((a: any) => a.jobId !== jobId);
    localStorage.setItem('spora_applications', JSON.stringify(filteredApps));
  }
};
