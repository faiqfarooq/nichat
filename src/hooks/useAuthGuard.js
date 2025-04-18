"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirectToLogin } from "@/lib/authUtils";

/**
 * Custom hook to protect routes that require authentication
 * @param {Object} options - Configuration options
 * @param {boolean} options.redirectToLoginOnUnauthenticated - Whether to redirect to login if unauthenticated
 * @param {boolean} options.redirectToDashboardOnAuthenticated - Whether to redirect to dashboard if authenticated
 * @param {string} options.fallbackUrl - Fallback URL to redirect to if no callbackUrl is provided
 * @returns {Object} - Session data and status
 */
export default function useAuthGuard({
  redirectToLoginOnUnauthenticated = true,
  redirectToDashboardOnAuthenticated = false,
  fallbackUrl = "/dashboard",
} = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If still loading, do nothing yet
    if (status === "loading") return;

    // If user is not authenticated and we should redirect
    if (status === "unauthenticated" && redirectToLoginOnUnauthenticated) {
      console.log("User is not authenticated, redirecting to login");
      
      // Add the current URL as the callback URL
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }

    // If user is authenticated and we should redirect (for login/register pages)
    if (status === "authenticated" && redirectToDashboardOnAuthenticated) {
      console.log("User is already authenticated, redirecting to dashboard");
      
      // Check for callbackUrl in the URL
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      
      // Redirect to callbackUrl if it exists, otherwise to fallbackUrl
      router.push(callbackUrl || fallbackUrl);
    }
  }, [
    status, 
    router, 
    redirectToLoginOnUnauthenticated, 
    redirectToDashboardOnAuthenticated,
    fallbackUrl
  ]);

  return { session, status };
}
