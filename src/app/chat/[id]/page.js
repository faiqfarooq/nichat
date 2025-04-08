'use client';
// src/app/chat/[id]/page.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import Link from 'next/link';

export default function ChatDetailPage({ params }) {
  const { data: session, status } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const chatId = params.id;
  
  const router = useRouter();
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Show loading state
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-dark-lighter border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 text-gray-400 hover:text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="flex items-center">
            <img
              src="/assets/images/logo.png"
              alt="Chat App"
              className="w-8 h-8 object-contain mr-2"
            />
            <h1 className="text-white font-semibold text-xl">Chat App</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/groups" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c.37-.06.74-.1 1.13-.1.99 0 1.93.21 2.78.58.73.33 1.21 1.05 1.21 1.85V18h-4.5v-1.61c0-.83-.23-1.61-.63-2.29zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
            </svg>
          </Link>
          
          <Link href="/settings" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </Link>
          
          <Link href="/profile" className="flex items-center">
            <img
              src={session?.user?.avatar || '/assets/images/default-avatar.png'}
              alt={session?.user?.name || 'Profile'}
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat list */}
        <aside 
          className={`w-full md:w-80 border-r border-gray-700 bg-dark-lighter flex-shrink-0 ${
            showMobileMenu ? 'block' : 'hidden'
          } md:block`}
        >
          <ChatList />
        </aside>
        
        {/* Main chat area */}
        <main className="flex-1 bg-dark">
          <ChatWindow chatId={chatId} />
        </main>
      </div>
    </div>
  );
}
