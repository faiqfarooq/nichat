"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import NavbarWrapper from "./NavbarWrapper";
import FooterWrapper from "./FooterWrapper";
import UsernameSetupModal from "@/components/auth/UsernameSetupModal";

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="bg-dark-lighter p-6 rounded-lg shadow-lg max-w-lg w-full border border-red-500/30">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Something went wrong</h2>
        </div>
        <div className="bg-dark p-3 rounded mb-4 overflow-auto max-h-40">
          <p className="text-red-400 font-mono text-sm">{error.message}</p>
        </div>
        <p className="text-gray-400 mb-4">
          We apologize for the inconvenience. You can try refreshing the page or
          contact support if the problem persists.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Set mounted to true after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle mobile menu toggle
  const handleMobileMenuToggle = (isOpen) => {
    setShowMobileSidebar(isOpen);
  };

  // Hide sidebar on these pages
  const hideSidebar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/contact-us" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/verify-email-otp" ||
    pathname === "/forgot-password";

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex h-screen">
        {/* Sidebar - conditionally rendered */}
        {mounted && !hideSidebar && (
          <div className="hidden md:block w-full md:w-1/4">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`w-full ${
            mounted && !hideSidebar ? "md:w-3/4 " : ""
          } flex flex-col`}
        >
          {/* Sticky Navbar - fixed the background color */}
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

      <FooterWrapper />

      {/* Mobile Sidebar */}
      {mounted && !hideSidebar && (
        <MobileSidebar
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Username Setup Modal */}
      {/* <UsernameSetupModal /> */}
    </ErrorBoundary>
  );
}
