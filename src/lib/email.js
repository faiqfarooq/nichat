import nodemailer from "nodemailer";

/**
 * Configure the email transporter
 * @returns {Object} Nodemailer transporter
 */
function getEmailTransporter() {
  // Always use real SMTP settings regardless of environment
  console.log("Creating email transporter with real SMTP settings");
  console.log(`SMTP Host: ${process.env.EMAIL_SERVER_HOST}`);
  console.log(`SMTP Port: ${process.env.EMAIL_SERVER_PORT}`);
  console.log(`SMTP User: ${process.env.EMAIL_SERVER_USER}`);
  console.log(`SMTP Secure: ${process.env.EMAIL_SERVER_SECURE}`);

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

/**
 * Send a password reset email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise} Promise resolving to the sent message info
 */
export async function sendPasswordResetEmail(to, name, resetUrl) {
  const transporter = getEmailTransporter();

  const mailOptions = {
    from: `"NiChat" <${process.env.EMAIL_FROM || "noreply@chatapp.com"}>`,
    to,
    subject: "Reset Your Password",
    text: `
      Hello ${name},
      
      You requested to reset your password for your NiChat account.
      
      Please click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you did not request a password reset, please ignore this email.
      
      Best regards,
      The NiChat Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #34B7F1; padding: 20px; text-align: center; color: white;">
          <h1>Reset Your Password</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>You requested to reset your password for your NiChat account.</p>
          <p>Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #34B7F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br>The NiChat Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} NiChat. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send a verification email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationUrl - Email verification URL
 * @returns {Promise} Promise resolving to the sent message info
 */
export async function sendVerificationEmail(
  to,
  token,
  name,
  isEmailChange = false
) {
  // Construct the verification URL with the current domain
  // This will be determined by the request in the API route
  const verificationUrl = `/verify-email?token=${token}`;
  const transporter = getEmailTransporter();

  const subject = isEmailChange
    ? "Verify Your New Email Address"
    : "Verify Your Email Address";

  const textContent = isEmailChange
    ? `
      Hello ${name},
      
      You have requested to change your email address for your NiChat account.
      
      Please click the link below to verify your new email address:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you did not request this change, please ignore this email or contact support.
      
      Best regards,
      The NiChat Team
    `
    : `
      Hello ${name},
      
      Thank you for registering with NiChat!
      
      Please click the link below to verify your email address:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      Best regards,
      The NiChat Team
    `;

  const htmlContent = isEmailChange
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #34B7F1; padding: 20px; text-align: center; color: white;">
          <h1>Verify Your New Email Address</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>You have requested to change your email address for your NiChat account.</p>
          <p>Please click the button below to verify your new email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #34B7F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify New Email</a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not request this change, please ignore this email or contact support.</p>
          <p>Best regards,<br>The NiChat Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} NiChat. All rights reserved.</p>
        </div>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #34B7F1; padding: 20px; text-align: center; color: white;">
          <h1>Verify Your Email Address</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>Thank you for registering with NiChat!</p>
          <p>Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #34B7F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>The NiChat Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} NiChat. All rights reserved.</p>
        </div>
      </div>
    `;

  const mailOptions = {
    from: `"nichat" <${process.env.EMAIL_FROM || "noreply@chatapp.com"}>`,
    to,
    subject,
    text: textContent,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send an OTP verification email
 * @param {string} to - Recipient email address
 * @param {string} otp - The OTP code
 * @param {string} name - Recipient name
 * @param {boolean} isEmailChange - Whether this is for email change verification
 * @returns {Promise} Promise resolving to the sent message info
 */
export async function sendOTPEmail(to, otp, name, isEmailChange = false) {
  const transporter = getEmailTransporter();

  const subject = isEmailChange
    ? "Verify Your New Email Address"
    : "Verify Your Email Address";

  const textContent = isEmailChange
    ? `
      Hello ${name},
      
      You have requested to change your email address for your NiChat account.
      
      Your verification code is: ${otp}
      
      Enter this code on the verification page to complete your email change.
      
      This code will expire in 30 minutes.
      
      If you did not request this change, please ignore this email or contact support.
      
      Best regards,
      The NiChat Team
    `
    : `
      Hello ${name},
      
      Thank you for registering with NiChat!
      
      Your verification code is: ${otp}
      
      Enter this code on the verification page to complete your registration.
      
      This code will expire in 30 minutes.
      
      Best regards,
      The NiChat Team
    `;

  const htmlContent = isEmailChange
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #34B7F1; padding: 20px; text-align: center; color: white;">
          <h1>Verify Your New Email Address</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>You have requested to change your email address for your NiChat account.</p>
          <p>Your verification code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold; display: inline-block; border-radius: 4px;">${otp}</div>
          </div>
          <p>Enter this code on the verification page to complete your email change.</p>
          <p>This code will expire in 30 minutes.</p>
          <p>If you did not request this change, please ignore this email or contact support.</p>
          <p>Best regards,<br>The NiChat Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} NiChat. All rights reserved.</p>
        </div>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #34B7F1; padding: 20px; text-align: center; color: white;">
          <h1>Verify Your Email Address</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>Thank you for registering with NiChat!</p>
          <p>Your verification code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold; display: inline-block; border-radius: 4px;">${otp}</div>
          </div>
          <p>Enter this code on the verification page to complete your registration.</p>
          <p>This code will expire in 30 minutes.</p>
          <p>Best regards,<br>The NiChat Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} NiChat. All rights reserved.</p>
        </div>
      </div>
    `;

  const mailOptions = {
    from: `"nichat" <${process.env.EMAIL_FROM || "noreply@chatapp.com"}>`,
    to,
    subject,
    text: textContent,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send a verification email with a 6-digit OTP for registration or password reset
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {boolean} isPasswordReset - Whether this is for password reset (forgot password)
 * @returns {Promise<{otp: string, info: any}>} Promise resolving to the OTP and sent message info
 */
export async function sendVerificationEmailWithOTP(
  to,
  name,
  isPasswordReset = false
) {
  console.log(
    `Sending verification email with OTP to ${to} (${name}), isPasswordReset: ${isPasswordReset}`
  );

  try {
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);

    const transporter = getEmailTransporter();
    console.log("Email transporter created");

    const subject = isPasswordReset
      ? "Reset Your Password"
      : "Verify Your Email Address";
    console.log(`Email subject: ${subject}`);

    const textContent = isPasswordReset
      ? `
        Hello ${name},
        
        You requested to reset your password for your NiChat account.
        
        Your verification code is: ${otp}
        
        Enter this code on the password reset page to continue with resetting your password.
        
        This code will expire in 30 minutes.
        
        If you did not request a password reset, please ignore this email or contact support.
        
        Best regards,
        The NiChat Team
      `
      : `
        Hello ${name},
        
        Thank you for registering with NiChat!
        
        Your verification code is: ${otp}
        
        Enter this code on the verification page to complete your registration.
        
        This code will expire in 30 minutes.
        
        Best regards,
        The NiChat Team
      `;

    const htmlContent = isPasswordReset
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #34B7F1; padding: 20px; text-align: center; color: white;">
            <h1>Reset Your Password</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p>Hello ${name},</p>
            <p>You requested to reset your password for your NiChat account.</p>
            <p>Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold; display: inline-block; border-radius: 4px;">${otp}</div>
            </div>
            <p>Enter this code on the password reset page to continue with resetting your password.</p>
            <p>This code will expire in 30 minutes.</p>
            <p>If you did not request a password reset, please ignore this email or contact support.</p>
            <p>Best regards,<br>The NiChat Team</p>
          </div>
          <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} NiChat. All rights reserved.</p>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #34B7F1; padding: 20px; text-align: center; color: white;">
            <h1>Verify Your Email Address</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p>Hello ${name},</p>
            <p>Thank you for registering with NiChat!</p>
            <p>Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold; display: inline-block; border-radius: 4px;">${otp}</div>
            </div>
            <p>Enter this code on the verification page to complete your registration.</p>
            <p>This code will expire in 30 minutes.</p>
            <p>Best regards,<br>The NiChat Team</p>
          </div>
          <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} NiChat. All rights reserved.</p>
          </div>
        </div>
      `;

    const mailOptions = {
      from: `"NiChat" <${process.env.EMAIL_FROM || "noreply@chatapp.com"}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    };

    console.log("Mail options prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    console.log("Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return { otp, info };
  } catch (error) {
    console.error("Error sending verification email:", error);
    console.error(error.stack);
    throw error; // Re-throw to be handled by the caller
  }
}
