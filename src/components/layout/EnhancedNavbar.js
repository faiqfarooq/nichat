"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import NotificationBar from "./NotificationBar";

export default function EnhancedNavbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("contact"); // Set based on current page

  // Handle scroll event to change navbar style when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact-us" },
  ];

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const mobileMenuItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-dark/90 backdrop-blur-md shadow-lg"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 mr-3 relative overflow-hidden">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  className="drop-shadow-glow"
                >
                  <defs>
                    <linearGradient
                      id="logoGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#25D366" />
                      <stop offset="100%" stopColor="#128C7E" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite
                        in="SourceGraphic"
                        in2="blur"
                        operator="over"
                      />
                    </filter>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
                  <path
                    d="M70 30H30C27.2 30 25 32.2 25 35V75L35 65H70C72.8 65 75 62.8 75 60V35C75 32.2 72.8 30 70 30Z"
                    fill="white"
                  />
                  <path
                    d="M60 45H40M60 50H40M60 55H40"
                    stroke="url(#logoGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-primary transition-all duration-500">
                Nichat
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              {menuItems.map((item) => (
                <motion.li key={item.name} variants={menuItemVariants}>
                  <Link
                    href={item.path}
                    className={`relative px-4 py-2 rounded-lg text-white font-medium transition-colors hover:text-primary block`}
                    onClick={() => setActiveMenuItem(item.name.toLowerCase())}
                  >
                    {pathname === item.path.toLowerCase()&& (
                      <motion.span
                        layoutId="activeMenuItem"
                        className="absolute inset-0 bg-dark-lighter rounded-lg -z-10"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    {item.name}
                    {pathname === item.path.toLowerCase() && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" ? (
              <>
                <Link href="/search">
                  <motion.button
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-400 hover:text-white focus:outline-none"
                    aria-label="Search"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </motion.button>
                </Link>
                <NotificationBar />
                <Link href="/profile">
                  <motion.div
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark-lighter transition-colors hover:border-primary/50 group"
                  >
                    <div className="relative">
                      {session.user.avatar ? (
                        <img 
                          src={session.user.avatar}
                          alt={session.user.name}
                          className="w-6 h-6 rounded-full mr-2 group-hover:shadow-glow transition-all duration-300" 
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-dark font-bold text-sm mr-2 group-hover:shadow-glow transition-all duration-300">
                          {session.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-dark-lighter"></span>
                    </div>
                    <span className="group-hover:text-primary transition-colors duration-300">{session.user.name}</span>
                  </motion.div>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <motion.button
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark-lighter transition-colors"
                  >
                    Log In
                  </motion.button>
                </Link>

                <Link href="/register">
                  <motion.button
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-dark font-medium rounded-lg relative overflow-hidden group shadow-lg hover:shadow-primary/30 transition-all duration-300"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-secondary to-primary"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center focus:outline-none"
            >
              <span
                className={`w-6 h-0.5 bg-white rounded-full transform transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-white rounded-full my-1 transition-opacity duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-white rounded-full transform transition-transform duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={mobileMenuVariants}
          className="md:hidden absolute top-full left-0 right-0 bg-dark-lighter shadow-lg mt-1 rounded-b-2xl overflow-hidden"
        >
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-3 mb-6">
              {menuItems.map((item) => (
                <motion.li key={item.name} variants={mobileMenuItemVariants}>
                  <Link
                    href={item.path}
                    className={`block px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                      pathname === item.path.toLowerCase()
                        ? "bg-dark text-primary"
                        : "hover:bg-dark hover:text-primary"
                    }`}
                    onClick={() => {
                      setActiveMenuItem(item.name.toLowerCase());
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="grid grid-cols-3 gap-4">
              {status === "authenticated" ? (
                <>
                  <Link href="/search">
                    <motion.div
                      variants={mobileMenuItemVariants}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <span>Search</span>
                    </motion.div>
                  </Link>
                  
                  <Link href="/notifications">
                    <motion.div
                      variants={mobileMenuItemVariants}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      <span>Notifications</span>
                    </motion.div>
                  </Link>
                  
                  <Link href="/profile">
                    <motion.div
                      variants={mobileMenuItemVariants}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark transition-colors hover:border-primary/50"
                    >
                      <div className="relative">
                        {session.user.avatar ? (
                          <img 
                            src={session.user.avatar}
                            alt={session.user.name}
                            className="w-5 h-5 rounded-full mr-2" 
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-dark font-bold text-xs mr-2">
                            {session.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-dark-lighter"></span>
                      </div>
                      <span>Profile</span>
                    </motion.div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <motion.button
                      variants={mobileMenuItemVariants}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark transition-colors"
                    >
                      Log In
                    </motion.button>
                  </Link>

                  <Link href="/register">
                    <motion.button
                      variants={mobileMenuItemVariants}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-dark font-medium rounded-lg"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
