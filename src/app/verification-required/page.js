"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerificationRequiredPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResendVerification = async () => {
    if (!session?.user?.email) {
      setError(
        "Unable to identify your email address. Please try logging in again."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      setSuccess("Verification email sent! Please check your inbox.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-lighter p-8 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Email Verification Required
          </h2>
          <p className="text-gray-400 mb-4">
            You need to verify your email address before you can access this
            page. Please check your inbox for the verification link we sent you.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-200 text-sm">
              {success}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-dark font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>

          <div className="mt-4">
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark transition"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
