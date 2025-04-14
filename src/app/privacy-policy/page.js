"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
        <h1 className="text-2xl font-semibold text-white">Privacy Policy</h1>
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
              At nichat, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application, website, and services (collectively, the "Service").
            </p>
            <p className="text-gray-300 mb-4">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-white mt-4 mb-2">2.1 Personal Data</h3>
            <p className="text-gray-300 mb-4">
              We may collect personal information that you voluntarily provide to us when you register for the Service, express an interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Profile picture</li>
              <li>Status message</li>
              <li>Contact information</li>
              <li>User-generated content, such as messages, photos, and files</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">2.2 Automatically Collected Data</h3>
            <p className="text-gray-300 mb-4">
              When you access or use our Service, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>Device information (such as your IP address, browser type, and operating system)</li>
              <li>Usage data (such as the pages you visit, the time and date of your visit, and the time spent on those pages)</li>
              <li>Location data (if you grant permission)</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices, updates, security alerts, and support and administrative messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Communicate with you about products, services, offers, promotions, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize and improve the Service and provide content or features that match user profiles or interests</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-300 mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li><strong>With Other Users:</strong> When you send messages or share content with other users, those users will receive the information you share.</li>
              <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.</li>
              <li><strong>For Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent.</li>
              <li><strong>To Comply with Legal Obligations:</strong> We may disclose your information where required to do so by law or in response to valid requests by public authorities.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">5. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">6. Data Retention</h2>
            <p className="text-gray-300 mb-4">
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>The right to access the personal information we have about you</li>
              <li>The right to request that we correct or update any personal information we have about you</li>
              <li>The right to request that we delete any personal information we have about you</li>
              <li>The right to object to the processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>
            <p className="text-gray-300 mb-4">
              To exercise these rights, please contact us using the contact information provided below.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-4">10. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300 mb-4">
              Email: privacy@nichat.app<br />
              Address: 123 Chat Street, Messaging City, MC 12345
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
