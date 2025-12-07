import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Get token from storage
        const token = localStorage.getItem('token');
        
        // 2. Attach token to the request
        // This is the critical fix for the redirect loop
        const { data } = await axios.get('http://localhost:4000/api/auth/me', {
            withCredentials: true,
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error.message);
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
      await axios.get('http://localhost:4000/api/auth/logout', { withCredentials: true });
      localStorage.removeItem('token'); // Clear token on logout
      setUser(null);
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);