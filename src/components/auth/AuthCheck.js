'use client';

import { useRouter } from 'next/navigation';
import useCustomAuth from '@/hooks/useCustomAuth';

/**
 * A simple client-side authentication check component
 * This component will check if the user is authenticated using our custom hook
 * If not authenticated, it will redirect to the login page
 */
export default function AuthCheck({ children }) {
  const { isAuthenticated, isLoading } = useCustomAuth();
  
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
