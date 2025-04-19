'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Simple custom hook for authentication using only localStorage
 */
export default function useCustomAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status from localStorage
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Get user data
          const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          
          // Check if the login is recent (within the last 30 days)
          if (storedUserData.timestamp) {
            const loginTime = new Date(storedUserData.timestamp);
            const now = new Date();
            const daysSinceLogin = (now - loginTime) / (1000 * 60 * 60 * 24);
            
            if (daysSinceLogin < 30) {
              setIsAuthenticated(true);
              setUserData(storedUserData);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // If we get here, user is not authenticated
      setIsAuthenticated(false);
      setUserData(null);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Custom login function
  const login = async (credentials) => {
    try {
      // Create a simple token (in a real app, this would be a JWT from the server)
      const token = btoa(JSON.stringify({
        email: credentials.email,
        timestamp: new Date().toISOString()
      }));
      
      // Store token and user data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify({
        email: credentials.email,
        timestamp: new Date().toISOString()
      }));
      
      // Update state
      setIsAuthenticated(true);
      setUserData({
        email: credentials.email,
        timestamp: new Date().toISOString()
      });
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  // Custom logout function
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Update state
      setIsAuthenticated(false);
      setUserData(null);
      
      // Redirect to login
      router.push('/login');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };
  
  return {
    isAuthenticated,
    isLoading,
    userData,
    login,
    logout
  };
}
