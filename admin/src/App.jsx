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

// --- Auth Receiver ---
const AuthReceiver = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('adminToken', token);
      navigate('/dashboard', { replace: true });
    } else {
      // Fallback: Redirect to STUDENT APP on 5174
      window.location.href = 'http://localhost:5174/login';
    }
  }, [searchParams, navigate]);

  return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;
};

// --- Protected Layout ---
const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // If not logged in, go to STUDENT APP on 5174
    window.location.href = 'http://localhost:5174/login';
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

// --- Root Redirect ---
const RootRedirect = () => {
  const token = localStorage.getItem('adminToken');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Force external redirect to STUDENT APP on 5174
  useEffect(() => {
    window.location.href = 'http://localhost:5174/login';
  }, []);

  return null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth-receiver" element={<AuthReceiver />} />
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/tasks" element={<ProtectedLayout><Tasks /></ProtectedLayout>} />
        <Route path="/rankings" element={<ProtectedLayout><Rankings /></ProtectedLayout>} />
        <Route path="/referrals" element={<ProtectedLayout><Referrals /></ProtectedLayout>} />
        <Route path="/qa-session" element={<ProtectedLayout><QASession /></ProtectedLayout>} />
        <Route path="/teams" element={<ProtectedLayout><Teams /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;