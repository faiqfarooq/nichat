import crypto from 'crypto';

/**
 * Generate a secure random token for password reset
 * @returns {Object} Object containing token, hashed token, and expiry date
 */
export function generateResetToken() {
  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash the token for storage
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Set expiry to 1 hour from now
  const expires = new Date(Date.now() + 3600000); // 1 hour
  
  return {
    token,
    hashedToken,
    expires,
  };
}

/**
 * Verify a password reset token
 * @param {string} token - The token to verify
 * @param {string} hashedToken - The hashed token from the database
 * @returns {boolean} Whether the token is valid
 */
export function verifyResetToken(token, hashedToken) {
  // Hash the provided token
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Compare with the stored hash
  return hash === hashedToken;
}

/**
 * Generate a secure verification token for email verification
 * @returns {Object} Object containing token, hashed token, and expiry date
 */
export function generateVerificationToken() {
  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash the token for storage
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Set expiry to 24 hours from now
  const expires = new Date(Date.now() + 86400000); // 24 hours
  
  return {
    token,
    hashedToken,
    expires,
  };
}

/**
 * Verify an email verification token
 * @param {string} token - The token to verify
 * @param {string} hashedToken - The hashed token from the database
 * @returns {boolean} Whether the token is valid
 */
export function verifyVerificationToken(token, hashedToken) {
  // Hash the provided token
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Compare with the stored hash
  return hash === hashedToken;
}
