/**
 * Authentication utility functions
 */

/**
 * Checks if a route is protected and requires authentication
 * @param {string} pathname - The current route pathname
 * @returns {boolean} - Whether the route is protected
 */
export function isProtectedRoute(pathname) {
  return (
    pathname.startsWith("/chat") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/group") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/settings")
  );
}

/**
 * Checks if a route should skip authentication checks
 * @param {string} pathname - The current route pathname
 * @returns {boolean} - Whether the route should skip auth checks
 */
export function shouldSkipAuthCheck(pathname) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/debug") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/contact-us" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/verify-email-otp" ||
    pathname === "/forgot-password" ||
    pathname === "/verification-required" ||
    pathname === "/verify-email" ||
    pathname === "/terms" ||
    pathname === "/privacy-policy" ||
    pathname === "/help-center"
  );
}

/**
 * Clears all authentication-related data from the browser
 * Useful for handling auth errors or logging out
 */
export function clearAuthData() {
  if (typeof window === 'undefined') return;
  
  // Clear localStorage and sessionStorage
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
  
  // Clear cookies by setting them to expire
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

/**
 * Refreshes the authentication state by forcing a hard reload
 * This ensures all cookies and session data are properly reloaded
 */
export function refreshAuthState() {
  if (typeof window === 'undefined') return;
  window.location.reload();
}

/**
 * Redirects to login with the current URL as the callback URL
 */
export function redirectToLogin() {
  if (typeof window === 'undefined') return;
  
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `/login?callbackUrl=${currentUrl}`;
}
