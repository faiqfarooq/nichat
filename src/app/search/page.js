'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import { getApiUrl } from '@/lib/apiUtils';

export default function SearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Simulate loading time and then set loaded state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle search
  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(getApiUrl(`/api/users/search?query=${encodeURIComponent(searchQuery)}`));
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  // Start a chat with a user
  const startChat = async (userId) => {
    try {
      const response = await fetch(getApiUrl('/api/chats'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat');
      }
      
      const chat = await response.json();
      
      // Navigate to the chat
      router.push(`/chat/${chat._id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to start chat');
    }
  };

  // Show loading state
  if (status === 'loading' || !isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-secondary border-b-transparent animate-spin animation-delay-500"></div>
            <svg 
              className="absolute inset-0 w-20 h-20 text-primary-light opacity-80"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path 
                d="M70 30H30C27.2 30 25 32.2 25 35V75L35 65H70C72.8 65 75 62.8 75 60V35C75 32.2 72.8 30 70 30Z" 
                stroke="currentColor" 
                strokeWidth="2" 
              />
            </svg>
          </div>
          <p className="text-gray-400 animate-pulse">Loading search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-dark">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-lighter border-b border-gray-700 px-4 py-3 flex items-center"
      >
        <Link href="/chat" className="text-gray-400 hover:text-white mr-4">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        
        <h1 className="text-xl font-semibold text-white">Find Friends</h1>
      </motion.header>
      
      {/* Search bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4 bg-dark-lighter"
      >
        <SearchBar onSearch={handleSearch} />
      </motion.div>
      
      {/* Search results */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex-1 overflow-y-auto p-4"
      >
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4 text-red-200 text-sm">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : results.length > 0 ? (
          <SearchResults results={results} onStartChat={startChat} currentUserId={session?.user?.id} />
        ) : query ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-lighter rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <p className="text-gray-400">No users found matching "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-lighter rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <p className="text-gray-400">Search for users by name or email</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
