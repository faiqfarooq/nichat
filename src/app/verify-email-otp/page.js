"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getApiUrl } from "@/lib/apiUtils";

export default function VerifyEmailOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const isPasswordReset = searchParams.get("reset") === "true";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("input"); // 'input', 'verifying', 'success', 'error'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value.length > 1) {
      // If pasting multiple digits, distribute them across inputs
      const digits = value.split("").slice(0, 6);
      const newOtp = [...otp];

      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus on the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        document.getElementById(`otp-${nextEmptyIndex}`).focus();
      } else {
        document.getElementById("otp-5").focus();
      }
    } else {
      // Handle single digit input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    if (!email) {
      setError("Email is missing. Please try again.");
      return;
    }

    setLoading(true);
    setStatus("verifying");
    setError("");

    try {
      const response = await fetch(getApiUrl("/api/auth/verify-email-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
          isPasswordReset,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setStatus("success");

      // Redirect based on verification type
      setTimeout(() => {
        if (isPasswordReset) {
          router.push(`/reset-password?userId=${data.userId}`);
        } else {
          router.push("/login?verified=true");
        }
      }, 2000);
    } catch (error) {
      setStatus("error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!email) {
      setError("Email is missing. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isPasswordReset
        ? "/api/auth/forgot-password"
        : "/api/auth/resend-verification";

      const response = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification code");
      }

      // Show success message
      setError("");
      alert("A new verification code has been sent to your email.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-auto h-full bg-dark flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-dark-lighter p-8 rounded-lg shadow-lg border border-gray-700"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isPasswordReset ? "Reset Your Password" : "Verify Your Email"}
          </h2>
          <p className="text-gray-400 mb-4">
            {isPasswordReset
              ? "Enter the 6-digit code sent to your email to reset your password."
              : "Enter the 6-digit code sent to your email to verify your account."}
          </p>

          {status === "verifying" && (
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          )}

          {status === "success" && (
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}

          {status === "error" && (
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {status === "input" || status === "error" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-full aspect-square text-center text-xl font-bold bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                    disabled={loading}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-primary hover:text-primary-dark transition"
                >
                  Resend
                </button>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        ) : status === "success" ? (
          <div className="text-center">
            <p className="text-green-400 mb-4">
              {isPasswordReset
                ? "Verification successful! You will be redirected to reset your password."
                : "Your email has been successfully verified! You will be redirected to the login page."}
            </p>
          </div>
        ) : null}

        <div className="flex justify-center mt-6">
          <Link
            href="/login"
            className="px-6 py-2 bg-transparent hover:bg-gray-800 text-gray-300 font-medium rounded-lg transition border border-gray-700"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
