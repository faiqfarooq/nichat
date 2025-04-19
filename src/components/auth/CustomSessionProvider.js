'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Custom AuthProvider that handles authentication state and redirection
 */
export default function AuthProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Handle redirection based on authentication state
  useEffect(() => {
    // If we're on a protected route and not authenticated according to localStorage,
    // redirect to login
    const isProtectedRoute = 
      pathname?.startsWith('/chat') ||
      pathname?.startsWith('/profile') ||
      pathname?.startsWith('/group') ||
      pathname?.startsWith('/search') ||
      pathname?.startsWith('/dashboard') ||
      pathname?.startsWith('/notifications') ||
      pathname?.startsWith('/settings');
      
    const isLoginRoute = pathname?.startsWith('/login');
    
    // Check localStorage for authentication token
    const hasToken = !!localStorage.getItem('authToken');
    
    if (isProtectedRoute && !hasToken) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else if (isLoginRoute && hasToken) {
      // Redirect to dashboard if already authenticated
      router.push('/dashboard');
    }
    
    // Clean up any callback parameters from the URL
    if (window.location.search.includes('callbackUrl')) {
      // Remove the callbackUrl parameter by replacing the URL without reloading the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [pathname, router]);
  
  return children;
}
