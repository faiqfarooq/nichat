"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function HelpCenterPage() {
  const { data: session, status: authStatus } = useSession();

  // Check if user is authenticated
  if (authStatus === "unauthenticated") {
    redirect("/login");
  }

  // FAQ data
  const faqs = [
    {
      question: "How do I start a new chat?",
      answer: "To start a new chat, go to the Chat tab and click on the 'Search Users' button in the top right corner. Search for the user you want to chat with and click on their name to start a conversation."
    },
    {
      question: "How do I create a group chat?",
      answer: "To create a group chat, go to the Group tab and click on the 'Create New Group' button. Enter a name for your group, add members, and click 'Create Group'."
    },
    {
      question: "How do I change my profile picture?",
      answer: "To change your profile picture, go to the Profile tab and click on your current profile picture. You'll see an edit icon that allows you to upload a new image."
    },
    {
      question: "How do I change my status message?",
      answer: "To change your status message, go to the Profile tab and scroll down to the 'Status' field. Enter your new status message and click 'Save Changes'."
    },
    {
      question: "How do I block a user?",
      answer: "To block a user, open a chat with them, click on their name at the top of the chat window to view their profile, and select 'Block User' from the options."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Settings > Account > Delete Account. You'll need to confirm this action as it permanently removes all your data."
    },
    {
      question: "How do I change the chat background color?",
      answer: "To change the chat background color, go to Settings > Chats > Chat Background Color and select your preferred color from the options provided."
    },
    {
      question: "How do I backup my chat history?",
      answer: "To backup your chat history, go to Settings > Chats > Chat Backup and click on 'Create Backup'. This will create a backup of all your conversations."
    },
    {
      question: "How do I invite friends to nichat?",
      answer: "To invite friends, go to Settings > Invite and enter your friend's email address or share the invitation link provided."
    },
    {
      question: "How do I change my email address?",
      answer: "To change your email address, go to Settings > Account > Change Email Address. Enter your new email and follow the verification process."
    }
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Back button for mobile */}
      <div className="md:hidden fixed left-4 z-10">
        <Link
          href="/settings"
          className="p-2 bg-dark-lighter rounded-full text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Page title */}
      <div className="pt-8 pb-2 px-4 text-center">
        <h1 className="text-2xl font-semibold text-white">Help Center</h1>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        {/* Introduction */}
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg border border-gray-700/50 mb-8 p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Welcome to the nichat Help Center</h2>
          <p className="text-gray-300 text-center mb-6">
            Find answers to common questions and learn how to use all the features of nichat.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark p-4 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chat Features
              </h3>
              <p className="text-gray-400 text-sm">
                Learn how to use chat features, send messages, share files, and more.
              </p>
            </div>
            <div className="bg-dark p-4 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Group Management
              </h3>
              <p className="text-gray-400 text-sm">
                Create and manage groups, add members, and set group preferences.
              </p>
            </div>
            <div className="bg-dark p-4 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Privacy & Security
              </h3>
              <p className="text-gray-400 text-sm">
                Learn about privacy settings, blocking users, and securing your account.
              </p>
            </div>
            <div className="bg-dark p-4 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Account Management
              </h3>
              <p className="text-gray-400 text-sm">
                Update your profile, change email, and manage account settings.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-dark p-4 rounded-lg border border-gray-700">
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/30">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Still need help?
            </h3>
            <p className="text-gray-300 mb-4">
              If you couldn't find the answer to your question, please contact our support team.
            </p>
            <Link
              href="/contact-us"
              className="px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors inline-block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
