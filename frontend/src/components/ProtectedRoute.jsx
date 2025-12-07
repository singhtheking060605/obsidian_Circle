import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-600 text-2xl font-creepster animate-pulse glow-text">
          Establishing Connection...
        </div>
      </div>
    );
  }

  // 1. Not logged in -> Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but role not allowed -> Student Dashboard (or specialized 403 page)
  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorized
  return <Outlet />;
};

export default ProtectedRoute;