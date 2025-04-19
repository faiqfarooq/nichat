'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * A simple client-side authentication check component
 * This component will check if the user is authenticated using both NextAuth session and localStorage
 * If not authenticated, it will redirect to the login page
 */
export default function AuthCheck({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // First check NextAuth session
      if (status === 'authenticated' && session) {
        setIsAuthenticated(true);
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
      
      // Redirect to login
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      }
    };
    
    checkAuth();
  }, [session, status, router]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If authenticated, render children
  return isAuthenticated ? children : null;
}
