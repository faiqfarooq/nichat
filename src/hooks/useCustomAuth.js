'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for authentication that combines NextAuth session with localStorage
 * This provides more reliable authentication state management
 */
export default function useCustomAuth() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // First check NextAuth session
      if (status === 'authenticated' && session) {
        setIsAuthenticated(true);
        
        // Also store in localStorage for better persistence
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          email: session.user.email,
          timestamp: new Date().toISOString()
        }));
        
        setIsLoading(false);
        return;
      }
      
      // Then check localStorage as fallback
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        // Check if the login is recent (within the last 7 days)
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.timestamp) {
          const loginTime = new Date(userData.timestamp);
          const now = new Date();
          const daysSinceLogin = (now - loginTime) / (1000 * 60 * 60 * 24);
          
          if (daysSinceLogin < 7) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
      }
      
      // If we get here, user is not authenticated
      setIsAuthenticated(false);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [session, status]);
  
  // Custom login function
  const login = async (credentials) => {
    try {
      // Store in localStorage immediately
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({
        email: credentials.email,
        timestamp: new Date().toISOString()
      }));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  // Custom logout function
  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      
      // Sign out from NextAuth
      await signOut({ redirect: false });
      
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
    login,
    logout,
    session,
    status
  };
}
