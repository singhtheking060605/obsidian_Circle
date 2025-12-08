// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// // Layout

// import ViewAllTasks from './components/viewalltasks.jsx';
// import AcceptMission from './components/acceptmission.jsx';
// import ManageTeam from './components/manageteam.jsx';



// import DashboardLayout from './layout/DashboardLayout.jsx';

// // Public Pages
// import HomePage from './pages/homepage.jsx'; 
// import LoginPage from './pages/loginpage.jsx';
// import SignupPage from './pages/signuppage.jsx';
// import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
// import ResetPasswordPage from './pages/ResetPasswordPage.jsx';


// import AcceptInvitationPage from './pages/AcceptInvitationPage.jsx';

// // Student Components & Pages
// import PersonalDashboard from './components/PersonalDashboard.jsx'; 
// import TeamManagement from './components/TeamManagement.jsx'; 
// import MissionsPage from './pages/student/MissionsPage.jsx'; 
// import AlumniPage from './pages/student/AlumniPage.jsx'; 

// // Mentor Pages
// import MentorDashboard from './pages/admin/MentorDashboard.jsx';
// import AdminTaskPage from './pages/admin/AdminTaskPage.jsx';
// import AdminTeamsPage from './pages/admin/AdminTeamsPage.jsx';

// import QnAPage from './pages/QnAPage.jsx';

// import AdminEvaluate from './pages/admin/AdminEvaluate.jsx'; // <--- ADD THIS IMPORT

// // Components

// import ProtectedRoute from './components/ProtectedRoute.jsx';

// // ... imports
// import AdminReferral from './pages/admin/AdminReferral.jsx'; // <--- Import

// // ... inside <Routes> under MENTOR ROUTES
// import AdminStudents from './pages/admin/AdminStudents.jsx';

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         {/* --- Public Routes --- */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        

//  {/* View all available missions/tasks */}
//         <Route path="/all-missions" element={<ViewAllTasks />} />
//         <Route path="/missions" element={<ViewAllTasks />} />
        
//         {/* Accept mission form */}
//         <Route path="/accept-mission/:taskId" element={<AcceptMission />} />
        
//         {/* Manage team with missions */}
//         <Route path="/manage-team" element={<ManageTeam />} />
//         <Route path="/my-team" element={<ManageTeam />} />








//         {/* Accept Team Invitation - Public Route */}
//         <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />

//         {/* --- Protected Routes wrapped in DashboardLayout --- */}
//         <Route element={<DashboardLayout />}>
          
//           {/* STUDENT ROUTES */}
//           <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
//             <Route path="/dashboard" element={
//               <div className="p-4 md:p-8"><PersonalDashboard /></div>
//             } />
//             <Route path="/team/me" element={
//               <div className="p-4 md:p-8"><TeamManagement /></div>
//             } />
//             <Route path="/missions" element={<MissionsPage />} />
//             <Route path="/alumni" element={<AlumniPage />} />
//              {/* ... existing routes ... */}
//             <Route path="/qna" element={<QnAPage />} /> {/* ADD THIS LINE */}
//           </Route>

//           {/* MENTOR ROUTES */}
//           <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin', 'Alumni']} />}>
//             <Route path="/mentor/dashboard" element={<MentorDashboard />} />
//             <Route path="/mentor/tasks" element={<AdminTaskPage />} />
//             <Route path="/mentor/teams" element={<AdminTeamsPage />} />
//             <Route path="/mentor/qna" element={<QnAPage />} /> {/* ADD THIS LINE */}
//             <Route path="/mentor/evaluate" element={<AdminEvaluate />} /> {/* <--- ADD THIS ROUTE */}

//             <Route path="/mentor/referral" element={<AdminReferral />} /> {/* <--- Add Route */}
//             <Route path="/mentor/students" element={<AdminStudents />} />
//             <Route path="/mentor/alumni" element={<AlumniPage />} />

//           </Route>

//         </Route>


//         {/* --- 404 Route --- */}
//         <Route path="*" element={<div className="text-white text-center mt-20 text-xl font-creepster">404 - You are lost in the Upside Down</div>} />

//       </Routes>
//     </div>
//   );
// }

// export default App;


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

import AdminStudents from './pages/admin/AdminStudents.jsx';
import AdminReferral from './pages/admin/AdminReferral.jsx'; 
import AdminEvaluate from './pages/admin/AdminEvaluate.jsx'; 

// --- NEW IMPORTS (ADDED) ---
// This is the component for the 'Review Submissions' sidebar link
import MentorSubmissionsList from './pages/admin/MentorSubmissionList.jsx'; 
// ---------------------------

// Components
import ViewAllTasks from './components/viewalltasks.jsx';
import AcceptMission from './components/acceptmission.jsx';
import ManageTeam from './components/manageteam.jsx';
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
                
                {/* Public Mission/Team Links (as per your existing code) */}
                <Route path="/all-missions" element={<ViewAllTasks />} />
                <Route path="/missions" element={<ViewAllTasks />} />
                <Route path="/accept-mission/:taskId" element={<AcceptMission />} />
                <Route path="/manage-team" element={<ManageTeam />} />
                <Route path="/my-team" element={<ManageTeam />} />
                <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />

                {/* --- Protected Routes wrapped in DashboardLayout --- */}
                <Route element={<DashboardLayout />}>
                    
                    {/* STUDENT ROUTES */}
                    <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
                        <Route path="/dashboard" element={
                            <div className="p-4 md:p-8"><PersonalDashboard /></div>
                        } />
                        <Route path="/team/me" element={
                            <div className="p-4 md:p-8"><TeamManagement /></div>
                        } />
                        <Route path="/missions" element={<MissionsPage />} />
                        <Route path="/alumni" element={<AlumniPage />} />
                        <Route path="/qna" element={<QnAPage />} />
                    </Route>

                    {/* MENTOR ROUTES */}
                    <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin', 'Alumni']} />}>
                        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
                        <Route path="/mentor/tasks" element={<AdminTaskPage />} />
                        <Route path="/mentor/teams" element={<AdminTeamsPage />} />
                        <Route path="/mentor/qna" element={<QnAPage />} /> 
                        <Route path="/mentor/referral" element={<AdminReferral />} />
                        <Route path="/mentor/students" element={<AdminStudents />} />
                        <Route path="/mentor/alumni" element={<AlumniPage />} />
                        
                        {/* --- NEW AI FEATURE ROUTES (FIXED) --- */}
                        {/* 1. Mentor Submissions List (Fixes 404 for sidebar link) */}
                        <Route path="/mentor/submissions" element={<MentorSubmissionsList />} /> 
                        
                        {/* 2. Admin Evaluate Page (Now requires taskId, accessed from submissions list) */}
                        <Route path="/admin/evaluate/:taskId" element={<AdminEvaluate />} /> 
                        {/* ------------------------------------- */}

                    </Route>

                </Route>


                {/* --- 404 Route --- */}
                <Route path="*" element={<div className="text-white text-center mt-20 text-xl font-creepster">404 - You are lost in the Upside Down</div>} />

            </Routes>
        </div>
    );
// =======
// import AdminEvaluate from './pages/admin/AdminEvaluate.jsx'; 
// import AdminReferral from './pages/admin/AdminReferral.jsx'; 
// import AdminStudents from './pages/admin/AdminStudents.jsx';

// // Auth
// import ProtectedRoute from './components/ProtectedRoute.jsx';

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         {/* --- Public Routes --- */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
//         <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />

//         {/* --- Protected Routes wrapped in DashboardLayout --- */}
//         <Route element={<DashboardLayout />}>
          
//           {/* STUDENT ROUTES */}
//           <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            
//             {/* Dashboard: Acts as the main container */}
//             <Route path="/dashboard" element={
//               <div className="p-4 md:p-8"><PersonalDashboard /></div>
//             } />
            
//             {/* Direct Links (If user navigates directly via URL) */}
//             <Route path="/team/me" element={
//               <div className="p-4 md:p-8"><TeamManagement /></div>
//             } />
            
//             {/* Reused AvailableMissions here if direct link needed */}
//             <Route path="/missions" element={
//                <div className="p-4 md:p-8"><AvailableMissions /></div>
//             } />
            
//             {/* Individual Mission Acceptance Page */}
//             <Route path="/accept-mission/:taskId" element={
//                <div className="p-4 md:p-8"><AcceptMission /></div> 
//             } />

//             <Route path="/alumni" element={<AlumniPage />} />
//             <Route path="/qna" element={<QnAPage />} />
//           </Route>

//           {/* MENTOR ROUTES */}
//           <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin', 'Alumni']} />}>
//             <Route path="/mentor/dashboard" element={<MentorDashboard />} />
//             <Route path="/mentor/tasks" element={<AdminTaskPage />} />
//             <Route path="/mentor/teams" element={<AdminTeamsPage />} />
//             <Route path="/mentor/qna" element={<QnAPage />} /> 
//             <Route path="/mentor/evaluate" element={<AdminEvaluate />} /> 
//             <Route path="/mentor/referral" element={<AdminReferral />} />
//             <Route path="/mentor/students" element={<AdminStudents />} />
//             <Route path="/mentor/alumni" element={<AlumniPage />} />
//           </Route>

//         </Route>

//         {/* --- 404 Route --- */}
//         <Route path="*" element={<div className="text-white text-center mt-20 text-xl font-creepster">404 - You are lost in the Upside Down</div>} />

//       </Routes>
//     </div>
//   );

}

export default App;