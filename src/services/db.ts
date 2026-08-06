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
    return notifs.filter((n: any) => 
      n.userId === cleanId || 
      cleanId.includes(n.userId)
    );
  },
  markNotificationRead: (notifId: string) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const idx = notifs.findIndex((n: any) => n.id === notifId);
    if (idx >= 0) {
      notifs[idx].isRead = true;
      localStorage.setItem('spora_notifications', JSON.stringify(notifs));
    }
  },
  deleteNotification: (notifId: string) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const filtered = notifs.filter((n: any) => n.id !== notifId);
    localStorage.setItem('spora_notifications', JSON.stringify(filtered));
  },
  deleteMultipleNotifications: (notifIds: string[]) => {
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const filtered = notifs.filter((n: any) => !notifIds.includes(n.id));
    localStorage.setItem('spora_notifications', JSON.stringify(filtered));
  },
  clearAllNotifications: (userId?: string) => {
    if (!userId) {
      localStorage.setItem('spora_notifications', JSON.stringify([]));
      return;
    }
    const cleanId = userId.toLowerCase();
    const notifs = JSON.parse(localStorage.getItem('spora_notifications') || '[]');
    const remaining = notifs.filter((n: any) => n.userId !== cleanId);
    localStorage.setItem('spora_notifications', JSON.stringify(remaining));
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

    const name = matchedProfile?.fullName || matchedUser?.name || (studentId && !studentId.startsWith('app-') && !studentId.startsWith('student-') ? studentId : '');
    const email = matchedProfile?.email || matchedUser?.email || (studentId?.includes('@') ? studentId : '');
    const schoolName = matchedProfile?.schoolName || matchedUser?.school || '';
    const major = matchedProfile?.major || matchedUser?.major || '';

    return {
      id: studentId || email,
      userId: matchedUser?.id || '',
      name,
      email,
      schoolId: matchedProfile?.schoolId || '',
      schoolName,
      major,
      graduationYear: matchedProfile?.graduationYear || new Date().getFullYear(),
      province: matchedProfile?.province || matchedUser?.province || '',
      city: matchedProfile?.city || matchedUser?.city || '',
      skills: matchedProfile?.skills || [],
      languages: matchedProfile?.languages || [],
      resumeUrl: matchedProfile?.resumeUrl || '',
      careerInterest: matchedProfile?.careerInterest || '',
      profileCompletion: matchedProfile?.profileCompletion || 0,
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

    // Deduplicate applications by (jobId + studentEmail/studentName)
    // PREFER 'rejected', 'hired', or 'interview' status over older 'applied' duplicate!
    const appMap = new Map<string, any>();

    repairedApps.forEach((a: any) => {
      const candidateKey = `${a.jobId}_${(a.studentName || a.studentEmail || a.studentId || 'default').toLowerCase()}`;
      if (!appMap.has(candidateKey)) {
        appMap.set(candidateKey, a);
      } else {
        const existing = appMap.get(candidateKey);
        if (a.status === 'rejected' || a.status === 'hired' || a.status === 'interview') {
          appMap.set(candidateKey, a);
        }
      }
    });

    const uniqueApps = Array.from(appMap.values());

    if (studentId) {
      const cleanSearchId = studentId.toLowerCase();
      return uniqueApps.filter((a: any) => 
        (a.studentId && a.studentId.toLowerCase() === cleanSearchId) ||
        (a.studentEmail && a.studentEmail.toLowerCase() === cleanSearchId) ||
        (a.studentName && cleanSearchId.includes(a.studentName.toLowerCase())) ||
        cleanSearchId.includes((a.studentEmail || '').toLowerCase())
      );
    }
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
       (targetName && a.studentName === targetName))
    );

    if (existingIdx >= 0) {
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
      aiMatchScore: 0,
      aiMatchReasons: [],
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
    const jobs = JSON.parse(localStorage.getItem('spora_jobs') || '[]');
    const idx = apps.findIndex((a: any) => a.id === appId);
    
    if (idx >= 0) {
      const app = apps[idx];
      app.status = status;
      app.statusUpdatedAt = new Date().toISOString().split('T')[0];
      if (rejectionReason) app.rejectionReason = rejectionReason;
      
      // Update any duplicate entries for the same candidate & jobId to status
      apps.forEach((otherApp: any) => {
        if (otherApp.jobId === app.jobId && (otherApp.studentId === app.studentId || otherApp.studentEmail === app.studentEmail)) {
          otherApp.status = status;
          if (rejectionReason) otherApp.rejectionReason = rejectionReason;
        }
      });

      localStorage.setItem('spora_applications', JSON.stringify(apps));

      // Trigger automatic real-time notification for candidate!
      const job = jobs.find((j: any) => j.id === app.jobId);
      const companyName = job?.department || job?.company || 'Perusahaan';
      const jobTitle = job?.title || 'Posisi';
      const candidateUserId = app.studentEmail || app.studentId;

      let title = 'Pembaruan Status Lamaran';
      let message = `Status lamaran Anda untuk posisi ${jobTitle} telah diperbarui.`;
      let type: 'invite' | 'reminder' | 'status' | 'feedback' | 'system' = 'status';

      if (status === 'rejected') {
        title = `❌ Status Lamaran: ${jobTitle}`;
        message = `Lamaran Anda di ${companyName} untuk posisi ${jobTitle} tidak dapat dilanjutkan. Alasan: "${rejectionReason || 'Kualifikasi belum memenuhi kebutuhan kriteria.'}"`;
        type = 'feedback';
      } else if (status === 'interview') {
        title = `📅 Undangan Wawancara dari ${companyName}`;
        message = `Selamat! Anda diundang untuk mengikuti sesi wawancara posisi ${jobTitle}. Silakan cek tab Wawancara untuk jadwal lengkap.`;
        type = 'invite';
      } else if (status === 'hired') {
        title = `🎉 Selamat! Anda Resmi Diterima di ${companyName}`;
        message = `Selamat! ${companyName} telah menyetujui dan menerima Anda untuk bergabung di posisi ${jobTitle}.`;
        type = 'status';
      } else {
        title = `🚀 Lamaran Maju ke Tahap ${status.toUpperCase().replace('_', ' ')}`;
        message = `Lamaran Anda untuk posisi ${jobTitle} di ${companyName} telah disetujui dan dipindahkan ke tahap ${status.toUpperCase().replace('_', ' ')}.`;
        type = 'status';
      }

      localDB.addNotification({
        userId: candidateUserId,
        title,
        message,
        type
      });
    }
  },
  withdrawApplication: (appId: string) => {
    const apps = JSON.parse(localStorage.getItem('spora_applications') || '[]');
    const targetApp = apps.find((a: any) => a.id === appId);
    
    if (targetApp) {
      const targetJobId = targetApp.jobId;
      const targetStudentId = (targetApp.studentId || '').toLowerCase();
      const targetEmail = (targetApp.studentEmail || '').toLowerCase();
      const targetName = (targetApp.studentName || '').toLowerCase();

      // Cascade delete ALL application records for this candidate and jobId
      const filtered = apps.filter((a: any) => {
        if (a.id === appId) return false;
        if (a.jobId === targetJobId) {
          const sId = (a.studentId || '').toLowerCase();
          const sEmail = (a.studentEmail || '').toLowerCase();
          const sName = (a.studentName || '').toLowerCase();
          if (
            (targetStudentId && sId === targetStudentId) ||
            (targetEmail && sEmail === targetEmail) ||
            (targetName && sName === targetName)
          ) {
            return false;
          }
        }
        return true;
      });
      localStorage.setItem('spora_applications', JSON.stringify(filtered));
      return;
    }

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
