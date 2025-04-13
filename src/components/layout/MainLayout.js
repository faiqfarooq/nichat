"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import NavbarWrapper from "./NavbarWrapper";
import FooterWrapper from "./FooterWrapper";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  
  // Hide sidebar on these pages
  const hideSidebar = 
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/contact-us" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/forgot-password";
  
  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar - conditionally rendered */}
        {!hideSidebar && (
          <div className="w-full md:w-1/4">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className={`w-full ${!hideSidebar ? 'md:w-3/4' : ''} flex flex-col`}>
          {/* Sticky Navbar */}
          <div className="h-16 sticky top-0 z-10 bg-white shadow">
            <NavbarWrapper />
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
    </>
  );
}
