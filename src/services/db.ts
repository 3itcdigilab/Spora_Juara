import { getAll, setAll, addItem, updateItem, removeItem, removeWhere, findOne, findMany } from './firestoreSync';

export const localDB = {
  resetDB: () => {
    setAll('students', []);
    setAll('profiles', []);
    setAll('certificates', []);
    setAll('portfolio', []);
    setAll('applications', []);
    setAll('talent_scores', []);
    setAll('jobs', []);
  },

  // Notifications
  addNotification: (notifData: any) => {
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
    addItem('notifications', newNotif);
    return newNotif;
  },
  getNotifications: (userId?: string) => {
    const notifs = getAll('notifications');
    if (!userId) return notifs;
    const cleanId = userId.toLowerCase();
    return notifs.filter((n: any) => (n.userId || '').toLowerCase() === cleanId);
  },
  markNotificationRead: (id: string) => {
    updateItem('notifications', id, { isRead: true });
  },
  deleteNotification: (id: string) => {
    removeItem('notifications', id);
  },
  deleteMultipleNotifications: (ids: string[]) => {
    removeWhere('notifications', (n: any) => ids.includes(n.id));
  },
  clearAllNotifications: (userId: string) => {
    const cleanId = userId.toLowerCase();
    removeWhere('notifications', (n: any) => n.userId === cleanId);
  },

  // Profiles
  getProfile: (studentId: string) => {
    if (!studentId) return null;
    const cleanId = studentId.toLowerCase().trim();
    const profiles = getAll('profiles');
    return profiles.find((p: any) => 
      (p.studentId && p.studentId.toLowerCase().trim() === cleanId) ||
      (p.email && p.email.toLowerCase().trim() === cleanId)
    ) || null;
  },
  saveProfile: (profileData: any) => {
    const profiles = getAll('profiles');
    const targetId = (profileData.studentId || profileData.email || '').toLowerCase().trim();
    const existing = profiles.find((p: any) => 
      (p.studentId && p.studentId.toLowerCase().trim() === targetId) ||
      (p.email && p.email.toLowerCase().trim() === targetId)
    );
    
    if (existing && existing.id) {
      updateItem('profiles', existing.id, profileData);
      return { ...existing, ...profileData };
    } else {
      const newProfile = { id: `prof-${Date.now()}`, ...profileData };
      addItem('profiles', newProfile);
      return newProfile;
    }
  },

  // Students
  getStudents: () => {
    return getAll('students');
  },
  getStudentById: (studentId: string) => {
    if (!studentId) return null;
    const cleanId = studentId.toLowerCase().trim();
    const students = getAll('students');
    const found = students.find((s: any) => s.id?.toLowerCase() === cleanId || s.email?.toLowerCase() === cleanId);
    
    // Check profiles
    const profiles = getAll('profiles');
    const matchedProfile = profiles.find((p: any) => 
      (p.studentId && p.studentId.toLowerCase().trim() === cleanId) || 
      (p.email && p.email.toLowerCase().trim() === cleanId)
    );

    // Check users
    const users = getAll('users');
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
    const certs = getAll('certificates');
    return certs.filter((c: any) => c.studentId === studentId);
  },
  addCertificate: (certData: any) => {
    const newCert = { id: `cert-${Date.now()}`, status: 'verified', ...certData };
    addItem('certificates', newCert);
    return newCert;
  },

  // Portfolio
  getPortfolio: (studentId: string) => {
    const items = getAll('portfolio');
    return items.filter((p: any) => p.studentId === studentId);
  },
  addPortfolioProject: (projData: any) => {
    const newProj = { id: `proj-${Date.now()}`, completedDate: new Date().toISOString().split('T')[0], ...projData };
    addItem('portfolio', newProj);
    return newProj;
  },

  // Applications
  getApplications: (studentId?: string) => {
    const apps = getAll('applications');
    
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

  applyForJob: (applicationData: any) => {
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

    addItem('applications', newApp);

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
    const apps = getAll('applications');
    const idx = apps.findIndex((a: any) => a.id === appId);
    if (idx >= 0) {
      const updatedData: any = { status, statusUpdatedAt: new Date().toISOString() };
      if (rejectionReason) updatedData.rejectionReason = rejectionReason;
      
      updateItem('applications', appId, updatedData);

      // Trigger automatic notification
      const app = { ...apps[idx], ...updatedData };
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
    const apps = getAll('applications');
    const targetApp = apps.find((a: any) => a.id === appId);
    if (!targetApp) return;

    const targetJobId = targetApp.jobId;
    const targetCandidateKey = (targetApp.studentEmail || targetApp.studentId || targetApp.studentName || '').toLowerCase().trim();

    removeWhere('applications', (a: any) => {
      const aCandidateKey = (a.studentEmail || a.studentId || a.studentName || '').toLowerCase().trim();
      const isSameJob = a.jobId === targetJobId;
      const isSameCandidate = aCandidateKey === targetCandidateKey || (targetCandidateKey && aCandidateKey.includes(targetCandidateKey));
      return isSameJob && isSameCandidate;
    });
  },

  // Talent Scores
  getTalentScore: (studentId: string) => {
    const scores = getAll('talent_scores');
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
    const jobs = getAll('jobs');
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
    const newJob: any = {
      id: `job-${Date.now()}`,
      status: 'active',
      postedAt: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      ...jobData
    };
    
    addItem('jobs', newJob);
    return newJob;
  },
  updateJob: (jobId: string, updatedData: any) => {
    updateItem('jobs', jobId, updatedData);
  },
  deleteJob: (jobId: string) => {
    const jobs = getAll('jobs');
    const target = jobs.find((j: any) => j.id === jobId);

    removeWhere('jobs', (j: any) => {
      if (j.id === jobId) return true;
      if (target && j.title === target.title && j.industryId === target.industryId) return true;
      return false;
    });

    // Cascade delete applications for this deleted job
    removeWhere('applications', (a: any) => a.jobId === jobId);
  }
};
