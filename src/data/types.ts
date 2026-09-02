export interface User { 
  id: string; 
  email: string; 
  name: string; 
  role: 'student' | 'school' | 'industry' | 'admin'; 
  avatarUrl: string; 
  tenantId: string | null; 
  nisn?: string;
  schoolToken?: string;
  isActive: boolean; 
  createdAt: string; 
  lastLoginAt: string; 
}

export interface Student { 
  id: string; 
  userId: string; 
  schoolId: string; 
  nisn?: string;
  schoolName?: string;
  schoolToken?: string;
  isSchoolVerified?: boolean;
  major: string; 
  graduationYear: number; 
  province: string; 
  city: string; 
  skills: string[]; 
  languages: string[]; 
  resumeUrl: string; 
  careerInterest: string; 
  profileCompletion: number; 
  status: 'active' | 'graduated' | 'employed'; 
}

export interface Profile { 
  id: string; 
  studentId: string; 
  fullName: string; 
  nisn?: string;
  dateOfBirth: string; 
  gender: string; 
  phone: string; 
  address: string; 
  bio: string; 
  linkedinUrl: string; 
  portfolioUrl: string; 
}

export interface School { 
  id: string; 
  name: string; 
  provinceId: string; 
  city: string; 
  address: string; 
  type: string; 
  majors: string[]; 
  totalStudents: number; 
  employmentRate: number; 
  avgTalentScore: number; 
  registrationToken: string;
  partnershipStatus: 'active' | 'pending' | 'inactive'; 
}

export interface Industry { 
  id: string; 
  companyName: string; 
  sector: string; 
  provinceId: string; 
  city: string; 
  logoUrl: string; 
  description: string; 
  totalEmployees: number; 
  activeVacancies: number; 
  totalHires: number; 
  partnershipTier: 'platinum' | 'gold' | 'silver'; 
}

export interface Job { 
  id: string; 
  industryId: string; 
  title: string; 
  description: string; 
  department: string; 
  location: string; 
  employmentType: 'full-time' | 'contract' | 'internship'; 
  salaryMin: number; 
  salaryMax: number; 
  requiredTalentScore: number; 
  requiredSkills: string[]; 
  requiredCertifications: string[]; 
  status: 'active' | 'paused' | 'closed'; 
  postedAt: string; 
  deadline: string; 
}

export interface ScoreDimension { 
  key: string; 
  label: string; 
  score: number; 
  weight: number; 
  source: string; 
  description: string; 
  color: string; 
}

export interface TalentScore { 
  id: string; 
  studentId: string; 
  overall: number; 
  dimensions: ScoreDimension[]; 
  calculatedAt: string; 
  configVersion: string; 
}

export interface ScoreConfig { 
  id: string; 
  version: string; 
  dimensions: Omit<ScoreDimension, 'score'>[]; 
  minPoolScore: number; 
  minMatchPercent: number; 
  minProfileCompletion: number; 
  updatedAt: string; 
  updatedBy: string; 
}

export interface Assessment { 
  id: string; 
  type: 'psychometric' | 'technical'; 
  title: string; 
  description: string; 
  timeLimit: number; 
  totalQuestions: number; 
  passingScore: number; 
  category: string; 
  isActive: boolean; 
}

export interface Question { 
  id: string; 
  assessmentId: string; 
  text: string; 
  type: 'single' | 'multiple' | 'scale'; 
  options: string[]; 
  correctAnswer: string; 
  points: number; 
  difficulty: 'easy' | 'medium' | 'hard'; 
  category: string; 
}

export interface AssessmentResult { 
  id: string; 
  studentId: string; 
  assessmentId: string; 
  score: number; 
  totalQuestions: number; 
  correctAnswers: number; 
  timeTaken: number; 
  dimensionScores: Record<string, number>; 
  strengths: string[]; 
  weaknesses: string[]; 
  personalityType: string; 
  completedAt: string; 
}

export interface AIPsychologicalReport {
  id: string;
  studentId: string;
  generatedAt: string;
  modelUsed: string;
  archetype: string;
  summary: string;
  bigFiveTraits: {
    conscientiousness: { score: number; analysis: string };
    emotionalStability: { score: number; analysis: string };
    extraversion: { score: number; analysis: string };
    agreeableness: { score: number; analysis: string };
    openness: { score: number; analysis: string };
  };
  safetyMindsetIndex: number;
  workplaceStrengths: string[];
  operationalRisks: string[];
  developmentRecommendations: string[];
  recommendedEVRoles: string[];
}

export interface Certificate { 
  id: string; 
  studentId: string; 
  name: string; 
  issuingBody: string; 
  issueDate: string; 
  expiryDate: string; 
  fileUrl: string; 
  status: 'verified' | 'pending' | 'rejected'; 
  type: 'competency' | 'training' | 'award'; 
}

export interface PortfolioProject { 
  id: string; 
  studentId: string; 
  title: string; 
  description: string; 
  imageUrl: string; 
  projectUrl: string; 
  tags: string[]; 
  completedDate: string; 
}

export interface Application { 
  id: string; 
  studentId: string; 
  jobId: string; 
  status: 'applied' | 'ai_screening' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected' | 'withdrawn'; 
  aiMatchScore: number; 
  aiMatchReasons: string[]; 
  appliedAt: string; 
  statusUpdatedAt: string; 
  rejectionReason: string; 
}

export interface Interview { 
  id: string; 
  applicationId: string; 
  scheduledAt: string; 
  durationMinutes: number; 
  location: 'online' | 'onsite'; 
  meetingUrl: string; 
  interviewerName: string; 
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'; 
  feedback: string; 
  rating: number; 
}

export interface Notification { 
  id: string; 
  userId: string; 
  type: 'invite' | 'reminder' | 'status' | 'feedback' | 'system'; 
  title: string; 
  message: string; 
  actionUrl: string; 
  isRead: boolean; 
  createdAt: string; 
}

export interface AIRecommendation { 
  id: string; 
  studentId: string; 
  type: 'career' | 'learning' | 'job' | 'industry'; 
  title: string; 
  description: string; 
  reason: string; 
  confidence: number; 
  relatedJobId: string; 
  generatedAt: string; 
}

export interface SchoolFeedback { 
  id: string; 
  schoolId: string; 
  industryId: string; 
  category: string; 
  skillArea: string; 
  rating: number; 
  comment: string; 
  recommendation: string; 
  createdAt: string; 
}

export interface Province { 
  id: string; 
  name: string; 
  region: string; 
  latitude: number; 
  longitude: number; 
  totalStudents: number; 
  totalSchools: number; 
  totalIndustries: number; 
}

export interface AuditLog { 
  id: string; 
  userId: string; 
  userName: string; 
  userRole: string; 
  action: string; 
  entity: string; 
  entityId: string; 
  ipAddress: string; 
  timestamp: string; 
}

export interface FAQ { 
  id: string; 
  question: string; 
  answer: string; 
  category: string; 
}

export interface Testimonial { 
  id: string; 
  name: string; 
  role: string; 
  organization: string; 
  quote: string; 
  avatarUrl: string; 
}
