"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Features() {
  const [activeTab, setActiveTab] = useState("messaging");
  const featureSectionRef = useRef(null);

  // Scroll to the features section when a tab is clicked
  useEffect(() => {
    if (featureSectionRef.current) {
      featureSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen flex flex-col bg-dark">
      {/* Hero Section */}
      <section className="relative mt-8 py-24 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-dark/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Discover Nichat Features
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-3xl">
            Explore the powerful capabilities that make Nichat the perfect
            platform for connecting with friends, family, and colleagues. Our
            feature-rich application is designed to enhance your communication
            experience.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("messaging")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "messaging"
                  ? "bg-gradient-to-r from-primary to-secondary text-dark font-bold"
                  : "bg-dark-lighter text-gray-300 hover:bg-gray-800"
              }`}
            >
              Messaging
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("groups")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "groups"
                  ? "bg-gradient-to-r from-primary to-secondary text-dark font-bold"
                  : "bg-dark-lighter text-gray-300 hover:bg-gray-800"
              }`}
            >
              Groups
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("media")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "media"
                  ? "bg-gradient-to-r from-primary to-secondary text-dark font-bold"
                  : "bg-dark-lighter text-gray-300 hover:bg-gray-800"
              }`}
            >
              Media Sharing
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("calls")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "calls"
                  ? "bg-gradient-to-r from-primary to-secondary text-dark font-bold"
                  : "bg-dark-lighter text-gray-300 hover:bg-gray-800"
              }`}
            >
              Voice & Video
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "privacy"
                  ? "bg-gradient-to-r from-primary to-secondary text-dark font-bold"
                  : "bg-dark-lighter text-gray-300 hover:bg-gray-800"
              }`}
            >
              Privacy & Security
            </motion.button>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-dark font-bold rounded-lg transition-all duration-300 text-center transform hover:shadow-glow flex items-center justify-center"
            >
              <span>Try Nichat For Free</span>
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
        </motion.div>
      </section>

      {/* Feature Details Section */}
      <section ref={featureSectionRef} className="py-20 px-4 bg-dark-lighter">
        <div className="max-w-6xl mx-auto">
          {/* Messaging Features */}
          {activeTab === "messaging" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Real-Time Messaging
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Communicate effortlessly with lightning-fast message delivery
                  and a rich set of messaging features.
                </p>
              </div>

              {/* Feature Row 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Instant Message Delivery
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Experience the speed of real-time communication with our
                      lightning-fast message delivery system. Messages are sent
                      and received instantly, ensuring your conversations flow
                      naturally without delays.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Real-Time Notifications
                          </h4>
                          <p className="text-gray-400">
                            Get instantly notified when someone messages you
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Read Receipts
                          </h4>
                          <p className="text-gray-400">
                            Know when your messages have been read
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Typing Indicators
                          </h4>
                          <p className="text-gray-400">
                            See when someone is typing a response
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src="https://i.imgur.com/8XcXuTF.jpg"
                        alt="Instant Messaging"
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Lightning Fast Delivery
                      </h4>
                      <p className="text-gray-400">
                        Our optimized infrastructure ensures messages are
                        delivered in milliseconds, creating a seamless
                        conversation experience.
                      </p>
                    </div>

                    {/* Demo animation for typing indicator */}
                    <div className="absolute bottom-4 left-6 flex items-center space-x-1 bg-gray-800/80 px-3 py-1 rounded-full">
                      <span className="text-sm text-white">Typing</span>
                      <span className="flex space-x-1">
                        <motion.span
                          className="w-1.5 h-1.5 bg-primary rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                          }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 bg-primary rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            delay: 0.2,
                            times: [0, 0.5, 1],
                          }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 bg-primary rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            delay: 0.4,
                            times: [0, 0.5, 1],
                          }}
                        />
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 2 */}
              <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src="https://i.imgur.com/HZe7YjO.jpg"
                        alt="Rich Message Formatting"
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Express Yourself Fully
                      </h4>
                      <p className="text-gray-400">
                        Enhance your messages with rich formatting, emojis,
                        stickers, and GIFs to convey exactly what you mean.
                      </p>
                    </div>

                    {/* Demo emoji selector */}
                    <div className="absolute top-4 right-4 bg-dark-lighter/90 p-2 rounded-lg flex space-x-2">
                      <motion.span
                        className="text-xl cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        😊
                      </motion.span>
                      <motion.span
                        className="text-xl cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ❤️
                      </motion.span>
                      <motion.span
                        className="text-xl cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        👍
                      </motion.span>
                      <motion.span
                        className="text-xl cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        🎉
                      </motion.span>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Rich Text Formatting
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Express yourself fully with Nichat's rich messaging
                      capabilities. Format your text to emphasize important
                      points, add visual elements, and share your emotions
                      clearly.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Text Formatting
                          </h4>
                          <p className="text-gray-400">
                            Use bold, italic, and underline to emphasize your
                            points
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Emojis & Stickers
                          </h4>
                          <p className="text-gray-400">
                            Express emotions with our extensive emoji and
                            sticker collections
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            GIFs & Memes
                          </h4>
                          <p className="text-gray-400">
                            Search and share the perfect GIF or meme for any
                            moment
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Message Organization
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Keep your conversations organized and easily find
                      important messages with our advanced organization
                      features. Never lose track of important information again.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Message Pinning
                          </h4>
                          <p className="text-gray-400">
                            Pin important messages to the top of your
                            conversations
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Smart Search
                          </h4>
                          <p className="text-gray-400">
                            Find any message, file, or link with our powerful
                            search feature
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Message Replies
                          </h4>
                          <p className="text-gray-400">
                            Reply directly to specific messages to keep
                            conversations organized
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src="https://i.imgur.com/R2XWYpT.jpg"
                        alt="Message Organization"
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Stay Organized
                      </h4>
                      <p className="text-gray-400">
                        Keep your conversations structured and find important
                        information quickly with our organization tools.
                      </p>
                    </div>

                    {/* Demo pinned message */}
                    <div className="absolute top-4 left-4 bg-dark-lighter/90 px-3 py-1 rounded-lg flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-primary"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 12V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v8l-4.4 4.4c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0l4.3-4.3V22c0 .55.45 1 1 1s1-.45 1-1v-8.8l4.3 4.3c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L16 12z" />
                      </svg>
                      <span className="text-xs text-white">Pinned Message</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Groups Features */}
          {activeTab === "groups" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Dynamic Group Chats
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Create and manage group conversations with powerful
                  collaboration tools that bring people together.
                </p>
              </div>

              {/* Feature Row 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Create Custom Groups
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Create the perfect group for any purpose - from small
                      friend gatherings to large communities. Customize your
                      groups to match your needs and style.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Unlimited Members
                          </h4>
                          <p className="text-gray-400">
                            Create groups with any number of participants
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Custom Group Icons
                          </h4>
                          <p className="text-gray-400">
                            Personalize your group with custom icons and banners
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Invite Links
                          </h4>
                          <p className="text-gray-400">
                            Share invite links to quickly add new members
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src="https://i.imgur.com/VBGdtJP.jpg"
                        alt="Group Creation"
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Powerful Group Management
                      </h4>
                      <p className="text-gray-400">
                        Create and customize groups for friends, family, work
                        teams, or communities with intuitive tools.
                      </p>
                    </div>

                    {/* Demo group creation UI */}
                    <div className="absolute top-4 right-4 bg-dark-lighter/90 px-3 py-2 rounded-lg flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold mr-2">
                        N
                      </div>
                      <span className="text-white text-xs font-medium">
                        New Group
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 2 */}
              <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src="https://i.imgur.com/K7Iqy3F.jpg"
                        alt="Group Management"
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Advanced Admin Controls
                      </h4>
                      <p className="text-gray-400">
                        Manage your group with powerful admin tools that give
                        you complete control over your community.
                      </p>
                    </div>

                    {/* Demo admin tools */}
                    <div className="absolute top-4 left-4 bg-dark-lighter/90 p-2 rounded-lg flex space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4 text-primary"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4 text-secondary"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4 text-red-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Powerful Admin Controls
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Take control of your groups with comprehensive admin
                      tools. Manage members, set permissions, and keep your
                      community running smoothly.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Role Management
                          </h4>
                          <p className="text-gray-400">
                            Assign different roles with specific permissions to
                            members
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Content Moderation
                          </h4>
                          <p className="text-gray-400">
                            Moderate messages and media to keep conversations
                            appropriate
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Member Management
                          </h4>
                          <p className="text-gray-400">
                            Add, remove, or temporarily restrict members as
                            needed
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Group Activities & Events
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Make your group interactions more engaging with built-in
                      activities, polls, and event planning tools that bring
                      your community together.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Polls & Voting
                          </h4>
                          <p className="text-gray-400">
                            Create polls to gather opinions and make group
                            decisions
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Event Scheduling
                          </h4>
                          <p className="text-gray-400">
                            Plan and schedule events with integrated calendar
                            features
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Group Games
                          </h4>
                          <p className="text-gray-400">
                            Play mini-games directly in your group chats
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src="https://i.imgur.com/OzVDlYP.jpg"
                        alt="Group Activities"
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Interactive Group Experiences
                      </h4>
                      <p className="text-gray-400">
                        Engage your group with interactive activities that make
                        your conversations more fun and productive.
                      </p>
                    </div>

                    {/* Demo poll UI */}
                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-lighter/90 p-3 rounded-lg w-3/4">
                      <h5 className="text-white text-sm font-bold mb-2">
                        Poll: Choose our next meeting time
                      </h5>
                      <div className="space-y-2">
                        <div className="bg-gray-800 rounded-lg p-2 flex justify-between">
                          <span className="text-white text-xs">
                            Friday, 7PM
                          </span>
                          <span className="text-xs text-primary-light">
                            64%
                          </span>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-2 flex justify-between">
                          <span className="text-white text-xs">
                            Saturday, 3PM
                          </span>
                          <span className="text-xs text-primary-light">
                            28%
                          </span>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-2 flex justify-between">
                          <span className="text-white text-xs">
                            Sunday, 1PM
                          </span>
                          <span className="text-xs text-primary-light">8%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Media Sharing Features */}
          {activeTab === "media" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Rich Media Sharing
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Share photos, videos, documents and more with high quality and
                  seamless integration.
                </p>
              </div>

              {/* Feature Row 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      High-Quality Photo Sharing
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Share your photos in high resolution without compromising
                      quality. Create albums, add captions, and organize your
                      visual memories with ease.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Original Quality
                          </h4>
                          <p className="text-gray-400">
                            Share photos in their original resolution with
                            minimal compression
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Photo Albums
                          </h4>
                          <p className="text-gray-400">
                            Create and share collections of photos in organized
                            albums
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Image Editing
                          </h4>
                          <p className="text-gray-400">
                            Edit photos with filters and adjustments before
                            sharing
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="grid grid-cols-3 gap-1 p-1">
                      <Image
                        src="https://i.imgur.com/ZxF8Jmd.jpg"
                        alt="Photo Gallery 1"
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <Image
                        src="https://i.imgur.com/4bZnQZW.jpg"
                        alt="Photo Gallery 2"
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <Image
                        src="https://i.imgur.com/p3s5YPs.jpg"
                        alt="Photo Gallery 3"
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <Image
                        src="https://i.imgur.com/LkUJ5G3.jpg"
                        alt="Photo Gallery 4"
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <Image
                        src="https://i.imgur.com/D42jsCZ.jpg"
                        alt="Photo Gallery 5"
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <div className="relative w-full aspect-square bg-gray-900 rounded flex items-center justify-center">
                        <div className="absolute inset-0">
                          <Image
                            src="https://i.imgur.com/7XTtHDO.jpg"
                            alt="Photo Gallery 6"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover rounded opacity-40"
                          />
                        </div>
                        <span className="text-white font-bold text-lg relative z-10">
                          +24
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-white">
                        Summer Vacation 2025
                      </h4>
                      <p className="text-gray-400 text-sm">
                        30 photos · Updated 2 hours ago
                      </p>
                    </div>

                    {/* Demo photo sharing UI */}
                    <div className="absolute top-2 right-2 bg-dark-lighter/90 p-1.5 rounded-lg flex space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-primary"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                        </svg>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-secondary"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 2 */}
              <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src="https://i.imgur.com/Q8RFxTR.jpg"
                        alt="Video Sharing"
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>

                      {/* Play button overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center cursor-pointer">
                          <svg
                            className="w-8 h-8 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        HD Video Streaming
                      </h4>
                      <p className="text-gray-400">
                        Share videos in high definition with smart streaming
                        capabilities that adjust to any connection.
                      </p>
                      <div className="flex items-center mt-4 text-gray-400 text-sm">
                        <span>4:32</span>
                        <div className="mx-3 flex-1 h-1 bg-gray-700 rounded-full">
                          <div className="h-full w-1/3 bg-primary rounded-full"></div>
                        </div>
                        <span>12:15</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      HD Video Sharing
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Share videos in high definition with smooth playback on
                      any device. Our intelligent streaming technology adapts to
                      your connection speed for a seamless experience.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Adaptive Streaming
                          </h4>
                          <p className="text-gray-400">
                            Videos adapt to your network for buffer-free viewing
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Video Trimming
                          </h4>
                          <p className="text-gray-400">
                            Trim videos before sharing to highlight key moments
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Picture-in-Picture
                          </h4>
                          <p className="text-gray-400">
                            Continue watching videos while using other apps
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      File Sharing & Storage
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Share documents, spreadsheets, presentations and more with
                      secure file sharing. Organize, find, and access your
                      shared files with ease.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Support for All File Types
                          </h4>
                          <p className="text-gray-400">
                            Share PDFs, Office documents, Zip files and more
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Smart Voice Detection
                          </h4>
                          <p className="text-gray-400">
                            Automatically enhances the clarity of human voices
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Voice Messages
                          </h4>
                          <p className="text-gray-400">
                            Send recorded voice messages when you can't call
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-4">
                        Crystal Clear Audio
                      </h4>

                      {/* Audio waveform visualization */}
                      <div className="relative h-40 mb-6 bg-dark-lighter rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center space-x-1 px-4">
                          {Array.from({ length: 50 }).map((_, i) => {
                            const height = Math.sin(i * 0.2) * 0.5 + 0.5;
                            const animationDelay = `${i * 0.05}s`;
                            return (
                              <motion.div
                                key={i}
                                className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full"
                                style={{
                                  height: `${height * 100}%`,
                                  animationDelay,
                                }}
                                animate={{
                                  height: [
                                    `${height * 100}%`,
                                    `${height * 60 + 20}%`,
                                    `${height * 100}%`,
                                  ],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Playback controls */}
                        <div className="absolute bottom-4 left-0 w-full flex justify-center items-center space-x-6">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-8 h-8 bg-dark rounded-full flex items-center justify-center cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer"
                          >
                            <svg
                              className="w-5 h-5 text-dark"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-8 h-8 bg-dark rounded-full flex items-center justify-center cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-secondary"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-white font-medium text-sm">
                              Voice Message
                            </h5>
                            <p className="text-gray-400 text-xs">0:42 / 1:24</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-400 text-xs">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                          </svg>
                          <span>HD Audio</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy & Security Features */}
          {activeTab === "privacy" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Advanced Privacy & Security
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Keep your conversations private with industry-leading security
                  features that put you in control.
                </p>
              </div>

              {/* Feature Row 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      End-to-End Encryption
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Your messages are secured with state-of-the-art end-to-end
                      encryption. Only you and the intended recipients can read
                      your messages - not even we can access them.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Military-Grade Encryption
                          </h4>
                          <p className="text-gray-400">
                            256-bit AES encryption for maximum security
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Secure All Content
                          </h4>
                          <p className="text-gray-400">
                            Messages, calls, and shared files are all encrypted
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Verify Security
                          </h4>
                          <p className="text-gray-400">
                            Verify your connection with security codes
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                          <svg
                            className="w-6 h-6 text-primary"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-white">
                          Secure End-to-End Encryption
                        </h4>
                      </div>

                      {/* Encryption visualization */}
                      <div className="relative h-48 bg-dark-lighter rounded-lg p-4 overflow-hidden mb-6">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-full h-full text-gray-700/20"
                            viewBox="0 0 100 100"
                          >
                            <defs>
                              <pattern
                                id="grid"
                                width="10"
                                height="10"
                                patternUnits="userSpaceOnUse"
                              >
                                <path
                                  d="M 10 0 L 0 0 0 10"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="0.5"
                                />
                              </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                          </svg>
                        </div>

                        <div className="relative h-full flex flex-col justify-between">
                          <div className="flex justify-between items-center">
                            <div className="bg-dark p-2 rounded-lg flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                <span className="text-primary text-xs font-bold">
                                  You
                                </span>
                              </div>
                              <div className="text-white text-xs">
                                🔒 Encrypted
                              </div>
                            </div>

                            <div className="bg-dark p-2 rounded-lg flex items-center">
                              <div className="text-white text-xs">
                                🔒 Encrypted
                              </div>
                              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center ml-2">
                                <span className="text-secondary text-xs font-bold">
                                  Them
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <motion.div
                              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <svg
                                className="w-20 h-20 text-primary"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                opacity="0.2"
                              >
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                              </svg>
                            </motion.div>

                            <motion.div
                              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary/30 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />

                            <motion.div
                              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-secondary/30 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0, 0.3],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                              }}
                            />
                          </div>

                          <div className="bg-dark/80 p-2 rounded-lg text-center">
                            <div className="text-white text-xs font-medium">
                              Only you and the recipient can read these messages
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                          Verify Security
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 2 */}
              <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-6">
                        Privacy Controls
                      </h4>

                      <div className="space-y-4">
                        <div className="bg-dark-lighter p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <div className="bg-primary/20 p-1.5 rounded-lg mr-3">
                                <svg
                                  className="w-5 h-5 text-primary"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                              </div>
                              <h5 className="text-white font-medium">
                                Profile Privacy
                              </h5>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-12 h-6 bg-primary/20 rounded-full flex items-center p-1 cursor-pointer"
                            >
                              <div className="w-4 h-4 bg-primary rounded-full ml-auto"></div>
                            </motion.div>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Control who can see your profile photo, status and
                            information
                          </p>
                        </div>

                        <div className="bg-dark-lighter p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <div className="bg-secondary/20 p-1.5 rounded-lg mr-3">
                                <svg
                                  className="w-5 h-5 text-secondary"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                </svg>
                              </div>
                              <h5 className="text-white font-medium">
                                Message Security
                              </h5>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-12 h-6 bg-secondary/20 rounded-full flex items-center p-1 cursor-pointer"
                            >
                              <div className="w-4 h-4 bg-secondary rounded-full ml-auto"></div>
                            </motion.div>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Configure disappearing messages and screen security
                            options
                          </p>
                        </div>

                        <div className="bg-dark-lighter p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <div className="bg-primary-dark/20 p-1.5 rounded-lg mr-3">
                                <svg
                                  className="w-5 h-5 text-primary-dark"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M11.19 1.36l-7 3.11C3.47 4.79 3 5.51 3 6.3V11c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6.3c0-.79-.47-1.51-1.19-1.83l-7-3.11c-.51-.23-1.11-.23-1.62 0zM12 11.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                </svg>
                              </div>
                              <h5 className="text-white font-medium">
                                Access Control
                              </h5>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-12 h-6 bg-gray-600 rounded-full flex items-center p-1 cursor-pointer"
                            >
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                            </motion.div>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Manage app access with biometric authentication and
                            app lock
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Complete Privacy Controls
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Take full control of your privacy with comprehensive
                      settings. Decide who can see your information, when
                      messages disappear, and how your data is handled.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Last Seen Control
                          </h4>
                          <p className="text-gray-400">
                            Choose who can see when you were last active
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Disappearing Messages
                          </h4>
                          <p className="text-gray-400">
                            Set messages to automatically delete after a
                            specific time
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Block Contacts
                          </h4>
                          <p className="text-gray-400">
                            Easily block and report unwanted contacts
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>

              {/* Feature Row 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Secure Account Protection
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Protect your account with multiple layers of security.
                      From two-factor authentication to encrypted backups, your
                      account is secured against unauthorized access.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-gray-400">
                            Add an extra layer of security with 2FA
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Encrypted Backups
                          </h4>
                          <p className="text-gray-400">
                            Secure your chat history with encrypted backups
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
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
                          <h4 className="font-semibold text-white">
                            Security Notifications
                          </h4>
                          <p className="text-gray-400">
                            Get alerted about suspicious login attempts
                          </p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative bg-dark rounded-xl overflow-hidden shadow-xl border border-gray-800"
                  >
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-6">
                        Advanced Account Protection
                      </h4>

                      {/* 2FA Verification UI */}
                      <div className="bg-dark-lighter p-5 rounded-lg mb-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-primary"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zm-1-6h-3V8h-2v5H8l4 4 4-4z" />
                            </svg>
                          </div>
                          <h5 className="text-white font-medium">
                            Two-Factor Authentication
                          </h5>
                        </div>

                        <div className="flex justify-between mb-6">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <motion.div
                              key={num}
                              className="w-12 h-12 border-2 border-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                              whileHover={{
                                borderColor: "#25D366",
                                scale: 1.05,
                              }}
                            >
                              {num === 1 || num === 2 ? num : ""}
                            </motion.div>
                          ))}
                        </div>

                        <p className="text-center text-gray-400 text-sm">
                          Enter the 6-digit code from your authentication app
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-green-500"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-medium">
                              Password Protection Active
                            </h5>
                            <p className="text-gray-500 text-xs">
                              Strong password with special characters
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-green-500"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-medium">
                              Biometric Login Enabled
                            </h5>
                            <p className="text-gray-500 text-xs">
                              Fingerprint authentication active
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-yellow-500"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M13 13h-2V7h2v6zm0 4h-2v-2h2v2zm-1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-white text-sm font-medium">
                              Recovery Email Pending
                            </h5>
                            <p className="text-gray-500 text-xs">
                              Add a recovery email for extra security
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-6 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                        Configure Security Settings
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
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
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Experience Nichat?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join millions of users already enjoying the most secure and
            feature-rich messaging platform. Create your account today and start
            connecting.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
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

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg text-center mb-2">
                100% Free
              </h3>
              <p className="text-gray-400 text-center text-sm">
                No subscription fees or hidden costs. Nichat is completely free
                to use.
              </p>
            </div>

            <div className="bg-dark p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg text-center mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-400 text-center text-sm">
                Your conversations are protected with end-to-end encryption.
              </p>
            </div>

            <div className="bg-dark p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-primary-dark/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary-dark"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.5 4.07c-.79-.57-1.72-.93-2.7-1.04-.92-.09-1.83.08-2.65.5-.83.41-1.51 1.07-1.97 1.91-.38.71-.57 1.49-.57 2.28-.01 1.19.39 2.33 1.14 3.25.7.86 1.69 1.51 2.8 1.8l.03.01v.04c-.15.41-.44.78-.83 1.03C8.2 14.16 7.57 14.3 7 14.3c-1.15 0-2.24-.34-3.15-.94-.14-.1-.29-.19-.44-.27L2 14c.59.36 1.23.66 1.91.86 1.03.31 2.12.35 3.17.09 1.21-.3 2.3-.99 3.06-1.95.41-.54.73-1.16.9-1.82.1-.36.15-.73.17-1.09.02-.32.01-.63-.01-.94-.01-.19-.06-.33-.08-.48.6-.02 1.19-.16 1.73-.4.64-.29 1.21-.72 1.67-1.24.37-.41.67-.89.89-1.4.04-.11.07-.22.1-.34.04-.14.06-.29.1-.43.02-.09.04-.18.05-.28.05-.33.05-.66.05-.97-.01-1.38-.51-2.72-1.42-3.76.18.42.35.86.49 1.31.31 1.04.39 2.16.23 3.21-.09.51-.28 1.01-.55 1.47-.44.75-1.09 1.36-1.85 1.75-.07.03-.14.06-.21.08-.15.05-.31.1-.47.12-.11.01-.22.02-.33.02-.2 0-.4-.01-.59-.06-.11-.02-.22-.06-.32-.1 1.49-.56 2.55-1.86 2.55-3.39 0-2.03-1.6-3.67-3.6-3.67-1.96 0-3.59 1.72-3.59 3.83 0 .67.11 1.32.34 1.92-.48-.07-.94-.2-1.37-.39-.28-.12-.53-.28-.77-.46.19.58.45 1.12.78 1.63.51.81 1.2 1.47 2.02 1.93.37.22.76.36 1.16.49l-.27.66c-.34-.14-.64-.33-.91-.55-.75-.59-1.3-1.43-1.55-2.38-.18-.66-.18-1.35-.03-2.01.1-.43.25-.85.45-1.24-.91.43-1.58 1.28-1.79 2.26-.2 1.02.15 2.07.91 2.77.18.17.38.3.58.39-.1.12-.19.25-.29.4.76.16 1.55.21 2.33.04.26-.06.51-.14.76-.24.39 0 .78-.08 1.14-.24.39-.18.69-.47.87-.84.03-.08.05-.17.07-.26.02-.11.03-.23.03-.35.19.04.39.06.58.06.21 0 .41-.03.62-.07.28-.06.55-.16.8-.3.12-.08.23-.17.33-.27-.16.5-.42.96-.79 1.35-.57.6-1.3.96-2.09 1.09-.18.03-.36.04-.55.04h-.13c-.24-.01-.47-.05-.7-.1-.16-.04-.32-.09-.47-.15-.14-.05-.27-.12-.4-.19.27.31.57.58.89.83.73.55 1.59.88 2.5.91.16.01.33.01.5 0 .37-.01.74-.07 1.1-.17.32-.09.63-.21.92-.36.56-.29 1.05-.7 1.45-1.18.4-.49.7-1.04.91-1.64.1-.29.18-.59.22-.89.05-.31.08-.63.08-.94v-.01c0-.37-.04-.73-.12-1.08.55.26 1.06.62 1.49 1.05.82.82 1.38 1.88 1.71 3.02.39 1.33.49 2.85.13 4.2-.38 1.43-1.21 2.71-2.33 3.58-.91.7-1.99 1.15-3.1 1.37-.15.03-.3.05-.45.07-.21.02-.43.03-.65.03-.34 0-.67-.02-1-.08-.41-.07-.81-.18-1.21-.32-.69-.26-1.32-.64-1.89-1.12-1.04-.88-1.83-2.04-2.32-3.35l-.01-.02-.13-.01C4.51 10.11 3 8.19 3 5.97c0-1.03.24-2.02.7-2.91.49-.97 1.2-1.81 2.08-2.42.87-.6 1.88-.93 2.91-.98 1.49-.07 2.94.38 4.12 1.25.94.7 1.7 1.66 2.12 2.76.26.67.39 1.38.39 2.1 0 1.89-.86 3.58-2.21 4.71l-.01.01-.06.05c.05-.12.1-.24.13-.37.15-.57.13-1.18-.04-1.73z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg text-center mb-2">
                All Platforms
              </h3>
              <p className="text-gray-400 text-center text-sm">
                Available on iOS, Android, Windows, Mac, and web browsers.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
