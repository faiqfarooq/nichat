"use client";

import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the session
const SessionContext = createContext(null);

export function CustomSessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated using localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (authToken) {
      try {
        // Parse user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Create a session object similar to NextAuth
        setSession({
          user: {
            id: userData.id || 'unknown',
            name: userData.name || 'User',
            email: userData.email || '',
            image: userData.avatar || '',
            ...userData
          },
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setSession(null);
      }
    } else {
      setSession(null);
    }
    
    setLoading(false);
  }, []);

  // Function to update session (for login/logout)
  const updateSession = (newSession) => {
    setSession(newSession);
    
    if (newSession) {
      // Store auth token and user data in localStorage
      localStorage.setItem('authToken', newSession.authToken || 'token');
      localStorage.setItem('userData', JSON.stringify(newSession.user || {}));
    } else {
      // Clear localStorage on logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  };

  return (
    <SessionContext.Provider value={{ data: session, status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated', update: updateSession }}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to use the session
export function useSession() {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a CustomSessionProvider');
  }
  
  return context;
}

// Export the context for direct access if needed
export { SessionContext };
