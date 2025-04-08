'use client';
// src/app/chat/page.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ChatList from '@/components/chat/ChatList';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import useUserData from '@/hooks/useUserData';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const { user: userData } = useUserData();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const router = useRouter();
  
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
    
    // Welcome message timer
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(welcomeTimer);
    };
  }, []);

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
          <p className="text-gray-400 animate-pulse">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-dark-lighter p-8 rounded-xl shadow-xl border border-gray-700 max-w-md text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <motion.svg 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="w-12 h-12 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </motion.svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Welcome, {session?.user?.name}!</h2>
              <p className="text-gray-300 mb-6">
                Your secure chat experience starts now. Connect with friends and make new ones!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWelcome(false)}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-dark font-semibold rounded-lg transition"
              >
                Let's Start
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-lighter border-b border-gray-700 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 relative mr-2 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-dark group-hover:from-primary-dark group-hover:to-primary transition-all duration-300">
              <svg 
                className="absolute inset-0 w-10 h-10 text-white p-2 transform group-hover:scale-110 transition-transform duration-300" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h1 className="text-white font-semibold text-xl group-hover:text-primary transition-colors duration-300">nichat</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/groups/new" className="text-gray-300 hover:text-primary relative rounded-full p-2 hover:bg-dark-light transition-all duration-300">
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </Link>
          
          <Link href="/search" className="text-gray-300 hover:text-primary rounded-full p-2 hover:bg-dark-light transition-all duration-300">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          
          <Link href="/profile" className="flex items-center group">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", damping: 12 }}
                className="border-2 border-transparent group-hover:border-primary transition-all duration-300 cursor-pointer rounded-full"
              >
                <Avatar 
                  src={userData?.avatar || session?.user?.avatar} 
                  name={userData?.name || session?.user?.name || 'User'} 
                  size="md"
                />
              </motion.div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
            </div>
          </Link>
        </div>
      </motion.header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat list */}
        <motion.aside 
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`w-full md:w-80 border-r border-gray-700 bg-dark-lighter flex-shrink-0 ${
            showMobileMenu ? 'block' : 'hidden'
          } md:block`}
        >
          <ChatList />
        </motion.aside>
        
        {/* Main chat area - Empty state */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 flex items-center justify-center p-6 bg-dark"
        >
          <div className="text-center max-w-md">
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                damping: 12,
                delay: 0.6 
              }}
              className="mb-6 relative"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto flex items-center justify-center">
                <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <motion.div 
                className="absolute -top-1 -right-1"
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 1.5
                }}
              >
                <div className="w-8 h-8 bg-dark-lighter rounded-full flex items-center justify-center border-2 border-dark shadow-lg">
                  <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L9 9H2L7 14.5L5 22L12 17.5L19 22L17 14.5L22 9H15L12 1Z" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Start a conversation
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-400 mb-8 leading-relaxed"
            >
              Search for friends, create a group, or start a conversation with someone new.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/search">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-dark font-semibold rounded-lg transition-colors shadow-lg hover:shadow-primary/30 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Find Friends
                </motion.button>
              </Link>
              
              <Link href="/groups/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-dark-light hover:bg-dark-lighter text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  New Group
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex flex-wrap gap-3 justify-center"
            >
              <div className="text-xs bg-dark-lighter text-gray-400 py-1 px-3 rounded-full">
                Recent Conversations
              </div>
              <div className="text-xs bg-dark-lighter text-gray-400 py-1 px-3 rounded-full">
                Quick Replies
              </div>
              <div className="text-xs bg-dark-lighter text-gray-400 py-1 px-3 rounded-full">
                Suggestions
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>
      
      {/* Floating action button (mobile only) */}
      <motion.button
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-dark flex items-center justify-center shadow-lg hover:shadow-primary/30 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10, delay: 1.3 }}
        onClick={() => setShowMobileMenu(true)}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"></path>
        </svg>
      </motion.button>
    </div>
  );
}
