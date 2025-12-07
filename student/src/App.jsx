import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams, Navigate } from 'react-router-dom';

// Import Components and Pages
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Rankings from './pages/Rankings';
import Referrals from './pages/Referrals';
import QASession from './pages/QASession';
import Teams from './pages/Teams';

// --- Helper Components ---

// 1. Catches the backend redirect, saves token, and pushes to Dashboard
const AuthReceiver = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      console.log("Token received, saving to localStorage...");
      localStorage.setItem('adminToken', token);
      // Use replace to prevent back-button loops
      navigate('/dashboard', { replace: true });
    } else {
      console.error("No token found in redirect.");
      // Fallback to login if something breaks
      window.location.href = 'http://localhost:5173/login';
    }
  }, [searchParams, navigate]);

  return <div className="min-h-screen flex items-center justify-center bg-gray-50">Authenticating...</div>;
};

// 2. Protects routes: If no token, kick to external login
const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    window.location.href = 'http://localhost:5173/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// 3. Handles the root "/" path safely
const RootRedirect = () => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  // Force hard redirect to external login if not authenticated
  useEffect(() => {
    window.location.href = 'http://localhost:5173/login';
  }, []);
  
  return null;
}

// --- Main App ---

function App() {
  return (
    <Router>
      <Routes>
        {/* Entry Point */}
        <Route path="/" element={<RootRedirect />} />

        {/* Auth Handshake - Must be Public */}
        <Route path="/auth-receiver" element={<AuthReceiver />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/tasks" element={<ProtectedLayout><Tasks /></ProtectedLayout>} />
        <Route path="/rankings" element={<ProtectedLayout><Rankings /></ProtectedLayout>} />
        <Route path="/referrals" element={<ProtectedLayout><Referrals /></ProtectedLayout>} />
        <Route path="/qa-session" element={<ProtectedLayout><QASession /></ProtectedLayout>} />
        <Route path="/teams" element={<ProtectedLayout><Teams /></ProtectedLayout>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;