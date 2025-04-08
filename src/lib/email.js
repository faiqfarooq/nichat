import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  debug: true, // Enable debugging
  logger: true, // Log debug info
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise} - Nodemailer send mail promise
 */
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send a verification email
 * @param {string} to - Recipient email
 * @param {string} token - Verification token
 * @param {string} name - User's name
 * @returns {Promise} - Nodemailer send mail promise
 */
export const sendVerificationEmail = async (to, token, name) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #25D366; text-align: center;">Verify Your Email Address</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with our Chat App. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
      </div>
      <p>If you did not create an account, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
      <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; font-size: 14px; color: #666;">${verificationUrl}</p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Chat App. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail(to, "Verify Your Email Address", html);
};
