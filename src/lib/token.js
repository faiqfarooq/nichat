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

/**
 * Generate a 6-digit OTP for email verification
 * @returns {Object} Object containing OTP, hashed OTP, and expiry date
 */
export function generateOTP() {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the OTP for storage
  const hashedOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  
  // Set expiry to 30 minutes from now
  const now = new Date();
  const expires = new Date(now.getTime() + 1800000); // 30 minutes
  
  console.log("Generated OTP:", otp);
  console.log("OTP Expiry:", expires);
  console.log("Current time:", now);
  console.log("OTP Expiry ISO:", expires.toISOString());
  
  return {
    otp,
    hashedOTP,
    expires,
  };
}

/**
 * Verify an OTP
 * @param {string} otp - The OTP to verify
 * @param {string} hashedOTP - The hashed OTP from the database
 * @returns {boolean} Whether the OTP is valid
 */
export function verifyOTP(otp, hashedOTP) {
  // Hash the provided OTP
  const hash = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  
  // Compare with the stored hash
  return hash === hashedOTP;
}
