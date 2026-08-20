import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

// Helper for named exports lazy loading
const lazyNamed = (importFn: () => Promise<any>, exportName: string) =>
  lazy(() => importFn().then((module) => ({ default: module[exportName] })));

// Public & Auth Pages
const LandingPage = lazyNamed(() => import('../pages/landing/LandingPage'), 'LandingPage');
const LoginPage = lazyNamed(() => import('../pages/auth/LoginPage'), 'LoginPage');
const RegisterPage = lazyNamed(() => import('../pages/auth/RegisterPage'), 'RegisterPage');
const ForgotPasswordPage = lazyNamed(() => import('../pages/auth/ForgotPasswordPage'), 'ForgotPasswordPage');
const RoleSelectionPage = lazyNamed(() => import('../pages/auth/RoleSelectionPage'), 'RoleSelectionPage');
const PendingVerificationPage = lazyNamed(() => import('../pages/auth/PendingVerificationPage'), 'PendingVerificationPage');

// Layouts
const StudentLayout = lazyNamed(() => import('../layouts/StudentLayout'), 'StudentLayout');
const IndustryLayout = lazyNamed(() => import('../layouts/IndustryLayout'), 'IndustryLayout');
const SchoolLayout = lazyNamed(() => import('../layouts/SchoolLayout'), 'SchoolLayout');
const AdminLayout = lazyNamed(() => import('../layouts/AdminLayout'), 'AdminLayout');

// Student Pages
const StudentDashboard = lazyNamed(() => import('../pages/student/StudentDashboard'), 'StudentDashboard');
const StudentProfile = lazyNamed(() => import('../pages/student/StudentProfile'), 'StudentProfile');
const StudentAssessments = lazyNamed(() => import('../pages/student/StudentAssessments'), 'StudentAssessments');
const StudentCertificates = lazyNamed(() => import('../pages/student/StudentCertificates'), 'StudentCertificates');
const StudentPortfolio = lazyNamed(() => import('../pages/student/StudentPortfolio'), 'StudentPortfolio');
const StudentTalentScore = lazyNamed(() => import('../pages/student/StudentTalentScore'), 'StudentTalentScore');
const StudentJobBoard = lazyNamed(() => import('../pages/student/StudentJobBoard'), 'StudentJobBoard');
const StudentJobDetail = lazyNamed(() => import('../pages/student/StudentJobDetail'), 'StudentJobDetail');
const StudentApplications = lazyNamed(() => import('../pages/student/StudentApplications'), 'StudentApplications');
const StudentNotifications = lazyNamed(() => import('../pages/student/StudentNotifications'), 'StudentNotifications');
const StudentSettings = lazyNamed(() => import('../pages/student/StudentSettings'), 'StudentSettings');

// Assessment Engine Pages
const AssessmentList = lazyNamed(() => import('../pages/assessment/AssessmentList'), 'AssessmentList');
const AssessmentInstructions = lazyNamed(() => import('../pages/assessment/AssessmentInstructions'), 'AssessmentInstructions');
const AssessmentTest = lazyNamed(() => import('../pages/assessment/AssessmentTest'), 'AssessmentTest');
const AssessmentReview = lazyNamed(() => import('../pages/assessment/AssessmentReview'), 'AssessmentReview');
const AssessmentResults = lazyNamed(() => import('../pages/assessment/AssessmentResults'), 'AssessmentResults');

// Industry Pages
const IndustryDashboard = lazyNamed(() => import('../pages/industry/IndustryDashboard'), 'IndustryDashboard');
const IndustryVacancies = lazyNamed(() => import('../pages/industry/IndustryVacancies'), 'IndustryVacancies');
const IndustryJobPosting = lazyNamed(() => import('../pages/industry/IndustryJobPosting'), 'IndustryJobPosting');
const IndustryTalentPool = lazyNamed(() => import('../pages/industry/IndustryTalentPool'), 'IndustryTalentPool');
const CandidateDetail = lazyNamed(() => import('../pages/industry/CandidateDetail'), 'CandidateDetail');
const IndustryPipeline = lazyNamed(() => import('../pages/industry/IndustryPipeline'), 'IndustryPipeline');
const IndustryCandidates = lazyNamed(() => import('../pages/industry/IndustryCandidates'), 'IndustryCandidates');
const IndustryInterviews = lazyNamed(() => import('../pages/industry/IndustryInterviews'), 'IndustryInterviews');
const IndustryReports = lazyNamed(() => import('../pages/industry/IndustryReports'), 'IndustryReports');

// School Pages
const SchoolDashboard = lazyNamed(() => import('../pages/school/SchoolDashboard'), 'SchoolDashboard');
const SchoolStudents = lazyNamed(() => import('../pages/school/SchoolStudents'), 'SchoolStudents');
const SchoolGraduates = lazyNamed(() => import('../pages/school/SchoolGraduates'), 'SchoolGraduates');
const SchoolAnalytics = lazyNamed(() => import('../pages/school/SchoolAnalytics'), 'SchoolAnalytics');
const SchoolSkillGap = lazyNamed(() => import('../pages/school/SchoolSkillGap'), 'SchoolSkillGap');
const SchoolIndustryFeedback = lazyNamed(() => import('../pages/school/SchoolIndustryFeedback'), 'SchoolIndustryFeedback');
const SchoolCurriculum = lazyNamed(() => import('../pages/school/SchoolCurriculum'), 'SchoolCurriculum');
const SchoolPlacement = lazyNamed(() => import('../pages/school/SchoolPlacement'), 'SchoolPlacement');
const SchoolRankings = lazyNamed(() => import('../pages/school/SchoolRankings'), 'SchoolRankings');

// Admin Pages
const AdminDashboard = lazyNamed(() => import('../pages/admin/AdminDashboard'), 'AdminDashboard');
const AdminUsers = lazyNamed(() => import('../pages/admin/AdminUsers'), 'AdminUsers');
const AdminStudents = lazyNamed(() => import('../pages/admin/AdminStudents'), 'AdminStudents');
const AdminSchools = lazyNamed(() => import('../pages/admin/AdminSchools'), 'AdminSchools');
const AdminIndustries = lazyNamed(() => import('../pages/admin/AdminIndustries'), 'AdminIndustries');
const AdminAssessments = lazyNamed(() => import('../pages/admin/AdminAssessments'), 'AdminAssessments');
const AdminAIRules = lazyNamed(() => import('../pages/admin/AdminAIRules'), 'AdminAIRules');
const AdminReports = lazyNamed(() => import('../pages/admin/AdminReports'), 'AdminReports');
const AdminAnalytics = lazyNamed(() => import('../pages/admin/AdminAnalytics'), 'AdminAnalytics');
const AdminSystem = lazyNamed(() => import('../pages/admin/AdminSystem'), 'AdminSystem');

// Error Pages
const Error403 = lazy(() => import('../pages/errors/Error403'));
const Error404 = lazy(() => import('../pages/errors/Error404'));

const DashboardRedirect: React.FC = () => {
  const { role } = useAuth();
  if (role === 'industry') return <Navigate to="/industry/dashboard" replace />;
  if (role === 'school') return <Navigate to="/school/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

const PageFallback = () => (
  <div className="flex h-screen items-center justify-center font-sans text-slate-500 font-bold bg-slate-50">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-[#0099B8] border-t-transparent rounded-full animate-spin"></div>
      <span>Memuat Spora Juara...</span>
    </div>
  </div>
);

export const AppRouter: React.FC = () => (
  <Suspense fallback={<PageFallback />}>
    <Routes>
      {/* Public & Landing Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/pending-verification" element={<PendingVerificationPage />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />

      {/* Student Portal (Protected) */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="assessments" element={<StudentAssessments />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="portfolio" element={<StudentPortfolio />} />
          <Route path="talent-score" element={<StudentTalentScore />} />
          <Route path="jobs" element={<StudentJobBoard />} />
          <Route path="jobs/:id" element={<StudentJobDetail />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        <Route path="/assessment" element={<StudentLayout />}>
          <Route index element={<Navigate to="list" replace />} />
          <Route path="list" element={<AssessmentList />} />
          <Route path=":id/instructions" element={<AssessmentInstructions />} />
          <Route path=":id/test" element={<AssessmentTest />} />
          <Route path=":id/review" element={<AssessmentReview />} />
          <Route path=":id/results" element={<AssessmentResults />} />
        </Route>
      </Route>

      {/* Industry Portal (Protected) */}
      <Route element={<ProtectedRoute allowedRole="industry" />}>
        <Route path="/industry" element={<IndustryLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<IndustryDashboard />} />
          <Route path="vacancies" element={<IndustryVacancies />} />
          <Route path="post-job" element={<IndustryJobPosting />} />
          <Route path="talent-pool" element={<IndustryTalentPool />} />
          <Route path="talent-pool/:id" element={<CandidateDetail />} />
          <Route path="pipeline" element={<IndustryPipeline />} />
          <Route path="candidates" element={<IndustryCandidates />} />
          <Route path="interviews" element={<IndustryInterviews />} />
          <Route path="reports" element={<IndustryReports />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Route>

      {/* School Portal (Protected) */}
      <Route element={<ProtectedRoute allowedRole="school" />}>
        <Route path="/school" element={<SchoolLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SchoolDashboard />} />
          <Route path="students" element={<SchoolStudents />} />
          <Route path="graduates" element={<SchoolGraduates />} />
          <Route path="analytics" element={<SchoolAnalytics />} />
          <Route path="skill-gap" element={<SchoolSkillGap />} />
          <Route path="feedback" element={<SchoolIndustryFeedback />} />
          <Route path="curriculum" element={<SchoolCurriculum />} />
          <Route path="placement" element={<SchoolPlacement />} />
          <Route path="rankings" element={<SchoolRankings />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Route>

      {/* Admin Command Center (Protected) */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="schools" element={<AdminSchools />} />
          <Route path="industries" element={<AdminIndustries />} />
          <Route path="assessments" element={<AdminAssessments />} />
          <Route path="ai-rules" element={<AdminAIRules />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="system" element={<AdminSystem />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Route>

      {/* Error & Fallback Routes */}
      <Route path="/403" element={<Error403 />} />
      <Route path="/404" element={<Error404 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  </Suspense>
);