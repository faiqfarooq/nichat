'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-feature-in');
        }
      },
      { threshold: 0.2 }
    );
    
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-card');
      features.forEach(feature => observer.observe(feature));
    }
    
    return () => {
      if (featuresRef.current) {
        const features = featuresRef.current.querySelectorAll('.feature-card');
        features.forEach(feature => observer.unobserve(feature));
      }
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-dark/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
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
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="w-28 h-28 flex items-center justify-center">
              <svg 
                width="100" 
                height="100" 
                viewBox="0 0 100 100" 
                className="drop-shadow-glow"
              >
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
            Connect Instantly
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed"
          >
            Experience seamless communication with our modern messaging platform. 
            Connect with friends, create groups, and share moments securely.
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
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-scroll-down"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 bg-dark-lighter">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Experience the Power of Real-Time Communication
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="feature-card opacity-0 bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500">
              <div className="bg-gradient-to-br from-primary to-secondary w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Personalized Profiles</h3>
              <p className="text-gray-400 leading-relaxed">
                Create your custom profile, set your status, and manage privacy settings to control who can see your information.
              </p>
            </div>
            
            <div className="feature-card opacity-0 bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 delay-100">
              <div className="bg-gradient-to-br from-secondary to-primary-dark w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Instant Messaging</h3>
              <p className="text-gray-400 leading-relaxed">
                Send and receive text, images, audio, and files in real-time with lightning-fast delivery and read receipts.
              </p>
            </div>
            
            <div className="feature-card opacity-0 bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 delay-200">
              <div className="bg-gradient-to-br from-primary-dark to-secondary w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c.37-.06.74-.1 1.13-.1.99 0 1.93.21 2.78.58.73.33 1.21 1.05 1.21 1.85V18h-4.5v-1.61c0-.83-.23-1.61-.63-2.29zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Group Conversations</h3>
              <p className="text-gray-400 leading-relaxed">
                Create and manage group chats with multiple participants, perfect for teams, friends, and family.
              </p>
            </div>
            
            <div className="feature-card opacity-0 bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 delay-300">
              <div className="bg-gradient-to-br from-secondary to-primary w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Privacy Controls</h3>
              <p className="text-gray-400 leading-relaxed">
                Take control of your privacy with customizable settings, allowing you to choose who can search for and message you.
              </p>
            </div>
            
            <div className="feature-card opacity-0 bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 delay-400">
              <div className="bg-gradient-to-br from-primary to-primary-dark w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Rich Media Sharing</h3>
              <p className="text-gray-400 leading-relaxed">
                Share photos, videos, documents, and voice messages easily with friends and groups in high quality.
              </p>
            </div>
            
            <div className="feature-card opacity-0 bg-dark p-8 rounded-xl shadow-lg border border-gray-800 transform transition-all duration-500 delay-500">
              <div className="bg-gradient-to-br from-secondary-dark to-secondary w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Secure Communication</h3>
              <p className="text-gray-400 leading-relaxed">
                Rest easy knowing your conversations are protected with state-of-the-art security and privacy features.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* App Preview Section */}
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
                <div className="relative z-10 bg-dark-lighter rounded-3xl p-3 shadow-2xl border border-gray-700 transform transition duration-500 hover:scale-105">
                  <Image
                    src="https://i.imgur.com/JR0zM5W.png"
                    alt="Chat App Preview"
                    width={600}
                    height={1200}
                    className="rounded-2xl w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -left-5 -bottom-5 w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-full opacity-50 blur-2xl z-0"></div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6 text-white">Communication Reimagined</h2>
                <p className="text-gray-300 text-lg mb-6">
                  Our modern messaging platform is designed to make staying connected easier than ever. With a beautiful interface and powerful features, you'll experience communication at its best.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Intuitive Design</h3>
                      <p className="text-gray-400">Clean interface that makes messaging a breeze</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Fast Performance</h3>
                      <p className="text-gray-400">Messages delivered instantly with real-time sync</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Fully Responsive</h3>
                      <p className="text-gray-400">Works perfectly on mobile, tablet, and desktop</p>
                    </div>
                  </li>
                </ul>
                
                <Link
                  href="/register"
                  className="inline-flex items-center bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-lg font-bold text-dark transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
                >
                  Join Now
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 bg-dark-lighter relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 z-0"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Transform How You Communicate?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users already enjoying our modern messaging platform. It's free, secure, and designed for the way we communicate today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-dark font-bold rounded-lg transition-all duration-300 text-center transform hover:scale-105 hover:shadow-glow"
            >
              Create Free Account
            </Link>
            
            <Link
              href="/login"
              className="px-8 py-4 bg-dark hover:bg-dark-light text-white font-bold rounded-lg transition-all duration-300 text-center transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="bg-dark py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 100 100" 
                className="w-10 h-10 mr-3"
              >
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#25D366" />
                    <stop offset="100%" stopColor="#128C7E" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#footerLogoGradient)" />
                <path 
                  d="M70 30H30C27.2 30 25 32.2 25 35V75L35 65H70C72.8 65 75 62.8 75 60V35C75 32.2 72.8 30 70 30Z" 
                  fill="white" 
                />
                <path 
                  d="M60 45H40M60 50H40M60 55H40" 
                  stroke="url(#footerLogoGradient)" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <h3 className="text-xl font-bold text-white">Chat App</h3>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
          
          <hr className="border-gray-800 my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Chat App. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}