'use client';

import AuthCheck from '@/components/auth/AuthCheck';
import Sidebar from '@/components/layout/Sidebar';
import NavbarWrapper from '@/components/layout/NavbarWrapper';
import { useState, useEffect } from 'react';

export default function ChatLayout({ children }) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle mobile menu toggle
  const handleMobileMenuToggle = (isOpen) => {
    setShowMobileSidebar(isOpen);
  };

  return (
    <AuthCheck>
      <div className="flex h-screen">
        {/* Sidebar - conditionally rendered */}
        {mounted && (
          <div className="hidden md:block w-full md:w-1/4">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className={`w-full ${mounted ? "md:w-3/4 " : ""} flex flex-col`}>
          {/* Sticky Navbar */}
          <div className="h-16 sticky top-0 z-10 bg-dark shadow">
            <NavbarWrapper onToggleMobileMenu={handleMobileMenuToggle} />
          </div>

          {/* Scrollable Content */}
          <div
            className="overflow-auto"
            style={{ height: "calc(100vh - 68px)" }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mounted && (
        <div className={`md:hidden fixed inset-0 z-50 ${showMobileSidebar ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)}></div>
          <div className="absolute left-0 top-0 h-full w-3/4 max-w-xs bg-dark-lighter shadow-lg transform transition-transform duration-300">
            <Sidebar />
          </div>
        </div>
      )}
    </AuthCheck>
  );
}
