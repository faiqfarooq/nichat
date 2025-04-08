import React from "react";
import { motion } from "framer-motion";

const FooterMain = () => {
  return (
    <>
      {/* Complete Footer with Interactive Elements */}
      <footer className="bg-dark py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 100 100"
                    className="w-10 h-10 mr-3"
                  >
                    <defs>
                      <linearGradient
                        id="footerLogoGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#25D366" />
                        <stop offset="100%" stopColor="#128C7E" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="url(#footerLogoGradient)"
                    />
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
                </motion.div>
                <h3 className="text-xl font-bold text-white">Nichat</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting people through seamless communication. Experience the
                next level of messaging.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </motion.a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Home
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Features
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Pricing
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    About Us
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Contact
                  </motion.a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Help Center
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Blog
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Tutorials
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    API Documentation
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Community
                  </motion.a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest features and releases
              </p>
              <div className="flex space-x-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-dark-lighter text-sm p-3 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary w-full text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary-dark text-dark p-3 rounded-r-lg text-sm font-medium transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>

          <hr className="border-gray-800 my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Nichat. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 md:mt-0">
              <motion.a
                href="#"
                className="hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
              >
                Cookie Policy
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
              >
                Contact Us
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterMain;
