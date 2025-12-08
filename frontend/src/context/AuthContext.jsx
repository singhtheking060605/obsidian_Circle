// frontend/src/context/AuthContext.jsx (FIXED)

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Get base URL from environment (Vite standard)
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// 1. Create a pre-configured axios instance exported for use across the application
export const authenticatedAxios = axios.create({
    // IMPORTANT: Assuming Express server routes are prefixed with '/api/v1'
    baseURL: `${BASE_API_URL}/api/v1`, 
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use the configured client for authenticated check
        const { data } = await authenticatedAxios.get('/users/me'); 
        
        if (data.success) {
          // Assuming data.user contains the necessary info (e.g., id, role)
          setUser({ ...data.user }); 
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await authenticatedAxios.get('/users/logout');
      setUser(null);
      // Optional: use router navigation if available, otherwise window.location
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    // Only export user, loading, and methods via Context
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);