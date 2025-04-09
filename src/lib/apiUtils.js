/**
 * Get the base URL for API requests
 * This ensures that API calls work correctly in both development and production
 * @returns {string} The base URL for API requests
 */
export function getApiBaseUrl() {
  // In production, use NEXTAUTH_URL as the base
  // In development, use relative URLs (empty string)
  return process.env.NODE_ENV === 'production' 
    ? process.env.NEXTAUTH_URL || 'https://nichat-self.vercel.app'
    : '';
}

/**
 * Construct a full API URL
 * @param {string} path - The API path (should start with /)
 * @returns {string} The full API URL
 */
export function getApiUrl(path) {
  return `${getApiBaseUrl()}${path}`;
}
