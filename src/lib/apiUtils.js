/**
 * Get the base URL for API requests
 * This ensures that API calls work correctly in both development and production
 * @returns {string} The base URL for API requests
 */
export function getApiBaseUrl() {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Use the current origin (hostname) for API requests
    // This ensures requests are made to the same domain, avoiding CORS issues
    return window.location.origin;
  }
  
  // In server environment
  return process.env.NODE_ENV === 'production' 
    ? process.env.NEXTAUTH_URL || 'https://nichat.ninjacodex.co'
    : process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

/**
 * Construct a full API URL
 * @param {string} path - The API path (should start with /)
 * @returns {string} The full API URL
 */
export function getApiUrl(path) {
  return `${getApiBaseUrl()}${path}`;
}
