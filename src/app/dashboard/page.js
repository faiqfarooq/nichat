'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    
    if (token) {
      setIsAuthenticated(true);
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
    
    setIsLoading(false);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Dashboard</h1>
        <p className="text-xl mb-8">Welcome to your dashboard</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/chat" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Go to Chat
          </Link>
          <Link href="/profile" className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            View Profile
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              window.location.href = "/login";
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
