"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function TermsPage() {
  const { data: session, status: authStatus } = useSession();

  // Check if user is authenticated
  if (authStatus === "unauthenticated") {
    redirect("/login");
  }

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
        <h1 className="text-2xl font-semibold text-white">Terms of Service</h1>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg border border-gray-700/50 p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              Last Updated: April 13, 2025
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              Welcome to nichat ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the nichat application, website, and services (collectively, the "Service").
            </p>
            <p className="text-gray-300 mb-4">
              By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">2. Using Our Service</h2>
            <h3 className="text-lg font-medium text-white mt-4 mb-2">2.1 Account Registration</h3>
            <p className="text-gray-300 mb-4">
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <h3 className="text-lg font-medium text-white mt-4 mb-2">2.2 Account Security</h3>
            <p className="text-gray-300 mb-4">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
            <h3 className="text-lg font-medium text-white mt-4 mb-2">2.3 Age Restrictions</h3>
            <p className="text-gray-300 mb-4">
              The Service is intended for users who are 13 years of age or older. By using the Service, you represent and warrant that you are 13 years of age or older.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">3. User Content</h2>
            <h3 className="text-lg font-medium text-white mt-4 mb-2">3.1 Responsibility for Content</h3>
            <p className="text-gray-300 mb-4">
              You are solely responsible for the content that you post, upload, or otherwise make available through the Service ("User Content"). You represent and warrant that you have all necessary rights to post such User Content and that it does not violate any laws or infringe any third-party rights.
            </p>
            <h3 className="text-lg font-medium text-white mt-4 mb-2">3.2 License to User Content</h3>
            <p className="text-gray-300 mb-4">
              By posting User Content, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, copy, modify, create derivative works based on, distribute, publicly display, publicly perform, and otherwise exploit such User Content in connection with the Service.
            </p>
            <h3 className="text-lg font-medium text-white mt-4 mb-2">3.3 Prohibited Content</h3>
            <p className="text-gray-300 mb-4">
              You agree not to post User Content that:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Infringes any patent, trademark, trade secret, copyright, or other intellectual property right of any party</li>
              <li>Contains software viruses or any other code designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
              <li>Constitutes unauthorized or unsolicited advertising, spam, or any other form of solicitation</li>
              <li>Impersonates any person or entity or falsely states or otherwise misrepresents your affiliation with a person or entity</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of nichat and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">5. Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our Privacy Policy describes how we handle the information you provide to us when you use the Service. By using the Service, you agree to our collection, use, and disclosure of information as described in our Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">6. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              In no event shall nichat, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">9. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-300 mb-4">
              Email: support@nichat.app<br />
              Address: 123 Chat Street, Messaging City, MC 12345
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
