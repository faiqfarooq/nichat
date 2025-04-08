"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function EnhancedNavbar() {
  const pathname = usePathname();
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
            <motion.button
              variants={menuItemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark-lighter transition-colors"
            >
              Log In
            </motion.button>

            <motion.button
              variants={menuItemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-dark font-medium rounded-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Up</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-secondary to-primary"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
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

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                variants={mobileMenuItemVariants}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-dark transition-colors"
              >
                Log In
              </motion.button>

              <motion.button
                variants={mobileMenuItemVariants}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-dark font-medium rounded-lg"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
