'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Custom SessionProvider that wraps NextAuth's SessionProvider
 * This component adds additional functionality to handle redirection issues
 */
export default function CustomSessionProvider({ children, session }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Handle redirection issues by checking localStorage on mount
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
    
    // Check localStorage for authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isProtectedRoute && !isLoggedIn) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else if (isLoginRoute && isLoggedIn) {
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
  
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
