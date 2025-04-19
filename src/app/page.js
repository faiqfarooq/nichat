'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to nichat</h1>
        <p className="text-xl mb-8">A modern messaging application</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Login
          </Link>
          <Link href="/register" className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Register
          </Link>
        </div>
        
        {isClient && (
          <div className="mt-12 text-gray-400">
            <p>Ready to connect with friends and colleagues</p>
          </div>
        )}
      </div>
    </main>
  );
}
