import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import DashboardLayout from './layout/DashboardLayout.jsx';

// Public Pages
import HomePage from './pages/homepage.jsx'; 
import LoginPage from './pages/loginpage.jsx';
import SignupPage from './pages/signuppage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AcceptInvitationPage from './pages/AcceptInvitationPage.jsx';

// Components
import AcceptMission from './components/acceptmission.jsx';
import PersonalDashboard from './components/PersonalDashboard.jsx'; 
import TeamManagement from './components/TeamManagement.jsx'; 
import AvailableMissions from './components/AvailableMissions.jsx'; // Using our new component
import AlumniPage from './pages/student/AlumniPage.jsx'; 
import QnAPage from './pages/QnAPage.jsx';

// Mentor Pages
import MentorDashboard from './pages/admin/MentorDashboard.jsx';
import AdminTaskPage from './pages/admin/AdminTaskPage.jsx';
import AdminTeamsPage from './pages/admin/AdminTeamsPage.jsx';
import AdminEvaluate from './pages/admin/AdminEvaluate.jsx'; 
import AdminReferral from './pages/admin/AdminReferral.jsx'; 
import AdminStudents from './pages/admin/AdminStudents.jsx';

import MissionRequestsPage from './pages/admin/MissionRequestsPage';


// Auth
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />

        {/* --- Protected Routes wrapped in DashboardLayout --- */}
        <Route element={<DashboardLayout />}>
          
          {/* STUDENT ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            
            {/* Dashboard: Acts as the main container */}
            <Route path="/dashboard" element={
              <div className="p-4 md:p-8"><PersonalDashboard /></div>
            } />
            
            {/* Direct Links (If user navigates directly via URL) */}
            <Route path="/team/me" element={
              <div className="p-4 md:p-8"><TeamManagement /></div>
            } />
            
            {/* Reused AvailableMissions here if direct link needed */}
            <Route path="/missions" element={
               <div className="p-4 md:p-8"><AvailableMissions /></div>
            } />
            
            {/* Individual Mission Acceptance Page */}
            <Route path="/accept-mission/:taskId" element={
               <div className="p-4 md:p-8"><AcceptMission /></div> 
            } />

            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/qna" element={<QnAPage />} />
          </Route>

          {/* MENTOR ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin', 'Alumni']} />}>
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/tasks" element={<AdminTaskPage />} />
            <Route path="/mentor/teams" element={<AdminTeamsPage />} />
            <Route path="/mentor/qna" element={<QnAPage />} /> 
            <Route path="/mentor/evaluate" element={<AdminEvaluate />} /> 
            <Route path="/mentor/referral" element={<AdminReferral />} />
            <Route path="/mentor/students" element={<AdminStudents />} />
            <Route path="/mentor/alumni" element={<AlumniPage />} />
            {/* // ... inside <Routes> -> Mentor Routes ... */}
            <Route path="/mentor/requests" element={<MissionRequestsPage />} />
          </Route>

        </Route>

        {/* --- 404 Route --- */}
        <Route path="*" element={<div className="text-white text-center mt-20 text-xl font-creepster">404 - You are lost in the Upside Down</div>} />

      </Routes>
    </div>
  );
}

export default App;