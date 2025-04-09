import nodemailer from "nodemailer";

/**
 * Configure the email transporter
 * @returns {Object} Nodemailer transporter
 */
function getEmailTransporter() {
  // For production, use actual SMTP settings

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // For development, log emails to console
  return {
    sendMail: async (options) => {
      console.log("Email sent:");
      console.log("To:", options.to);
      console.log("Subject:", options.subject);
      console.log("Text:", options.text);
      console.log("HTML:", options.html);
      return { messageId: "dev-mode" };
    },
  };
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
export async function sendVerificationEmail(to, token, name) {
  // Construct the verification URL with a relative path
  // This will work with any deployment URL
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  const transporter = getEmailTransporter();

  const mailOptions = {
    from: `"nichat" <${process.env.EMAIL_FROM || "noreply@chatapp.com"}>`,
    to,
    subject: "Verify Your Email Address",
    text: `
      Hello ${name},
      
      Thank you for registering with NiChat!
      
      Please click the link below to verify your email address:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      Best regards,
      The NiChat Team
    `,
    html: `
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
    `,
  };

  return transporter.sendMail(mailOptions);
}
