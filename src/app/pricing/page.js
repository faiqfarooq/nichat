"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Feature lists for each plan
  const freePlanFeatures = [
    "Basic messaging with friends",
    "Create up to 3 group chats",
    "File sharing up to 20MB",
    "Standard support",
    "Mobile & desktop access",
  ];

  const individualPlanFeatures = [
    "Unlimited messaging",
    "Create up to 10 group chats",
    "File sharing up to 100MB",
    "Priority support",
    "Voice & video calls",
    "Message scheduling",
    "Custom themes",
  ];

  const multiplePlanFeatures = [
    "Everything in Individual plan",
    "Unlimited group chats",
    "File sharing up to 1GB",
    "Premium support 24/7",
    "Advanced admin controls",
    "Analytics dashboard",
    "Team collaboration tools",
    "Custom branding options",
  ];

  return (
    <main className="min-h-screen flex flex-col bg-dark">
      {/* Hero Section */}
      <section className="py-16 mt-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-dark/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Choose the perfect plan for your communication needs. No hidden
            fees, no surprises. Upgrade or downgrade anytime.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center bg-dark-lighter p-1 rounded-lg mb-16"
          >
            <button
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                !isAnnual
                  ? "bg-gradient-to-r from-primary to-secondary text-dark font-medium"
                  : "text-gray-300"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                isAnnual
                  ? "bg-gradient-to-r from-primary to-secondary text-dark font-medium"
                  : "text-gray-300"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
              <span className="ml-1 text-xs bg-primary-dark px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Free Plan */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={() => setHoveredPlan("free")}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`bg-dark-lighter rounded-2xl overflow-hidden transition-all duration-500 border-2 ${
              hoveredPlan === "free" ? "border-primary" : "border-gray-800"
            }`}
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
              <p className="text-gray-400 mb-6">
                Perfect for getting started with basic communication needs
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>

              <Link
                href="/register"
                className={`block text-center py-3 px-6 rounded-lg transition-all duration-300 ${
                  hoveredPlan === "free"
                    ? "bg-gradient-to-r from-primary to-secondary text-dark font-medium"
                    : "bg-dark text-white border border-gray-700"
                }`}
              >
                Get Started
              </Link>
            </div>

            <div className="bg-dark p-8 border-t border-gray-800">
              <h4 className="font-medium text-white mb-4">What's included:</h4>
              <ul className="space-y-3">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Individual Plan */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={() => setHoveredPlan("individual")}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`bg-dark-lighter rounded-2xl overflow-hidden transition-all duration-500 transform ${
              hoveredPlan === "individual"
                ? "border-2 border-primary scale-105 shadow-xl shadow-primary/20"
                : "border-2 border-gray-800"
            }`}
          >
            

            <div className="p-8 pt-12">
              <h3 className="text-2xl font-bold text-white mb-4">Individual</h3>
              <p className="text-gray-400 mb-6">
                Enhanced features for individuals who chat frequently
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold text-white">
                  ${isAnnual ? "8" : "10"}
                </span>
                <span className="text-gray-400">/month</span>
                {isAnnual && (
                  <span className="ml-2 text-primary text-sm">
                    Save $24/year
                  </span>
                )}
              </div>

              <Link
                href="/register"
                className="block text-center py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-secondary text-dark font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-dark p-8 border-t border-gray-800">
              <h4 className="font-medium text-white mb-4">
                Everything in Free, plus:
              </h4>
              <ul className="space-y-3">
                {individualPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Multiple People Plan */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={() => setHoveredPlan("multiple")}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`bg-dark-lighter rounded-2xl overflow-hidden transition-all duration-500 border-2 ${
              hoveredPlan === "multiple"
                ? "border-secondary"
                : "border-gray-800"
            }`}
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Multiple People
              </h3>
              <p className="text-gray-400 mb-6">
                Perfect for teams, businesses, and large groups
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold text-white">
                  ${isAnnual ? "20" : "25"}
                </span>
                <span className="text-gray-400">/month</span>
                {isAnnual && (
                  <span className="ml-2 text-secondary text-sm">
                    Save $60/year
                  </span>
                )}
              </div>

              <Link
                href="/register"
                className={`block text-center py-3 px-6 rounded-lg transition-all duration-300 ${
                  hoveredPlan === "multiple"
                    ? "bg-gradient-to-r from-secondary to-primary-dark text-dark font-medium"
                    : "bg-dark text-white border border-gray-700"
                }`}
              >
                Get Started
              </Link>
            </div>

            <div className="bg-dark p-8 border-t border-gray-800">
              <h4 className="font-medium text-white mb-4">
                Everything in Individual, plus:
              </h4>
              <ul className="space-y-3">
                {multiplePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-secondary mt-0.5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-dark-lighter">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6 text-left">
            <FaqItem
              question="How do I upgrade my plan?"
              answer="You can upgrade your plan at any time from your account settings. The new pricing will be prorated for the remainder of your billing cycle."
            />

            <FaqItem
              question="Can I cancel my subscription anytime?"
              answer="Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your paid features until the end of your current billing period."
            />

            <FaqItem
              question="Is there a limit to how many people can join my groups?"
              answer="Free plans can have up to 10 people per group, Individual plans support up to 50 people per group, and Multiple People plans support up to 250 members per group."
            />

            <FaqItem
              question="Do you offer discounts for educational institutions?"
              answer="Yes, we offer special discounts for educational institutions. Please contact our sales team for more information on our educational pricing."
            />

            <FaqItem
              question="How secure is my data on Nichat?"
              answer="We take security very seriously. All messages are encrypted end-to-end, and we never sell your data to third parties. Your privacy is our priority."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-slow"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-slow animation-delay-2000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center z-10 relative"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Our team is here to help you find the perfect plan for your needs.
            Reach out to us and we'll get back to you as soon as possible.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-dark font-bold rounded-lg transition-all duration-300 text-center transform hover:scale-105 hover:shadow-glow"
            >
              Contact Sales
            </Link>

            <Link
              href="/register"
              className="px-8 py-4 bg-dark hover:bg-dark-light text-white font-bold border border-gray-700 rounded-lg transition-all duration-300 text-center transform hover:scale-105"
            >
              Try For Free
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

// FAQ Accordion component
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <button
        className="flex justify-between items-center w-full p-5 text-left text-white font-medium focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 pt-0 text-gray-300 border-t border-gray-800">
          {answer}
        </div>
      </div>
    </div>
  );
}
