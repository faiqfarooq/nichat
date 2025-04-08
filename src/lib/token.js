import crypto from 'crypto';

/**
 * Generate a random token
 * @param {number} bytes - Number of bytes for the token (default: 32)
 * @returns {string} - Random token in hexadecimal format
 */
export const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Generate a verification token and expiry date
 * @param {number} expiryHours - Number of hours until the token expires (default: 24)
 * @returns {Object} - Object containing the token and expiry date
 */
export const generateVerificationToken = (expiryHours = 24) => {
  const token = generateToken();
  const expires = new Date();
  expires.setHours(expires.getHours() + expiryHours);
  
  return {
    token,
    expires,
  };
};
