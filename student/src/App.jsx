// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// // The AuthProvider is imported from context, not the main app directory.
// // import { AuthProvider } from './context/AuthContext'; 
// // ProtectedRoute is a component and should be imported from the components directory.
// // import ProtectedRoute from './components/ProtectedRoute'; 

// // --- Public Pages ---
// // These are top-level pages and should be imported directly from the pages directory.
// import HomePage from './pages/homepage.jsx'; 
// // import LoginPage from './pages/LoginPage'; 
// // import NotFoundPage from './pages/NotFoundPage'; 

// // // --- Student Pages ---
// // // These are specific to the student folder structure.
// // import StudentDashboard from './student/pages/StudentDashboard';
// // import TaskListView from './student/pages/TaskListView';
// // import TaskDetailsPage from './student/pages/TaskDetailsPage';

// // // --- Mentor/Alumni Pages ---
// // // These are specific to the mentor folder structure.
// // import MentorDashboard from './mentor/pages/MentorDashboard';
// // import PostTaskPage from './mentor/pages/PostTaskPage';
// // import MentorProfilePage from './mentor/pages/MentorProfilePage';

// // // --- Admin Pages ---
// // // These are specific to the admin folder structure.
// // import AdminDashboard from './admin/pages/AdminDashboard';
// // import UserManagementPage from './admin/pages/UserManagementPage';


// function App() {
//   return (
//     <div className="App">
//         {/* AuthProvider should ideally wrap App in main.jsx, but included here for completeness */}
//         {/* <AuthProvider> */}
//             <Routes>
//                 {/* 1. Public Routes */}
//                 <Route path="/" element={<HomePage />} />
//                 {/* Comment out LoginPage route since it's not imported yet */}
//                 {/* <Route path="/login" element={<LoginPage />} /> */}
                
//                 {/* 2. Authenticated Student/Mentor Routes (Tasks are open to both roles) */}
//                 {/* <Route element={<ProtectedRoute allowedRoles={['Student', 'Mentor']} />}> */}
//                     {/* The main dashboard for students is often the base dashboard route */}
//                     {/* <Route path="/dashboard" element={<StudentDashboard />} />  */}
//                     {/* <Route path="/tasks" element={<TaskListView />} /> */}
//                     {/* <Route path="/tasks/:taskId" element={<TaskDetailsPage />} /> */}
//                 {/* </Route> */}
                
//                 {/* 3. Authenticated Mentor/Alumni Routes (requires 'Mentor' role for management) */}
//                 {/* <Route element={<ProtectedRoute allowedRoles={['Mentor']} />}> */}
//                     {/* Mentor-specific dashboard view */}
//                     {/* <Route path="/mentor/dashboard" element={<MentorDashboard />} />  */}
//                     {/* <Route path="/mentor/post-task" element={<PostTaskPage />} /> */}
//                     {/* Profile is accessible by anyone, but we put it here to reuse the protection element for Mentors */}
//                     {/* <Route path="/profile" element={<MentorProfilePage />} />  */}
//                 {/* </Route> */}

//                 {/* 4. Authenticated Admin Routes (requires 'Admin' role for governance) */}
//                 {/* <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
//                     <Route path="/admin/dashboard" element={<AdminDashboard />} />
//                     <Route path="/admin/users" element={<UserManagementPage />} /> */}
//                     {/* Placeholder routes for other Admin features */}
//                     {/* <Route path="/admin/moderation" element={<div>Task Moderation Component</div>} />
//                     <Route path="/admin/disputes" element={<div>Dispute Resolution Component</div>} />
//                 </Route> */}

//                 {/* 5. Catch-all Route */}
//                 {/* <Route path="*" element={<NotFoundPage />} /> */}
//             </Routes>
//         {/* </AuthProvider> */}
//     </div>
//   );
// }

// export default App;



import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from './pages/homepage.jsx'; 
import LoginPage from './pages/loginpage.jsx';
import SignupPage from './pages/signuppage.jsx';

import StudentDashboard from './pages/StudentDashboard.jsx';

import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />


        <Route path="/dashboard" element={<StudentDashboard />} />
        

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/password/reset/:token" element={<ResetPasswordPage />} />

        {/* Add more routes as you build them */}
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/password/reset/:token" element={<ResetPasswordPage />} /> */}
        
        {/* Protected Routes - Add later */}
        {/* <Route path="/dashboard" element={<StudentDashboard />} /> */}
        {/* <Route path="/tasks" element={<TaskListView />} /> */}
        {/* <Route path="/mentor/dashboard" element={<MentorDashboard />} /> */}
        
        {/* Catch-all Route */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;