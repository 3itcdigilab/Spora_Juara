import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';

// Public & Auth Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { RoleSelectionPage } from '../pages/auth/RoleSelectionPage';
import { PendingVerificationPage } from '../pages/auth/PendingVerificationPage';

// Layouts
import { StudentLayout } from '../layouts/StudentLayout';
import { IndustryLayout } from '../layouts/IndustryLayout';
import { SchoolLayout } from '../layouts/SchoolLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentProfile } from '../pages/student/StudentProfile';
import { StudentAssessments } from '../pages/student/StudentAssessments';
import { StudentCertificates } from '../pages/student/StudentCertificates';
import { StudentPortfolio } from '../pages/student/StudentPortfolio';
import { StudentTalentScore } from '../pages/student/StudentTalentScore';
import { StudentAIRecommendation } from '../pages/student/StudentAIRecommendation';
import { StudentJobBoard } from '../pages/student/StudentJobBoard';
import { StudentJobDetail } from '../pages/student/StudentJobDetail';
import { StudentApplications } from '../pages/student/StudentApplications';
import { StudentNotifications } from '../pages/student/StudentNotifications';
import { StudentSettings } from '../pages/student/StudentSettings';

// Assessment Engine Pages
import { AssessmentList } from '../pages/assessment/AssessmentList';
import { AssessmentInstructions } from '../pages/assessment/AssessmentInstructions';
import { AssessmentTest } from '../pages/assessment/AssessmentTest';
import { AssessmentReview } from '../pages/assessment/AssessmentReview';
import { AssessmentResults } from '../pages/assessment/AssessmentResults';

// Industry Pages
import { IndustryDashboard } from '../pages/industry/IndustryDashboard';
import { IndustryVacancies } from '../pages/industry/IndustryVacancies';
import { IndustryJobPosting } from '../pages/industry/IndustryJobPosting';
import { IndustryTalentPool } from '../pages/industry/IndustryTalentPool';
import { CandidateDetail } from '../pages/industry/CandidateDetail';
import { IndustryPipeline } from '../pages/industry/IndustryPipeline';
import { IndustryCandidates } from '../pages/industry/IndustryCandidates';
import { IndustryInterviews } from '../pages/industry/IndustryInterviews';
import { IndustryReports } from '../pages/industry/IndustryReports';
import { IndustryAIRecommendations } from '../pages/industry/IndustryAIRecommendations';

// School Pages
import { SchoolDashboard } from '../pages/school/SchoolDashboard';
import { SchoolStudents } from '../pages/school/SchoolStudents';
import { SchoolGraduates } from '../pages/school/SchoolGraduates';
import { SchoolAnalytics } from '../pages/school/SchoolAnalytics';
import { SchoolSkillGap } from '../pages/school/SchoolSkillGap';
import { SchoolIndustryFeedback } from '../pages/school/SchoolIndustryFeedback';
import { SchoolCurriculum } from '../pages/school/SchoolCurriculum';
import { SchoolPlacement } from '../pages/school/SchoolPlacement';
import { SchoolRankings } from '../pages/school/SchoolRankings';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminStudents } from '../pages/admin/AdminStudents';
import { AdminSchools } from '../pages/admin/AdminSchools';
import { AdminIndustries } from '../pages/admin/AdminIndustries';
import { AdminAssessments } from '../pages/admin/AdminAssessments';
import { AdminAIRules } from '../pages/admin/AdminAIRules';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminAnalytics } from '../pages/admin/AdminAnalytics';
import { AdminSystem } from '../pages/admin/AdminSystem';

// Error Pages
import Error403 from '../pages/errors/Error403';
import Error404 from '../pages/errors/Error404';

import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect: React.FC = () => {
  const { role } = useAuth();
  if (role === 'industry') return <Navigate to="/industry/dashboard" replace />;
  if (role === 'school') return <Navigate to="/school/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const AppRouter: React.FC = () => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center font-sans text-slate-500 font-bold">Loading Spora Juara...</div>}>
    <Routes>
      {/* Public & Landing Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/pending-verification" element={<PendingVerificationPage />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />

      {/* Student Portal */}
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

      {/* Assessment Engine */}
      <Route path="/assessment" element={<StudentLayout />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<AssessmentList />} />
        <Route path=":id/instructions" element={<AssessmentInstructions />} />
        <Route path=":id/test" element={<AssessmentTest />} />
        <Route path=":id/review" element={<AssessmentReview />} />
        <Route path=":id/results" element={<AssessmentResults />} />
      </Route>

      {/* Industry Portal */}
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

      {/* School Portal */}
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

      {/* Admin Command Center */}
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

      {/* Error & Fallback Routes */}
      <Route path="/403" element={<Error403 />} />
      <Route path="/404" element={<Error404 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  </Suspense>
);