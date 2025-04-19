'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * A simple client-side authentication check component
 * This component will check if the user is authenticated using localStorage
 * If not authenticated, it will redirect to the login page
 */
export default function AuthCheck({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    
    if (token) {
      setIsAuthenticated(true);
    } else {
      // Redirect to login page
      router.push('/login');
    }
    
    setIsLoading(false);
  }, [router]);
  
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
