"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import EnhancedNavbar from "@/components/layout/EnhancedNavbar";
import FooterMain from "@/components/layout/FooterMain";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-feature-in");
        }
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll(".feature-card");
      features.forEach((feature) => observer.observe(feature));
    }

    return () => {
      if (featuresRef.current) {
        const features = featuresRef.current.querySelectorAll(".feature-card");
        features.forEach((feature) => observer.unobserve(feature));
      }
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-dark">
      <EnhancedNavbar />
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Interactive animated background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${
                mousePosition.y * 0.02
              }px)`,
            }}
          ></div>
          <div
            className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"
            style={{
              transform: `translate(${-mousePosition.x * 0.01}px, ${
                mousePosition.y * 0.01
              }px)`,
            }}
          ></div>
          <div
            className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-dark/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"
            style={{
              transform: `translate(${mousePosition.x * 0.015}px, ${
                -mousePosition.y * 0.015
              }px)`,
            }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto px-4 z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              type: "spring",
              stiffness: 200,
            }}
            className="mb-8"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 },
            }}
          >
            <div className="w-28 h-28 flex items-center justify-center">
              <svg
                width="100"
                height="100"
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
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent"
          >
            Welcome to Nichat
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed"
          >
            Connect with new friends, create groups, and share moments in a fun
            and secure environment. Experience the next generation of messaging.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/login"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-dark font-bold rounded-lg transition-all duration-300 text-center min-w-[150px] transform hover:scale-105 hover:shadow-glow"
            >
              Get Started
            </Link>

            <Link
              href="/register"
              className="px-8 py-3 bg-transparent hover:bg-gray-800 text-white border border-gray-600 font-bold rounded-lg transition-all duration-300 text-center min-w-[150px] transform hover:scale-105"
            >
              Create Account
            </Link>
          </motion.div>
        </motion.div>

        {/* Interactive scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          whileHover={{
            y: [0, -5, 0],
            transition: { repeat: Infinity, duration: 1 },
          }}
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-scroll-down"></div>
          </div>
          <p className="text-xs text-white mt-2 opacity-75">Discover More</p>
        </motion.div>
      </section>

      {/* Complete Features Section with 6 Interactive Cards - All Visible */}
      <section ref={featuresRef} className="py-20 px-4 bg-dark-lighter">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Experience Nichat's Amazing Features
          </h2>

          <p className="text-center text-gray-300 mb-16 max-w-3xl mx-auto text-lg">
            We've designed Nichat to be the most engaging way to connect with
            friends, old and new. Discover all the powerful features we offer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Card 1 - Personalized Profiles */}
            <motion.div
              className="feature-card bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 group"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(37, 211, 102, 0.2)",
              }}
            >
              <div className="bg-gradient-to-br from-primary to-secondary w-16 h-16 rounded-lg mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300">
                Create Your Identity
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Customize your profile with photos, statuses, and personal
                information. Express yourself the way you want to be seen.
              </p>
              <div className="h-1.5 w-0 bg-primary mt-6 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </motion.div>

            {/* Card 2 - Real-time Messaging */}
            <motion.div
              className="feature-card bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 group"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(37, 211, 102, 0.2)",
              }}
            >
              <div className="bg-gradient-to-br from-secondary to-primary-dark w-16 h-16 rounded-lg mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-secondary transition-colors duration-300">
                Real-time Messaging
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Send messages that arrive instantly. Share photos, videos, GIFs,
                and emojis to express yourself fully in conversations.
              </p>
              <div className="h-1.5 w-0 bg-secondary mt-6 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </motion.div>

            {/* Card 3 - Group Conversations */}
            <motion.div
              className="feature-card bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 group"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(37, 211, 102, 0.2)",
              }}
            >
              <div className="bg-gradient-to-br from-primary-dark to-secondary w-16 h-16 rounded-lg mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c.37-.06.74-.1 1.13-.1.99 0 1.93.21 2.78.58.73.33 1.21 1.05 1.21 1.85V18h-4.5v-1.61c0-.83-.23-1.61-.63-2.29zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary-dark transition-colors duration-300">
                Engaging Group Chats
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Create group conversations with friends, family, or teams. Share
                experiences and stay connected with multiple people at once.
              </p>
              <div className="h-1.5 w-0 bg-primary-dark mt-6 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </motion.div>

            {/* Card 4 - Privacy & Security */}
            <motion.div
              className="feature-card bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 group"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(18, 140, 126, 0.2)",
              }}
            >
              <div className="bg-gradient-to-br from-secondary to-primary w-16 h-16 rounded-lg mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-secondary transition-colors duration-300">
                Privacy & Security
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Control your privacy with advanced settings. Choose who can see
                your information and decide who can contact you on Nichat.
              </p>
              <div className="h-1.5 w-0 bg-secondary mt-6 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </motion.div>

            {/* Card 5 - Rich Media Sharing */}
            <motion.div
              className="feature-card bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 group"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(37, 211, 102, 0.2)",
              }}
            >
              <div className="bg-gradient-to-br from-primary to-primary-dark w-16 h-16 rounded-lg mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300">
                Rich Media Sharing
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Share photos and videos in high quality. Create memorable
                moments with friends through media that looks great on any
                device.
              </p>
              <div className="h-1.5 w-0 bg-primary mt-6 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </motion.div>

            {/* Card 6 - Voice & Video Calls */}
            <motion.div
              className="feature-card bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 group"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(18, 140, 126, 0.2)",
              }}
            >
              <div className="bg-gradient-to-br from-secondary-dark to-secondary w-16 h-16 rounded-lg mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-secondary-dark transition-colors duration-300">
                Voice & Video Calls
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Connect face-to-face with crystal clear video calls or
                high-quality voice conversations. Stay in touch no matter the
                distance.
              </p>
              <div className="h-1.5 w-0 bg-secondary-dark mt-6 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive App Preview Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-slow"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-slow animation-delay-2000"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative mx-auto w-full max-w-md"
              >
                {/* Phone frame with interactive elements */}
                <div className="relative z-10 bg-dark-lighter rounded-3xl p-3 shadow-2xl border border-gray-700 transform transition duration-500 hover:scale-105">
                  <div className="relative">
                    <Image
                      src="https://i.imgur.com/JR0zM5W.png"
                      alt="Nichat App Preview"
                      width={600}
                      height={1200}
                      className="rounded-2xl w-full h-auto object-cover"
                    />

                    {/* Interactive notification bubbles */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 1],
                      }}
                      transition={{
                        delay: 1.5,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 5,
                      }}
                      className="absolute top-20 right-4 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-dark font-bold text-xs"
                    >
                      2
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 1],
                      }}
                      transition={{
                        delay: 2.5,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 6,
                      }}
                      className="absolute top-36 right-8 bg-secondary rounded-full px-3 py-1 text-dark text-xs font-medium shadow-lg"
                    >
                      New message!
                    </motion.div>

                    {/* Typing animation */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        delay: 3,
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                      className="absolute bottom-20 left-8 bg-gray-700/80 rounded-full px-4 py-2 text-white text-xs"
                    >
                      <div className="flex space-x-1">
                        <span>Sarah is typing</span>
                        <span className="flex space-x-1">
                          <span className="animate-bounce delay-100">.</span>
                          <span className="animate-bounce delay-200">.</span>
                          <span className="animate-bounce delay-300">.</span>
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Decorative gradient blobs */}
                <div className="absolute -left-5 -bottom-5 w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-full opacity-50 blur-2xl z-0 animate-pulse"></div>
                <div className="absolute -right-5 top-1/4 w-24 h-24 bg-gradient-to-br from-secondary to-primary-dark rounded-full opacity-40 blur-xl z-0 animate-pulse animation-delay-2000"></div>
              </motion.div>
            </div>

            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6 text-white">
                  Nichat:{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Connecting People
                  </span>
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Nichat is designed to bring people together through a
                  beautiful and intuitive interface. With powerful features and
                  smooth performance, you'll experience communication like never
                  before.
                </p>

                <div className="space-y-6 mb-8">
                  <motion.div
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                      <svg
                        className="w-5 h-5 text-primary"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Beautiful Design
                      </h3>
                      <p className="text-gray-400">
                        Stunning interface that makes messaging exciting and
                        enjoyable
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-secondary/20 p-2 rounded-full mr-4 mt-1">
                      <svg
                        className="w-5 h-5 text-secondary"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Ultra-Fast Experience
                      </h3>
                      <p className="text-gray-400">
                        Messages delivered instantly with real-time
                        notifications
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-primary-dark/20 p-2 rounded-full mr-4 mt-1">
                      <svg
                        className="w-5 h-5 text-primary-dark"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Cross-Platform
                      </h3>
                      <p className="text-gray-400">
                        Seamlessly switch between mobile, tablet, and desktop
                        devices
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-10 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">User Satisfaction</span>
                    <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "95%" }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      ></motion.div>
                    </div>
                    <span className="text-white font-medium">95%</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Reliability</span>
                    <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "99%" }}
                        transition={{ duration: 1, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      ></motion.div>
                    </div>
                    <span className="text-white font-medium">99%</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Performance</span>
                    <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "97%" }}
                        transition={{ duration: 1, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      ></motion.div>
                    </div>
                    <span className="text-white font-medium">97%</span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="inline-flex items-center bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-lg font-bold text-dark mt-10 transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
                >
                  Start Messaging Now
                  <svg
                    className="w-5 h-5 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Interactive Carousel - Complete Version */}
      <section className="py-20 px-4 bg-dark-lighter relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-0 w-full h-80 bg-gradient-to-b from-dark to-transparent"></div>
          <div className="absolute -bottom-40 left-0 w-full h-80 bg-gradient-to-t from-dark to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              What Our Users Say
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of happy users who have already discovered the
              Nichat experience.
            </p>
          </motion.div>

          <div className="relative">
            {/* Testimonial Carousel */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  x: [
                    0, -100, -200, -300, -400, -500, -600, -700, -800, -900,
                    -1000, -1100, -1200, -1300, -1400, 0,
                  ],
                  transition: {
                    x: {
                      duration: 30,
                      ease: "linear",
                      repeat: Infinity,
                      repeatType: "loop",
                    },
                  },
                }}
                className="flex"
              >
                {/* Testimonial 1 */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="min-w-[350px] md:min-w-[400px] mx-4 bg-dark p-8 rounded-xl shadow-lg border border-gray-800"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                      S
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">Sarah Johnson</h3>
                      <p className="text-gray-400 text-sm">
                        Marketing Specialist
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    "Nichat has completely transformed how I stay in touch with
                    my friends. The interface is beautiful and the group
                    features are perfect for planning our weekend trips!"
                  </p>
                  <div className="flex text-yellow-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </motion.div>

                {/* Testimonial 2 */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="min-w-[350px] md:min-w-[400px] mx-4 bg-dark p-8 rounded-xl shadow-lg border border-gray-800"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center text-white font-bold text-xl">
                      M
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">Michael Chen</h3>
                      <p className="text-gray-400 text-sm">
                        Software Developer
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    "As a developer, I'm impressed by how smooth and responsive
                    Nichat is. The voice messages feature is excellent, and I
                    use it daily to communicate with my remote team."
                  </p>
                  <div className="flex text-yellow-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </motion.div>

                {/* Testimonial 3 */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="min-w-[350px] md:min-w-[400px] mx-4 bg-dark p-8 rounded-xl shadow-lg border border-gray-800"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-dark to-secondary flex items-center justify-center text-white font-bold text-xl">
                      J
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">
                        Jessica Williams
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Photography Teacher
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    "The image sharing on Nichat is incredible! The quality is
                    preserved, and my photography students can share their work
                    in our group with perfect clarity. Life-changing!"
                  </p>
                  <div className="flex text-yellow-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </motion.div>

                {/* Testimonial 4 */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="min-w-[350px] md:min-w-[400px] mx-4 bg-dark p-8 rounded-xl shadow-lg border border-gray-800"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-primary-dark flex items-center justify-center text-white font-bold text-xl">
                      R
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">Robert Garcia</h3>
                      <p className="text-gray-400 text-sm">
                        Small Business Owner
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    "Nichat has revolutionized my team's communication. The
                    group features help us coordinate projects, and the file
                    sharing is secure and reliable. Highly recommend!"
                  </p>
                  <div className="flex text-yellow-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </motion.div>

                {/* Testimonial 5 */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="min-w-[350px] md:min-w-[400px] mx-4 bg-dark p-8 rounded-xl shadow-lg border border-gray-800"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary-dark flex items-center justify-center text-white font-bold text-xl">
                      A
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">Aisha Patel</h3>
                      <p className="text-gray-400 text-sm">Student</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    "Nichat is perfect for my study groups! We can share notes,
                    organize video study sessions, and the interface is so
                    intuitive. The dark mode is easier on my eyes during
                    late-night study sessions."
                  </p>
                  <div className="flex text-yellow-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </motion.div>

                {/* Add duplicate testimonials to create infinite loop effect */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="min-w-[350px] md:min-w-[400px] mx-4 bg-dark p-8 rounded-xl shadow-lg border border-gray-800"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                      S
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">Sarah Johnson</h3>
                      <p className="text-gray-400 text-sm">
                        Marketing Specialist
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    "Nichat has completely transformed how I stay in touch with
                    my friends. The interface is beautiful and the group
                    features are perfect for planning our weekend trips!"
                  </p>
                  <div className="flex text-yellow-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="min-w-[350px] md:min-w-[400px] mx-4 bg-dark p-8 rounded-xl shadow-lg border border-gray-800"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center text-white font-bold text-xl">
                      M
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">Michael Chen</h3>
                      <p className="text-gray-400 text-sm">
                        Software Developer
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    "As a developer, I'm impressed by how smooth and responsive
                    Nichat is. The voice messages feature is excellent, and I
                    use it daily to communicate with my remote team."
                  </p>
                  <div className="flex text-yellow-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Gradient Overlays for Infinite Scroll Effect */}
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-dark-lighter to-transparent z-10"></div>
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-dark-lighter to-transparent z-10"></div>
          </div>

          {/* User Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-dark p-8 rounded-xl text-center"
            >
              <h3 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                1M+
              </h3>
              <p className="text-gray-300">Active Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-dark p-8 rounded-xl text-center"
            >
              <h3 className="text-5xl font-bold bg-gradient-to-r from-secondary to-primary-dark bg-clip-text text-transparent mb-2">
                4.9
              </h3>
              <p className="text-gray-300">Average Rating</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-dark p-8 rounded-xl text-center"
            >
              <h3 className="text-5xl font-bold bg-gradient-to-r from-primary-dark to-secondary bg-clip-text text-transparent mb-2">
                150+
              </h3>
              <p className="text-gray-300">Countries</p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Complete Call to Action with Interactive Elements */}
      <section className="py-20 px-4 bg-dark-lighter relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 z-0"></div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-0">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
          {Array.from({ length: 15 }).map((_, index) => (
            <motion.div
              key={index + 20}
              className="absolute w-2 h-2 rounded-full bg-secondary/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Join{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nichat
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join millions of users already enjoying our modern messaging
            platform. It's free, secure, and designed for the way we communicate
            today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-dark font-bold rounded-lg transition-all duration-300 text-center transform hover:shadow-glow flex items-center justify-center"
              >
                <span>Create Free Account</span>
                <svg
                  className="w-5 h-5 ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="px-8 py-4 bg-dark hover:bg-dark-light text-white border border-gray-700 font-bold rounded-lg transition-all duration-300 text-center"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* App badges */}
          <div className="mt-12">
            <p className="text-gray-400 mb-4">Available on all platforms</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-dark rounded-xl overflow-hidden cursor-pointer border border-gray-800"
              >
                <div className="flex items-center px-4 py-2">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.74 3.51 7.1 8.9 6.84c1.34.05 2.27.89 3.05.89.8 0 2.31-1.11 3.89-.92 1.41.2 2.48.85 3.18 2.16-2.96 1.71-2.26 5.36.03 6.46-.62 1.72-1.48 3.43-2 4.85zM12.03 6.15c-.16-2.27 1.87-4.35 4.05-4.4.12 2.89-2.79 4.75-4.05 4.4z" />
                  </svg>
                  <div className="ml-2">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-medium text-white">
                      App Store
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-dark rounded-xl overflow-hidden cursor-pointer border border-gray-800"
              >
                <div className="flex items-center px-4 py-2">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.9 5c.1.7.1 1.3.2 1.9.1 1.1.2 1.8.2 2.1s-.1.8-.3 1.4c-.2.5-.5 1-.8 1.3-.4.4-.9.7-1.4.9-.6.2-1.2.3-1.7.4-.2 0-.7 0-1.2-.1-.5-.1-.8-.2-1.1-.3-.2-.1-.6-.4-1-.8s-.7-.8-.8-1.1c-.2-.3-.2-.7-.3-1.2s-.1-1-.1-1.2c0-.5.1-1.1.3-1.7.2-.6.5-1.1.8-1.4.4-.4.9-.7 1.4-.9.6-.2 1.2-.3 1.7-.4.2 0 .7 0 1.2.1s.8.2 1.1.3c.3.1.6.4 1 .8.4.4.7.8.8 1.1zM6.9 9c-.1-.7-.2-1.3-.3-1.9-.3-1.8-.4-2.8-.4-3.1v-.8c0-.3.1-.5.2-.7.1-.2.3-.3.5-.3.1 0 .5 0 1 .1.3 0 .5.1.6.1.1 0 .3.1.4.2.2.1.3.2.3.3.1.1.1.2.2.4.1.1.1.3.1.5s0 .3.1.4v.8c0 .2 0 .4-.1.6-.1.3-.1.5-.2.5-.1.1-.2.1-.4.2-.2.1-.5.2-.7.2H7.3c-.1-.1-.2-.1-.4-.3zm4.1 13.5c0 .2-.1.4-.2.5-.2.2-.4.2-.6.3-.2 0-.6-.1-1-.4-.5-.2-.7-.4-.9-.5-.5-.5-.9-1.1-1.3-1.9l-.7-1.4-.8-1.4c-.5-1-1-1.7-1.3-2.1-.3-.5-.6-.7-.9-.8-.5-.2-.9-.1-1.3.1-.3.2-.5.4-.5.5-.1.3-.1.5-.2.6 0 .1-.1.1-.3.1s-.4 0-.5-.1c-.3-.1-.5-.4-.7-.7-.2-.5-.3-.9-.3-1.2 0-.4.1-.8.3-1.2.1-.2.3-.5.6-.8.5-.4.9-.7 1.3-.7.6-.1 1.3 0 2.1.3 1.8.7 3.6 2.1 5.2 4 .4.5.7.9.9 1.4.2.5.4 1 .5 1.5.3.9.5 1.8.5 2.7v.2c.1.4.1.7.1 1.2z" />
                  </svg>
                  <div className="ml-2">
                    <div className="text-xs text-gray-400">GET IT ON</div>
                    <div className="text-sm font-medium text-white">
                      Google Play
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-dark rounded-xl overflow-hidden cursor-pointer border border-gray-800"
              >
                <div className="flex items-center px-4 py-2">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                  </svg>
                  <div className="ml-2">
                    <div className="text-xs text-gray-400">Download for</div>
                    <div className="text-sm font-medium text-white">
                      Windows & Mac
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <FooterMain />
    </main>
  );
}
