import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import DashboardLayout from './layout/DashboardLayout.jsx';

// Public Pages
import HomePage from './pages/homepage.jsx'; 
import LoginPage from './pages/loginpage.jsx';
import SignupPage from './pages/signuppage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

// Student Components & Pages
import PersonalDashboard from './components/PersonalDashboard.jsx'; // Now a page
import TeamManagement from './components/TeamManagement.jsx'; // Now a page
import MissionsPage from './pages/student/MissionsPage.jsx'; // New file
import AlumniPage from './pages/student/AlumniPage.jsx'; // New file

// Mentor Pages
import MentorDashboard from './pages/admin/MentorDashboard.jsx';
import AdminTaskPage from './pages/admin/AdminTaskPage.jsx';
import AdminTeamsPage from './pages/admin/AdminTeamsPage.jsx';

// Components
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

        {/* --- Protected Routes wrapped in DashboardLayout --- */}
        <Route element={<DashboardLayout />}>
          
          {/* STUDENT ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Student', 'Mentor', 'Admin', 'Alumni']} />}>
            <Route path="/dashboard" element={
              <div className="p-4 md:p-8"><PersonalDashboard /></div>
            } />
            <Route path="/team/me" element={
              <div className="p-4 md:p-8"><TeamManagement /></div>
            } />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/alumni" element={<AlumniPage />} />
          </Route>

          {/* MENTOR ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin', 'Alumni']} />}>
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/tasks" element={<AdminTaskPage />} />
            <Route path="/mentor/teams" element={<AdminTeamsPage />} />
          </Route>

        </Route>

        {/* --- 404 Route --- */}
        <Route path="*" element={<div className="text-white text-center mt-20 text-xl font-creepster">404 - You are lost in the Upside Down</div>} />
      </Routes>
    </div>
  );
}

export default App;