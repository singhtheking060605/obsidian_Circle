import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Loading state with Stranger Things theme
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-600 text-2xl font-creepster animate-pulse glow-text">
          Establishing Connection...
        </div>
      </div>
    );
  }

  // If logged in, show content (Outlet)
  // If not, redirect to login and remember where they were trying to go
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;